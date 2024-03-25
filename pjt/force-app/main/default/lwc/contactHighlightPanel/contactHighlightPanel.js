import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getContactById from '@salesforce/apex/ContactController.getContactById';

export default class MyHighlightPanel extends NavigationMixin(LightningElement) {
  @api recordId;
  contact;
  contactAccountName;
  @wire(getContactById, { contactId: '$recordId' })
  wiredContact({ error, data }) {
    if (data) {
    console.log('Contact Data:', data);
      this.contact = data;
      this.contactAccountName = data.Account ? data.Account.Name : '';
    } else if (error) {
      console.error('Error retrieving contact', error);
    }
  }
  handleEdit() {
    console.log('Edit button clicked for recordId:', this.recordId);

    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.recordId,
        objectApiName: 'Contact',
        actionName: 'edit'
      }
    });
  }
  connectedCallback() {
    console.log('Record ID:', this.recordId);
}
}