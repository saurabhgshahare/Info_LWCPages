import { LightningElement, api, track } from 'lwc';
import createClaim from '@salesforce/apex/ClaimCreationController.createClaim';
import getPoliciesByContactId from '@salesforce/apex/GetPolicyController.getPoliciesByContactId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ClaimCreation extends LightningElement {
    @api selectedContactId; // The selected contact
    @track claimType = '';
    @track selectedPolicies = [];
    @track policyOptions = [];
    @track totalAmount = 0; // To store the total amount from selected policies

    // Claim type options
    get claimTypeOptions() {
        return [
            { label: 'Death', value: 'Death' },
            { label: 'Dismemberment', value: 'Dismemberment' }
        ];
    }

    // Fetch policies based on the selected contact
    connectedCallback() {
        // Retrieve the selectedContactId from the state
        const state = this.getStateFromUrl();
        this.selectedContactId = state.selectedContactId;
        console.log('ClaimCreation ConnectedCallback selectedContactId:', this.selectedContactId);

        // Fetch policies based on the selected contact
        this.fetchPolicies();
    }

    getStateFromUrl() {
        // This is where you would normally get the values from the URL
        return this.getUrlParameters();
    }

    getUrlParameters() {
        const params = new URLSearchParams(window.location.search);
        return {
            selectedContactId: params.get('selectedContactId')
        };
    }
    async fetchPolicies() {
        if (this.selectedContactId) {
            try {
                const policies = await getPoliciesByContactId({ contactId: this.selectedContactId });
                this.policyOptions = policies.map(policy => ({
                    label: `${policy.Name} - ${policy.Type__c} - $${policy.Amount__c}`,
                    value: policy.Id,
                    amount: policy.Amount__c
                }));
            } catch (error) {
                this.showToast('Error', 'Failed to fetch policies.', 'error');
            }
        }
    }

    // Handle policy selection
    handlePolicyChange(event) {
        this.selectedPolicies = event.detail.value;
        this.calculateTotalAmount();
    }

    // Calculate total amount based on selected policies
    calculateTotalAmount() {
        this.totalAmount = this.selectedPolicies.reduce((total, policyId) => {
            const policy = this.policyOptions.find(option => option.value === policyId);
            return total + (policy ? policy.amount : 0);
        }, 0);
    }

    // Handle claim submission
    async submitClaim() {
        try {
            await createClaim({
                claim: {
                    ClaimType__c: this.claimType,
                    Contact__c: this.contact.Id,
                    Amount__c: this.totalAmount // Send the total amount
                },
                policyIds: this.selectedPolicies,
            });
            this.showToast('Success', 'Claim created successfully.', 'success');
            // Optionally navigate to the created claim record here (if needed)
        } catch (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    // Show toast messages
    showToast(title, message, variant) {
        const toast = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(toast);
    }

    // Navigate Back
    navigateBack() {
        window.history.back();
    }
}
