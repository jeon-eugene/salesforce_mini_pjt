global class LevelDecisionBatch implements Database.Batchable<sObject> {
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        Date recentNinetyDays = System.today().addDays(-90);
        /* 
        본체 최근 90일 구매 금액, 
        주변기기 최근 90일 구매 금액 조회 및 합산 후 등급 결정 */
        return Database.getQueryLocator(
            'SELECT BodyPart_Amount__c, SubPart_Amount__c, PhoneNumber__c FROM Contact'
        );
    }

    global void execute(Database.BatchableContext BC, List<Contact> scope) {
        for (Contact contact : scope) {
            // 널 값 체크 및 기본값 할당
            Decimal bodyPartAmount = contact.BodyPart_Amount__c != null ? contact.BodyPart_Amount__c : 0;
            Decimal subPartAmount = contact.SubPart_Amount__c != null ? contact.SubPart_Amount__c : 0;
            Decimal totalAmount = bodyPartAmount + subPartAmount;

            if (totalAmount >= 5000000) {
                contact.Level__c = 'A등급';
            } else if (totalAmount >= 2000000) {
                contact.Level__c = 'B등급';
            } else if (totalAmount > 0) {
                contact.Level__c = 'C등급';
            } else {
                contact.Level__c = 'D등급';
            }
        }
        update scope;
    }
    global void finish(Database.BatchableContext BC) {
        System.debug('Batch is done');
    }
}
/* 실행
LevelDecisionBatch levelBatch = new LevelDecisionBatch();
Database.executeBatch(levelBatch);
*/