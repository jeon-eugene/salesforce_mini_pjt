import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import updateVoiceCase from '@salesforce/apex/CaseDataService.updateVoiceCase';

import ACCOUNT_FIELD from '@salesforce/schema/Case.AccountId';
import NUMBER_FIELD from '@salesforce/schema/Case.CaseNumber';
import OWNER_FIELD from '@salesforce/schema/Case.OwnerId';
import CONTACT_FIELD from '@salesforce/schema/Case.ContactId';
import PRODUCT_FIELD from '@salesforce/schema/Case.ProductId';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import REASON_FIELD from '@salesforce/schema/Case.Reason';
import STATUS_FIELD from '@salesforce/schema/Case.Status';

const voiceCaseFields = [ACCOUNT_FIELD, NUMBER_FIELD, OWNER_FIELD, CONTACT_FIELD, PRODUCT_FIELD, DESCRIPTION_FIELD, REASON_FIELD, STATUS_FIELD];

export default class VoiceCaseDetail extends LightningElement {
    @api recordId;
    isViewMode = true;
    @track contactId;
    @track productId;
    @track description;
    @track reason;
    @track status;
    voiceCaseData;
    wiredResult;

    @wire(getRecord, { recordId: '$recordId', fields: voiceCaseFields })
    wiredVoiceCaseData(result) {
        this.wiredResult = result;
        const { data, error } = result;
        if (data) {
            this.contactId = getFieldValue(data, CONTACT_FIELD);
            this.productId = getFieldValue(data, PRODUCT_FIELD);
            this.description = getFieldValue(data, DESCRIPTION_FIELD);
            this.reason = getFieldValue(data, REASON_FIELD);
            this.status = getFieldValue(data, STATUS_FIELD);
            this.voiceCaseData = data;
        } else if (error) {
            console.error('Error loading record: ', error);
        }
    };

    // 현재 salesCase의 data 프로퍼티에 데이터가 있을 경우
    get account() {
        return getFieldValue(this.voiceCaseData, ACCOUNT_FIELD);
    }

    get caseNumber() {
        return getFieldValue(this.voiceCaseData, NUMBER_FIELD);
    }

    get caseOwner() {
        return getFieldValue(this.voiceCaseData, OWNER_FIELD);
    }

    get contact() {
        return getFieldValue(this.voiceCaseData, CONTACT_FIELD);
    }

    get product() {
        return getFieldValue(this.voiceCaseData, PRODUCT_FIELD);
    }

    get description() {
        return getFieldValue(this.salesCaseData, DESCRIPTION_FIELD);
    }

    get reason() {
        return getFieldValue(this.voiceCaseData, REASON_FIELD);
    }

    get status() {
        return getFieldValue(this.voiceCaseData, STATUS_FIELD);
    }


    get toggleButtonLabel() {
        return this.isViewMode ? '수정하기' : '저장하기';
    }

    handleContactChange(event) {
        this.contactId = String(event.detail.value);
    }

    handleProductChange(event) {
        this.productId = String(event.detail.value);
    }
    
    handleDescriptionChange(event) {
        this.description = String(event.detail.value);
    }
    
    handleReasonChange(event) {
        this.reason = String(event.detail.value);
    }

    handleStatusChange(event) {
        this.status = String(event.detail.value);
    }

    toggleMode() {
        if (this.isViewMode) {
            this.isViewMode = false;
        } else {
            updateVoiceCase({
                caseId: this.recordId,
                contactId: this.contactId,
                productId: this.productId,
                description: this.description,
                reason: this.reason,
                status: this.status
            })
            .then(result => {
                // Handle success
                console.log('Case updated successfully: ', result);
                this.isViewMode = true; // Change mode back to view
                return refreshApex(this.wiredResult); // Refresh the data
            })
            .catch(error => {
                // Handle error
                console.error('Error updating Case: ', error);
            });
        }
    }
}