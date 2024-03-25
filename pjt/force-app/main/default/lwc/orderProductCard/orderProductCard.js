import { LightningElement, api, track } from "lwc";

export default class OrderProductCard extends LightningElement {
    product;

    @track serialNumbers = [{ index: 1, value: "" }];
    @track serialTableColumns = [
        {
            label: "시리얼 번호",
            fieldName: "value",
            type: "text",
            editable: true
        }
    ];

    @api
    get productData() {
        return this.product;
    }
    set productData(value) {
        if (value) {
            this.product = value;
            // console.log("OrderProductCard product: ", this.product); //

            this.id = value.Id;
            this.productImageUrl = value.DisplayUrl;
            this.productFamily = value.Family;
            this.productName = value.Name;
            this.productCode = value.ProductCode;
            this.price = value.UnitPrice;
            // this.serialNumbers = this.getSerialNumbers();
        }
    }

    handleQuantityChange(evt) {
        let n = parseInt(evt.target.value, 10);
        this.serialNumbers = [...Array(n).keys()].map((x) => ({
            index: x + 1,
            value: ""
        }));
    }
    handleClick() {
        this.dispatchEvent(
            new CustomEvent("delete", {
                detail: { productId: this.id }
            })
        );
    }

    // TODO 시리얼번호 입력받아서 업데이트하기
    // setter에서 호출됨
    getSerialNumbers() {
        // Assuming you have a method to fetch or generate serial numbers
        // This is just an example. Replace it with your actual data fetching or generation logic
        return [{ index: 1, value: "" }];
    }

    // 시리얼 테이블 수정 후 저장할 때
    handleSave(event) {
        const updatedFields = event.detail.draftValues;

        // TODO: quantity와 serialNumbers 원소개수 비교해서 유효성 체크
        this.serialNumbers = this.serialNumbers.map((serial) => {
            const updatedVal = updatedFields.find(
                // eslint-disable-next-line eqeqeq
                (field) => field.index == serial.index
            );
            return updatedVal ? updatedVal : serial;
        });

        console.log("handleSave 시리얼넘버: ", this.serialNumbers);

        // 값 업데이트하고 draftValues 지우기
        this.template.querySelector("lightning-datatable").draftValues = [];

        // 부모에게 시리얼 넘버를 전송(Quantity는 생략, products는 보낼필요x)
        this.dispatchEvent(
            new CustomEvent("savetable", {
                detail: {
                    productId: this.product.Id,
                    serialNumbers: this.serialNumbers
                }
            })
        );
    }
}