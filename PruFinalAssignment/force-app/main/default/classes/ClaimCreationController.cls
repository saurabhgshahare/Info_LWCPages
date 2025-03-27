public with sharing class ClaimCreationController {
    @AuraEnabled
    public static void createClaim(Claim__c claim, List<Id> policyIds) {
        // Query to get the total amount from Policy__c records
        AggregateResult totalAmountResult = [SELECT SUM(Amount__c) totalAmount FROM Policy__c WHERE Id IN :policyIds];

        // Retrieve the total amount if it exists
        Decimal totalAmount = (Decimal)totalAmountResult.get('totalAmount');

        // Set the Amount__c field of the Claim__c object
        claim.Amount__c = totalAmount;

        // Insert the claim record
        insert claim;
    }
}