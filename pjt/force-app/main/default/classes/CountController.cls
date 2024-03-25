public with sharing class CountController {
    @AuraEnabled(cacheable=true)
    public static Integer getSalesCaseCount(String contactId) {
        String userId = UserInfo.getUserId();
        return [SELECT COUNT() FROM Case WHERE RecordType.Name = '판매상담' AND OwnerId = :userId AND ContactId = :contactId];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getOrderCount(String contactId) {
        String userId = UserInfo.getUserId();
        return [SELECT COUNT() FROM Order WHERE BillToContactId = :contactId AND OwnerId = :userId];
    }
}