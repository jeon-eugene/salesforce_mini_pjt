import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import SELECTED_PRODUCT_CHANNEL from "@salesforce/messageChannel/SelectedProductChannel__c";
import getProducts from "@salesforce/apex/ProductBrowser.getProducts";

export default class ProductBrowser extends LightningElement {
    selectedProductId = "";

    @wire(getProducts)
    products;

    @wire(MessageContext) messageContext;
    cols = [
        {
            fieldName: "Name",
            label: "제품명"
        },
        {
            fieldName: "UnitPrice",
            label: "가격"
        },
        {
            fieldName: "ProductCode",
            label: "제품코드"
        },
        {
            fieldName: "Family",
            label: "제품군"
        }
    ];

    handleProductSelected(event) {
        const productId = event.detail.productId;
        this.selectedProductId = productId;
        this.updateSelectedProduct(productId);
    }

    updateSelectedProduct(productId) {
        const gallery = this.template.querySelector("c-product-tiles");
        const grid = this.template.querySelector("c-product-datatable");
        if (gallery) {
            gallery.setSelectedProduct(productId);
        }
        if (grid) {
            grid.setSelectedRecord(productId);
        }
        publish(this.messageContext, SELECTED_PRODUCT_CHANNEL, {
            productId: productId
        });
    }

    handleRowClick(event) {
        const productId = event.detail.pk;
        this.updateSelectedProduct(productId);
    }
}