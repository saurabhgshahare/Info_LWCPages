import { LightningElement, wire } from 'lwc';
import getAccountFieldValues from '@salesforce/apex/AccountContactCreator.getAccountFieldValues';
import createAccount from '@salesforce/apex/AccountContactCreator.createAccount';
import createContactAndLinkToAccount from '@salesforce/apex/AccountContactCreator.createContactAndLinkToAccount';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class AccountContact extends LightningElement {

    accountName = '';
    accountPhone = '';
    selectedType = '';
    selectedIndustry = '';
    selectedRating = '';
    contactFirstName = '';
    contactLastName = '';
    contactEmail = '';
    contactDepartment = '';

    typeOptions = [];
    industryOptions = [];
    ratingOptions = [];

    

    isSubmitDisabled = true;
    @wire(getAccountFieldValues, { fieldName: 'Type' })
    wiredType({ error, data }) {
        if (data) {
            this.typeOptions = data.map(item => ({ label: item, value: item }));
        } else if (error) {
            console.error('Error fetching Type values: ', error);
        }
    }

    @wire(getAccountFieldValues, { fieldName: 'Industry' })
    wiredIndustry({ error, data }) {
        if (data) {
            this.industryOptions = data.map(item => ({ label: item, value: item }));
        } else if (error) {
            console.error('Error fetching Industry values: ', error);
        }
    }

    @wire(getAccountFieldValues, { fieldName: 'Rating' })
    wiredRating({ error, data }) {
        if (data) {
            this.ratingOptions = data.map(item => ({ label: item, value: item }));
        } else if (error) {
            console.error('Error fetching Rating values: ', error);
        }
    }

    checkFormValidity() {
        this.isSubmitDisabled = !(this.accountName && this.accountPhone && this.contactFirstName && this.contactLastName && this.contactEmail && this.selectedType && this.selectedIndustry && this.selectedRating);
    }

    handleAccountNameChange(event) {
        this.accountName = event.target.value;
        this.checkFormValidity();
    }

    handleAccountPhoneChange(event) {
        this.accountPhone = event.target.value;
        this.checkFormValidity();
    }
    handleTypeChange(event) {
        this.selectedType = event.target.value;
        this.checkFormValidity();
    }

    handleIndustryChange(event) {
        this.selectedIndustry = event.target.value;
        this.checkFormValidity();
    }

    handleRatingChange(event) {
        this.selectedRating = event.target.value;
        this.checkFormValidity();
    }

    handleContactFirstNameChange(event) {
        this.contactFirstName = event.target.value;
        this.checkFormValidity();
    }

    handleContactLastNameChange(event) {
        this.contactLastName = event.target.value;
        this.checkFormValidity();
    }

    handleContactEmailChange(event) {
        this.contactEmail = event.target.value;
        this.checkFormValidity();
    }
    handleContactDepartmentChange(event) {
        this.contactDepartment = event.target.value;
    }

    

    handleCreate() {
        createAccount({
            accountName: this.accountName,
            accountPhone: this.accountPhone,
            type: this.selectedType,
            rating: this.selectedRating,
            industry: this.selectedIndustry
        })
        .then(accountId => {
            return createContactAndLinkToAccount({
                firstName: this.contactFirstName,
                lastName: this.contactLastName,
                email: this.contactEmail,
                department: this.contactDepartment,
                accountId: accountId
            });
        })
        .then(result => {
            if (result) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!',
                        message: 'Account and Contact created successfully.',
                        variant: 'success'
                    })
                );
                this.resetFields();
            }
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
    resetFields() {
        this.accountName = '';
        this.accountPhone = '';
        this.selectedType = '';
        this.selectedIndustry = '';
        this.selectedRating = '';
        this.contactFirstName = '';
        this.contactLastName = '';
        this.contactEmail = '';
        this.contactDepartment = '';
    }
}