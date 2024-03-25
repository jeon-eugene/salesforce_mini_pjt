public with sharing class ContactDataService {
    @AuraEnabled(cacheable = true)
    public static List<Contact> getContact(String contactId){
        List<Contact> contacts = new List<Contact>();
        return [SELECT Id, Name, AccountId, OwnerId, Email, Level__c, Count_Cases_c__c, Type__c, PhoneNumber__c FROM Contact WHERE Id = :contactId LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static String getUserProfileName() {
        return [SELECT Profile.Name FROM User WHERE Id = :UserInfo.getUserId()].Profile.Name;
    }
}