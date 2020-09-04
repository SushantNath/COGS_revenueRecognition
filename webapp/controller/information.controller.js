sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.sap.revenueRecognition.cogs_revenueRecognition.controller.information", {
		onInit: function () {

		},
		
		onClickGetInformation: function () {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("outboundDetails");
					console.log("Inside navigation loop");

		}
	});
});