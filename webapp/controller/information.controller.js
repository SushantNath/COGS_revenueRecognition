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
], function (Controller, MessageToast, SearchField, typeString, ColumnListItem, Label, Token, JSONModel, Filter) {
	"use strict";

	return Controller.extend("com.sap.revenueRecognition.cogs_revenueRecognition.controller.information", {
		onInit: function () {

			this.oColModel = new JSONModel(sap.ui.require.toUrl("com/sap/revenueRecognition/cogs_revenueRecognition/model") +
				"/columnsModel.json");
			this._oManuOrdInput = this.getView().byId("deliveryInputFilter");
			/* COde to rename the "GO" button of filter bar */
			var oFilter = this.getView().byId("filterbar"),
				that = this;

			oFilter.addEventDelegate({
				"onAfterRendering": function (oEvent) {
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

		/* Logic to fetch filter options for Immediate invoice */

		loadImmInvoice: function () {
			var oModel = this.getView().getModel("revenueModel");
			var that = this;
			var oView = this.getView();

			oModel.read("/HTvfkSet", {

				success: function (oData, Response) {

					var orderModel = new sap.ui.model.json.JSONModel();
					oView.setModel(orderModel, "shipToModel");
					oView.getModel("shipToModel").setProperty("/ShipToPartySet", oData.results);

					// var immInvoiceModel = new sap.ui.model.json.JSONModel(oData);
					// 	that.getView().setModel(immInvoiceModel, "immInvoiceData");
					// 	immInvoiceModel.setProperty("/immInvoiceSet", oData.results);

					console.log("Inside Success function", oData.results);
				},

				error: function (oData, Response, oError) {
					console.log("Inside Error function");
				}

			});

			console.log("Inside Filter options");

		},

	/* Logic to fetch filter options for Revenue invoice */

		loadRevInvoice: function () {
			var oModel = this.getView().getModel("revenueModel");
			var that = this;
			var oView = this.getView();

			oModel.read("/HTvfkSet", {

				success: function (oData, Response) {

					var revInvModel = new sap.ui.model.json.JSONModel();
					oView.setModel(revInvModel, "revInvoiceModel");
					oView.getModel("revInvoiceModel").setProperty("/revInvoiceSet", oData.results);

					// var immInvoiceModel = new sap.ui.model.json.JSONModel(oData);
					// 	that.getView().setModel(immInvoiceModel, "immInvoiceData");
					// 	immInvoiceModel.setProperty("/immInvoiceSet", oData.results);

					console.log("Inside Success function", oData.results);
				},

				error: function (oData, Response, oError) {
					console.log("Inside Error function");
				}

			});

			console.log("Inside Filter options");

		},


		/* Logic for outbound delivery value help */

		onValueHelpRequested: function () {
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
								return new Label({
									text: "{" + column.template + "}"
								});
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
			var that = this;
			
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					this.getView().getId(), "com.sap.revenueRecognition.cogs_revenueRecognition.fragments.immInvoiceType",
					this
				);
			
				this.getView().addDependent(this._valueHelpDialog);
			}
		
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open();
			

		},
		//Code to hadle serach inside immediate invoice value help
		handleSearchImmInv: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var filter1 = new Filter("Fkart", sap.ui.model.FilterOperator.Contains, sValue);
			var filter2 = new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.Contains, sValue);

			var oFilter = new Filter([filter1, filter2]);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},
		
		// Code to handle selection for immediate invoice value help
		
		handleCloseImmInv: function (oEvent) {

			var selectedInvoice;

			var oMultiInput = this.byId("ImminvoiceTypeInputId");
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				//	MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().Name; }).join(", "));
				aContexts.forEach(function (oItem) {

					selectedInvoice = oItem.oModel.getProperty(oItem.sPath).Fkart;

				});

			}

			oMultiInput.setValue(selectedInvoice);
		},


	// Code to handle value help for revenue invoice
		handleValueHelpRevInv: function (oEvent) {

			this.loadImmInvoice();
			var oView = this.getView();
			var that = this;
			
			// create value help dialog revenue invoice
			if (!this._valueHelpDialogRevInv) {
				this._valueHelpDialogRevInv = sap.ui.xmlfragment(
					this.getView().getId(), "com.sap.revenueRecognition.cogs_revenueRecognition.fragments.revenueInvoice",
					this
				);
			
				this.getView().addDependent(this._valueHelpDialogRevInv);
			}
		
			// open value help dialog filtered by the input value
			this._valueHelpDialogRevInv.open();
			

		},
		//Code to hadle serach inside revenue invoice value help
		handleSearchRevInv: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var filter1 = new Filter("Fkart", sap.ui.model.FilterOperator.Contains, sValue);
			var filter2 = new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.Contains, sValue);

			var oFilter = new Filter([filter1, filter2]);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},
		
		// Code to handle selection for immediate invoice value help
		
		handleCloseRevInv: function (oEvent) {

			var selectedRevInvoice;

			var oMultiInputRevInv = this.byId("invoiceTypeInputId");
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				//	MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().Name; }).join(", "));
				aContexts.forEach(function (oItem) {

					selectedRevInvoice = oItem.oModel.getProperty(oItem.sPath).Fkart;

				});

			}

			oMultiInputRevInv.setValue(selectedRevInvoice);
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
			} else {
				podDateValue.setValueState("Success");
			}
			if (docTableLength.length > 0) {

			} else {

				MessageToast.show(msg);
			}

			var oFilter = this.getView().byId("filterbar"),
				that = this;

			oFilter.addEventDelegate({
				"onAfterRendering": function (oEvent) {
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
			if (passedValidation === false) {
				//show an error message, rest of code will not execute.
				return false;
			}

		},
		returnIdListOfRequiredFields: function () {
			var requiredInputs = [];
			$('[data-required="true"]').each(function () {
				requiredInputs.push($(this).context.id);
			});
			return requiredInputs;
		},
		validateEventFeedbackForm: function (requiredInputs) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var _self = this;
			var valid = true;
			requiredInputs.forEach(function (input) {
				var sInput = _self.getView().byId(input);
				if (sInput.getValue() == "" || sInput.getValue() == undefined) {
					valid = false;
					sInput.setValueState("Error");
				} else {
					sInput.setValueState("Success");
					// 	_self.getView().byId("dynamicPageId").setShowFooter(true);
				}
			});
			return valid;
		}
	});
});