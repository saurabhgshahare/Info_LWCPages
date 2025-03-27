public with sharing class GetPolicyController {
    @AuraEnabled(cacheable=true)
    public static List<Policy__c> getPoliciesByContactId(Id contactId) {
        // Validate the input
        if (contactId == null) {
            throw new AuraHandledException('Contact ID cannot be null');
        }

        // Query to fetch policies associated with the provided Contact ID
        List<Policy__c> policies = [
            SELECT Id, Name, Type__c, Amount__c
            FROM Policy__c
            WHERE Contact__c = :contactId
        ];

        return policies;
    }
}
