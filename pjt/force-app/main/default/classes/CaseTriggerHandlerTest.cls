@isTest
private class CaseTriggerHandlerTest {
    @testSetup
    static void dataSetup() {
        Contact newCon1 = new Contact(LastName='TestContact1', type__c='상담 고객', PhoneNumber__c='12323');
        insert newCon1;
        
        Contact newCon2 = new Contact(LastName='TestContact2', type__c='상담 고객', PhoneNumber__c='123277773');
        insert newCon2;
    }
    
    // 새로운 Case를 만들었을 때
    @isTest
    static void test_afterInsert() {
        Contact insertedCon1 = [Select Id, Count_Cases_c__c From Contact Where LastName = 'TestContact1'];
        System.assertEquals(0, insertedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        
        List<Case> cases = new List<Case>();
        for(Integer i=0; i<2; i++) {
            cases.add(new Case(Description='TestContact'+i, ContactId=insertedCon1.Id));
        }
        
        Test.startTest();
            insert cases;
            Contact updatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
            System.assertEquals(2, updatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        Test.stopTest();
    }
    
    // Update1 : Case에 ContactId가 추가되었을 때 (단순, 판매 무관)
    @isTest
    static void test_afterUpdate_scenario1() {
        Contact insertedCon1 = [Select Id, Count_Cases_c__c From Contact Where LastName = 'TestContact1'];
        System.assertEquals(0, insertedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        
        List<Case> cases = new List<Case>();
        for(Integer i=0; i<2; i++) {
            cases.add(new Case(Description='TestContact'+i, ContactId=insertedCon1.Id));
        }
        insert cases;
        
        Contact updatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
        System.assertEquals(2, updatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        
        Test.startTest();
            for(Case aCase : cases) {
                aCase.ContactId = insertedCon1.Id;
            }
            update cases;
        Test.stopTest();
        
        Contact newUdpatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
        System.assertEquals(2, newUdpatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
    }
    
    // Update2: Case의 ContactId가 null이 되었을 때 (단순상담이라면 상담횟수 감소)
    @isTest
    static void test_afterUpdate_scenario2() {
        Contact insertedCon1 = [Select Id From Contact Where LastName = 'TestContact1'];
        
        List<Case> cases = new List<Case>();
        for(Integer i=0; i<2; i++) {
            cases.add(new Case(Description='TestContact'+i, isStopped=true, ContactId=insertedCon1.Id));
        }
        insert cases;
        
        Contact updatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
        System.assertEquals(2, updatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        
        Test.startTest();
            for(Case aCase : cases) {
                aCase.ContactId = null;
            }
            update cases;
        Test.stopTest();
        
        Contact newUpdatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
        System.assertEquals(0, newUpdatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
    }
    
    // Update3: Case의 ContactId가 null이 되었을 때 (판매상담이라면 커스텀 Violation 발생)
    @isTest
    static void test_afterUpdate_scenario3() {
        Contact insertedCon1 = [Select Id From Contact Where LastName = 'TestContact1'];
        
        List<Case> cases = new List<Case>();
        for(Integer i=0; i<2; i++) {
            cases.add(new Case(Description='TestContact'+i, isStopped=false, ContactId=insertedCon1.Id));
        }
        insert cases;
        
        Contact updatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
        System.assertEquals(2, updatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        
        Test.startTest();
            try {
                for (Case aCase : cases) {
                    aCase.ContactId = null;
                }
                update cases;
                System.assert(false, 'Custom Exception이 발생하지 않았습니다.');
            } catch (DmlException e) {
                System.assert(e.getMessage().contains('FIELD_CUSTOM_VALIDATION_EXCEPTION'), 'Custom validation rule violated.');
            }
        Test.stopTest();
        
        Contact newUpdatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
        System.assertEquals(2, newUpdatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
    }
    
    
    // Update4: Case의 ContactId가 바뀌었을 때(단순, 판매 무관)
    @isTest
    static void test_afterUpdate_scenario4() {
        Contact insertedCon1 = [Select Id From Contact Where LastName = 'TestContact1'];
        Contact insertedCon2 = [Select Id From Contact Where LastName = 'TestContact2'];
        
        List<Case> cases = new List<Case>();
        for(Integer i=0; i<2; i++) {
            cases.add(new Case(Description='TestContact'+i, ContactId=insertedCon1.Id));
        }
        insert cases;
        
        Contact updatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
        Contact updatedCon2 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon2.Id];
        System.assertEquals(2, updatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        System.assertEquals(0, updatedCon2.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        
        Test.startTest();
            for(Case aCase : cases) {
                aCase.ContactId = updatedCon2.Id;
            }
            update cases;
        Test.stopTest();
        
        Contact newUpdatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
        Contact newUpdatedCon2 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon2.Id];
        System.assertEquals(0, newUpdatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        System.assertEquals(2, newUpdatedCon2.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
    }

    // 기존 Case를 제거했을 때
    @isTest
    static void test_afterDelete() {
        Contact insertedCon1 = [Select Id, Count_Cases_c__c From Contact Where LastName = 'TestContact1'];
        System.assertEquals(0, insertedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        
        List<Case> cases = new List<Case>();
        for(Integer i=0; i<2; i++) {
            cases.add(new Case(Description='TestContact'+i, ContactId=insertedCon1.Id));
        }
        insert cases;
        
        Contact updatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
        System.assertEquals(2, updatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
        
        Test.startTest();
            delete cases;
        Test.stopTest();
        
        Contact newUpdatedCon1 = [Select Id, Count_Cases_c__c From Contact Where Id = :insertedCon1.Id];
        System.assertEquals(0, newUpdatedCon1.Count_Cases_c__c, '예상한 상담횟수와 일치하지 않습니다.');
    }
   
}