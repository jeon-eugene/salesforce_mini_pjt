public with sharing class OrderController {
    
    public class OrderInfo {
        @AuraEnabled
        public Id id { get; set; }
        @AuraEnabled
        public Date effectiveDate { get; set; }
        @AuraEnabled
        public Map<String, Decimal> productNames { get; set; }
        @AuraEnabled
        public String orderStatus { get; set; }
        @AuraEnabled
        public Decimal discountRate { get; set; }
        @AuraEnabled
        public Decimal totalAmount { get; set; }
        @AuraEnabled
        public Decimal netAmount { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static List<OrderInfo> getOrderInfoByContactId(Id contactId, String status) {
        List<OrderInfo> orderInfoList = new List<OrderInfo>();

        Id currentUserId = UserInfo.getUserId();
        
        List<Order> orders = [SELECT Id, EffectiveDate, OwnerId, Status, DiscountRate__c, TotalAmount, NetOrderAmount__c,
                                     (SELECT Id, Product2.Name, Quantity FROM OrderItems)
                              FROM Order
                              WHERE BillToContactId = :contactId
                              AND Status = :status
                              WITH USER_MODE
                              ORDER BY EffectiveDate DESC];
        
        for (Order order : orders) {
            OrderInfo info = new OrderInfo();
            info.id = order.Id;
            info.effectiveDate = order.EffectiveDate;
            info.discountRate = order.DiscountRate__c;
            info.orderStatus = order.Status;
            info.totalAmount = order.TotalAmount;
            info.netAmount = order.NetOrderAmount__c;
            info.productNames = new Map<String, Decimal>();
            
            for (OrderItem item : order.OrderItems) {
                info.productNames.put(item.Product2.Name, item.Quantity);
            }
            
            orderInfoList.add(info);
        }
        
        return orderInfoList;
    }
}