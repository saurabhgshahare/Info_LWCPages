import { LightningElement, track } from 'lwc';
import saveContactWithPolicies from '@salesforce/apex/ContactPolicyController.saveContactWithPolicies';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class ContactCreation extends NavigationMixin(LightningElement) {
    // Contact fields
    @track firstName = '';
    @track lastName = '';
    @track phone = '';
    @track email = '';
    @track ssn = '';
    @track mailingCity = '';

    @track policyType = '';
    @track policyAmount = '';

    @track policies = [];
    @track policyColumns = [
        { label: 'Type', fieldName: 'Type__c', type: 'text' },
        { label: 'Amount', fieldName: 'Amount__c', type: 'currency' }
    ];

    get policyTypeOptions() {
        return [
            { label: 'III', value: 'III' },
            { label: 'Retirement', value: 'Retirement' },
            { label: 'GI', value: 'GI' },
        ];
    }

    handleInputChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.value;
    }

    // Handle Policy Input Changes
    handlePolicyInputChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.value;
    }

    // Add Policy to the List
    addPolicy() {
        if (this.policyType && this.policyAmount) {
            this.policies = [
                ...this.policies,
                {
                    Type__c: this.policyType,
                    Amount__c: this.policyAmount
                },
            ];
            // Clear the Policy Inputs
            this.policyType = '';
            this.policyAmount = '';
        } else {
            this.showToast('Error', 'Please fill all necessary fields before adding.', 'error');
        }
    }


    async submitForm() {
        if (!this.firstName || !this.lastName || !this.ssn) {
            this.showToast('Error', 'Please fill all required contact fields.', 'error');
            return;
        }

        try {
            const contact = {
                FirstName: this.firstName,
                LastName: this.lastName,
                Phone: this.phone,
                Email: this.email,
                SSN__c: this.ssn,
                MailingCity: this.mailingCity,
            };
            console.log('contact:', JSON.stringify(contact, null, 2));

            const contactId = await saveContactWithPolicies({
                contact,
                policies: this.policies,
            });
            console.log('contactId:', JSON.stringify(contactId, null, 2));

            this.showToast('Success', `Contact created successfully. ID: ${contactId}`, 'success');
            this.navigateSubmit();
            // this.resetForm();

        } catch (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    navigateBack() {
        window.history.back();
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }

    navigateSubmit() {
        const compDefinition = {
            componentDef: "c:contactSearch" // Correct property name
        };

        // Encode the component definition to Base64
        const encodedCompDef = btoa(JSON.stringify(compDefinition));

        // Use the NavigationMixin to navigate to the component
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#' + encodedCompDef // Construct the URL correctly
            }
        });
    }

 /*   resetForm() {
        this.firstName = '';
        this.lastName = '';
        this.phone = '';
        this.email = '';
        this.ssn = '';
        this.mailingCity = '';
        this.policies = [];
    } */
}
