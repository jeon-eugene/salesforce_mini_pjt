global class AmountBatch implements Database.Batchable<sObject> {
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        Date recentNinetyDays = System.today().addDays(-90);
        // 최근 90일 동안의 status가 Completed 인 OrderItem 조회(환불은 주문에서 변환이라 조회 안해도 됨)
        return Database.getQueryLocator(
            'SELECT OrderId, Product2.Family, TotalPrice, Order.Status ' +
            'FROM OrderItem ' +
            'WHERE Order.EffectiveDate >= :recentNinetyDays ' +
            'AND Order.Status = \'Completed\' ' +
            'AND Product2.Family IN (\'BodyPart\', \'SubPart\')');
    }
    
    global void execute(Database.BatchableContext BC, List<OrderItem> scope) {
        Map<Id, Id> orderToContactMap = new Map<Id, Id>();
        /* Order의 Id와 해당 Order에 연결된 Contact의 Id를 매핑하기 위한 
            Map 객체를 생성. 두 가지 Id 값을 매핑. 
        */
        for (OrderItem item : scope) {
            orderToContactMap.put(item.OrderId, null);
        }
        
        for (Order order : [SELECT Id, BillToContactId FROM Order WHERE Id IN :orderToContactMap.keySet()]) {
            orderToContactMap.put(order.Id, order.BillToContactId);
        }
        
        Map<Id, Contact> contactsToUpdateMap = new Map<Id, Contact>();

        for (OrderItem item : scope) {
            Id contactId = orderToContactMap.get(item.OrderId);
            if(contactId == null) continue; // 연결된 Contact가 없는 경우 건너뜀

            Contact contactToUpdate = contactsToUpdateMap.get(contactId);
            if(contactToUpdate == null) {
                contactToUpdate = new Contact(Id = contactId);
                contactsToUpdateMap.put(contactId, contactToUpdate);
            }
            
            if(item.Product2.Family == 'BodyPart') {
                contactToUpdate.BodyPart_Amount__c = (contactToUpdate.BodyPart_Amount__c != null ? contactToUpdate.BodyPart_Amount__c : 0) + item.TotalPrice;
            } else if(item.Product2.Family == 'SubPart') {
                contactToUpdate.SubPart_Amount__c = (contactToUpdate.SubPart_Amount__c != null ? contactToUpdate.SubPart_Amount__c : 0) + item.TotalPrice;
            }
        }

        try {
            update contactsToUpdateMap.values();
            System.debug('Update Successfully');
        } catch (DmlException e) {
            System.debug('error :( ' + e.getMessage());
        }
    }

    global void finish(Database.BatchableContext BC) {
        System.debug('Batch is done');
    }

}


/*
바로 확인 방법
AmountBatch myBatch = new AmountBatch();
Database.executeBatch(myBatch);
*/