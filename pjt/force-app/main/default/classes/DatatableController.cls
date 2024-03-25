public with sharing class DatatableController {
    @AuraEnabled(cacheable=true)
    public static List<Case> refreshDatatable(String contactId) {
        List<Case> refreshedCases = [SELECT Id, CaseNumber, AccountId, Description, CreatedDate FROM Case WHERE ContactId = :contactId];
        return refreshedCases;
    }
}