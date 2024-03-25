import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getProductsWithContact from '@salesforce/apex/ProductBrowser.getProductsWithContact';

const columns = [
    { label: '제품이름', fieldName: 'productName', type: 'text' },
    { label: '제품군', fieldName: 'productFamily', type: 'text' },
    { label: '제품코드', fieldName: 'productCode', type: 'text' }
];

export default class ContactProductList extends NavigationMixin(LightningElement) {
    @api recordId;
    productList = [];
    @api targetProduct;
    cols = columns;
    error;

    @wire(getProductsWithContact, { contactId: '$recordId' })
    wiredProductsWithContact({ error, data }) {
        if (data) {
            this.productList = data.map(productInfo => {
                const [productId, productName, productFamily, productCode] = productInfo.split('|');
                const part = productFamily === 'BodyPart' ? '본체' : '주변기기';
                return { id: productId, productName, productFamily: part, productCode };
            });
            this.error = undefined;
            console.log("parent recordId: ", this.recordId);
        } else if (error) {
            this.error = '오류 발생: ' + error.body.message;
            this.productList = [];
        }
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        if (selectedRows.length === 1) {
            this.targetProduct = selectedRows[0].id;
        } else {
            this.targetProduct = null;
        }
    }

    get columns() {
        return columns;
    }
}