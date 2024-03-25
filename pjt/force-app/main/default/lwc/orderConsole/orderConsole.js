import { LightningElement, api } from "lwc";
// import getProducts from '@salesforce/apex/ProductBrowser.getProducts';
// 제품을 모두 가져오는 getProducts를 쓰지말고 AdaptorAPI 써서 recordId와 Name만 가져온다
// 그리고 ProductForm에 넘겨주고
// 선택된 ProductId(recordId)를 OrderProductCard에 넘긴다.

// TODO: ProductForm 이랑 ContactNavigation(lightning-vertical-navigation) 컴포넌트 만들기

const VIEW_CONTACT_DETAIL = "contactDetail";
const VIEW_ORDER_HISTORY = "orderHistory";
const VIEW_CASE_HISTORY = "caseHistory";
const VIEW_FLOW_VIEW = "flowView";
const VIEW_ORDER_BROWSER = "order";

export default class OrderConsole extends LightningElement {
    @api recordId;
    viewMode = VIEW_CONTACT_DETAIL; // detail로 바꾸기

    connectedCallback() {
        console.log("parent recordId: ", this.recordId);
    }

    handleNavItemSelected(event) {
        const selectedItemName = event.detail.itemName;

        if (selectedItemName === "contactdetail") {
            this.viewMode = VIEW_CONTACT_DETAIL;
        } else if (selectedItemName === "orderhistory") {
            this.viewMode = VIEW_ORDER_HISTORY;
        } else if (selectedItemName === "casehistory") {
            this.viewMode = VIEW_CASE_HISTORY;
        } else if (selectedItemName === "flowview") {
            this.viewMode = VIEW_FLOW_VIEW;
        } else if (selectedItemName === "order") {
            this.viewMode = VIEW_ORDER_BROWSER;
        }
    }

    handleFlowStatusChange(event) {
        if (event.detail.status === "FINISHED") {
            this.viewMode = VIEW_ORDER_BROWSER;
        }
    }

    get contactDetail() {
        return this.viewMode === VIEW_CONTACT_DETAIL;
    }

    get orderHistoryView() {
        return this.viewMode === VIEW_ORDER_HISTORY;
    }

    get caseHistoryView() {
        return this.viewMode === VIEW_CASE_HISTORY;
    }
    get flowView() {
        return this.viewMode === VIEW_FLOW_VIEW;
    }

    get orderView() {
        return this.viewMode === VIEW_ORDER_BROWSER;
    }

    get inputVariables() {
        return [
            {
                name: "contactId",
                type: "String",
                value: this.recordId
            }
        ];
    }
}