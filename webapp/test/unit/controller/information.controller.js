/*global QUnit*/

sap.ui.define([
	"com/sap/revenueRecognition/cogs_revenueRecognition/controller/information.controller"
], function (Controller) {
	"use strict";

	QUnit.module("information Controller");

	QUnit.test("I should test the information controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});