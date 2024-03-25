public class ProductBrowserForm {
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts() {
        return [SELECT Id, Name FROM Product2 WHERE IsActive = true ORDER BY Name];
    }
}