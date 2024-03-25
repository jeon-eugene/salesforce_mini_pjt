import { LightningElement, api, track, wire } from 'lwc';
import getContactPhone from '@salesforce/apex/CaseDataService.getContactPhone';

export default class InputComponent extends LightningElement {
    @api phoneNum = '';
    @track showOptions = false;
    @track phoneOptions = [];

    @wire(getContactPhone, { inputPrefix: '$phoneNum' })
    wiredPhoneOptions({ error, data }) {
        if (data) {
            // 입력 값과 동일한 값을 필터링하여 phoneOptions 배열을 업데이트합니다.
            this.phoneOptions = data.filter(option => option !== this.phoneNum);
            if (this.phoneNum && this.phoneNum.length >= 1) {
                this.showOptions = true;
            }
        } else if (error) {
            console.error('Error retrieving phone options:', error);
        }
    }

    handleChange(event) {
        this.phoneNum = event.target.value;
        if (this.phoneNum.length >= 1) {
            const matchedOption = this.phoneOptions.find(option => option === this.phoneNum);
            if (matchedOption) {
                this.showOptions = false;
            } else {
                this.showOptions = true;
            }
        } else {
            this.showOptions = false;
        }
    }
    
    selectOption(event) {
        this.phoneNum = event.target.innerText;
        this.showOptions = false;
    }
}