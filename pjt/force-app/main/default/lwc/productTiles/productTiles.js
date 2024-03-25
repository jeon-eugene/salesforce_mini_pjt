import { LightningElement, api } from 'lwc';

export default class ProductTiles extends LightningElement {
    @api productList = [];
    selectedProductId = '';
    @api setSelectedProduct (productId) {
        this.selectedProductId = productId;
    }

    handleProductSelected(event) {
        this.selectedProductId=event.detail.productId;
    }
}