import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import updateSalesCase from '@salesforce/apex/CaseDataService.updateSalesCase';

import ACCOUNT_FIELD from '@salesforce/schema/Case.AccountId';
import NUMBER_FIELD from '@salesforce/schema/Case.CaseNumber';
import OWNER_FIELD from '@salesforce/schema/Case.OwnerId';
import CONTACT_FIELD from '@salesforce/schema/Case.ContactId';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import STOPPED_FIELD from '@salesforce/schema/Case.IsStopped';

const salesCaseFields = [ACCOUNT_FIELD, NUMBER_FIELD, OWNER_FIELD, CONTACT_FIELD, DESCRIPTION_FIELD, STOPPED_FIELD];

export default class SalesCaseDetail extends LightningElement {
    @api recordId;
    isViewMode = true;
    @track contactId;
    @track description;
    @track isStopped = false;
    salesCaseData;
    wiredResult;

    @wire(getRecord, { recordId: '$recordId', fields: salesCaseFields })
    wiredSalesCaseData(result) {
        this.wiredResult = result;
        const { data, error } = result;
        if (data) {
            this.contactId = getFieldValue(data, CONTACT_FIELD);
            this.description = getFieldValue(data, DESCRIPTION_FIELD);
            this.isStopped = getFieldValue(data, STOPPED_FIELD);
            this.salesCaseData = data;
        } else if (error) {
            console.error('Error loading record: ', error);
        }
    };

    // 현재 salesCase의 data 프로퍼티에 데이터가 있을 경우
    get account() {
        return getFieldValue(this.salesCaseData, ACCOUNT_FIELD);
    }

    get caseNumber() {
        return getFieldValue(this.salesCaseData, NUMBER_FIELD);
    }

    get caseOwner() {
        return getFieldValue(this.salesCaseData, OWNER_FIELD);
    }

    get contact() {
        return getFieldValue(this.salesCaseData, CONTACT_FIELD);
    }

    get description() {
        return getFieldValue(this.salesCaseData, DESCRIPTION_FIELD);
    }

    get stopped() {
        return getFieldValue(this.salesCaseData, STOPPED_FIELD);
    }


    get toggleButtonLabel() {
        return this.isViewMode ? '수정하기' : '저장하기';
    }

    handleContactChange(event) {
        this.contactId = String(event.detail.value);
    }
    
    handleDescriptionChange(event) {
        this.description = String(event.detail.value);
    }
    
    handleStoppedChange(event) {
        this.isStopped = event.detail.checked;
    }

    toggleMode() {
        if (this.isViewMode) {
            this.isViewMode = false;
        } else {
            updateSalesCase({
                caseId: this.recordId,
                contactId: this.contactId,
                description: this.description,
                isStopped: this.isStopped
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