public with sharing class ContactPolicyController {
    @AuraEnabled
    public static Id saveContactWithPolicies(Contact contact, List<Policy__c> policies) {
        System.debug('Contact to save: ' + contact);
        try {
            // Validate required fields
            if (String.isEmpty(contact.FirstName) || String.isEmpty(contact.LastName)) {
                throw new AuraHandledException('First Name and Last Name are required.');
            }

            // Insert the contact
            insert contact;
            System.debug('Inserted contact ID: ' + contact.Id);

            // Associate policies with the contact
            for (Policy__c policy : policies) {
                policy.Contact__c = contact.Id; // Assuming Contact__c is the lookup field on Policy__c
            }

            // Insert policies if there are any
            if (!policies.isEmpty()) {
                insert policies;
            }

            return contact.Id;
        } catch (DmlException e) {
            throw new AuraHandledException('DML Error: ' + e.getMessage());
        } catch (Exception e) {
            throw new AuraHandledException('Error: ' + e.getMessage());
        }
    }
}
