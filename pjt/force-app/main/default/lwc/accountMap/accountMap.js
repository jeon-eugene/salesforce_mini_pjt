import { LightningElement, wire, api } from 'lwc';
import getAccountLocation from '@salesforce/apex/AccountLocationController.getAccountLocation';

export default class AccountMap extends LightningElement {
    @api recordId; 
    mapMarkers = [];

    @wire(getAccountLocation, { accountId: '$recordId' })
    wiredAccount({ error, data }) {
        if (data) {
            this.mapMarkers = [{
                location: {
                    City: data.BillingCity,
                    State: data.BillingState,
                },
                title: data.Name,
                description: `<b>주소:</b> ${data.BillingState}`
            }];
        } else if (error) {
            console.error(error);
        }
    }
}