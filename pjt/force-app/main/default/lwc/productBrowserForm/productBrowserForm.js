import { LightningElement, wire, api } from "lwc";
import getProducts from "@salesforce/apex/ProductBrowserForm.getProducts";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";
import FIELD_CONTACT_NAME from "@salesforce/schema/Contact.Name";

const FIELDS = [FIELD_CONTACT_NAME];

export default class ProductBrowserForm extends NavigationMixin(
    LightningElement
) {
    @api recordId;

    products = [];
    selectedContactName = "";
    selectedProductId = "";
    isButtonDisabled = true;
    isRecordPage;
    error;

    // 현재 record의 고객 이름 가져오기
    @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
    wiredContact({ error, data }) {
        if (data) {
            let field = getFieldValue(data, FIELD_CONTACT_NAME);
            this.selectedContactName = field;
            // console.log("필드: ", field);
            // console.log("이름: ", this.selectedContactName);
            this.isRecordPage = true;
        } else if (error) {
            this.error = error;
            this.isRecordPage = false;
            console.error("Error fetching contact:", error);
        }
    }

    @wire(getProducts)
    wired_getProducts({ error, data }) {
        if (data) {
            this.products = data.map((product) => ({
                value: product.Id,
                label: product.Name
            }));
        } else if (error) {
            this.error = error;
            console.error("Error fetching products:", error);
        }
    }

    handleSelected(event) {
        this.selectedProductId = event.detail.value;
        this.isButtonDisabled = false;

        console.log("선택 productId: ", this.selectedProductId);
    }

    // "추가" 버튼 눌렀을 때 부모(orderProductBrowser)에 알림
    onAddProduct() {
        this.dispatchEvent(
            new CustomEvent("add", {
                detail: { productId: this.selectedProductId }
            })
        );

        // 여러번 클릭 방지
        this.isButtonDisabled = true;
    }

    onAddNewProduct() {
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Product2",
                actionName: "new"
            }
        });
    }
}