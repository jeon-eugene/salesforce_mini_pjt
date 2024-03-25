import { LightningElement, api, wire, track } from "lwc";
import getProducts from "@salesforce/apex/ProductBrowser.getProducts";
import Id from "@salesforce/user/Id";
import getAccountByUser from "@salesforce/apex/OrderMaker.getAccountByUser";
import createProductItem from "@salesforce/apex/OrderMaker.createProductItem";
import createOrder from "@salesforce/apex/OrderMaker.createOrder";
import createOrderItem from "@salesforce/apex/OrderMaker.createOrderItem";
import Utils from "c/utils";
import { reduceErrors } from "c/ldsUtils";
// import { getRecords } from "lightning/uiRecordApi.getRecords";

export default class OrderProductBrowser extends LightningElement {
    @api recordId;
    userId = Id;
    accountId;
    discount;
    date = new Date().toISOString().split("T")[0];

    // 전체 product 정보.
    products = []; // [{ Id: "01tIS000000hyoXYAQ", DisplayUrl: "", ProductCode ...}, ...]
    error;
    @track selectedProductIds = [];

    // Demo: 모든 product의 정보를 가져온다
    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            console.log("OrderProductBrowser 와이어: ", data);
            this.products = data;
        } else if (error) {
            this.error = error;
            console.error("product 가져오기 실패: ", error);
        }
    }

    // Account Id 가져오기
    @wire(getAccountByUser, { userId: "$userId" })
    wiredAccount({ error, data }) {
        if (data) {
            this.accountId = data.Id;
        } else if (error) {
            console.error("Error:", error);
        }
    }

    get selectedProducts() {
        // console.log(
        //     "selectedProduct 계산! length:",
        //     this.selectedProductIds.length
        // );
        return this.products.filter((product) =>
            this.selectedProductIds.includes(product.Id)
        );
    }

    onChange(event) {
        if (event.target.name === "discount")
            this.discount = event.target.value;
        else if (event.target.name === "orderDate")
            this.date = event.target.value;
    }

    // products에서 순회하면서 id에 맞는걸 찾는다.
    handleAddProductSubmit(event) {
        console.log("OrderProductBrowser 이벤트핸들러: ", event);
        console.log("event.detail.productId: ", event.detail.productId);

        const addedId = event.detail.productId;
        if (!this.selectedProductIds.includes(addedId)) {
            this.selectedProductIds.push(addedId);
        } else {
            // TODO 이미 추가된 상품 경고창
        }
    }
    // products 리스트와 Ids 리스트에서 삭제하기
    handleDeleteCard(event) {
        console.log(
            "OrderProductBrowser Delete 이벤트핸들러: ",
            event.detail.productId
        );
        const toRemove = event.detail.productId;
        this.selectedProductIds = this.selectedProductIds.filter(
            (id) => id !== toRemove
        );
    }
    handleSaveTable(event) {
        // 시리얼 테이블의 save 버튼 눌렀을 때
        // console.log("OrderProductBrowser Save event handler: ", event);
        const addedProductId = event.detail.productId;
        const updatedSerialNumbers = event.detail.serialNumbers.map(
            (serial) => serial.value
        );

        // serialNumbers : { index: "1", value: "123123123" }
        // console.log("시리얼 번호 리스트: ", updatedSerialNumbers); //

        // products의 해당 product에 시리얼 넘버 추가
        this.products = this.products.map((product) => {
            return product.Id === addedProductId
                ? { ...product, SerialNumbers: updatedSerialNumbers }
                : product;
        });
    }

    // product id당 serial number들을 저장
    async handleSaveOrder() {
        // console.log("User ID: ", this.userId);
        // console.log("Account: ", this.accountId);
        // console.log("selected Products: ", this.selectedProducts);

        try {
            if (this.discount < 0 || this.discount > 20) {
                throw new Error("할인율이 20보다 클 수 없습니다.");
            }

            // 1. ProductItem 생성
            for await (const product of this.selectedProducts) {
                if (product.SerialNumbers && product.SerialNumbers.length > 0) {
                    const uniqueSerialNumbers = [
                        ...new Set(product.SerialNumbers)
                    ];
                    if (
                        uniqueSerialNumbers.length !==
                        product.SerialNumbers.length
                    ) {
                        throw new Error("중복된 시리얼 번호가 있습니다.");
                    }
                    await createProductItem({
                        userId: this.userId,
                        productId: product.Id,
                        serialNumbers: product.SerialNumbers
                    });
                    console.log(
                        `Product item created for product ID ${product.Id}`
                    );
                }
            }

            // 2. Order 생성
            const orderResult = await createOrder({
                accountId: this.accountId,
                contactId: this.recordId,
                orderDate: this.date,
                discount: this.discount
            });

            const orderId = orderResult;
            console.log(`Order 아이디: ${orderId}`);

            // 3. OrderProduct 생성
            let productIdList = [];
            let quantityList = [];
            for (const product of this.selectedProducts) {
                if (product.SerialNumbers && product.SerialNumbers.length > 0) {
                    productIdList.push(product.Id);
                    quantityList.push(product.SerialNumbers.length);
                }
            }
            const orderItemResult = await createOrderItem({
                orderId: orderId,
                productIds: productIdList,
                quantities: quantityList
            });

            if (orderItemResult.length === productIdList.length) {
                Utils.showToast(
                    this,
                    "성공",
                    "주문내역 저장에 성공했습니다.",
                    "success"
                );
                this.selectedProductIds = [];
                this.discount = "";
            }
        } catch (error) {
            let errors = reduceErrors(error);
            let errorBody = errors.length
                ? errors[0]
                : "There was a problem creating your record.";
            Utils.showToast(this, "판매내역 생성 오류", errorBody, "error");
            console.error("판매내역 생성 프로세스 오류: ", error);
        }
    }
}