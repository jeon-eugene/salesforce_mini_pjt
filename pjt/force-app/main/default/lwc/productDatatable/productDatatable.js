import { LightningElement, api } from 'lwc';

export default class ProductDatatable extends LightningElement {
	@api columnConfig;
	@api pkField;
	rows = [];
	_selectedRow;
	@api selectedProductId;

	@api
	get rowData() {
		return this.rows;
	}
	set rowData(value) {
		if (typeof value !== "undefined") {
			this.rows = this.reformatRows(value);
		}
	}

	@api setSelectedRecord(recordId) {
		const mySelector = `tr[data-pk='${recordId}']`;
		const selectedRow = this.template.querySelector(mySelector);
		if(selectedRow) {
			this.highlightSelectedRow(selectedRow);
		}
	}
	
	reformatRows(rowData) {
		let colItems = this.columnConfig;
		let reformattedRows = [];
	
		for (let i = 0; i < rowData.length; i++) {
			let rowDataItems = [];
			for (let j = 0; j < colItems.length; j++) {
				let colClass = '';
				let displayedValue = rowData[i][colItems[j].fieldName];

				if (colItems[j].fieldName === 'Family') { 
					displayedValue = displayedValue === 'BodyPart' ? '본체' : 
									 displayedValue === 'SubPart' ? '주변기기' : displayedValue;
				}
	
				rowDataItems.push({
					value: displayedValue,
					label: colItems[j].label,
					class: colClass,
					columnId: 'col' + j + '-' + rowData[i][this.pkField],
				});
			}
			reformattedRows.push({
				data: rowDataItems,
				pk: rowData[i][this.pkField]
			});
		}
		return reformattedRows;
	}
	

	onRowClick(event) {
		const target = event.currentTarget;
		const evt = new CustomEvent( 'rowclick', {
			detail: {
				pk: target.getAttribute('data-pk')
			}
		});
		this.dispatchEvent(evt);
		this.highlightSelectedRow(target);
		console.log(target.getAttribute('data-pk'))
	}

	highlightSelectedRow(target) {
		if (this._selectedRow) {
			this._selectedRow.classList.remove("slds-is-selected");
		}
		target.classList.add("slds-is-selected");
		this._selectedRow = target;
	}

	renderedCallback() {
		const productId = this.selectedProductId;
	
		if (productId) {
			this.setSelectedRecord(productId);
		}
	}
}