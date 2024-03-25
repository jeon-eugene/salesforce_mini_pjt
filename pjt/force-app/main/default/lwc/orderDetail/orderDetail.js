import { LightningElement, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { getRecord } from 'lightning/uiRecordApi';
import SELECTED_ORDER_CHANNEL from '@salesforce/messageChannel/SelectedOrderChannel__c';
import Utils from 'c/utils';
import FIELD_Date from '@salesforce/schema/Order.EffectiveDate';
import FIELD_Status from '@salesforce/schema/Order.Status';
import FIELD_Amount from '@salesforce/schema/Order.TotalAmount';
import FIELD_DiscountRate from '@salesforce/schema/Order.DiscountRate__c';
import FIELD_NetAmount from '@salesforce/schema/Order.NetOrderAmount__c';
// import FIELD_BodyAmount from '@salesforce/schema/Order.OrderAmountBody__c';
// import FIELD_SubAmount from '@salesforce/schema/Order.OrderAmountSub__c';

const fields = {FIELD_Date, FIELD_Status, FIELD_Amount, FIELD_DiscountRate, FIELD_NetAmount};

export default class OrderDetail extends LightningElement {
    @wire(MessageContext) messageContext;
    orderId;
    subscription;

    @wire(getRecord, { recordId: '$orderId', fields })
    wiredOrderSales;

    get date() {
        return Utils.getDisplayValue(this.wiredOrderSales.data, FIELD_Date);
    }

    get status() {
        return Utils.getDisplayValue(this.wiredOrderSales.data, FIELD_Status);
    }

    get amount() {
        return Utils.getDisplayValue(this.wiredOrderSales.data, FIELD_Amount);
    }

    get discountRate() {
        return Utils.getDisplayValue(this.wiredOrderSales.data, FIELD_DiscountRate);
    }

    get netAmount() {
        return Utils.getDisplayValue(this.wiredOrderSales.data, FIELD_NetAmount);
    }

    // get bodyAmount() {
    //     return Utils.getDisplayValue(this.wiredOrderSales.data, FIELD_BodyAmount);
    // }

    // get subAmount() {
    //     return Utils.getDisplayValue(this.wiredOrderSales.data, FIELD_SubAmount);
    // }

    connectedCallback() {
        if(this.subscription) {
            return;
        }
        this.subscription = subscribe (
            this.messageContext,
            SELECTED_ORDER_CHANNEL,
            (message) => {
                this.handleOrderChange(message)
            }
        );
    }

    handleOrderChange(message) {
        this.orderId = message.orderId;
        console.log('orderdeatil : ', this.wiredOrderSales.data)
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
}