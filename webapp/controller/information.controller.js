sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageToast',
	'sap/m/SearchField',
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/Token',
	'sap/ui/model/json/JSONModel',
	"sap/ui/model/Filter",
	'sap/ui/model/Sorter',
	"com/sap/revenueRecognition/cogs_revenueRecognition/utilities/Formatter"
], function (Controller, MessageToast, SearchField, typeString, ColumnListItem, Label, Token, JSONModel, Filter,Sorter,Formatter) {
	"use strict";

	return Controller.extend("com.sap.revenueRecognition.cogs_revenueRecognition.controller.information", {
		formatter: Formatter,
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
sap.ui.core.BusyIndicator.show();
			oModel.read("/HTvfkSet", {

				success: function (oData, Response) {

					var orderModel = new sap.ui.model.json.JSONModel();
					oView.setModel(orderModel, "shipToModel");
					oView.getModel("shipToModel").setProperty("/ShipToPartySet", oData.results);
sap.ui.core.BusyIndicator.hide();
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
sap.ui.core.BusyIndicator.show();
			oModel.read("/HTvfkSet", {

				success: function (oData, Response) {

					// var revInvModel = new sap.ui.model.json.JSONModel();
					// oView.setModel(revInvModel, "revInvoiceModel");
					// oView.getModel("revInvoiceModel").setProperty("/revInvoiceSet", oData.results);

					// var immInvoiceModel = new sap.ui.model.json.JSONModel(oData);
					// 	that.getView().setModel(immInvoiceModel, "immInvoiceData");
					// 	immInvoiceModel.setProperty("/immInvoiceSet", oData.results);
					
						var orderModel = new sap.ui.model.json.JSONModel();
					oView.setModel(orderModel, "shipToModel");
					oView.getModel("shipToModel").setProperty("/ShipToPartySet", oData.results);
sap.ui.core.BusyIndicator.hide();
					console.log("Inside Success function revenue invoice", oData.results);
				},

				error: function (oData, Response, oError) {
					console.log("Inside Error function");
				}

			});

			console.log("Inside Filter options");

		},



		/* Logic for outbound delivery value help */

/*		onValueHelpRequested: function () {
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

			
			}.bind(this));

		
			var oToken = new Token();
			oToken.setKey(this._oManuOrdInput.getSelectedKey());
			oToken.setText(this._oManuOrdInput.getValue());
			this._oValueHelpDialog.setTokens([oToken]);
			this._oValueHelpDialog.open();

		},

		onValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},  */
		
		
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


	/* Logic to fetch filter options for Ship To */
	
		handleValueShipTo: function (oEvent) {

			this.loadShipTo();
			var oView = this.getView();
			var that = this;
			
			// create value help dialog
			if (!this._valueHelpDialogShipTo) {
				this._valueHelpDialogShipTo = sap.ui.xmlfragment(
					this.getView().getId(), "com.sap.revenueRecognition.cogs_revenueRecognition.fragments.shipTo",
					this
				);
			
				this.getView().addDependent(this._valueHelpDialogShipTo);
			}
		
			// open value help dialog filtered by the input value
			this._valueHelpDialogShipTo.open();
			

		},

		loadShipTo: function () {
			var oModel = this.getView().getModel("revenueModel");
			var that = this;
			var oView = this.getView();
sap.ui.core.BusyIndicator.show();
			oModel.read("/DebiaSet", {

				success: function (oData, Response) {

					// var revInvModel = new sap.ui.model.json.JSONModel();
					// oView.setModel(revInvModel, "revInvoiceModel");
					// oView.getModel("revInvoiceModel").setProperty("/revInvoiceSet", oData.results);

					// var immInvoiceModel = new sap.ui.model.json.JSONModel(oData);
					// 	that.getView().setModel(immInvoiceModel, "immInvoiceData");
					// 	immInvoiceModel.setProperty("/immInvoiceSet", oData.results);
					
						var shipToModel = new sap.ui.model.json.JSONModel();
					oView.setModel(shipToModel, "shipToModel");
					oView.getModel("shipToModel").setProperty("/ShipToPartySet", oData.results);
sap.ui.core.BusyIndicator.hide();
					console.log("Inside Success function revenue invoice", oData.results);
				},

				error: function (oData, Response, oError) {
					console.log("Inside Error function");
				}

			});

			console.log("Inside Filter options");

		},

	//Code to hadle serach inside revenue invoice value help
		handleSearchShipTo: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var filter1 = new Filter("Land1", sap.ui.model.FilterOperator.Contains, sValue);
			var filter2 = new sap.ui.model.Filter("Mcod1", sap.ui.model.FilterOperator.Contains, sValue);

			var oFilter = new Filter([filter1, filter2]);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},
		
		// Code to handle selection for immediate invoice value help
		
		handleCloseShipTo: function (oEvent) {

			var selectedShipTo;

			var oMultiInputShipTo = this.byId("shipToCustomerId");
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				//	MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().Name; }).join(", "));
				aContexts.forEach(function (oItem) {

					selectedShipTo = oItem.oModel.getProperty(oItem.sPath).Kunnr;

				});

			}

			oMultiInputShipTo.setValue(selectedShipTo);
		},



	/* Logic to fetch filter options for Sold To */
	
		handleValueSoldTo: function (oEvent) {

			this.loadSoldTo();
		
			
			// create value help dialog
			if (!this._valueHelpDialogSoldTo) {
				this._valueHelpDialogSoldTo = sap.ui.xmlfragment(
					this.getView().getId(), "com.sap.revenueRecognition.cogs_revenueRecognition.fragments.soldTo",
					this
				);
			
				this.getView().addDependent(this._valueHelpDialogSoldTo);
			}
		
			// open value help dialog filtered by the input value
			this._valueHelpDialogSoldTo.open();
			

		},

		loadSoldTo: function () {
			var oModel = this.getView().getModel("revenueModel");
			var that = this;
			var oView = this.getView();
sap.ui.core.BusyIndicator.show();
			oModel.read("/DebiaSet", {

				success: function (oData, Response) {

					// var revInvModel = new sap.ui.model.json.JSONModel();
					// oView.setModel(revInvModel, "revInvoiceModel");
					// oView.getModel("revInvoiceModel").setProperty("/revInvoiceSet", oData.results);

					// var immInvoiceModel = new sap.ui.model.json.JSONModel(oData);
					// 	that.getView().setModel(immInvoiceModel, "immInvoiceData");
					// 	immInvoiceModel.setProperty("/immInvoiceSet", oData.results);
					
						var shipToModel = new sap.ui.model.json.JSONModel();
					oView.setModel(shipToModel, "shipToModel");
					oView.getModel("shipToModel").setProperty("/ShipToPartySet", oData.results);
sap.ui.core.BusyIndicator.hide();
					console.log("Inside Success function Sold to", oData.results);
				},

				error: function (oData, Response, oError) {
					console.log("Inside Error function  Sold to");
				}

			});

			console.log("Inside Filter options");

		},

	//Code to hadle serach inside revenue invoice value help
		handleSearchSoldTo: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var filter1 = new Filter("Land1", sap.ui.model.FilterOperator.Contains, sValue);
			var filter2 = new sap.ui.model.Filter("Mcod1", sap.ui.model.FilterOperator.Contains, sValue);
			var filter3 = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.Contains, sValue);

			var oFilter = new Filter([filter1, filter2,filter3]);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},
		
		// Code to handle selection for immediate invoice value help
		
		handleCloseSoldTo: function (oEvent) {

			var selectedSoldTo;

			var oMultiInputSoldTo = this.byId("soldToInputId");
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				//	MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().Name; }).join(", "));
				aContexts.forEach(function (oItem) {

					selectedSoldTo = oItem.oModel.getProperty(oItem.sPath).Kunnr;

				});

			}

			oMultiInputSoldTo.setValue(selectedSoldTo);
		},

	/* Logic to fetch filter options for External Delivery*/
	
		handleValueExtDev: function (oEvent) {

			this.loadExtDev();
		
			
			// create value help dialog
			if (!this._valueHelpDialogSoldTo) {
				this._valueHelpDialogSoldTo = sap.ui.xmlfragment(
					this.getView().getId(), "com.sap.revenueRecognition.cogs_revenueRecognition.fragments.soldTo",
					this
				);
			
				this.getView().addDependent(this._valueHelpDialogSoldTo);
			}
		
			// open value help dialog filtered by the input value
			this._valueHelpDialogSoldTo.open();
			

		},

		loadExtDev: function () {
			var oModel = this.getView().getModel("revenueModel");
			var that = this;
			var oView = this.getView();
sap.ui.core.BusyIndicator.show();
			oModel.read("/DebiaSet", {

				success: function (oData, Response) {

					// var revInvModel = new sap.ui.model.json.JSONModel();
					// oView.setModel(revInvModel, "revInvoiceModel");
					// oView.getModel("revInvoiceModel").setProperty("/revInvoiceSet", oData.results);

					// var immInvoiceModel = new sap.ui.model.json.JSONModel(oData);
					// 	that.getView().setModel(immInvoiceModel, "immInvoiceData");
					// 	immInvoiceModel.setProperty("/immInvoiceSet", oData.results);
					
						var shipToModel = new sap.ui.model.json.JSONModel();
					oView.setModel(shipToModel, "shipToModel");
					oView.getModel("shipToModel").setProperty("/ShipToPartySet", oData.results);
sap.ui.core.BusyIndicator.hide();
					console.log("Inside Success function Sold to", oData.results);
				},

				error: function (oData, Response, oError) {
					console.log("Inside Error function  Sold to");
				}

			});

			console.log("Inside Filter options");

		},

	//Code to hadle serach inside revenue invoice value help
		handleSearchExtDev: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var filter1 = new Filter("Land1", sap.ui.model.FilterOperator.Contains, sValue);
			var filter2 = new sap.ui.model.Filter("Mcod1", sap.ui.model.FilterOperator.Contains, sValue);
			var filter3 = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.Contains, sValue);

			var oFilter = new Filter([filter1, filter2,filter3]);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},
		
		// Code to handle selection for immediate invoice value help
		
		handleCloseExtDev: function (oEvent) {

			var selectedSoldTo;

			var oMultiInputSoldTo = this.byId("soldToInputId");
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				//	MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().Name; }).join(", "));
				aContexts.forEach(function (oItem) {

					selectedSoldTo = oItem.oModel.getProperty(oItem.sPath).Kunnr;

				});

			}

			oMultiInputSoldTo.setValue(selectedSoldTo);
		},

	/* Logic to fetch filter options for Outbond Delivery*/
	
		handleValueOutDel: function (oEvent) {

			this.loadOutboundDel();
		
			
			// create value help dialog
			if (!this._valueHelpDialogOutDel) {
				this._valueHelpDialogOutDel = sap.ui.xmlfragment(
					this.getView().getId(), "com.sap.revenueRecognition.cogs_revenueRecognition.fragments.outboundDelivery",
					this
				);
			
				this.getView().addDependent(this._valueHelpDialogOutDel);
			}
		
			// open value help dialog filtered by the input value
			this._valueHelpDialogOutDel.open();
			

		},

		loadOutboundDel: function () {
			var oModel = this.getView().getModel("revenueModel");
			var that = this;
			var oView = this.getView();
sap.ui.core.BusyIndicator.show();
			oModel.read("/VmvlaSet", {

				success: function (oData, Response) {

					// var revInvModel = new sap.ui.model.json.JSONModel();
					// oView.setModel(revInvModel, "revInvoiceModel");
					// oView.getModel("revInvoiceModel").setProperty("/revInvoiceSet", oData.results);

					var outboundDelModel = new sap.ui.model.json.JSONModel();
						oView.setModel(outboundDelModel, "outboundDelModel");
					oView.getModel("outboundDelModel").setProperty("/outboundDelSet", oData.results);
					
					// 	var shipToModel = new sap.ui.model.json.JSONModel();
					// oView.setModel(shipToModel, "shipToModel");
					// oView.getModel("shipToModel").setProperty("/ShipToPartySet", oData.results);
sap.ui.core.BusyIndicator.hide();
					console.log("Inside Success function Outbound delivery", oData.results);
				},

				error: function (oData, Response, oError) {
					console.log("Inside Error function Outbound delivery");
				}

			});

			console.log("Inside Filter options");

		},

	//Code to hadle serach inside outbound delivery value help
		handleSearchOutDev: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var filter1 = new Filter("Vbeln", sap.ui.model.FilterOperator.Contains, sValue);
			var filter2 = new sap.ui.model.Filter("Vstel", sap.ui.model.FilterOperator.Contains, sValue);
			var filter3 = new sap.ui.model.Filter("Route", sap.ui.model.FilterOperator.Contains, sValue);
			var filter4 = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.Contains, sValue);

			var oFilter = new Filter([filter1, filter2,filter3,filter4]);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},
		
		// Code to handle selection for outbound delivery value help
		
		handleCloseOutDev: function (oEvent) {

			var selectedOutboundDev;

			var oMultiInputOutDev = this.byId("outboundDelId");
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				//	MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().Name; }).join(", "));
				aContexts.forEach(function (oItem) {

					selectedOutboundDev = oItem.oModel.getProperty(oItem.sPath).Vbeln;

				});

			}

			oMultiInputOutDev.setValue(selectedOutboundDev);
		},



		/* code to check validation for Extract documents */

		onClickGetDocs: function (e) {
			var valid = true;
			var podDateValue = this.getView().byId("podDateId");
		var podDate = podDateValue.mProperties.dateValue;
			var formatPodDate = Formatter.formatterDateAllOrders(podDate) ;
			var docTableLength = this.getView().byId("idProductsTable").getSelectedItems();
				var oModel = this.getView().getModel("revenueModel");
			var msg = "Please select atleast one document";
			var selectedArray = [];
			if (podDateValue.getValue() == "" || podDateValue.getValue() == undefined) {
				valid = false;
				podDateValue.setValueState("Error");
			} else {
				podDateValue.setValueState("Success");
			}
			if (docTableLength.length > 0) {
				
				docTableLength.forEach(function (oItem) {
					
				var selectedValue = oItem.oBindingContexts.docTableModel.sPath;
			var tableValue =	e.getSource().getModel("docTableModel").getProperty(selectedValue);
			tableValue.Poddate =formatPodDate;
			selectedArray.push(tableValue);
			
			});
				

			} else {

				MessageToast.show(msg);
			}

console.log("Selected values array is",selectedArray);

			var oFilter = this.getView().byId("filterbar"),
				that = this;
				
					// postData = {
					// 	"d": this.getOrderDataForSimulate()
					// };
					
//  var oEntry = {};
// oEntry.DeliveryNo = "80002160";
// oEntry.Goodsissuedate = "2020-09-06T00:00:00";
// oEntry.Soldtoparty = "10000019";
// oEntry.Shiptoparty = "10000019";
// oEntry.Externaldelno = "";
// oEntry.Imminvoicetype = "";
// oEntry.Revinvdate = "2020-09-06T00:00:00";
// oEntry.Salesorg = "415D";
// oEntry.Imminvoiceno = "90001518";
// oEntry.Imminvreversalno = "90001519";
// oEntry.Revenueinvoice = "90001520";
// oEntry.Poddelstat = "C";

			//	var todayDate = new Date();
					// postData = {
					// 	"d": this.getOrderDataForSimulate()
					// };

// 					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance();   
// var dateFormatted = dateFormat.format(todayDate);

// screenDate=view.byId("screeningDate").getValue();
// var date = view.byId("__date");
// Make date object out of screenDate
//var dateObject = new Date();
// SAPUI5 date formatter
//var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYY-MM-dd" }); 
// Format the date
//var dateFormatted = dateFormat.format(dateObject);
//date.setText(dateFormatted);

 
 //oEntry.Goodsissuedate =dateFormatted;
 //oEntry.Revinvdate = dateFormatted;
 
 
				
				// 	oModel.create("/DeliverySet", oEntry, {
				// 	success: function (oData) {
				// 	console.log("Inside success update");
						
						
				// 	}.bind(this),
				// 	error: function (oError) {
				// 	console.log("Inside error update");
				// 	}.bind(this)
				// });

//Batch update code

//  var batchChanges = [];  

// for (var i = 0; i < selectedArray.length; i++) {
//     batchChanges.push(oModel.createBatchOperation("/DeliverySet", "POST", selectedArray[i]));
// }

// oModel.addBatchChangeOperations(batchChanges); 
// oModel.setUseBatch(true);
// oModel.submitBatch();



///////////////////////

			oModel.setDeferredGroups(["CreateDocumentBatch"]);
			oModel.setUseBatch(true);
			var aCreateDocPayload = selectedArray,
				mParameters = {
					batchGroupId: "CreateDocumentBatch",
					success: function (oData, oRet) {

						console.log("Inside success batch");
						
					}.bind(this),
					error: function (oError, resp) {
						console.log("Inside error batch");

					}.bind(this)
				};

			for (var m = 0; m < aCreateDocPayload.length; m++) {
				oModel.create("/DeliverySet", aCreateDocPayload[m], mParameters);
			}
			oModel.submitChanges(mParameters);

/////////////////////////



			// oFilter.addEventDelegate({
			// 	"onAfterRendering": function (oEvent) {
			// 		var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();

			// 		var oButton = oEvent.srcControl._oSearchButton;
			// 		oButton.setText(oResourceBundle.getText("goButton"));
			// 	}
			// });

		},

		/* code to check validation for filters */
		onApplyFilter: function () {

			var requiredInputs = this.returnIdListOfRequiredFields();
			var passedValidation = this.validateEventFeedbackForm(requiredInputs);
			if (passedValidation === false) {
				MessageToast.show("Please enter all the required fieds");	
				return false;
			}
			
			else{
			sap.ui.core.BusyIndicator.show();
			//code to fetch the list of documents on click of extract documents button
				var dateRange = this.getView().byId("DRS2");
			// var currentDate = new Date();
			// var from_date = new Date().setDate(currentDate.getDate() - 21);
			// var fromDate = new Date(from_date);
			// var to_date = new Date().setDate(currentDate.getDate());
			// var toDate = new Date(to_date);
			// dateRange.setDateValue(fromDate);
			// dateRange.setSecondDateValue(toDate);

			//this.setSearchFieldsFromAppState();

			var dateFrom = dateRange.getDateValue();
			var dateTo = dateRange.getSecondDateValue();
			
		    var outboundDelvalue = this.getView().byId("outboundDelId").getValue();
			var shipToValue = this.getView().byId("shipToCustomerId").getValue();
			var soldToValue = this.getView().byId("soldToInputId").getValue();
			var extDelValue = this.getView().byId("externalDeliveryId").getValue();
			var immInvValue = this.getView().byId("ImminvoiceTypeInputId").getValue();
			var revinvValue = this.getView().byId("invoiceTypeInputId").getValue();
		    var dateFromGI = dateRange.getDateValue();
			var dateToGI = dateRange.getSecondDateValue();
		if(dateFromGI === null){

		    	dateFromGI = "1900-01-01";
		    	dateToGI = "9999-12-31";
		    	var dateFromGIFilter = new sap.ui.model.Filter("Goodsissuedate", sap.ui.model.FilterOperator.GE, Formatter.formatterDateAllOrders(dateFromGI));

		    	var dateToGIFilter = new sap.ui.model.Filter("Goodsissuedate", sap.ui.model.FilterOperator.LE, Formatter.formatterDateAllOrders(dateToGI));
		    }
		    
		    else{
		    	
		    	var dateFromGIFilter = new sap.ui.model.Filter("Goodsissuedate", sap.ui.model.FilterOperator.GE, Formatter.formatterDateAllOrders(dateFromGI) );
		    	var dateToGIFilter = new sap.ui.model.Filter("Goodsissuedate", sap.ui.model.FilterOperator.LE, Formatter.formatterDateAllOrders(dateToGI) );
		    }
// if(dateToGI === null){

// 		    	dateToGI ="9999-01-01T00:00:00";
// 		    }
			
			var revInvDate = this.getView().byId("invoiceDateInpuIdt").getDateValue();

			//Filters
			var outboundDelFilter = new sap.ui.model.Filter("DeliveryNo", sap.ui.model.FilterOperator.EQ, outboundDelvalue);
			var shipToFilter = new sap.ui.model.Filter("Shiptoparty", sap.ui.model.FilterOperator.EQ, shipToValue);
			var soldToFilter = new sap.ui.model.Filter("Soldtoparty", sap.ui.model.FilterOperator.EQ, soldToValue);
			var extDelFilter = new sap.ui.model.Filter("Externaldelno", sap.ui.model.FilterOperator.EQ, extDelValue);
			
				var immInvFilter = new sap.ui.model.Filter("Imminvoicetype", sap.ui.model.FilterOperator.EQ, immInvValue);
			var revinvFilter = new sap.ui.model.Filter("Revinvoicetype", sap.ui.model.FilterOperator.EQ, revinvValue);
		//	 var dateFromGIFilter = new sap.ui.model.Filter("Goodsissuedate", sap.ui.model.FilterOperator.EQ, Formatter.formatterDateAllOrders(dateFromGI) + "T00:00:00");
		 var revInvDateFromFilter	=  new sap.ui.model.Filter("Revinvdate", sap.ui.model.FilterOperator.EQ, Formatter.formatterDateAllOrders(revInvDate));
		//	var custPoFilter = new sap.ui.model.Filter("CustPoNumber", sap.ui.model.FilterOperator.EQ, custPoNumber);
		//	var revInvDateFilter = new sap.ui.model.Filter("DistRefNumber", sap.ui.model.FilterOperator.EQ, revInvDate);

			// var revInvDateFromFilter = new sap.ui.model.Filter("IFromDate", sap.ui.model.FilterOperator.GE,revInvDate );
		//	 var IToDate = new sap.ui.model.Filter("IToDate", sap.ui.model.FilterOperator.LE, Formatter.formatterDateAllOrders(dateTo) +
			//	"T23:59:59.999Z");
       
		var oModel = this.getView().getModel("revenueModel");
			var that = this;

			//Call Backend for last 30 days of Invoices
			oModel.read("/DeliverySet", {
			
				success: function (oData, Response) {
				
					 var docTableModel = new sap.ui.model.json.JSONModel(oData);
					 that.getView().setModel(docTableModel, "docTableModel");
					 that.getView().getModel("docTableModel").setProperty("/docTableSet", oData.results);
			//	 docTableModel.setProperty("/docTableSet", oData.results);
					
					// 	var shipToModel1 = new sap.ui.model.json.JSONModel();
					// that.getView().setModel(shipToModel1, "shipToModel1");
					// that.getView().getModel("shipToModel1").setProperty("/ShipToPartySet1", oData.results);
				sap.ui.core.BusyIndicator.hide();
				console.log("Inside extract button success",oData.results);
				},
				error: function (oData, Response, oError) {
				console.log("Inside extract butoon error");
				sap.ui.core.BusyIndicator.hide();
				},
				filters: [outboundDelFilter, shipToFilter, soldToFilter, extDelFilter, immInvFilter, revinvFilter,revInvDateFromFilter,dateFromGIFilter,dateToGIFilter]
			});

}

		},
		//code to check validation of required fields from client side
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