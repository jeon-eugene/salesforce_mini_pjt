import { LightningElement, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import SELECTED_PRODUCT_CHANNEL from '@salesforce/messageChannel/SelectedProductChannel__c';
import getUnitPrice from '@salesforce/apex/ProductBrowser.getUnitPrice';
import { NavigationMixin } from 'lightning/navigation';

import { getRecord } from 'lightning/uiRecordApi';
import Utils from 'c/utils';

import FIELD_Name from '@salesforce/schema/Product2.Name';
import FIELD_Pic from '@salesforce/schema/Product2.DisplayUrl';
import FIELD_Family from '@salesforce/schema/Product2.Family';
import FIELD_Code from '@salesforce/schema/Product2.ProductCode';

const fields = [FIELD_Name, FIELD_Pic, FIELD_Family, FIELD_Code];

export default class ProductDetail extends NavigationMixin(LightningElement) {
    productId;
    subscription;

    @wire(MessageContext) messageContext;

    @wire(getRecord, { recordId: '$productId', fields })
    wiredProduct;

    @wire(getUnitPrice, { productId: '$productId' })
    price;

    get family() {
        return Utils.getDisplayValue(this.wiredProduct.data, FIELD_Family);
    }

    get code() {
        return Utils.getDisplayValue(this.wiredProduct.data, FIELD_Code);
    }

    get picture() {
        return Utils.getDisplayValue(this.wiredProduct.data, FIELD_Pic);
    }

    get cardTitle() {
        return this.wiredProduct && this.wiredProduct.data ? this.wiredProduct.data.fields.Name.value : '제품을 누르면 상세정보를 확인하실 수 있습니다';
    }

    get formattedPrice() {
		return this.price && this.price.data ? 
			new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(this.price.data) : 
			'';
	}

    onGoToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.productId,
                actionName: 'view'
            },
        });
    }

    connectedCallback() {
        if(this.subscription) {
            return;
        }
        this.subscription = subscribe (
            this.messageContext,
            SELECTED_PRODUCT_CHANNEL,
            (message) => {
                this.handleProductChange(message)
            }
        );
    }

    handleProductChange(message) {
        this.productId = message.productId;
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
}