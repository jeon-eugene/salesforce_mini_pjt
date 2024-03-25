import { LightningElement } from "lwc";

export default class ContactNavigation extends LightningElement {
    onselect(event) {
        const selectedItemName = event.detail.name;
        const evt = new CustomEvent("navitemselected", {
            detail: { itemName: selectedItemName }
        });
        this.dispatchEvent(evt);
    }
}