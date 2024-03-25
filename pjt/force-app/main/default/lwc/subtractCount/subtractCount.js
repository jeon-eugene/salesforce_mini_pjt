import { LightningElement, wire } from 'lwc';
import getSalesCaseCount from '@salesforce/apex/CountController.getSalesCaseCount';
import getOrderCount from '@salesforce/apex/CountController.getOrderCount';

export default class SubtractCount extends LightningElement {
    salesCaseCount;
    orderCount;

    @wire(getSalesCaseCount)
    wiredSalesCaseCount({ data, error }) {
        if (data) {
            this.salesCaseCount = data;
            this.subtractResult();
        } else if (error) {
            console.error('Error loading sales case count:', error);
        }
    }

    @wire(getOrderCount)
    wiredOrderCount({ data, error }) {
        if (data) {
            this.orderCount = data;
            this.subtractResult();
        } else if (error) {
            console.error('Error loading order count:', error);
        }
    }

    subtractResult() {
        if (this.salesCaseCount !== undefined && this.orderCount !== undefined) {
            this.resultCount = this.salesCaseCount - this.orderCount;
        }
    }
}