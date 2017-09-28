/**
 * @license  @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Sebastian Domas
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import derivedSeriesMixin from '../mixins/derived-series.js';

var each = H.each,
	objectEach = H.objectEach,
	seriesType = H.seriesType,
	correctFloat = H.correctFloat,
	isNumber = H.isNumber,
	arrayMax = H.arrayMax,
	arrayMin = H.arrayMin,
	merge = H.merge;

/* ***************************************************************************
 *
 * HISTOGRAM
 *
 **************************************************************************** */

/**
 * A dictionary with formulas for calculating number of bins based on the base series
 **/
var binsNumberFormulas = {
	'square-root': function (baseSeries) {
		return Math.round(Math.sqrt(baseSeries.options.data.length));
	},

	'sturges': function (baseSeries) {
		return Math.ceil(Math.log(baseSeries.options.data.length) * Math.LOG2E);
	},

	'rice': function (baseSeries) {
		return Math.ceil(2 * Math.pow(baseSeries.options.data.length, 1 / 3));
	}
};

/**
 * Returns a function for mapping number to the closed (right opened) bins
 * 
 * @param {number} binWidth - width of the bin
 * @returns {function}
 **/
function fitToBinLeftClosed(binWidth) {
	return function (y) {
		return Math.floor(y / binWidth) * binWidth;
	};
}

/**
 * Histogram class
 * 
 * @constructor seriesTypes.histogram
 * @augments seriesTypes.column
 * @mixes DerivedSeriesMixin
 **/

/**
 * A histogram is a column series which represents the distribution of the data
 * set in the base series. Histogram splits data into bins and shows their frequencies.
 *
 * @product highcharts
 * @sample {highcharts} highcharts/demo/histogram/ Histogram
 * @since 6.0.0
 * @extends plotOptions.line
 * @apioption plotOptions.histogram
 * @excluding pointInterval, pointIntervalUnit, stacking
 **/
seriesType('histogram', 'column', {
  /**
   * A preferable number of bins. It is a suggestion, so a histogram may have a 
   * different number of bins. By default it is set to the square of the base series' data length.
   * Available options are: 'square-root', 'sturges', 'rice'. You can also define 
   * a function which takes a baseSeries as a parameter and should return a positive integer.
   *
   * @type {Number|String|Function}
   * @default 'square-root'
   * @apioption plotOptions.histogram.binsNumber
   **/
	binsNumber: 'square-root',

  /**
   * Width of the each bin. By default the bin's width is calculated as `(max - min) / number of bins`.
   * This option takes precedence over [binsNumber](plotOptions.histogram.binsNumber.html).
   *
   * @type {Number}
   * @apioption plotOptions.histogram.binWidth
   **/
    // binWidth: undefined
	pointPadding: 0,
	groupPadding: 0,
	grouping: false,
	pointPlacement: 'between',
	tooltip: {
		headerFormat: '',
		pointFormatter: function () {
			var header = '<span style="font-size:10px">' + this.x + ' - ' + correctFloat((this.x + this.series.binWidth)) + '</span><br/>';
			var body = '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + this.y + '</b><br/>';

			return header + body;
		}
	}

  /**
   * A `histogram` series. If the [type](#series.histogram.type) option is not
   * specified, it is inherited from [chart.type](#chart.type).
   * 
   * For options that apply to multiple series, it is recommended to add
   * them to the [plotOptions.series](#plotOptions.series) options structure.
   * To apply to all series of this specific type, apply it to [plotOptions.
   * histogram](#plotOptions.histogram).
   * 
   * @type {Object}
   * @since 6.0.0
   * @extends series,plotOptions.histogram
   * @excluding dataParser,dataURL,data
   * @product highcharts
   * @apioption series.histogram
   **/
  
  /**
   * An integer identifying the index to use for the base series, or a string
   * representing the id of the series.
   *
   * @type {Number|String}
   * @default undefined
   * @apioption series.histogram.baseSeries
   **/

  /**
   * An array of data points for the series. For the `histogram` series type,
   * points are calculated dynamically.
   * 
   * @type {Array<Object|Array>}
   * @since 6.0.0
   * @extends series.histogram.data
   * @product highcharts
   * @apioption series.histogram.data
   **/
}, merge(derivedSeriesMixin, {
	setDerivedData: function () {
		var data = this.derivedData(
      this.baseSeries.yData,
      this.binsNumber(),
      this.options.binWidth
    );

		this.setData(data, false);
	},

	derivedData: function (baseData, binsNumber, binWidth) {
		var max = arrayMax(baseData),
			min = arrayMin(baseData),
			frequencies = {},
			data = [],
			x,
			fitToBin;

		binWidth = this.binWidth = isNumber(binWidth) ? binWidth : (max - min) / binsNumber;
		fitToBin = fitToBinLeftClosed(binWidth);

		for (x = fitToBin(min); x <= max; x += binWidth) {
			frequencies[correctFloat(x)] = 0;
		}

		each(baseData, function (y) {
			var x = correctFloat(fitToBin(y));
			frequencies[x]++;
		});

		objectEach(frequencies, function (frequency, x) {
			data.push([Number(x), frequency]);
		});

		data.sort(function (a, b) {
			return a[0] - b[0];
		});

		return data;
	},

	binsNumber: function () {
		var binsNumberOption = this.options.binsNumber;
		var binsNumber = binsNumberFormulas[binsNumberOption] || typeof binsNumberOption === 'function';

		return Math.ceil(
      (binsNumber && binsNumber(this.baseSeries)) ||
      (isNumber(binsNumberOption) ? binsNumberOption : binsNumberFormulas['square-root'](this.baseSeries))
    );
	}
}));
