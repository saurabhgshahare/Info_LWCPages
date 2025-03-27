import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class WelcomeNavigation extends NavigationMixin(LightningElement) {


    handlenewClick() {
        // Define the component you want to navigate to
        const compDefinition = {
            componentDef: "c:contactCreation" // Correct property name
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

    handleexistClick(event) {
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
}