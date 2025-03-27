import { LightningElement, track } from 'lwc';
import searchContacts from '@salesforce/apex/ContactSearchController.searchContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class ContactSearch extends NavigationMixin(LightningElement) {
    // Input fields
    firstName = '';
    lastName = '';
    ssn = '';

    // Contacts and columns
    @track contacts = [];
    @track selectedRows = [];
    @track selectedContactId = ''; // To track the selected contact ID
    @track isNextDisabled = true;

    @track columns = [
        { label: 'First Name', fieldName: 'FirstName', type: 'text' },
        { label: 'Last Name', fieldName: 'LastName', type: 'text' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'Email', fieldName: 'Email', type: 'email' },
        { label: 'SSN', fieldName: 'SSN__c', type: 'text' },
    ];

    handleInputChange(event) {
        this[event.target.dataset.field] = event.target.value;
    }
    async searchContacts() {
        try {
            const result = await searchContacts({
                firstName: this.firstName,
                lastName: this.lastName,
                ssn: this.ssn,
            });
            this.contacts = result;
        } catch (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        const selectedIds = selectedRows.map(row => row.Id);
        console.log('selectedIds:', JSON.stringify(selectedIds, null, 2));
        this.selectedContactId = selectedIds[0];
        console.log('Selected Contact ID: ', this.selectedContactId);
        this.isNextDisabled = !this.selectedContactId;
    }

    showToast(title, message, variant) {
        const toast = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(toast);
    }

   /* handleNext(){
        console.log('handleNext triggered');
        if(this.selectedContactId){
          const navigateEvent= new CustomEvent('navigate',{detail:{contactId: this.selectedContactId},});
          console.log('NavigateEvent is: ', JSON.stringify(navigateEvent, null, 2));
          this.dispatchEvent(navigateEvent);
            this.navigateNext();
        }

    } */

    navigateNext() {
        console.log('NavigateNext triggered selectedContactId: ', JSON.stringify(this.selectedContactId,null,2));
    /*    const compDefinition = {
            componentDef: "c:claimCreation" // Correct property name
        };

        // Encode the component definition to Base64
        const encodedCompDef = btoa(JSON.stringify(compDefinition));      */

        // Use the NavigationMixin to navigate to the component
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
            //    url: '/one/one.app#' + encodedCompDef // Construct the URL correctly
            componentName: "c__claimCreation"
            },
            state: {
                // Pass the selectedContactId as a state parameter
                c__selectedContactId: this.selectedContactId
            }
        });
    }
    // Navigate Back
    navigateBack() {
        window.history.back();
    }
}