sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageToast',
	'sap/m/SearchField',
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
		'sap/m/Token',
		'sap/ui/model/json/JSONModel',
		"sap/ui/model/Filter"
], function (Controller,MessageToast,SearchField,typeString,ColumnListItem,Label,Token,JSONModel,Filter) {
	"use strict";

	return Controller.extend("com.sap.revenueRecognition.cogs_revenueRecognition.controller.information", {
		onInit: function () {

this.oColModel = new JSONModel(sap.ui.require.toUrl("com/sap/revenueRecognition/cogs_revenueRecognition/model") + "/columnsModel.json");
this._oManuOrdInput = this.getView().byId("deliveryInputFilter");
/* COde to rename the "GO" button of filter bar */
var oFilter = this.getView().byId("filterbar"),
				that = this;
				
			oFilter.addEventDelegate({
				"onAfterRendering": function(oEvent) {
					var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();


					var oButton = oEvent.srcControl._oSearchButton;
					oButton.setText(oResourceBundle.getText("Extract Documents"));
				}
			});
			
		

		},
	
	onAfterRendering: function () {
		
	
var currentDate = new Date();
var oToDate = this.getView().byId("invoiceDateInpuIdt");
oToDate.setDateValue(currentDate);

	},
	
	/* Logic to fetch filter options */
	
	loadImmInvoice: function () {
		var oModel = this.getView().getModel("revenueModel");
		var that=this;
			var oView = this.getView();
			
		oModel.read("/HTvfkSet", { 
			
			success: function (oData, Response) {
				
				var orderModel = new sap.ui.model.json.JSONModel();
					oView.setModel(orderModel, "shipToModel");
						oView.getModel("shipToModel").setProperty("/ShipToPartySet", oData.results);
				
				// var immInvoiceModel = new sap.ui.model.json.JSONModel(oData);
				// 	that.getView().setModel(immInvoiceModel, "immInvoiceData");
				// 	immInvoiceModel.setProperty("/immInvoiceSet", oData.results);
				
				console.log("Inside Success function",oData.results);
			},
			
				error: function (oData, Response, oError) {
					console.log("Inside Error function");
				}
			
			
		});
	
console.log("Inside Filter options");



	},
		
		/* Logic for outbound delivery value help */
		
				onValueHelpRequested: function() {
			var aCols = this.oColModel.getData().cols;
			this._oBasicSearchField = new SearchField({
				showSearchButton: false
			});
			this._oValueHelpDialog = sap.ui.xmlfragment("com.sap.revenueRecognition.cogs_revenueRecognition.fragments.outboundDelivery", this);
			this.getView().addDependent(this._oValueHelpDialog);

			this._oValueHelpDialog.setRangeKeyFields([{
				label: "Product",
				key: "ProductId",
				type: "string",
				typeInstance: new typeString({}, {
					maxLength: 7
				})
			}]);

			var oFilterBar = this._oValueHelpDialog.getFilterBar();
			oFilterBar.setFilterBarExpanded(false);
			oFilterBar.setBasicSearch(this._oBasicSearchField);

			this._oValueHelpDialog.getTableAsync().then(function (oTable) {
				oTable.setModel(this.oProductsModel);
			//	oTable.setSelectionMode().mProperties.selectionMode = "Single";
				oTable.setModel(this.oColModel, "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/Invoices");
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/Invoices", function () {
						return new ColumnListItem({
							cells: aCols.map(function (column) {
								return new Label({ text: "{" + column.template + "}" });
							})
						});
					});
				}

			//	this._oValueHelpDialog.update();
			}.bind(this));

		//	this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
			var oToken = new Token();
			oToken.setKey(this._oManuOrdInput.getSelectedKey());
			oToken.setText(this._oManuOrdInput.getValue());
			this._oValueHelpDialog.setTokens([oToken]);
			 this._oValueHelpDialog.open();
		
			
			
		},

			onValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},
// Code to handle value help for immediate invoice
	handleValueHelpImmInv: function (oEvent) {
		
			this.loadImmInvoice();
			var oView = this.getView();
			var	that = this;
			//	oModelShipTo = this.getOwnerComponent().getModel("shipto");

			//getting data for ship to

		//	var sInputValue = oEvent.getSource().getValue();
		//	this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					this.getView().getId(), "com.sap.revenueRecognition.cogs_revenueRecognition.fragments.immInvoiceType",
					this
				);
				//this.getView().getId()// 
				this.getView().addDependent(this._valueHelpDialog);
			}
		//	window.fragmentId = this.byId("shipToDialog");
			// var aTokens = this.byId("shipToSelection6").getTokens();
			// this.byId("shipToDialog")._removeSelection();
			// var aAllShipTo = this.getView().getModel("shipToModel").getProperty("/ShipToPartySet");
			// for (var i = 0; i < aTokens.length; i++) {
			// 	for (var j = 0; j < aAllShipTo.length; j++) {
			// 		if ((aTokens[i].getText() == aAllShipTo[j].ShipToExt) &&
			// 			(aTokens[i].mAggregations.customData[0].getKey() == aAllShipTo[j].DistChannel)) {
			// 			this.byId("shipToDialog").getItems()[j].setSelected(true);
			// 		}
			// 	}
			// }
			//sap.ui.getCore().byId("ShipToObjectId");
			//create a filter for the binding

		//	jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._valueHelpDialog);
			// this._oDialog.open();

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open();
			// this.getView().getDependents()[0].setBusy(true);

		},
		//Code to hadle serach inside immediate invoice value help
				handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var filter1 = new Filter("Fkart", sap.ui.model.FilterOperator.Contains, sValue);
			var filter2 = new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.Contains, sValue);
			

			var oFilter = new Filter([filter1, filter2]);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},
	handleClose: function (oEvent) {
		
	},

/* code to check validation for Extract documents */

	onClickGetDocs: function () {
			 var valid = true;
			var podDateValue = this.getView().byId("podDateId");
			var docTableLength = this.getView().byId("idProductsTable").getSelectedItems();
			var msg = "Please select atleast one document";
			if (podDateValue.getValue() == "" || podDateValue.getValue() == undefined) {
                        valid = false;
                        podDateValue.setValueState("Error");
                    }
                    else {
                       podDateValue.setValueState("Success");
                    }
				if (docTableLength.length > 0) {
                        
                    }
                    else {
                    	
                      	MessageToast.show(msg);
                    }
                    
                    
                    	var oFilter = this.getView().byId("filterbar"),
				that = this;
				
			oFilter.addEventDelegate({
				"onAfterRendering": function(oEvent) {
					var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();


					var oButton = oEvent.srcControl._oSearchButton;
					oButton.setText(oResourceBundle.getText("goButton"));
				}
			});

		},
		
	
		
		
/* code to check validation for filters */
		onApplyFilter: function () {
			
			 var requiredInputs = this.returnIdListOfRequiredFields();
            var passedValidation = this.validateEventFeedbackForm(requiredInputs);
            if(passedValidation === false)
            {
                //show an error message, rest of code will not execute.
                return false;
            }

		},
		 returnIdListOfRequiredFields: function()
        {
           var requiredInputs = [];
            $('[data-required="true"]').each(function(){
                requiredInputs.push($(this).context.id);
            });
            return requiredInputs;
        },
        validateEventFeedbackForm: function(requiredInputs) {
        	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var _self = this;
                var valid = true;
                requiredInputs.forEach(function (input) {
                    var sInput = _self.getView().byId(input);
                    if (sInput.getValue() == "" || sInput.getValue() == undefined) {
                        valid = false;
                        sInput.setValueState("Error");
                    }
                    else {
                       sInput.setValueState("Success");
                      // 	_self.getView().byId("dynamicPageId").setShowFooter(true);
                    }
                });
                return valid;
        }
	});
});