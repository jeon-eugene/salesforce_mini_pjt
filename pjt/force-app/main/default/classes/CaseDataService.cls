public with sharing class CaseDataService {
    @AuraEnabled
    public static Case updateSalesCase(Id caseId, String contactId, String description, Boolean isStopped) {
        Case updatedCase = new Case(
            Id = caseId,
            ContactId = contactId,
            Description = description,
            IsStopped = isStopped
        );

        try {
            update updatedCase;
        } catch (Exception ex) {
            throw new AuraHandledException('Error updating Case: ' + ex.getMessage());
        }

        return updatedCase;
    }

    @AuraEnabled
    public static Case updateVoiceCase(Id caseId, String contactId, String productId, String description, String reason, String status) {
        Case updatedCase = new Case(
            Id = caseId,
            ContactId = contactId,
            ProductId = productId,
            Description = description,
            Reason = reason,
            Status = status
        );

        try {
            update updatedCase;
        } catch (Exception ex) {
            throw new AuraHandledException('Error updating Case: ' + ex.getMessage());
        }

        return updatedCase;
    }

    
    @AuraEnabled(cacheable=true)
    public static List<String> getContactPhone(String inputPrefix) {
        List<String> phoneNumbers = new List<String>();
        
        // 전화번호를 검색할 쿼리를 작성합니다.
        String searchTerm = inputPrefix + '%'; // 입력된 접두사와 일치하는 전화번호를 검색합니다.
        List<Contact> contacts = [SELECT PhoneNumber__c FROM Contact WHERE PhoneNumber__c LIKE :searchTerm LIMIT 5];
        
        // 검색된 전화번호를 가져와서 리스트에 추가합니다.
        for(Contact con : contacts) {
            if(con.PhoneNumber__c != null) {
                phoneNumbers.add(con.PhoneNumber__c);
            }
        }
        
        return phoneNumbers;
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getFilteredSalesCases(Id contactId, String range, String stopped) {
        String query = '';
        String recordTypeFilter = 'RecordType.Name = \'판매상담\'';
        
        String userId = UserInfo.getUserId();
        String myCasesFilter = 'OwnerId = \'' + userId + '\'';
        
        query += 'SELECT Id, Account.Name, CaseNumber, Description, IsStopped, CreatedDate FROM Case ';
        
        if(range.equals('All Case')) {
            if (stopped.equals('단순상담')) {
                query += 'WHERE IsStopped = true AND ' + recordTypeFilter;
            } else if (stopped.equals('판매상담')) {
                query += 'WHERE IsStopped = false AND ' + recordTypeFilter;
            } else {
                query += 'WHERE ' + recordTypeFilter;
            }
        } else if (range.equals('My Case')) {
            if (stopped.equals('단순상담')) {
                query += 'WHERE IsStopped = true AND ' + myCasesFilter + ' AND ' + recordTypeFilter;
            } else if (stopped.equals('판매상담')) {
                query += 'WHERE IsStopped = false AND ' + myCasesFilter + ' AND ' + recordTypeFilter;
            } else {
                query += 'WHERE ' + myCasesFilter + ' AND ' + recordTypeFilter;
            }
        }
        query += ' AND contactId =:contactId';
		query += ' ORDER BY CreatedDate DESC';

        System.debug(query);
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getFilteredVoiceCases(Id contactId, String range, String caseStatus) {
        String query = '';
        String recordTypeFilter = 'RecordType.Name = \'전화상담\'';
        
        String userId = UserInfo.getUserId();
        String myCasesFilter = 'OwnerId = \'' + userId + '\'';
        
        query += 'SELECT Id, CaseNumber, Description, Reason, Product.Name, Status, CreatedDate FROM Case ';
        
        if(range.equals('All Case')) {
            if (caseStatus.equals('Working')) {
                query += 'WHERE Status = \'Working\' AND ' + recordTypeFilter;
            } else if (caseStatus.equals('Closed')) {
                query += 'WHERE Status = \'Closed\' AND ' + recordTypeFilter;
            } else {
                query += 'WHERE ' + recordTypeFilter;
            }
        } else if (range.equals('My Case')) {
            if (caseStatus.equals('Working')) {
                query += 'WHERE Status = \'Working\' AND ' + myCasesFilter + ' AND ' + recordTypeFilter;
            } else if (caseStatus.equals('Closed')) {
                query += 'WHERE Status = \'Closed\' AND ' + myCasesFilter + ' AND ' + recordTypeFilter;
            } else {
                query += 'WHERE ' + myCasesFilter + ' AND ' + recordTypeFilter;
            }
        }
        query += ' AND contactId =:contactId';
		query += ' ORDER BY CreatedDate DESC';

        System.debug(query);
        return Database.query(query);
    }


}