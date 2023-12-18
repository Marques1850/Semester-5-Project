export default class PopUp {
    constructor() {

        this.buildElevatorPopup();
        this.buildPassagePopup();
    }

    buildElevatorPopup() {
        this.elevPopup = document.createElement('div');

        // Set the content of the pop-up
        this.elevPopup.innerHTML = "Choose a floor to go!";

        this.elevPopup.style.fontSize = '24px'; // Adjust this to change the size of the text
        this.elevPopup.style.fontFamily = 'NType82'; // Change this to the font family you want to use

        // Style the pop-up
        this.elevPopup.style.position = 'absolute';
        this.elevPopup.style.top = '50%'; // Adjust this to change the vertical position of the pop-up
        this.elevPopup.style.left = '50%'; // Adjust this to change the horizontal position of the pop-up
        this.elevPopup.style.transform = 'translate(-50%, -50%)';
        this.elevPopup.style.backgroundColor = '#F4F4F2';
        this.elevPopup.style.padding = '20px';
        this.elevPopup.style.borderRadius = '5px';
        this.elevPopup.style.width = '40%'; // Adjust this to change the width of the pop-up
        this.elevPopup.style.height = '40%'; // Adjust this to change the height of the pop-up
        this.elevPopup.style.display = 'flex';
        this.elevPopup.style.flexDirection = 'column';
        this.elevPopup.style.justifyContent = 'center';
        this.elevPopup.style.alignItems = 'center';


        this.elevText = document.createElement('p');

        this.elevText.style.fontSize = '24px'; // Same as the popup
        this.elevText.style.fontFamily = 'NType82'; // Same as the popup

        // Append the text to the pop-up
        this.elevPopup.appendChild(this.elevText);

        this.elevDropdown = document.createElement('select');

        // Style the dropdown
        this.elevDropdown.style.display = 'block';
        this.elevDropdown.style.padding = '8px';
        this.elevDropdown.style.height = 'auto';
        this.elevDropdown.style.borderRadius = '50px';
        this.elevDropdown.style.border = 'none';
        this.elevDropdown.style.backgroundColor = 'white';
        this.elevDropdown.style.width = '100%';
        this.elevDropdown.style.color = '#555';

        // Append the dropdown to the pop-up
        this.elevPopup.appendChild(this.elevDropdown);

        // Create a new HTML element for the button
        this.elevButton = document.createElement('button');

        // Add a margin to the top of the button
        this.elevButton.style.marginTop = '20px'; // Adjust this to change the space between the dropdown and the button

        // Set the content of the button
        this.elevButton.innerHTML = "Submit";
        this.elevPopup.appendChild(this.elevButton);


    }

    buildPassagePopup() {

        this.passPopup = document.createElement('div');

        // Set the content of the pop-up
        

        // Set the font size and style of the text
        this.passPopup.style.fontSize = '30px'; // Adjust this to change the size of the text
        this.passPopup.style.fontFamily = 'NType82'; // Change this to the font family you want to use

        // Style the pop-up
        this.passPopup.style.position = 'absolute';
        this.passPopup.style.top = '50%';
        this.passPopup.style.left = '50%';
        this.passPopup.style.transform = 'translate(-50%, -50%)';
        this.passPopup.style.backgroundColor = '#F4F4F2';
        this.passPopup.style.padding = '20px';
        this.passPopup.style.borderRadius = '5px';

    }

    popupElevator() {
        document.body.appendChild(this.elevPopup);

        return {
            popup: this.elevPopup,
            dropdown: this.elevDropdown,
            button: this.elevButton
        };
    }

    popupPassage() {
        document.body.appendChild(this.passPopup);

        return {
            popup: this.passPopup,
        };
    }

}