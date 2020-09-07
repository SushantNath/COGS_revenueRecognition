sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("com.sap.revenueRecognition.cogs_revenueRecognition.controller.outboundDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sap.revenueRecognition.cogs_revenueRecognition.view.outboundDetails
		 */
		onInit: function () {

		},

		onNavBack: function () {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Routeinformation", true);
		},
		/* code to check validation and navigate to Outbound details screen */
		onClickGetInformation: function () {
			
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
                    var sInput = _self.getView().byId("podDateId");
                    if (sInput.getValue() == "" || sInput.getValue() == undefined) {
                        valid = false;
                        sInput.setValueState("Error");
                    }
                    else {
                     //   oRouter.navTo("outboundDetails");
                     sInput.setValueState("Success");
                     console.log("Inside else part of validation");
                    }
                });
                return valid;
        }

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.sap.revenueRecognition.cogs_revenueRecognition.view.outboundDetails
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.sap.revenueRecognition.cogs_revenueRecognition.view.outboundDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.sap.revenueRecognition.cogs_revenueRecognition.view.outboundDetails
		 */
		//	onExit: function() {
		//
		//	}

	});

});