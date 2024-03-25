public with sharing class ProductBrowser {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getProducts() {
        List<Map<String, Object>> productList = new List<Map<String, Object>>();
        
        List<Product2> bodyProducts = [
            SELECT Id, DisplayUrl, ProductCode, Family, Name 
            FROM Product2 
            WHERE IsActive = true AND Family = 'BodyPart'
            ORDER BY Name
        ];
        productList.addAll(getProductsWithPrice(bodyProducts));

        List<Product2> subProducts = [
            SELECT Id, DisplayUrl, ProductCode, Family, Name 
            FROM Product2 
            WHERE IsActive = true AND Family = 'SubPart'
            ORDER BY Name
        ];
        productList.addAll(getProductsWithPrice(subProducts));

        return productList;
    }

    private static List<Map<String, Object>> getProductsWithPrice(List<Product2> products) {
        List<Map<String, Object>> productWithPriceList = new List<Map<String, Object>>();
        
        for(Product2 product : products) {
            Map<String, Object> productMap = new Map<String, Object>();
            productMap.put('Id', product.Id);
            productMap.put('DisplayUrl', product.DisplayUrl);
            productMap.put('ProductCode', product.ProductCode);
            productMap.put('Family', product.Family);
            productMap.put('Name', product.Name);
            productMap.put('UnitPrice', getUnitPrice(product.Id));
            productWithPriceList.add(productMap);
        }

        return productWithPriceList;
    }

    @AuraEnabled(cacheable=true)
    public static Decimal getUnitPrice(String productId){
        Decimal standPrice = 0;
        List<PricebookEntry> pricebookEntries = [SELECT Id, Product2Id, Pricebook2.Name, UnitPrice 
                                                 FROM PricebookEntry 
                                                 WHERE Product2Id = :productId 
                                                 AND Pricebook2.Name = 'Standard' 
                                                 LIMIT 1];
        if (!pricebookEntries.isEmpty()) {
            standPrice = pricebookEntries[0].UnitPrice;
        }
        return standPrice;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getProductsWithContact(String contactId) {
        Set<String> productInfoSet = new Set<String>();
        
        List<Order> orders = [SELECT Id, (SELECT Product2.Id, Product2.Name, Product2.Family, Product2.ProductCode FROM OrderItems) 
                                FROM Order WHERE BillToContactId = :contactId];
        
        for(Order order : orders) {
            for(OrderItem item : order.OrderItems) {
                productInfoSet.add(item.Product2.Id + '|' + item.Product2.Name + '|' + item.Product2.Family + '|' + item.Product2.ProductCode);
            }
        }
        
        return new List<String>(productInfoSet);
    }
    
}