import { LightningElement, track } from 'lwc';

export default class EmbedTest extends LightningElement {
    productDetail = {
        Id : 1,
        Family : '본체',
        Code : '123124',
        Price : 13000
    };
    @track orders = [];
    initialValue;
    @track serialNumbers = [ { value: '1231313', id: 1 }, { value: '99999', id: 2 } ];
    uniqueId = 0;

    quantity = 0;

    handleChange() {
        // if event.target == tagname
    }

    handleQuantityChange(event) {
        this.quantity = parseInt(event.target.value) || 0;
        this.serialNumbers = [];

        for(let i = 0; i < this.quantity; ++i) {
            this.serialNumbers.push({
                value: '',
                id: i
            });
        }

        console.log(serialNumbers);
    }

    handleSerialNumberChange(){

    }

    // Method to add a new item
    handleAddItem() {
        this.uniqueId++;
        this.products = [...this.products, { Id: this.uniqueId, Family: '', Code : 0, Price : 0 }];
    }

    // Method to remove an item by id
    handleRemoveItem(event) {
        const itemId = event.target.dataset.Id;
        this.products = this.products.filter(item => item.Id != itemId);
    }

    // Method to handle input changes and update the products array
    handleInputChange(event) {
        const itemId = parseInt(event.target.dataset.Id, 10);
        const fieldName = event.target.name;
        const value = fieldName === 'quantity' ? parseInt(event.target.value, 10) : event.target.value;

        let itemIndex = this.products.findIndex(item => item.Id === itemId);
        if(itemIndex !== -1) {
            this.products[itemIndex][fieldName] = value;
            this.products = [...this.products]; // Trigger reactivity
        }
    }
}