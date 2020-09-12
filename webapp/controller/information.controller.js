sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageToast'
], function (Controller,MessageToast) {
	"use strict";

	return Controller.extend("com.sap.revenueRecognition.cogs_revenueRecognition.controller.information", {
		onInit: function () {

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