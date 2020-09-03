/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/sap/revenueRecognition/cogs_revenueRecognition/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});