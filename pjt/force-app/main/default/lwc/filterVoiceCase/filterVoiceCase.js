import { LightningElement, api, wire } from 'lwc';
import getFilteredVoiceCases from '@salesforce/apex/CaseDataService.getFilteredVoiceCases';

export default class FilterSalesCase extends LightningElement {
    range = 'All Case';
    caseStatus = '전체';
    sortBy = 'CreatedDate';
    sortDirection = 'desc';
    cases = [];
    @api recordId; 

    columns = [
        { label: '상담번호', fieldName: 'CaseNumber', type: 'text' },
        { label: '문제가 발생한 제품', fieldName: 'ProductName', type: 'text'},
        { label: '원인', fieldName: 'Reason', type: 'text' },
        { label: '진행 상황', fieldName: 'Status', type: 'text' },
        { label: '상담내역', fieldName: 'Description', type: 'text' },
        { label: '기록일자', fieldName: 'CreatedDate', type: 'date'}
    ];

    rangeOptions = [
        { label: 'All Case', value: 'All Case' },
        { label: 'My Case', value: 'My Case' },
    ];

    statusOptions = [
        { label: '전체', value: '전체'},
        { label: '진행 중', value: 'Working'},
        { label: '완료', value: 'Closed'}
    ];

    @wire(getFilteredVoiceCases, { contactId: '$recordId', range: '$range', caseStatus: '$caseStatus' })
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data.map(item => ({
                ...item,
                ProductName: item.Product.Name,
                Status: item.Stuaus == 'Working' ? '진행 중' : '완료'
            }));
        } else if (error) {
            console.error('Error fetching cases:', error);
        }
    }

    handleRange(event) {
        this.range = event.target.value;
    }

    handleStatus(event) {
        this.caseStatus = event.target.value;
    }
}