public with sharing class CaseTriggerHandler {
    public static void countNewCases(List<Case> cases) {
        Map<Id, Integer> conMap = new Map<Id, Integer>();
        for (Case aCase : cases) {
            if (!conMap.containsKey(aCase.ContactId)) {
                conMap.put(aCase.ContactId, 1);
            }
            else {
                conMap.put(aCase.ContactId, conMap.get(aCase.ContactId) + 1);
            }
        }
        List<Contact> conToUpdate = [SELECT Id, Count_Cases_c__c FROM Contact WHERE Id IN :conMap.keySet()];
        for (Contact con : conToUpdate) {
            con.Count_Cases_c__c = con.Count_Cases_c__c + conMap.get(con.Id);
        }
        update conToUpdate;
    }
    
    public static void countCases(List<Case> cases, Map<Id, Case> oldCases) {
        Map<Id, Integer> conMap = new Map<Id, Integer>();
    
        for (Case aCase : cases) {
            Case oldCase = oldCases.get(aCase.Id);
    
            if (oldCase != null && aCase.isStopped) {
                if (aCase.ContactId != oldCase.ContactId) {
                    if (oldCase.ContactId != null) {
                        Integer oldValue = conMap.get(oldCase.ContactId);
                        conMap.put(oldCase.ContactId, oldValue != null ? oldValue - 1 : -1);
                    }
                    if (aCase.ContactId != null) {
                        Integer newValue = conMap.get(aCase.ContactId);
                        conMap.put(aCase.ContactId, newValue != null ? newValue + 1 : 1);
                    }
                }
            } else if (oldCase != null && !aCase.isStopped) {
                if (aCase.ContactId == null || oldCase.ContactId == null) {
                    System.debug('Warning: Custom Validation');
                } else {
                    if (!conMap.containsKey(aCase.ContactId)) {
                        conMap.put(aCase.ContactId, 1);
                    } else {
                        conMap.put(aCase.ContactId, conMap.get(aCase.ContactId) + 1);
                    }
                    
                    Id oldId = oldCase.ContactId;
                    if (!conMap.containsKey(oldId)) {
                        conMap.put(oldId, -1);
                    } else {
                        conMap.put(oldId, conMap.get(oldId) - 1);
                    }
                }
            }
        }
    
        List<Contact> conToUpdate = [SELECT Id, Count_Cases_c__c FROM Contact WHERE Id IN :conMap.keySet()];
        for (Contact con : conToUpdate) {
            con.Count_Cases_c__c = con.Count_Cases_c__c + conMap.get(con.Id);
        }
        update conToUpdate;
    }

    public static void countOldCases(List<Case> cases) {
        Map<Id, Integer> conMap = new Map<Id, Integer>();
        for (Case aCase : cases) {
            if (!conMap.containsKey(aCase.ContactId)) {
                conMap.put(aCase.ContactId, -1);
            } else {
                conMap.put(aCase.ContactId, conMap.get(aCase.ContactId) - 1);
            }
        }
        List<Contact> conToUpdate = [SELECT Id, Count_Cases_c__c FROM Contact WHERE Id IN :conMap.keySet()];
        for (Contact con : conToUpdate) {
            con.Count_Cases_c__c = con.Count_Cases_c__c + conMap.get(con.Id);
        }
        update conToUpdate;
    }
    
    public static void autocompleteAccountName(List<Case> cases) {
        Map<Id, Id> ownerIdAccount = new Map<Id, Id>();
        for(Case aCase : cases) {
            Id ownerId = aCase.OwnerId;
            if (ownerId != null && !ownerIdAccount.containsKey(ownerId)) {
                List<Account> accounts = [SELECT Id FROM Account WHERE OwnerId = :ownerId LIMIT 1];
                if (!accounts.isEmpty()) {
                    ownerIdAccount.put(ownerId, accounts[0].Id);
                }
            }
        }
        
        for (Case aCase : cases) {
            Id ownerId = aCase.OwnerId;
            if (ownerId != null) {
                aCase.AccountId = ownerIdAccount.get(ownerId);
            }
        }
    }
   
}