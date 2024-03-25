import { LightningElement, api, wire } from 'lwc';
import getFilteredSalesCases from '@salesforce/apex/CaseDataService.getFilteredSalesCases';

export default class FilterSalesCase extends LightningElement {
    range = 'All Case';
    stopped = '전체상담';
    sortBy = 'CreatedDate';
    sortDirection = 'desc';
    cases = [];
    @api recordId; 

    columns = [
        { label: '상담번호', fieldName: 'CaseNumber', type: 'text' },
        { label: '영업점', fieldName: 'AccountName', type: 'text' },
        { label: '타입', fieldName: 'IsStopped', type: 'text' },
        { label: '상담내역', fieldName: 'Description', type: 'text' },
        { label: '기록일자', fieldName: 'CreatedDate', type: 'date'}
    ];

    rangeOptions = [
        { label: 'All Case', value: 'All Case' },
        { label: 'My Case', value: 'My Case' },
    ];

    stoppedOptions = [
        { label: '전체상담', value: '전체상담'},
        { label: '단순상담', value: '단순상담'},
        { label: '판매상담', value: '판매상담'}
    ];

    @wire(getFilteredSalesCases, { contactId: '$recordId', range: '$range', stopped: '$stopped' })
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data.map(item => ({
                ...item,
                AccountName: item.Account ? item.Account.Name : null,
                IsStopped: item.IsStopped ? '단순상담' : '판매상담'
            }));
        } else if (error) {
            console.error('Error fetching cases:', error);
        }
    }

    handleRange(event) {
        this.range = event.target.value;
    }

    handleStopped(event) {
        this.stopped = event.target.value;
    }
}