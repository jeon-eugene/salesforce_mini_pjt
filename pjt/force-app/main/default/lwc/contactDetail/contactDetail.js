import { LightningElement, wire, api } from "lwc";
import getContactById from "@salesforce/apex/ContactController.getContactById";

export default class ContactDetail extends LightningElement {
    @api recordId;
    contactInfo = {};

    @wire(getContactById, { contactId: "$recordId" })
    wiredContact({ error, data }) {
        if (data) {
            this.contactInfo = {
                recordId: data.recordId,
                name: data.Name,
                email: data.Email,
                phone: data.PhoneNumber__c,
                ownerName: data.Owner?.Name,
                accountName: data.Account?.Name,
                numCases: data.Count_Cases_c__c,
                type: data.Type__c,
                mainAmount: "₩" + data.BodyPart_Amount__c,
                level: data.Level__c,
                subAmount: "₩" + data.SubPart_Amount__c
            };
        } else if (error) {
            console.error("Error retrieving contact", error);
        }
    }
}