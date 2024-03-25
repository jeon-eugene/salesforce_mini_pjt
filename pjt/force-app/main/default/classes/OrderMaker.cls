public with sharing class OrderMaker {
    @AuraEnabled(cacheable=true)
    public static Account getAccountByUser(Id userId) {
        return [SELECT Id, Name, OwnerId FROM Account WHERE OwnerId = :userId LIMIT 1];
    }
    
    @AuraEnabled
    public static void createProductItem(Id userId, Id productId, List<String> serialNumbers) {
        List<ProductItem> piList = new List<ProductItem>();
        for(Integer i=0; i < serialNumbers.size(); ++i) {
            ProductItem pi = new ProductItem();
            pi.QuantityOnHand = 1;
            pi.LocationId = '131IS000000wn7mYAA';
            pi.Product2Id = productId;
            pi.SerialNumber = serialNumbers[i];
            pi.OwnerId = userId;
            
            piList.add(pi);
        }
        insert piList;
    }
    @AuraEnabled
    public static Id createOrder(Id accountId, Id contactId, Date orderDate, Integer discount) {
        Id pricebookId = [SELECT Id FROM PriceBook2 WHERE NAME = 'Standard' LIMIT 1][0].Id;
        Order ord = new Order();
        ord.AccountId = accountId;
        ord.BillToContactId = contactId;
        ord.EffectiveDate = orderDate;
        ord.Status = 'Completed';
        ord.DiscountRate__c = discount;
        ord.Pricebook2Id = pricebookId;
        
        insert ord;
        return ord.Id;
    }
    // orderDate는 Date or String타입?    
    @AuraEnabled
    public static List<Id> createOrderItem(Id orderId, List<Id> productIds, List<Integer> quantities){
        List<Id> createdOrderItemIds = new List<Id>();
        
        List<OrderItem> oiList = new List<OrderItem>();
        for(Integer i=0; i < productIds.size(); ++i) {
            // Standard인 Prickbook에서 productId에 해당하는 pricebookEntry 가져오기
            List<PricebookEntry> output = 
                [SELECT (SELECT Id, UnitPrice 
                         FROM PricebookEntries 
                         WHERE product2Id = :productIds[i])
                 FROM PriceBook2
                 WHERE Name = 'Standard'].PricebookEntries;
	        OrderItem oi = new OrderItem();
    	    oi.Product2Id = productIds[i];
            oi.OrderId = orderId;
            oi.Quantity = quantities[i];
            oi.PricebookEntryId = output[0].Id;
            oi.UnitPrice = output[0].UnitPrice;
            
            oiList.add(oi);
        }
        insert oiList;
        
        for(OrderItem oi : oiList) {
            createdOrderItemIds.add(oi.Id);
        }
        
        return createdOrderItemIds;
    }
    
    @AuraEnabled
    public static Id createCompleteOrder(Id userId, Id accountId, Id contactId, Date orderDate, Integer discount, List<ProductWrapper> selectedProducts) {
        Id orderId;
        Savepoint sp = Database.setSavepoint();
        try {
            // Create ProductItem records
            for (ProductWrapper pw : selectedProducts) {
                createProductItem(userId, pw.productId, pw.serialNumbers);
            }
            
            // Create the Order
            orderId = createOrder(accountId, contactId, orderDate, discount);
            
            // Create OrderItem records
            List<Id> productIds = new List<Id>();
            List<Integer> quantities = new List<Integer>();
            for (ProductWrapper pw : selectedProducts) {
                productIds.add(pw.productId);
                quantities.add(pw.serialNumbers.size());
            }
            createOrderItem(orderId, productIds, quantities);
        } catch (Exception e) {
            Database.rollback(sp);
            throw new AuraHandledException('Transaction Failed: ' + e.getMessage());
        }
        return orderId;
    }
}