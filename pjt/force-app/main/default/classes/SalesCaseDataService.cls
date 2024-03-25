public with sharing class SalesCaseDataService {
    // Contact 페이지에서 판매상담 기록하기
    @AuraEnabled
    public static void saveSalesCase(String description, Boolean isStopped, Id contactId) {
        Case newCase = new Case();
        newCase.Description = description;
        newCase.IsStopped = isStopped;
        newCase.ContactId = contactId;
        insert newCase;
    }
}