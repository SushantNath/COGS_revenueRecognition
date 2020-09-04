sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.sap.revenueRecognition.cogs_revenueRecognition.controller.information", {
		onInit: function () {

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
                    var sInput = _self.getView().byId(input);
                    if (sInput.getValue() == "" || sInput.getValue() == undefined) {
                        valid = false;
                        sInput.setValueState("Error");
                    }
                    else {
                        oRouter.navTo("outboundDetails");
                    }
                });
                return valid;
        }
	});
});