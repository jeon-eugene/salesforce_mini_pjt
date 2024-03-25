public with sharing class AccountLocationController {
    @AuraEnabled(cacheable=true)
    public static Account getAccountLocation(String accountId) {
        return [SELECT Id, Name, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry FROM Account WHERE Id = :accountId ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAllAccountLocations() {
        return [SELECT Id, Name, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry FROM Account];
    }
}