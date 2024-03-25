import { LightningElement, wire, api } from 'lwc';
import getOrderInfoByContactId from '@salesforce/apex/OrderController.getOrderInfoByContactId';
import { MessageContext, publish } from 'lightning/messageService';
import SELECTED_ORDER_CHANNEL from '@salesforce/messageChannel/SelectedOrderChannel__c';

const columns = [
    { label: '구입날짜', fieldName: 'effectiveDate', type: 'date' },
    { label: '구입한 제품들', fieldName: 'productDetails', type: 'text' },
    { label: '합계', fieldName: 'totalAmount', type: 'number' },
    { label: '할인율', fieldName: 'discountRate', type: 'number' },
    { label: '총 구입금액', fieldName: 'netAmount', type: 'number' }
];

export default class OrderDatatable extends LightningElement {
    @api recordId;
    @wire(MessageContext) messageContext;
    orderInfo = [];
    refundInfo = [];
    selectedOrderId;
    cols = columns;

    @wire(getOrderInfoByContactId, { contactId: '$recordId', status: 'Completed' })
    wiredOrderInfo({ error, data }) {
        if (data) {
            this.orderInfo = this.prepareData(data);
        } else if (error) {
            console.error('Error fetching order information:', error);
        }
    }

    @wire(getOrderInfoByContactId, { contactId: '$recordId', status: 'Refunded' })
    wiredRefundInfo({ error, data }) {
        if (data) {
            this.refundInfo = this.prepareData(data);
        } else if (error) {
            console.error('Error fetching order information:', error);
        }
    }

    prepareData(data) {
        return data.map(order => ({
            id: order.id,
            effectiveDate: order.effectiveDate,
            productDetails: this.getProductDetails(order.productNames),
            totalAmount: order.totalAmount,
            discountRate: order.discountRate,
            netAmount: order.netAmount,
        }));
    }

    getProductDetails = (productNames) => {
        let details = '';
        for (const [productName, quantity] of Object.entries(productNames)) {
            if (details !== '') {
                details += ', ';
            }
            details += `${productName} (${quantity}개)`;
        }
        return details;
    }    

    handleRowClick(event) {
        const orderId = event.detail.pk;
        this.updateSelectedOrder(orderId);
    }

    updateSelectedOrder(orderId) {
        this.selectedOrderId = orderId;
        publish(this.messageContext, SELECTED_ORDER_CHANNEL, {
            orderId: orderId
        });
    }
}