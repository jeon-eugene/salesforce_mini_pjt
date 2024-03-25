public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static Contact getContactById(Id contactId) {
        return [SELECT Id, Name, Email, PhoneNumber__c, Owner.Name, Account.Name, Count_Cases_c__c, Type__c, BodyPart_Amount__c, Level__c,SubPart_Amount__c FROM Contact WHERE Id = :contactId LIMIT 1];
    }
}