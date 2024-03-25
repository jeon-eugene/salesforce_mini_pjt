public with sharing class OrderItemController {
    @AuraEnabled(cacheable=true)
    public static List<OrderWrapper> getOrdersAndItems(Id contactId) {
        List<OrderWrapper> ordersList = new List<OrderWrapper>();
        
        // Query to fetch related orders and order items
        List<Order> orders = [SELECT Id, Name, (SELECT Id, Product2.Name, Product2.Family, Product2.ProductCode FROM OrderItems) FROM Order WHERE BillToContactId = :contactId];
        
        for(Order ord : orders) {
            OrderWrapper orderWrapper = new OrderWrapper(ord);
            ordersList.add(orderWrapper);
        }
        
        return ordersList;
    }
    
    public class OrderWrapper {
        @AuraEnabled
        public Id orderId { get; set; }
        @AuraEnabled
        public String orderName { get; set; }
        @AuraEnabled
        public List<OrderItemWrapper> orderItems { get; set; }
        
        public OrderWrapper(Order ord) {
            this.orderId = ord.Id;
            this.orderName = ord.Name;
            this.orderItems = new List<OrderItemWrapper>();
            
            for(OrderItem oi : ord.OrderItems) {
                this.orderItems.add(new OrderItemWrapper(oi));
            }
        }
    }
    
    public class OrderItemWrapper {
        @AuraEnabled
        public String productName { get; set; }
        @AuraEnabled
        public String productFamily { get; set; }
        @AuraEnabled
        public String productCode { get; set; }
        
        public OrderItemWrapper(OrderItem oi) {
            this.productName = oi.Product2.Name;
            this.productFamily = oi.Product2.Family;
            this.productCode = oi.Product2.ProductCode;
        }
    }
}