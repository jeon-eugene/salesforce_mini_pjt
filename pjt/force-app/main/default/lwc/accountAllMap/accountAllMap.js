import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAllAccountLocations from '@salesforce/apex/AccountLocationController.getAllAccountLocations';

export default class AccountAllMap extends NavigationMixin(LightningElement) {
    @track allMapMarkers = [];

    @wire(getAllAccountLocations)
    wiredAllAccounts({ error, data }) {
        if (data) {
            this.allMapMarkers = data.map(account => ({
                location: {
                    City: account.BillingCity,
                    State: account.BillingState,
                },
                title: account.Name,
                value: account.Id
            }));
        } else if (error) {
            console.error(error);
        }
    }

    handleMarkerSelect(event) {
        const markerId = event.detail.selectedMarkerValue; 
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: markerId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }
}