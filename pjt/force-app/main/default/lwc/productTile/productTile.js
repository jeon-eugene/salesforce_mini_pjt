import { LightningElement, api } from 'lwc';

export default class ProductTile extends LightningElement {
    @api product;
    @api selectedProductId = '';

    get tileSelected() {
        return (this.selectedProductId === this.product.Id) ? "tile selected" : "tile";
    }

    productClick() {
        const evt = new CustomEvent('productselected', {
            bubbles: true,
            composed: true,
            detail: { productId: this.product.Id }
        });
        this.dispatchEvent(evt);
    }
}