public with sharing class OrderTriggerHandler {
    
    public static void autocompleteAccountName(List<Order> orders) {
        Map<Id, Id> ownerIdAccount = new Map<Id, Id>();
        for(Order aOrder : orders) {
            Id ownerId = aOrder.OwnerId;
            if (ownerId != null && !ownerIdAccount.containsKey(ownerId)) {
                List<Account> accounts = [SELECT Id FROM Account WHERE OwnerId = :ownerId LIMIT 1];
                if (!accounts.isEmpty()) {
                    ownerIdAccount.put(ownerId, accounts[0].Id);
                }
            }
        }        
        for (Order aOrder : orders) {
            Id ownerId = aOrder.OwnerId;
            if (ownerId != null) {
                aOrder.AccountId = ownerIdAccount.get(ownerId);
            }
        }
    }
    
}