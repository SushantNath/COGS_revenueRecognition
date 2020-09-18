sap.ui.define(function () {
	"use strict";

	var Formatter = {

		tableDateFormatter: function (date) {
			if (date !== "" && date !== null && date !== undefined) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "MMM dd, yyyy",
					UTC: false
				});
				return oDateFormat.format(new Date(date));
			}
			return date;
		},


			
      
		formatterDateAllOrders: function (date) {
			if (date !== "" && date !== null && date !== undefined) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd",
					UTC: false
				});
				return oDateFormat.format(new Date(date));

			}
			return date;
		},

		formatStringDate: function (sDate) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MMM dd, yyyy",
				UTC: false
			});

			if (sDate === "00000000" || !sDate) {
				return "";
			}
			var year = sDate.substring(0, 4),
				month = sDate.substring(4, 6) - 1,
				day = sDate.substring(6, 8);

			return oDateFormat.format(new Date(year, month, day));
		},

		formatDateToString: function (jDate) {
			if (!jDate) {
				return "";
			}
			var month = jDate.getMonth() + 1;
			var monthText = month < 10 ? '0' + month : month.toString();
			var day = jDate.getDate();
			var dayText = day < 10 ? '0' + day : day.toString();
			return jDate.getFullYear().toString() + monthText + dayText;
		}
	};
	return Formatter;
}, /* bExport= */ true);