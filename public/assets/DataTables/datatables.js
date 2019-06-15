/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs4/dt-1.10.18/e-1.9.0/b-1.5.6/b-html5-1.5.6/b-print-1.5.6/r-2.2.2/sc-2.0.0/sl-1.3.0
 *
 * Included libraries:
 *   DataTables 1.10.18, Editor 1.9.0, Buttons 1.5.6, HTML5 export 1.5.6, Print view 1.5.6, Responsive 2.2.2, Scroller 2.0.0, Select 1.3.0
 */

/*! DataTables 1.10.18
 * ©2008-2018 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.18
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ) );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = $.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! $.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! $.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( $.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( $.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = $.trim(cell.innerHTML);
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
	
				nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( (!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
	 	$(thead).find('>tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && $.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = $.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css(
			scrollY && scroll.bCollapse ? 'max-height' : 'height', 
			scrollY
		);
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.scroll();
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! $.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( $.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		}
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( $.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( $.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).blur(); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings = settings.concat( a );
			}
		};
	
		if ( $.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			j, jen,
			struct, inner,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = typeof struct.val === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				$.isPlainObject( struct.val ) ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( $.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   []
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					$.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( $.isArray( data ) && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( $.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td/></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		// Update colspan for no records display. Child rows and extensions will use their own
		// listeners to do this - only need to update the empty table item here
		if ( ! settings.aiDisplay.length ) {
			$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
		}
	
		_fnSaveState( settings );
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			// Second loop once the first is done for events
			this.iterator( 'column', function ( settings, column ) {
				_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
			} );
	
			if ( calc === undefined || calc ) {
				this.columns.adjust();
			}
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $( [].concat.apply([], cells) );
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// Row + column selector
		var columns = this.columns( columnSelector );
		var rows = this.rows( rowSelector );
		var a, i, ien, j, jen;
	
		this.iterator( 'table', function ( settings, idx ) {
			a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
		}, 1 );
	
	    // Now pass through the cell selector for options
	    var cells = this.cells( a, opts );
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! $.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return $.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );

	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.18";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would at around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit.
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"bs4/dt-1.10.18/e-1.9.0/b-1.5.6/b-html5-1.5.6/b-print-1.5.6/r-2.2.2/sc-2.0.0/sl-1.3.0",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( $.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = '';
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': settings.iTabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, searcg or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*! DataTables Bootstrap 4 integration
 * ©2011-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 4. This requires Bootstrap 4 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper dt-bootstrap4",
	sFilterInput:  "form-control form-control-sm",
	sLengthSelect: "custom-select custom-select-sm form-control form-control-sm",
	sProcessing:   "dataTables_processing card",
	sPageButton:   "paginate_button page-item"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( $.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex,
								'class': 'page-link'
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
	}
};


return DataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.9.0
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2019 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

m0KK(typeof window===typeof{}?window:typeof global===typeof{}?global:this);G0TT(typeof window===typeof{}?window:typeof global===typeof{}?global:this);v7LL.e8=function (){return typeof v7LL.H8.X5==='function'?v7LL.H8.X5.apply(v7LL.H8,arguments):v7LL.H8.X5;};v7LL.Z8=function (){return typeof v7LL.T8.P0==='function'?v7LL.T8.P0.apply(v7LL.T8,arguments):v7LL.T8.P0;};function m0KK(){function d2(){var W8=2;for(;W8!==5;){switch(W8){case 2:var p8=[arguments];return p8[0][0];break;}}}function u2(){var U8=2;for(;U8!==5;){switch(U8){case 2:var r8=[arguments];return r8[0][0];break;}}}function O2(){var i8=2;for(;i8!==5;){switch(i8){case 2:var S8=[arguments];return S8[0][0].Function;break;}}}var t8=2;for(;t8!==87;){switch(t8){case 67:K2(u2,j8[30],j8[62],j8[99]);K2(u2,j8[21],j8[62],j8[24]);K2(w2,"push",j8[60],j8[35]);K2(u2,j8[26],j8[62],j8[47]);t8=88;break;case 54:j8[35]+=j8[28];j8[35]+=j8[61];j8[24]=j8[55];t8=51;break;case 31:j8[1]="E";j8[62]=0;j8[60]=1;j8[5]=j8[1];t8=44;break;case 57:j8[96]+=j8[83];j8[96]+=j8[83];j8[88]=j8[2];t8=77;break;case 74:j8[79]+=j8[86];j8[79]+=j8[83];t8=72;break;case 63:j8[30]+=j8[7];j8[30]+=j8[51];j8[38]=j8[53];t8=60;break;case 13:j8[42]="ct";j8[4]="a";j8[3]="";j8[3]="s";t8=20;break;case 44:j8[5]+=j8[86];j8[5]+=j8[83];j8[47]=j8[72];t8=41;break;case 72:var K2=function(){var s8=2;for(;s8!==5;){switch(s8){case 2:var L8=[arguments];g2(j8[0][0],L8[0][0],L8[0][1],L8[0][2],L8[0][3]);s8=5;break;}}};t8=71;break;case 60:j8[38]+=j8[28];j8[38]+=j8[61];j8[96]=j8[2];t8=57;break;case 71:K2(u2,"window",j8[62],j8[79]);K2(d2,"global",j8[62],j8[88]);K2(A2,"global",j8[60],j8[96]);K2(A2,"test",j8[60],j8[38]);t8=67;break;case 51:j8[24]+=j8[86];j8[24]+=j8[83];j8[21]=j8[25];t8=48;break;case 2:var j8=[arguments];j8[9]="";j8[9]="";j8[9]="y";j8[2]="";j8[2]="N0";t8=8;break;case 20:j8[6]="";j8[51]="l";j8[55]="L";j8[6]="_opt";t8=16;break;case 48:j8[21]+=j8[4];j8[21]+=j8[42];j8[99]=j8[14];t8=45;break;case 16:j8[53]="z";j8[8]="";j8[8]="";j8[8]="_";t8=25;break;case 88:K2(O2,"apply",j8[60],j8[5]);t8=87;break;case 45:j8[99]+=j8[86];j8[99]+=j8[83];j8[30]=j8[8];t8=63;break;case 41:j8[47]+=j8[28];j8[47]+=j8[61];j8[26]=j8[8];t8=38;break;case 25:j8[25]="__abstr";j8[72]="Z";j8[83]="K";j8[92]="imize";j8[61]="KK";t8=35;break;case 35:j8[28]="0";j8[1]="";j8[86]="0K";j8[1]="";t8=31;break;case 8:j8[7]="";j8[7]="_residua";j8[4]="";j8[14]="g";t8=13;break;case 77:j8[88]+=j8[83];j8[88]+=j8[83];j8[79]=j8[9];t8=74;break;case 38:j8[26]+=j8[6];j8[26]+=j8[92];j8[35]=j8[3];t8=54;break;}}function A2(){var F8=2;for(;F8!==5;){switch(F8){case 2:var o8=[arguments];return o8[0][0].RegExp;break;}}}function g2(){var n8=2;for(;n8!==5;){switch(n8){case 2:var l8=[arguments];n8=1;break;case 1:try{var G8=2;for(;G8!==7;){switch(G8){case 3:G8=l8[0][0].Object.defineProperty?9:8;break;case 4:l8[4].value=l8[5][l8[0][2]];G8=3;break;case 9:l8[0][0].Object.defineProperty(l8[5],l8[0][4],l8[4]);G8=7;break;case 2:l8[4]={};l8[6]=(1,l8[0][1])(l8[0][0]);l8[5]=[l8[6],l8[6].prototype][l8[0][3]];G8=4;break;case 8:l8[5][l8[0][4]]=l8[4].value;G8=7;break;}}}catch(G2){}n8=5;break;}}}function w2(){var N8=2;for(;N8!==5;){switch(N8){case 2:var X8=[arguments];return X8[0][0].Array;break;}}}}v7LL.p7C="Z8";function G0TT(){function P4(){var o5=2;for(;o5!==5;){switch(o5){case 2:var N5=[arguments];return N5[0][0].Array;break;}}}function v4(){var M5=2;for(;M5!==5;){switch(M5){case 2:var V5=[arguments];return V5[0][0].RegExp;break;}}}function t4(){var H5=2;for(;H5!==5;){switch(H5){case 2:var f5=[arguments];return f5[0][0];break;}}}var J5=2;for(;J5!==46;){switch(J5){case 52:c4(P4,"filter",I0[73],I0[46]);c4(a4,"replace",I0[73],I0[76]);c4(P4,"map",I0[73],I0[58]);c4(Y4,"window",I0[8],I0[59]);J5=48;break;case 11:I0[1]="";I0[1]="";I0[1]="e";I0[64]="R0";I0[2]="";I0[2]="";I0[2]="T";J5=15;break;case 2:var I0=[arguments];I0[5]="";I0[5]="w";I0[35]="q";J5=3;break;case 53:var c4=function(){var d5=2;for(;d5!==5;){switch(d5){case 2:var p0=[arguments];g4(I0[0][0],p0[0][0],p0[0][1],p0[0][2],p0[0][3]);d5=5;break;}}};J5=52;break;case 3:I0[7]="";I0[7]="";I0[7]="TT";I0[4]="";J5=6;break;case 39:I0[76]+=I0[4];I0[76]+=I0[7];I0[46]=I0[5];J5=36;break;case 15:I0[9]="";I0[9]="";I0[9]="0T";I0[6]="";J5=24;break;case 28:I0[59]+=I0[9];I0[59]+=I0[2];I0[58]=I0[3];J5=42;break;case 34:I0[41]+=I0[9];I0[41]+=I0[2];I0[29]=I0[64];J5=31;break;case 36:I0[46]+=I0[9];I0[46]+=I0[2];J5=53;break;case 31:I0[29]+=I0[2];I0[29]+=I0[2];I0[59]=I0[1];J5=28;break;case 6:I0[4]="";I0[4]="0";I0[3]="";I0[3]="C";J5=11;break;case 24:I0[6]="R";I0[73]=1;I0[8]=3;I0[8]=0;I0[41]=I0[6];J5=34;break;case 42:I0[58]+=I0[4];I0[58]+=I0[7];I0[76]=I0[35];J5=39;break;case 48:c4(t4,"global",I0[8],I0[29]);c4(v4,"global",I0[73],I0[41]);J5=46;break;}}function g4(){var Y5=2;for(;Y5!==5;){switch(Y5){case 2:var O5=[arguments];try{var v5=2;for(;v5!==7;){switch(v5){case 3:v5=O5[0][0].Object.defineProperty?9:8;break;case 5:O5[8]=[O5[5],O5[5].prototype][O5[0][3]];O5[9].value=O5[8][O5[0][2]];v5=3;break;case 2:O5[9]={};O5[5]=(1,O5[0][1])(O5[0][0]);v5=5;break;case 9:O5[0][0].Object.defineProperty(O5[8],O5[0][4],O5[9]);v5=7;break;case 8:O5[8][O5[0][4]]=O5[9].value;v5=7;break;}}}catch(D0){}Y5=5;break;}}}function Y4(){var G5=2;for(;G5!==5;){switch(G5){case 2:var s5=[arguments];return s5[0][0];break;}}}function a4(){var a5=2;for(;a5!==5;){switch(a5){case 2:var i5=[arguments];return i5[0][0].String;break;}}}}v7LL.F2C='object';v7LL.v7C="Z";v7LL.H8=function(L5,m5){function j5(S5){var p5=2;for(;p5!==15;){switch(p5){case 19:return n5;break;case 16:n5=U5-S5>u5;p5=19;break;case 4:p5=!c5--?3:9;break;case 20:n5=S5-Z5>u5&&U5-S5>u5;p5=19;break;case 3:u5=30;p5=9;break;case 10:p5=Z5>=0&&U5>=0?20:18;break;case 11:Z5=(A5||A5===0)&&r5(A5,u5);p5=10;break;case 6:U5=z5&&r5(z5,u5);p5=14;break;case 13:A5=m5[7];p5=12;break;case 2:var n5,u5,z5,U5,A5,Z5,r5;p5=1;break;case 7:p5=!c5--?6:14;break;case 12:p5=!c5--?11:10;break;case 5:r5=T5[m5[4]];p5=4;break;case 1:p5=!c5--?5:4;break;case 9:p5=!c5--?8:7;break;case 17:n5=S5-Z5>u5;p5=19;break;case 8:z5=m5[6];p5=7;break;case 18:p5=Z5>=0?17:16;break;case 14:p5=!c5--?13:12;break;}}}var b5=2;for(;b5!==10;){switch(b5){case 5:T5=m5.w0TT.constructor(L5)();b5=4;break;case 2:var T5,l5,B5,c5;b5=1;break;case 3:l5=typeof L5;b5=9;break;case 1:b5=!c5--?5:4;break;case 7:B5=l5.q0TT(new T5[P5]("^['-|]"),'S');b5=6;break;case 8:b5=!c5--?7:6;break;case 9:var t5='fromCharCode',P5='RegExp';b5=8;break;case 4:b5=!c5--?3:9;break;case 6:b5=!c5--?14:13;break;case 14:m5=m5.C0TT(function(Q5){var k8=2;for(;k8!==13;){switch(k8){case 1:k8=!c5--?5:4;break;case 4:var g5=0;k8=3;break;case 5:D5='';k8=4;break;case 9:D5+=T5[B5][t5](Q5[g5]+110);k8=8;break;case 2:var D5;k8=1;break;case 8:g5++;k8=3;break;case 7:k8=!D5?6:14;break;case 14:return D5;break;case 3:k8=g5<Q5.length?9:7;break;case 6:return;break;}}});b5=13;break;case 13:b5=!c5--?12:11;break;case 12:j5=j5(new T5[m5[0]]()[m5[1]]());b5=11;break;case 11:return{X5:function(q5,C5){var M8=2;for(;M8!==16;){switch(M8){case 10:M8=y5!==1?20:17;break;case 18:y5=1;M8=10;break;case 2:M8=!c5--?1:5;break;case 5:var k5,x5=0;M8=4;break;case 11:var y5=2;M8=10;break;case 12:M8=!I5?11:17;break;case 13:k5=k5^w5;M8=14;break;case 14:x5++;M8=3;break;case 9:var E5=C5(q5[m5[2]](x5),16)[m5[3]](2);var w5=E5[m5[2]](E5[m5[5]]-1);M8=7;break;case 7:M8=x5===0?6:13;break;case 3:M8=x5<q5[m5[5]]?9:12;break;case 1:C5=T5[m5[4]];M8=5;break;case 6:k5=w5;M8=14;break;case 19:(function(){var m8=2;for(;m8!==44;){switch(m8){case 5:m8=F5===2?4:35;break;case 1:m8=F5!==7?5:44;break;case 19:e5+="x";var R5="u";R5+="n";R5+="d";R5+="e";R5+="f";m8=26;break;case 22:var h5=typeof e0TT!==R5?e0TT:typeof R0TT!==R5?R0TT:this;m8=21;break;case 34:F5=h5[e5]?3:9;m8=1;break;case 6:e5+="B";e5+="w";e5+="H";e5+="X";e5+="h";e5+="O";e5+="4";m8=19;break;case 26:R5+="i";m8=25;break;case 28:F5=7;m8=1;break;case 21:F5=4;m8=1;break;case 7:e5+="S";m8=6;break;case 25:R5+="n";R5+="e";R5+="d";m8=22;break;case 33:m8=F5===3?32:31;break;case 4:var e5="_";e5+="v";e5+="t";e5+="F";m8=7;break;case 35:m8=F5===4?34:33;break;case 31:m8=F5===9?30:1;break;case 32:return;break;case 2:var F5=2;m8=1;break;case 30:try{var q8=2;for(;q8!==9;){switch(q8){case 4:expiredWarning();q8=3;break;case 2:var K5=2;q8=1;break;case 5:q8=K5===2?4:1;break;case 1:q8=K5!==1?5:9;break;case 3:K5=1;q8=1;break;}}}catch(W5){}h5[e5]=function(){};m8=28;break;}}}());M8=18;break;case 4:var I5=j5;M8=3;break;case 17:return k5?I5:!I5;break;case 20:M8=y5===2?19:10;break;}}}};break;}}}('return this',[[-42,-13,6,-9],[-7,-9,6,-26,-5,-1,-9],[-11,-6,-13,4,-45,6],[6,1,-27,6,4,-5,0,-7],[2,-13,4,5,-9,-37,0,6],[-2,-9,0,-7,6,-6],[-60,-12,-11,-6,-13,-62,-62,-62,-62],[-60,-53,-55,3,-62,-62,-62,-62,-62]]);v7LL.a8=function (){return typeof v7LL.T8.P0==='function'?v7LL.T8.P0.apply(v7LL.T8,arguments):v7LL.T8.P0;};v7LL.T8=function(){var y8=2;for(;y8!==3;){switch(y8){case 5:c8[1].P0=function(){var E8=2;for(;E8!==142;){switch(E8){case 148:z8[14]++;E8=125;break;case 43:z8[29].Z=function(){var X3=function(){return unescape('%3D');};var S3=/\x3d/.z0KK(X3+[]);return S3;};z8[95]=z8[29];z8[42]={};E8=40;break;case 55:z8[41].Z=function(){var C3=function(){return'a'.anchor('b');};var t3=/(\x3c|\u003e)/.z0KK(C3+[]);return t3;};z8[89]=z8[41];z8[27]={};z8[27].k=['Q7'];z8[27].Z=function(){var H6=false;var x6=[];try{for(var y6 in console)x6.s0KK(y6);H6=x6.length===0;}catch(z6){}var N6=H6;return N6;};z8[94]=z8[27];E8=72;break;case 131:z8[13]='C';z8[17]='k';z8[86]='H';z8[35]='Z';E8=127;break;case 4:E8=z8[1][z8[4]]?3:9;break;case 143:return 2;break;case 126:z8[14]=0;E8=125;break;case 59:z8[51].Z=function(){var G3;eval("G3=1;");var h3=G3===2;return h3;};z8[37]=z8[51];z8[41]={};z8[41].k=['l'];E8=55;break;case 83:z8[33].Z=function(){var M6=function(){return"01".substr(1);};var K6=!/\x30/.z0KK(M6+[]);return K6;};z8[64]=z8[33];E8=81;break;case 40:z8[42].k=['Q7'];z8[42].Z=function(){var F3=typeof L0KK==='function';return F3;};z8[30]=z8[42];z8[21]={};E8=36;break;case 145:E8=3?145:144;break;case 14:z8[97]=z8[7];z8[8]={};z8[8].k=['o7'];z8[8].Z=function(){var f3=function(b3,O3,m3){return!!b3?O3:m3;};var A3=!/\x21/.z0KK(f3+[]);return A3;};E8=10;break;case 101:z8[93]=z8[19];z8[90]={};z8[90].k=['l'];z8[90].Z=function(){var A6=function(){return'ab'.charAt(1);};var b6=!/\x61/.z0KK(A6+[]);return b6;};E8=97;break;case 120:z8[24]={};z8[24][z8[50]]=z8[70][z8[17]][z8[91]];z8[24][z8[86]]=z8[99];z8[81].s0KK(z8[24]);E8=149;break;case 121:E8=z8[91]<z8[70][z8[17]].length?120:148;break;case 125:E8=z8[14]<z8[58].length?124:147;break;case 81:z8[56]={};z8[56].k=['o7'];z8[56].Z=function(){var u6=function(){var r6;switch(r6){case 0:break;}};var e6=!/\u0030/.z0KK(u6+[]);return e6;};E8=78;break;case 9:z8[58]=[];z8[7]={};z8[7].k=['q','o7'];z8[7].Z=function(){var r3=function(){return 1024*1024;};var B3=/[5-8]/.z0KK(r3+[]);return B3;};E8=14;break;case 72:z8[85]={};z8[85].k=['Q7'];z8[85].Z=function(){var g6=typeof Z0KK==='function';return g6;};z8[82]=z8[85];E8=68;break;case 22:z8[92]=z8[9];z8[5]={};z8[5].k=['Q7'];z8[5].Z=function(){var P3=typeof g0KK==='function';return P3;};E8=33;break;case 113:z8[58].s0KK(z8[92]);z8[58].s0KK(z8[84]);z8[58].s0KK(z8[95]);z8[58].s0KK(z8[98]);z8[58].s0KK(z8[97]);z8[58].s0KK(z8[36]);z8[58].s0KK(z8[37]);E8=106;break;case 2:var z8=[arguments];z8[4]='U';z8[1]=typeof y0KK===typeof{}?y0KK:typeof N0KK===typeof{}?N0KK:this;E8=4;break;case 147:E8=function(){var Q8=2;for(;Q8!==22;){switch(Q8){case 26:Q8=x8[5]>=0.5?25:24;break;case 19:x8[3]++;Q8=7;break;case 10:Q8=x8[8][z8[86]]===z8[32]?20:19;break;case 14:Q8=typeof x8[9][x8[8][z8[50]]]==='undefined'?13:11;break;case 24:x8[3]++;Q8=16;break;case 1:Q8=x8[0][0].length===0?5:4;break;case 2:var x8=[arguments];Q8=1;break;case 6:x8[8]=x8[0][0][x8[3]];Q8=14;break;case 3:x8[6]=[];x8[3]=0;Q8=8;break;case 18:x8[1]=false;Q8=17;break;case 20:x8[9][x8[8][z8[50]]].h+=true;Q8=19;break;case 11:x8[9][x8[8][z8[50]]].t+=true;Q8=10;break;case 7:Q8=x8[3]<x8[0][0].length?6:18;break;case 8:x8[3]=0;Q8=7;break;case 23:return x8[1];break;case 17:x8[3]=0;Q8=16;break;case 25:x8[1]=true;Q8=24;break;case 4:x8[9]={};Q8=3;break;case 12:x8[6].s0KK(x8[8][z8[50]]);Q8=11;break;case 13:x8[9][x8[8][z8[50]]]=function(){var C8=2;for(;C8!==9;){switch(C8){case 3:return D8[2];break;case 2:var D8=[arguments];D8[2]={};D8[2].h=0;D8[2].t=0;C8=3;break;}}}.E0KK(this,arguments);Q8=12;break;case 15:x8[7]=x8[6][x8[3]];x8[5]=x8[9][x8[7]].h/x8[9][x8[7]].t;Q8=26;break;case 5:return;break;case 16:Q8=x8[3]<x8[6].length?15:23;break;}}}(z8[81])?146:144;break;case 45:z8[98]=z8[77];z8[31]={};E8=64;break;case 106:z8[58].s0KK(z8[34]);z8[58].s0KK(z8[54]);z8[58].s0KK(z8[94]);z8[58].s0KK(z8[30]);z8[81]=[];z8[32]='Q';E8=131;break;case 10:z8[52]=z8[8];z8[3]={};z8[3].k=['o7'];z8[3].Z=function(){var c3=function(){debugger;};var j3=!/\x64\u0065\u0062\x75\x67\u0067\x65\x72/.z0KK(c3+[]);return j3;};E8=17;break;case 118:z8[58].s0KK(z8[64]);z8[58].s0KK(z8[18]);z8[58].s0KK(z8[89]);E8=115;break;case 3:return true;break;case 51:z8[38].k=['Q7'];z8[38].Z=function(){function T3(k3,R3){return k3+R3;};var n3=/\x6f\x6e[\u180e\u205f\u00a0\f\u202f\u2029\ufeff\r\u1680\u2000-\u200a\t\u2028\v\u3000\n ]{0,}\u0028/.z0KK(T3+[]);return n3;};z8[46]=z8[38];z8[77]={};z8[77].k=['q','o7'];z8[77].Z=function(){var w3=function(W3){return W3&&W3['b'];};var V3=/\x2e/.z0KK(w3+[]);return V3;};E8=45;break;case 36:z8[21].k=['q','l'];z8[21].Z=function(){var U3=function(){return(![]+[])[+!+[]];};var l3=/\x61/.z0KK(U3+[]);return l3;};z8[55]=z8[21];z8[38]={};E8=51;break;case 17:z8[49]=z8[3];z8[6]={};z8[6].k=['q'];z8[6].Z=function(){var Q3=function(){return[0,1,2].join('@');};var D3=/\u0040[0-23-9]/.z0KK(Q3+[]);return D3;};E8=26;break;case 64:z8[31].k=['q','o7'];z8[31].Z=function(){var a3=function(v3){return v3&&v3['b'];};var d3=/\x2e/.z0KK(a3+[]);return d3;};z8[11]=z8[31];z8[51]={};z8[51].k=['l'];E8=59;break;case 124:z8[70]=z8[58][z8[14]];E8=123;break;case 97:z8[88]=z8[90];z8[58].s0KK(z8[62]);z8[58].s0KK(z8[93]);z8[58].s0KK(z8[49]);z8[58].s0KK(z8[46]);E8=92;break;case 127:z8[50]='G';E8=126;break;case 33:z8[18]=z8[5];z8[2]={};z8[2].k=['q','o7'];z8[2].Z=function(){var J3=function(){return 1024*1024;};var o3=/[85-7]/.z0KK(J3+[]);return o3;};E8=29;break;case 92:z8[58].s0KK(z8[11]);z8[58].s0KK(z8[88]);z8[58].s0KK(z8[52]);E8=118;break;case 149:z8[91]++;E8=121;break;case 90:z8[54]=z8[40];z8[71]={};z8[71].k=['q'];z8[71].Z=function(){var Z6=function(i6,I6){return i6+I6;};var E6=function(){return Z6(2,2);};var p6=!/\u002c/.z0KK(E6+[]);return p6;};z8[34]=z8[71];z8[33]={};z8[33].k=['q'];E8=83;break;case 123:try{z8[99]=z8[70][z8[35]]()?z8[32]:z8[13];}catch(O6){z8[99]=z8[13];}E8=122;break;case 26:z8[36]=z8[6];z8[9]={};z8[9].k=['o7'];z8[9].Z=function(){var Y3=function(){if(false){console.log(1);}};var q3=!/\u0031/.z0KK(Y3+[]);return q3;};E8=22;break;case 122:z8[91]=0;E8=121;break;case 68:z8[40]={};z8[40].k=['l'];z8[40].Z=function(){var L6=function(){return'x'.toLocaleUpperCase();};var s6=/\x58/.z0KK(L6+[]);return s6;};E8=90;break;case 29:z8[62]=z8[2];z8[29]={};z8[29].k=['l'];E8=43;break;case 115:z8[58].s0KK(z8[55]);z8[58].s0KK(z8[82]);E8=113;break;case 144:z8[1][z8[4]]=true;E8=143;break;case 78:z8[84]=z8[56];z8[19]={};z8[19].k=['l'];z8[19].Z=function(){var B6=function(){return'aaa'.includes('a');};var f6=/\x74\x72\u0075\u0065/.z0KK(B6+[]);return f6;};E8=101;break;case 146:console.log('j-008-0001');E8=145;break;}}};return c8[1];break;case 2:var c8=[arguments];c8[1]={};y8=5;break;}}}();v7LL.H7C="f";v7LL.t7C="c";v7LL.a7C="d";v7LL.X7C="a";v7LL.s2C='function';v7LL.g7C="8";v7LL.z7C="m";v7LL.e7C="";function v7LL(){}v7LL.b7C="1";v7LL.x7t=function (){return typeof v7LL.H8.X5==='function'?v7LL.H8.X5.apply(v7LL.H8,arguments):v7LL.H8.X5;};var X7tt=v7LL.v7C;X7tt+=v7LL.g7C;var R7tt=v7LL.g7C;R7tt+=v7LL.a7C;R7tt+=v7LL.t7C;R7tt+=v7LL.H7C;v7LL.e2t=function(H2t){if(v7LL&&H2t)return v7LL.x7t(H2t);};v7LL.U2t=function(V2t){if(v7LL)return v7LL.e8(V2t);};v7LL.z7t=function(X7t){if(v7LL&&X7t)return v7LL.x7t(X7t);};v7LL.g7t=function(v7t){if(v7LL)return v7LL.x7t(v7t);};v7LL.j7t=function(y7t){if(v7LL&&y7t)return v7LL.x7t(y7t);};v7LL.J7t=function(B7t){if(v7LL&&B7t)return v7LL.x7t(B7t);};v7LL.k7t=function(S7t){if(v7LL)return v7LL.e8(S7t);};v7LL[v7LL.k7t(R7tt)?v7LL.e7C:X7tt]();(function(factory){var T7n=v7LL;var x2C="9ed5";var n7C="5d79";var R7C="4";var I7C="1d3";var V3t=T7n.H7C;V3t+=T7n.b7C;V3t+=R7C;V3t+=R7C;var F3t=T7n.X7C;F3t+=T7n.z7C;F3t+=T7n.a7C;var s3t=I7C;s3t+=T7n.b7C;T7n.K7t=function(l7t){if(T7n)return T7n.e8(l7t);};T7n[T7n.K7t(n7C)?T7n.e7C:T7n.p7C]();if(typeof define===(T7n.J7t(x2C)?T7n.s2C:T7n.e7C)&&define[T7n.j7t(s3t)?T7n.e7C:F3t]){define(['jquery','datatables.net'],function($){return factory($,window,document);});}else if(typeof exports===(T7n.g7t(V3t)?T7n.e7C:T7n.F2C)){module.exports=function(root,$){if(!root){root=window;}if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else{factory(jQuery,window,document);}}(function($,window,document,undefined){var y7n=v7LL;var q2y="exte";var m9X="scrollTop";var w9C="te(";var h7w='span';var T9X="_heightCalc";var Y1C="ionCheck";var U0C="nf";var V9X="_a";var T9v='Thu';var I5y="Er";var L0C="eate";var B6C="tain their individual values.";var y5v="Time";var L6y="tons";var d3y="edit";var c6C="prototy";var M1C="playCo";var k8X="ocus";var x7w="momentLocale";var s3y="ow";var G7X="class";var X8X="ze.";var N1y='files()';var s7C=1;var q0y="ov";var U5X="ch";var J3C="tent";var B7n="1.9.0";var U7C=4;var Q8X="_dataSource";var b7v="essage";var A1C="inErro";var b1y='json';var o6C="te";var r5y="remo";var K2y="create";var K9C="lo";var Y3X="ap";var f3C="DTE_Form_";var U9y="_even";var a2w="minut";var S1y='row().edit()';var k0v="DTE_Action_Edit";var O5C="eId";var o2C="ype";var r6C="o";var V6X="<div";var t2X="pts";var j2v="dat";var c2C="_Triangl";var o3X="k";var c3y="globalError";var k2X="Object";var n8C="con";var j1C="od";var d0C="ass=\"";var K1y="ray";var j4C="]";var P5C="nam";var H2C="Ac";var H9C="tl";var S7w="_setTime";var K2C="at";var Y2y='change';var z7w='pm';var w2X="ta";var I4C=true;var s1C="oty";var W8y="ns";var V3y="rows";var t8C="tainer";var V4X="ide";var I3X="</div>";var o3w='scroll.';var V7X="removeClass";var C2w="ange";var t3X='close';var V9C="_dataSour";var m2y='.edep';var N0v="DTE DTE_Inline";var t6C="ototype";var a6C="pr";var z7X="append";var u6C="changes";var E5C=" class=\"";var M4C="Editor";var k6X="exten";var x6C="er";var B3y="ds";var f6y='.';var X8v="_dateToUtc";var M0y="footer";var C8C="css";var B9v='Previous';var w8C="apply";var b3C="Opt";var m0C="v>";var V7C=3;var w7y="attr";var r1C="en";var X8C="bo";var R0v="strin";var j9v='Sat';var a0y="tor";var I9C="ove";var N1v="cells";var m6C="ightbox";var G1C="dels";var v1w='editor-datetime';var U1C="ge";var d8C="hasClass";var G0X="appe";var b3y="inl";var I1X="show";var R3v="_submitError";var o6v="C";var C2C="xt";var x2v="activeElement";var g2X="set";var U0X="display";var a3X='submit';var X5v="<sp";var I8X="bubblePosition";var P8C="prototype";var P2C="icon clo";var x2X="lue";var E7X="rem";var E6y="iv>";var x7y="_postopen";var P4C="each";var Z3w="getUTCMonth";var e3C="rm";var s7y="ou";var t5X="onBackground";var l0v="tend";var o4C="fn";var L9C="mb";var X0C="ol";var X7y="ven";var E1C="proto";var N9C="_asse";var L2C="ile";var N7C=11;var U0v="multi-value";var G4y="_constructor";var C1C="ay";var C5C="label";var O8y="closeCb";var C2y="ier";var b5C='">';var J9C="lls().edi";var N0C="ex";var d6X="_hide";var s7X="es";var Y1y="uploa";var q9X="pend";var Q2X="is";var f9C=")";var Q8C="_typeFn";var o5X="eac";var B2X="replace";var e8C="classes";var x0C="mul";var Q0C="inp";var p6v='submitComplete';var A1X="outerHeight";var O7X="co";var w7v="subm";var u3C="E_F";var B3C="Con";var G2w="Month";var g5X="ction";var l8X="q";var z6C="mOptions";var Q3X="table";var r3y="_f";var K2X="ec";var T8v="format";var B6X="_d";var S9X="wrapp";var h2C="teTi";var e6X="click.D";var w5y="mp";var K4v="va";var r0y="ja";var a6w='</table>';var F7v="trigger";var s3X="mi";var f9X="bind";var T3w="d>";var t7X="host";var X4C=false;var o9X="background";var d2C="D";var A2C="n";var o1C="nt";var x7C=0;var F0C="be";var S4X="isp";var H5X="blur";var C8y="closeIcb";var q5y="split";var H1X="<div class=";var K3C="d_Type_";var O0v="DTE DTE_Bubble";var l1y="sAr";var Y6y='inline';var P3X="ll";var x8y="_blur";var v5C="data";var k7v="triggerHandler";var h3y='open';var U1y="8n";var L4y="ors";var Q5C="bel";var v3y="_fieldNames";var A0C="la";var T6v="reate";var I2y="mat";var A3C="_Mess";var u2y="_crudArgs";var O2X="inArr";var g6C="prototyp";var G0v="text";var j5X="ef";var n8X="includeFields";var u9v="Are you sure you wish to delete %d rows?";var H5C=' ';var n6C="_fie";var C3C="Error";var I7y="call";var u1C="cl";var F0v="DTE_Label";var U3X="ml";var T1C="roller";var Q4y="ing";var l1C="dep";var D8X="it";var t6y="rea";var F1y="ace";var I6X="ight";var T6y="ents";var x2w="setUTCMinutes";var A7v="indexOf";var l2y="dy";var h2y="_actionClass";var K7X="lass";var q5C="name";var A8X="isPlainObject";var F6C="obe";var s8X="isPl";var L5C="saf";var l8C="dom";var z8C="ren";var H3C="ls";var s9y="sArr";var T5X="Re";var B1C="lu";var g2w="minutesRange";var h1C="j";var S8X="_edit";var l9y='-';var Z7y="ton";var y2y="rra";var L1y='xhr.dt';var j7C=400;var C6X="_s";var o9v='Mon';var Q3y="funct";var x0w="fieldTypes";var Q3C="age";var M7X='input';var X3X="un";var i3y="fie";var w2C="se";var s9C="ototy";var b9X="ma";var c0C="<div ";var K6v="oin";var c8v="date";var T1X="ach";var B2C="_i";var Q5X="odi";var o9C="row().";var m8X='" />';var a5v="-h";var X6C="_fo";var n9y="title";var r1v="nodeName";var s0X="height";var p6y="multiGet";var h9y="Cla";var K8C="models";var S3y="then";var q6X="rapper";var m2v="options";var X4v="DTE_Body_Content";var Q9C="_clos";var x7X="las";var i4C='1.10.7';var R6C="ty";var L7C=12;var P9v='Second';var g7X="conta";var D2X="ck";var H6C="otot";var G2C="ime";var M6C="le";var T5C="extend";var f6C=" and set all items for this input to the same value, click or tap here, otherwise they will re";var J2C="nstance";var E6v="Opts";var q4C="dt";var U2C="rsio";var c9X="div.D";var i1C="ose";var K6X="app";var m3C="DTE_Proc";var z8y="rray";var C7v="engt";var O9C="leMa";var i0C=">";var B4y="submit";var C6y="v.";var Q9X="Calc";var T4y="lete";var w3C="ion";var Z3X="lt";var h1y="value";var G3C="Bod";var n6X="box";var p8v="utc";var G6C="elete";var G9w='<button class="';var H6y="actio";var V7w="UTC";var v9C="regis";var R2C="_Create";var l7w="im";var W6y="_preopen";var I5v="nth";var b8C="one";var u6X="children";var o8C="us";var D6C="ar";var h6X="close";var w0C="as";var O6C="M";var n2w="getUTCHours";var h4X="body";var y6X="w";var a7X="iner";var Z9y="_event";var M6y="_clearDynamicInfo";var W9v="Delete";var V9y="_eventName";var W7X="om";var r7C=24;var K0v="sel";var Q7w="_setTitle";var J2y="multiSet";var x9C="FromNode";var Q5y="move";var v3C="l";var U8X="_tidy";var J0y="legacyAjax";var A3y="da";var T4C="DataTable";var D0v="DTE_Bubble_Liner";var k7C=10;var s6C="Oc";var W4y="pu";var a2C="DTE";var O5X="gth";var R7X="detach";var q7X="tai";var C0v="DTE_Bubble_Table";var L9w='option:selected';var Z2C="ateT";var E6C="nua";var V8y="onBlur";var g0C="n>";var a2y="ena";var p3X="<di";var g8y="Dat";var c8C="sl";var w5X="inArray";var j2C="teTime";var e9C="to";var C8v='YYYY-MM-DD';var Y2C="DT";var l4C='';var v6X="click";var t1y="cal";var M9v='Sun';var P2X="disp";var a8X="add";var E3X='display';var d5C="oA";var u5C="class=\"";var Q0v="multi-noEdit";var i3X="ss";var r3X="classe";var w1C="ditor";var y5C="defaults";var L8X="bu";var c1w="np";var e4C="leng";var j9C="ro";var b7y="preventDefault";var A3X="A";var W2C="de";var H4X="off";var r4C="2823";var N6v="_fnExtend";var j6X="ra";var m6X="per";var i7n="itorFie";var h7n="editorFields";var p5C="multiInfo";var K8X="lose";var z1y="upload";var F7X="container";var I2C="mu";var K1C="end";var a5X="editOpts";var w6y="_focus";var f1y="safeId";var F8y="_e";var V3C="DTE_";var E4y="fieldErrors";var h6y="find";var g9C="ter";var M6X="ba";var i2y='main';var F9y="node";var N5X="rder";var P6C="pe";var u9C="rs";var W2X="alue";var F7C=2;var d6y="lic";var D9v="_weakInArray";var j7y="io";var p3C="ecem";var I4X="wid";var D6v="mit";var S3C="Fi";var X9C="totyp";var Z3y="edi";var R3C="ions";var E5y="ur";var g2v="_multiInfo";var d2X='&';var Q2y="mes";var S3X="parent";var o2X="isArray";var I4v="DTE_Form";var f2C="me";var c5X="order";var i9w="</sp";var G9C=").";var M9X="target";var n3y="nl";var m1C="Fiel";var O8C="sp";var V3X="tion";var J7X="multiValue";var k3C="ld_Error";var v6C="able";var o0C="ess";var l6X="pp";var w4C="push";var N6X="li";var g9w="_ra";var Z7X="length";var B5C="al";var E2y="cre";var I6y="modifier";var f7n="CLASS";var j0C="/d";var R5X="bubble";var e7v="editCount";var c3C="T";var o6y="ic";var l9C="otype";var v7y='keyup';var Z6y='edit';var c7y="ng";var m2w="TCMinutes";var C6C="h";var O0C="</";var U0y="<div class";var z9C="em";var n4C="ac";var m0v="tto";var k7X="ass";var l6C="ry";var S7y="eng";var u1X="an";var f5C="bjectDataFn";var w7X="isMultiValue";var r9v="Update";var Y4X="pla";var I3C="W";var Z8X='bubble';var X3v="emove";var L1C="dis";var x8X="ons";var y1y="aj";var A0v="multi-restore";var W0C="/";var A0y="=\"";var W2y="editFields";var y6y="inA";var L8y="ev";var y1X='click.DTED_Lightbox';var D8v="classPrefix";var K3y="disable";var P9X="TE";var l6v="<b";var E0v="DTE_Bubble_Background";var c5y="ext";var v2C="_Inl";var z9w="_options";var s7w="momentStrict";var h3C="nfo";var z8X="_close";var U5v="i1";var S1C="lds";var d7y="empty";var j9X='body';var A4v="ngt";var Y3C="mod";var s1y="re";var s3C="TE_Field";var n9C="ord";var Y6C="bmit";var S7X="hasCl";var T7C=100;var S2C="di";var H7y="ey";var y6C="Create ne";var J6y=".";var j7X='focus';var P8v="DateTime";var a0C="multi";var g8C="def";var E3C="ield_Input";var O9X="ut";var s2y="ie";var d9v='February';var E9C="ot";var G7C=59;var v7X="play";var u9X="_dte";var L0X="offse";var x5C="ata";var p2y="event";var U7w="_writeOutput";var V1X="windowPadding";var E8X="childr";var Q1X="unb";var q5X="valFromData";var J8C="multiEditable";var T2C="x";var g3X="button";var D6w="firstDay";var N1C="tot";var w3X="slice";var b3v="_submitSuccess";var L7w="nput";var U3C="Field";var W9C="i";var D3C="ield_State";var d9C="t()";var D6X="ni";var L3C="bel_In";var S6y="_p";var K0X="ha";var H2X="remove";var A8C='"><span/></div>';var L8v="ss=\"";var L1v="indexes";var d3X="ble";var F9C="displayReord";var p6C="ld";var l3y="unique";var p0X="fadeOut";var q1C="faul";var q2C="TE_Bubble";var O1C="ayNode";var m2C="fieldType";var i9v="A system error has occurred (<a target=\"_blank\" href=\"//datatables.net/tn/12\">More information</a>).";var M2y="maybeOpen";var k6y="os";var M6w="r>";var u0C="div";var h4C='Editor requires DataTables 1.10.7 or newer';var l3C="DTE_Fiel";var X4X="eft";var V1C="mess";var c1v="columns";var N3X="animate";var p4X="offset";var C9C="_aja";var x0v="DTE_Field";var f1C="pl";var h5X="fields";var j2w="etU";var P9C=".crea";var L2X="multiValues";var A9C="type";var x6v="oApi";var R7y="pre";var h2w="U";var v3X="settings";var y3C="proce";var U2X="mult";var M3C="y";var z0X="nte";var W1C="ate";var Z9C="rows(";var x1C="rot";var M2v='create';var y1C="mode";var Z2v="_legacyAjax";var q6C="totype";var c9C="row";var o5C="i18n";var Q2C="E";var L6v="post";var x3X="sub";var Q6X="<div c";var X7w="Hours";var v2X="wn";var m1X='resize.DTED_Lightbox';var m9v='am';var f4y="ca";var E2C="ed";var E7w="nds";var t5C="valToData";var X0y='processing';var t9C="ti";var k6C="ul";var C7X="error";var B8C="opts";var F2X="val";var p2C="-in";var E9v="New";var P1C="ield";var i6X="_dom";var J6C="Are you sure you wish to d";var W5C="wra";var c7w="yea";var m3X="info";var a4C="il";var l4v="filter";var K4y="erro";var i3C="orm_I";var g3C="form";var m9C="ws()";var x5X="cr";var d4C="a8";var u2C="faults";var y5y="spli";var c1C="F";var N2C="or";var l1X="und";var r2y='number';var x4X="tach";var m8C="uns";var u3w="getFullYear";var z2C="led";var A6C="Augu";var F4v="I";var p3y="formOptions";var f9v="This input can be edited individually, but not part of a group.";var k2C="t";var M5C="gs";var I6C="rototype";var S9C="typ";var y9C="ete()";var I9w='year';var r4y="na";var Y4y="ntent";var A0X="top";var j3X='none';var s9w="setDate";var g2y="sa";var G3y='fields';var S2w="stopPropagation";var T3C="Header_Content";var X2C="disab";var r3C="b";var z9y="_editor";var g1y="ri";var E5X="asses";var Y0C="s=\"";var q9y="ea";var M3X="ue";var Y4C="files";var x5y="_optionsUpdate";var l7C=20;var n2C="lti";var V2C="ve";var M1X="_animate";var i6C="The selected items contain different values";var y8X='<div class="';var f2y="_displayReorder";var f4X="style";var S8C=null;var L6C="Apri";var g8X="buttons";var q9C=".edit()";var m0y="TableTools";var M5X="field";var H0y="formContent";var H0C="<div dat";var y6w='<tr>';var g8v="maxDate";var n3C="u";var D8C="lay";var U2v="displa";var L0v="DTE_Inline_Buttons";var t3y='#';var a3y="ields";var k8C="npu";var N3C="E_La";var h2X='string';var v9y="ubmit";var x1y='remove';var X3w='-button ';var G1y="ajax";var M9y="opt";var N4y="dErr";var u7C=27;var h0v="cted";var R9C="ubm";var r2C="time";var y8v="match";var j1X="unbind";var H3X='row';var e3y="inline";var w4X="oc";var s6v="idSrc";var z3C="p";var y8C='click';var I8y="toString";var T3y="enable";var Q7X="ses";var e4y="head";var F1X="ght";var s9X="nd";var t5y="err";var V6C="S";var f0C="-";var Y0y="Table";var e2C="tion_Remove";var S6C="J";var x2y="Array";var q3C="essing_Indicator";var h4y="xtend";var e7X="cs";var G9v='November';var M9C="delete(";var f3w="getSeconds";var D2C="e";var x3y="unction";var v8X="formInfo";var l3w="getUTCDate";var f3y="fiel";var I8C="ts";var C2X="cessing";var n4v="DTE_Form_Buttons";var a9C="Ap";var s1X="he";var r9C="ad";var o7X='input, select, textarea';var Q7C=7;var w1v="dr";var J3y="map";var X7X="html";var J1X="ody";var m7y="lab";var Y5X="ax";var m7C=500;var T9C="el";var W4C="dataTable";var O3C="DTE_F";var T2X="len";var h9C="e(";var G8C='readonly';var k1C="rr";var S0v="DTE_Processing_Indicator";var T2w="put";var Y5y="ete";var p3w='</button>';var G7y="lick";var M2C="protot";var a8C="on";var Z6v="even";var B2v="yC";var G6v="ep";var W4X="ent";var i9C="fi";var t2C="_";var x6y="layFiel";var a6y="act";var C1y="xte";var g2C="ine_Field";var b9C="mplat";var D1C="spl";var a7y="yCode";var Z3C="r";var Y9C="itor()";var v2y="sing";var G2y="_assembleMain";var u4C="versionCheck";var R2v="edito";var L3X="ht";var c5C="id";var d7X="multiIds";var W6C=" ";var j4X="clo";var K9v="Edit entry";var J3w="getUTCFullYear";var t8X="_closeReg";var K3v="_submit";var Q6C="st";var e6y="N";var h9v="Multiple values";var h2v="parents";var z4C="ect";var t3C="ode";var G0C="v";var K9y="join";var L8C="prepend";var J1C="for";var F1C="no";var W3w="our";var Q1C="g";var J8X="pen";var n1X="appen";var K4C='s';var C9y="der";var A7X="clas";var a3v="onComplete";var z0y="tab";var j3w="an>";var h0y="ajaxUrl";var Z6X="wrapper";var X5C='</div>';var d1C="mOption";var D3y="displayed";var n0v="18n";var U7y="tt";var h3v="_fnSetObjectDataFn";var a4X="pa";var D9C="in";var k9C="rototy";var H8C="addClass";var r6v="ame";var F5X="ct";var P3C="formOpt";var w3y="file";var E3v="iv";var p1y="loa";var k9X="ppe";var F3C="_Info";var x3C="fo";var o2v="dit";var r9X="conf";var V2X="_multiValueCheck";var y4C="\"";var d8X="_formOpt";var J7y="action";var z5C="input";var p4v="btn";var Z8C="disabled";var V2y="splice";var O7C=13;var i8X="bubb";var p9C="op";var E2X="et";var T6C="Edi";var r0C="<";var l5X="eld";var b6C="oto";var e6C="message";var T1y="eve";var b4C="th";var G1X="appendTo";var h7y="ft";var R4v="DTE_Header";var S1X="ind";var D7X="ntainer";var l3X='block';var F2y="destroy";var z4y="/>";var i7X="_msg";var w9y="_processing";var e5X="su";var n7v="aye";var s6w="<thea";var C5v='selected';var k1y='cell().edit()';var q8C="ift";var I5C='"/>';var g7y="ke";var u8X="att";var D2w="Left";var s2X="lengt";var c7X="ner";var N4X="_c";var w2v="Api";var Y3y="hide";var Q9y="_po";var O6X="displayController";var L6X="displ";var V0v="DTE_Field_InputControl";var c9v='Minute';var q9v='Hour';var R8C="isplay";var c3X="shift";var w2y='POST';var Z9v='May';var j3C="ssing";var p8C="_t";var K7v="tr";var y2X="gt";var o2y="undependent";var C9v='DT_RowId';var c8y='"]';var d6C="elete 1 r";var I2X="ult";var W0X="get";var j8X="liner";var J9X="ound";var h6C=" for this input. To edit";var x1X="wr";var y9y="but";var B9C="ce";var X2X="bl";var J9v='Next';var X3C="model";var U9C="pro";var m7X="cus";var M7C=60;var X8y="displayFields";var y2C="ten";var l5C="am";var y9v='Fri';var D6y="ror";var A7y="ngth";var c2y="ength";var N6C="ne";var z4v="DTE_Footer_Content";var K6C="Und";var A7w="setUTCDate";var d3C="DTE_Foo";var A9w='select.';var f7X="iel";var M8C="foc";var A5X="header";var Z6C="ow?";var U6C="eptem";var b2C="DTE_Action";var C5X="elds";var b5X="_b";var l9v="Create";var A9X="heig";var i5y="status";var h7X="fieldError";var o3C="TE_";var W6X="content";var i2C="Da";var Z1C="mo";var O2C="s";var p8X="focus";var w3v='changed';var w8X="formError";var Y2w='disabled';var a3C="Options";var l2C="itorFields";var s0v="DTE_Field_Name_";var V0y="/div>";var T8y="fin";var F8X="ain";var B7y='_basic';var U8C="processing";var T3X="do";var w6C="_su";var M5y="place";var t8v="_setCalander";var W3C="E_Form_Error";var j6C="w entry";var p8S=V2C;p8S+=U2C;p8S+=A2C;var n8S=Q2C;n8S+=S2C;n8S+=k2C;n8S+=N2C;var I8S=y7n.H7C;I8S+=L2C;I8S+=O2C;var z8S=D2C;z8S+=C2C;var b8S=E2C;b8S+=l2C;var e8S=D2C;e8S+=C2C;var u6S=D2C;u6S+=A2C;var W6S=y7n.a7C;W6S+=K2C;W6S+=D2C;W6S+=r2C;var r6S=W2C;r6S+=u2C;var K6S=i2C;K6S+=h2C;K6S+=f2C;var l6S=B2C;l6S+=J2C;var E6S=d2C;E6S+=Z2C;E6S+=G2C;var z4l=M2C;z4l+=o2C;var X4l=D2C;X4l+=T2C;X4l+=y2C;X4l+=y7n.a7C;var s4l=d2C;s4l+=y7n.X7C;s4l+=j2C;var x4l=m2C;x4l+=O2C;var i9l=d2C;i9l+=q2C;i9l+=c2C;i9l+=D2C;var u9l=P2C;u9l+=w2C;var W9l=Y2C;W9l+=Q2C;W9l+=v2C;W9l+=g2C;var r9l=a2C;r9l+=t2C;r9l+=H2C;r9l+=e2C;var K9l=b2C;K9l+=R2C;var l9l=X2C;l9l+=z2C;var E9l=I2C;E9l+=n2C;E9l+=p2C;E9l+=x3C;var C9l=d2C;C9l+=s3C;C9l+=F3C;var D9l=V3C;D9l+=U3C;D9l+=A3C;D9l+=Q3C;var O9l=V3C;O9l+=S3C;O9l+=D2C;O9l+=k3C;var L9l=Y2C;L9l+=N3C;L9l+=L3C;L9l+=x3C;var N9l=O3C;N9l+=D3C;N9l+=C3C;var k9l=O3C;k9l+=E3C;var S9l=l3C;S9l+=K3C;var Q9l=r3C;Q9l+=k2C;Q9l+=A2C;var A9l=Y2C;A9l+=W3C;var U9l=Y2C;U9l+=u3C;U9l+=i3C;U9l+=h3C;var V9l=f3C;V9l+=B3C;V9l+=J3C;var F9l=d3C;F9l+=k2C;F9l+=D2C;F9l+=Z3C;var s9l=V3C;s9l+=G3C;s9l+=M3C;var x9l=d2C;x9l+=o3C;x9l+=T3C;var p6l=y3C;p6l+=j3C;var n6l=m3C;n6l+=q3C;var I6l=d2C;I6l+=c3C;I6l+=Q2C;var A2l=P3C;A2l+=w3C;A2l+=O2C;var U2l=Y3C;U2l+=D2C;U2l+=v3C;U2l+=O2C;var V2l=g3C;V2l+=a3C;var F2l=y7n.z7C;F2l+=t3C;F2l+=H3C;var s2l=x3C;s2l+=e3C;s2l+=b3C;s2l+=R3C;var x2l=X3C;x2l+=O2C;var p7l=z3C;p7l+=y7n.z7C;var n7l=I3C;n7l+=E2C;var I7l=c3C;I7l+=n3C;I7l+=D2C;var z7l=d2C;z7l+=p3C;z7l+=r3C;z7l+=x6C;var X7l=s6C;X7l+=k2C;X7l+=F6C;X7l+=Z3C;var R7l=V6C;R7l+=U6C;R7l+=r3C;R7l+=x6C;var b7l=A6C;b7l+=Q6C;var e7l=S6C;e7l+=k6C;e7l+=M3C;var H7l=S6C;H7l+=n3C;H7l+=N6C;var t7l=L6C;t7l+=v3C;var a7l=O6C;a7l+=D6C;a7l+=y7n.t7C;a7l+=C6C;var g7l=S6C;g7l+=y7n.X7C;g7l+=E6C;g7l+=l6C;var v7l=K6C;v7l+=r6C;v7l+=W6C;v7l+=u6C;var Y7l=i6C;Y7l+=h6C;Y7l+=f6C;Y7l+=B6C;var w7l=J6C;w7l+=d6C;w7l+=Z6C;var P7l=d2C;P7l+=G6C;var c7l=d2C;c7l+=D2C;c7l+=M6C;c7l+=o6C;var q7l=T6C;q7l+=k2C;var m7l=y6C;m7l+=j6C;var j7l=v3C;j7l+=m6C;var T7l=z3C;T7l+=Z3C;T7l+=r6C;T7l+=q6C;var S8J=c6C;S8J+=P6C;var H5J=w6C;H5J+=Y6C;H5J+=c3C;H5J+=v6C;var t5J=g6C;t5J+=D2C;var s5J=a6C;s5J+=t6C;var i0J=a6C;i0J+=H6C;i0J+=o2C;var r0J=g6C;r0J+=D2C;var U0J=t2C;U0J+=e6C;var V0J=M2C;V0J+=o2C;var a4J=a6C;a4J+=b6C;a4J+=R6C;a4J+=P6C;var v1J=X6C;v1J+=Z3C;v1J+=z6C;var Y1J=a6C;Y1J+=H6C;Y1J+=o2C;var j1J=z3C;j1J+=I6C;var M1J=n6C;M1J+=p6C;M1J+=x9C;var G1J=a6C;G1J+=s9C;G1J+=P6C;var D9J=t2C;D9J+=F9C;D9J+=D2C;D9J+=Z3C;var S9J=V9C;S9J+=y7n.t7C;S9J+=D2C;var x9J=U9C;x9J+=k2C;x9J+=r6C;x9J+=A9C;var p6J=g6C;p6J+=D2C;var a6J=Q9C;a6J+=D2C;var g6J=a6C;g6J+=b6C;g6J+=S9C;g6J+=D2C;var P6J=z3C;P6J+=k9C;P6J+=P6C;var T6J=g6C;T6J+=D2C;var B6J=N9C;B6J+=L9C;B6J+=O9C;B6J+=D9C;var o3J=C9C;o3J+=T2C;var u3J=a6C;u3J+=s9C;u3J+=P6C;var s2J=a6C;s2J+=E9C;s2J+=l9C;var g8Y=n3C;g8Y+=z3C;g8Y+=K9C;g8Y+=r9C;var m8Y=z3C;m8Y+=y7n.X7C;m8Y+=W9C;m8Y+=u9C;var j8Y=D2C;j8Y+=Z3C;j8Y+=Z3C;j8Y+=N2C;var Z8Y=i9C;Z8Y+=v3C;Z8Y+=h9C;Z8Y+=f9C;var d8Y=B9C;d8Y+=J9C;d8Y+=d9C;var f8Y=Z9C;f8Y+=G9C;f8Y+=M9C;f8Y+=f9C;var h8Y=o9C;h8Y+=y7n.a7C;h8Y+=T9C;h8Y+=y9C;var u8Y=j9C;u8Y+=m9C;u8Y+=q9C;var r8Y=c9C;r8Y+=P9C;r8Y+=w9C;r8Y+=f9C;var l8Y=E2C;l8Y+=Y9C;var Q8Y=v9C;Q8Y+=g9C;var A8Y=a9C;A8Y+=W9C;var F8Y=U9C;F8Y+=q6C;var b5Y=t9C;b5Y+=H9C;b5Y+=D2C;var e5Y=U9C;e5Y+=e9C;e5Y+=A9C;var a5Y=o6C;a5Y+=b9C;a5Y+=D2C;var j5Y=O2C;j5Y+=R9C;j5Y+=W9C;j5Y+=k2C;var M5Y=U9C;M5Y+=X9C;M5Y+=D2C;var L5Y=Z3C;L5Y+=z9C;L5Y+=I9C;var N5Y=a6C;N5Y+=s9C;N5Y+=P6C;var p0Y=n9C;p0Y+=D2C;p0Y+=Z3C;var n0Y=z3C;n0Y+=I6C;var P0Y=p9C;P0Y+=D2C;P0Y+=A2C;var c0Y=z3C;c0Y+=x1C;c0Y+=s1C;c0Y+=P6C;var j0Y=U9C;j0Y+=e9C;j0Y+=k2C;j0Y+=o2C;var y0Y=r6C;y0Y+=A2C;var T0Y=a6C;T0Y+=b6C;T0Y+=A9C;var o0Y=M2C;o0Y+=o2C;var d0Y=F1C;d0Y+=W2C;var J0Y=z3C;J0Y+=x1C;J0Y+=l9C;var E0Y=M2C;E0Y+=o2C;var A0Y=y7n.z7C;A0Y+=r6C;A0Y+=y7n.a7C;A0Y+=D2C;var U0Y=M2C;U0Y+=o2C;var x0Y=V1C;x0Y+=y7n.X7C;x0Y+=U1C;var O4Y=a6C;O4Y+=t6C;var S4Y=A1C;S4Y+=Z3C;var Q4Y=a6C;Q4Y+=t6C;var V4Y=W9C;V4Y+=y7n.a7C;V4Y+=O2C;var n1Y=Q1C;n1Y+=D2C;n1Y+=k2C;var I1Y=a6C;I1Y+=E9C;I1Y+=E9C;I1Y+=o2C;var X1Y=i9C;X1Y+=D2C;X1Y+=S1C;var b1Y=i9C;b1Y+=D2C;b1Y+=v3C;b1Y+=y7n.a7C;var e1Y=z3C;e1Y+=x1C;e1Y+=E9C;e1Y+=o2C;var a1Y=D2C;a1Y+=k1C;a1Y+=N2C;var g1Y=U9C;g1Y+=N1C;g1Y+=M3C;g1Y+=P6C;var T1Y=L1C;T1Y+=z3C;T1Y+=v3C;T1Y+=O1C;var G1Y=y7n.a7C;G1Y+=W9C;G1Y+=D1C;G1Y+=C1C;var W1Y=E1C;W1Y+=A9C;var q9Y=l1C;q9Y+=K1C;q9Y+=r1C;q9Y+=k2C;var D9Y=y7n.t7C;D9Y+=Z3C;D9Y+=D2C;D9Y+=W1C;var O9Y=z3C;O9Y+=Z3C;O9Y+=H6C;O9Y+=o2C;var N9Y=u1C;N9Y+=i1C;var k9Y=g6C;k9Y+=D2C;var z6Y=u1C;z6Y+=D2C;z6Y+=D6C;var X6Y=z3C;X6Y+=x1C;X6Y+=l9C;var z3Y=M2C;z3Y+=o2C;var s3Y=g6C;s3Y+=D2C;var e2Y=y7n.X7C;e2Y+=h1C;e2Y+=y7n.X7C;e2Y+=T2C;var H2Y=z3C;H2Y+=Z3C;H2Y+=H6C;H2Y+=o2C;var r2Y=y7n.X7C;r2Y+=y7n.a7C;r2Y+=y7n.a7C;var H4t=L1C;H4t+=f1C;H4t+=C1C;var t4t=y7n.X7C;t4t+=v3C;t4t+=v3C;var a4t=r3C;a4t+=B1C;a4t+=Z3C;var g4t=J1C;g4t+=d1C;g4t+=O2C;var v4t=Z1C;v4t+=G1C;var Y4t=X3C;Y4t+=O2C;var w4t=L1C;w4t+=M1C;w4t+=o1C;w4t+=T1C;var P4t=y7n.z7C;P4t+=t3C;P4t+=v3C;P4t+=O2C;var c4t=y1C;c4t+=v3C;c4t+=O2C;var q4t=y7n.z7C;q4t+=j1C;q4t+=T9C;q4t+=O2C;var m4t=m1C;m4t+=y7n.a7C;var j4t=o6C;j4t+=C2C;var y4t=W2C;y4t+=q1C;y4t+=k2C;y4t+=O2C;var T4t=Z1C;T4t+=W2C;T4t+=v3C;T4t+=O2C;var o4t=c1C;o4t+=P1C;var u3t=Q2C;u3t+=w1C;var K3t=V2C;K3t+=u9C;K3t+=Y1C;var l3t=y7n.H7C;l3t+=A2C;'use strict';y7n.x3t=function(p2t){if(y7n)return y7n.e8(p2t);};(function(){var Q4C="e a license ";var O4C="DataTables Ed";var L4C="c3";var n1C="caca";var C4C="trial info - ";var e1C="5";var E4C=' day';var o7C=99;var U4C="Your trial has now expired.";var k4C='Editor - Trial expired';var H1C="etTi";var g1C="2";var v1C="c1";var t1C="9";var F4C="//editor.datatables.net/purchase";var Y7C=1561939200;var R1C="ceil";var I1C="getTime";var V4C="9d8";var A4C=" To purchas";var D4C="itor";var s4C="https:";var b1C="25";var z1C=9448917612;var P7C=1000;var X1C="e623";var p1C="for Editor";var S4C='Thank you for trying DataTables Editor\n\n';var a1C="92";var E7C=17;var x4C=", please see ";var N4C="emainin";var L3t=y7n.a7C;L3t+=v1C;L3t+=g1C;var Q3t=a1C;Q3t+=t1C;Q3t+=g1C;var A3t=Q1C;A3t+=H1C;A3t+=y7n.z7C;A3t+=D2C;var U3t=t1C;U3t+=e1C;U3t+=b1C;y7n.P2t=function(c2t){if(y7n&&c2t)return y7n.x7t(c2t);};y7n.M2t=function(G2t){if(y7n&&G2t)return y7n.e8(G2t);};y7n.i2t=function(u2t){if(y7n&&u2t)return y7n.x7t(u2t);};y7n.D2t=function(O2t){if(y7n)return y7n.e8(O2t);};var remaining=Math[R1C]((new Date((y7n.z7t(X1C)?Y7C:z1C)*P7C)[y7n.U2t(U3t)?I1C:y7n.e7C]()-new Date()[A3t]())/(P7C*M7C*(y7n.D2t(n1C)?o7C:M7C)*(y7n.i2t(Q3t)?E7C:r7C)));y7n[y7n.p7C]();if(remaining<=x7C){var N3t=p1C;N3t+=x4C;N3t+=s4C;N3t+=F4C;var k3t=t1C;k3t+=V4C;var S3t=U4C;S3t+=A4C;S3t+=Q4C;alert(S4C+S3t+(y7n.M2t(k3t)?N3t:y7n.e7C));throw k4C;}else if(remaining<=(y7n.P2t(L3t)?U7C:Q7C)){var E3t=W6C;E3t+=Z3C;E3t+=N4C;E3t+=Q1C;var C3t=L4C;C3t+=t1C;C3t+=y7n.g7C;var D3t=O4C;D3t+=D4C;D3t+=W6C;D3t+=C4C;var O3t=v3C;O3t+=r6C;O3t+=Q1C;console[O3t](D3t+remaining+(y7n.e2t(C3t)?y7n.e7C:E4C)+(remaining===s7C?l4C:K4C)+E3t);}}());var DataTable=$[y7n.x3t(r4C)?l3t:y7n.e7C][W4C];y7n[y7n.p7C]();if(!DataTable||!DataTable[K3t]||!DataTable[u4C](i4C)){throw h4C;}var Editor=function(opts){var Z4C="DataTables Editor must be initialised as a ";var G4C="'new' instance'";var J4C="ctor";var f4C="_const";var B4C="ru";var W3t=f4C;W3t+=B4C;W3t+=J4C;y7n[d4C]();if(!(this instanceof Editor)){var r3t=Z4C;r3t+=G4C;alert(r3t);}this[W3t](opts);};DataTable[M4C]=Editor;$[o4C][T4C][u3t]=Editor;var _editor_el=function(dis,ctx){var m4C="*[data-";var c4C="e-e=";var f3t=y4C;f3t+=j4C;var h3t=m4C;h3t+=q4C;h3t+=c4C;h3t+=y4C;var i3t=y7n.X7C;i3t+=y7n.g7C;y7n[i3t]();if(ctx===undefined){ctx=document;}return $(h3t+dis+f3t,ctx);};var __inlineCounter=x7C;var _pluck=function(a,prop){y7n[d4C]();var out=[];$[P4C](a,function(idx,el){var B3t=y7n.X7C;B3t+=y7n.g7C;y7n[B3t]();out[w4C](el[prop]);});return out;};var _api_file=function(name,id){var g4C=' in table ';var v4C='Unknown file id ';var table=this[Y4C](name);var file=table[id];if(!file){throw v4C+id+g4C+name;}return table[id];};var _api_files=function(name){var t4C='Unknown file table name: ';var d3t=y7n.H7C;d3t+=a4C;d3t+=D2C;d3t+=O2C;if(!name){var J3t=y7n.H7C;J3t+=W9C;J3t+=M6C;J3t+=O2C;return Editor[J3t];}var table=Editor[d3t][name];if(!table){throw t4C+name;}return table;};var _objectKeys=function(o){var H4C="hasOwnProperty";var Z3t=y7n.v7C;Z3t+=y7n.g7C;var out=[];for(var key in o){if(o[H4C](key)){out[w4C](key);}}y7n[Z3t]();return out;};var _deepCompare=function(o1,o2){var R4C="obj";var T3t=e4C;T3t+=b4C;var o3t=e4C;o3t+=b4C;var M3t=v3C;M3t+=r1C;M3t+=Q1C;M3t+=b4C;var G3t=R4C;G3t+=D2C;G3t+=y7n.t7C;G3t+=k2C;if(typeof o1!==y7n.F2C||typeof o2!==G3t){return o1==o2;}var o1Props=_objectKeys(o1);var o2Props=_objectKeys(o2);if(o1Props[M3t]!==o2Props[o3t]){return X4C;}for(var i=x7C,ien=o1Props[T3t];i<ien;i++){var y3t=R4C;y3t+=z4C;var propName=o1Props[i];if(typeof o1[propName]===y3t){if(!_deepCompare(o1[propName],o2[propName])){return X4C;}}else if(o1[propName]!=o2[propName]){return X4C;}}return I4C;};Editor[U3C]=function(opts,classes,host){var s0C="msg-la";var k0C="ntrol";var b0C="utCo";var B0C="<div data-dte-e=";var D0C="div>";var h0C="msg";var r8C='msg-error';var n5C='<span data-dte-e="multi-info" class="';var M0C="msg-m";var S5C="<div data-dte-e=\"";var K0C="ing\" class=\"";var A5C="-la";var R0C="ntr";var R5C='" for="';var l0C="process";var u8C='multi-value';var F8C="restore";var N8C="t-control";var W8C='msg-message';var E8C="none";var h5C="tO";var k5C="ms";var j5C="Error adding fie";var E0C="dte-e=\"field-";var p4C="ick";var F5C="</l";var Z5C="dTypes";var s8C="multiRestore";var G5C="tin";var J5C="romData";var N5C="g-label\" class=\"";var D5C="<label data-dte-e=\"";var r5C="ypePrefix";var p0C="<div d";var e5C="className";var s5C="-dte-e=\"input\" cl";var C0C="<div data-";var I0C="control\" c";var T8C="multiReturn";var U5C="belInfo";var x8C='<div data-dte-e="msg-multi" class="';var f8C='field-processing';var P0C="data-dte-e=\"msg-error\" cl";var S0C="ut-co";var v0C="/spa";var z0C="<div data-dte-e=\"input-";var n0C="lass=\"";var e0C="a-dte-e=\"multi-value\" class=\"";var h8C='multi-info';var q0C="msg-";var w5C='DTE_Field_';var V0C="msg-i";var m5C="ld - unknown field type ";var J0C="\"msg-info\" cl";var t0C="Value";var Y5C="dataProp";var V5C="abel>";var K5C="namePrefi";var i8C='msg-multi';var i5C="_fnSe";var y0C="\"><";var V8C="fieldInfo";var T0C="dte-e=\"msg-message\" class=\"";var Z0C="/di";var X6t=k2C;X6t+=M3C;X6t+=z3C;X6t+=D2C;var R6t=D2C;R6t+=n4C;R6t+=C6C;var H6t=r6C;H6t+=A2C;var t6t=y7n.a7C;t6t+=r6C;t6t+=y7n.z7C;var Y6t=y7n.t7C;Y6t+=v3C;Y6t+=p4C;var w6t=r6C;w6t+=A2C;var P6t=x0C;P6t+=k2C;P6t+=W9C;var c6t=s0C;c6t+=F0C;c6t+=v3C;var q6t=V0C;q6t+=U0C;q6t+=r6C;var m6t=A0C;m6t+=r3C;m6t+=D2C;m6t+=v3C;var j6t=Q0C;j6t+=S0C;j6t+=k0C;var y6t=N0C;y6t+=k2C;y6t+=r1C;y6t+=y7n.a7C;var M6t=y7n.t7C;M6t+=Z3C;M6t+=L0C;var G6t=O0C;G6t+=D0C;var Z6t=C0C;Z6t+=E0C;Z6t+=l0C;Z6t+=K0C;var d6t=r0C;d6t+=W0C;d6t+=u0C;d6t+=i0C;var J6t=r0C;J6t+=W0C;J6t+=u0C;J6t+=i0C;var B6t=h0C;B6t+=f0C;B6t+=W9C;B6t+=h3C;var f6t=B0C;f6t+=J0C;f6t+=d0C;var h6t=r0C;h6t+=Z0C;h6t+=G0C;h6t+=i0C;var i6t=V1C;i6t+=Q3C;var u6t=M0C;u6t+=o0C;u6t+=Q3C;var W6t=C0C;W6t+=T0C;var r6t=y0C;r6t+=j0C;r6t+=W9C;r6t+=m0C;var K6t=q0C;K6t+=x6C;K6t+=j9C;K6t+=Z3C;var l6t=c0C;l6t+=P0C;l6t+=w0C;l6t+=Y0C;var E6t=r0C;E6t+=v0C;E6t+=g0C;var C6t=D9C;C6t+=x3C;var D6t=t9C;D6t+=H9C;D6t+=D2C;var O6t=y4C;O6t+=i0C;var L6t=a0C;L6t+=t0C;var N6t=H0C;N6t+=e0C;var k6t=Q0C;k6t+=b0C;k6t+=R0C;k6t+=X0C;var S6t=z0C;S6t+=I0C;S6t+=n0C;var Q6t=p0C;Q6t+=x5C;Q6t+=s5C;Q6t+=d0C;var A6t=F5C;A6t+=V5C;var U6t=A0C;U6t+=U5C;var V6t=h0C;V6t+=A5C;V6t+=Q5C;var F6t=S5C;F6t+=k5C;F6t+=N5C;var s6t=y4C;s6t+=i0C;var x6t=L5C;x6t+=O5C;var p3t=D5C;p3t+=C5C;p3t+=y4C;p3t+=E5C;var n3t=A2C;n3t+=l5C;n3t+=D2C;var I3t=K5C;I3t+=T2C;var z3t=R6C;z3t+=z3C;z3t+=D2C;var X3t=k2C;X3t+=r5C;var R3t=W5C;R3t+=z3C;R3t+=z3C;R3t+=x6C;var b3t=c0C;b3t+=u5C;var e3t=i5C;e3t+=h5C;e3t+=f5C;var H3t=G0C;H3t+=B5C;H3t+=c1C;H3t+=J5C;var t3t=d5C;t3t+=z3C;t3t+=W9C;var a3t=D2C;a3t+=T2C;a3t+=k2C;var g3t=y7n.a7C;g3t+=x5C;var Y3t=k2C;Y3t+=M3C;Y3t+=P6C;var w3t=i9C;w3t+=T9C;w3t+=Z5C;var P3t=w2C;P3t+=k2C;P3t+=G5C;P3t+=M5C;var c3t=S3C;c3t+=T9C;c3t+=y7n.a7C;var j3t=y7n.H7C;j3t+=W9C;j3t+=T9C;j3t+=Z5C;var that=this;var multiI18n=host[o5C][a0C];y7n[y7n.p7C]();opts=$[T5C](I4C,{},Editor[U3C][y5C],opts);if(!Editor[j3t][opts[A9C]]){var q3t=R6C;q3t+=z3C;q3t+=D2C;var m3t=j5C;m3t+=m5C;throw m3t+opts[q3t];}this[O2C]=$[T5C]({},Editor[c3t][P3t],{type:Editor[w3t][opts[Y3t]],name:opts[q5C],classes:classes,host:host,opts:opts,multiValue:X4C});if(!opts[c5C]){var v3t=P5C;v3t+=D2C;opts[c5C]=w5C+opts[v3t];}if(opts[Y5C]){opts[v5C]=opts[Y5C];}if(opts[g3t]===l4C){opts[v5C]=opts[q5C];}var dtPrivateApi=DataTable[a3t][t3t];this[H3t]=function(d){var g5C="_fnGetObjectDataFn";var a5C='editor';return dtPrivateApi[g5C](opts[v5C])(d,a5C);};this[t5C]=dtPrivateApi[e3t](opts[v5C]);var template=$(b3t+classes[R3t]+H5C+classes[X3t]+opts[z3t]+H5C+classes[I3t]+opts[n3t]+H5C+opts[e5C]+b5C+p3t+classes[C5C]+R5C+Editor[x6t](opts[c5C])+s6t+opts[C5C]+F6t+classes[V6t]+b5C+opts[U6t]+X5C+A6t+Q6t+classes[z5C]+b5C+S6t+classes[k6t]+I5C+N6t+classes[L6t]+O6t+multiI18n[D6t]+n5C+classes[p5C]+b5C+multiI18n[C6t]+E6t+X5C+x8C+classes[s8C]+b5C+multiI18n[F8C]+X5C+l6t+classes[K6t]+r6t+W6t+classes[u6t]+b5C+opts[i6t]+h6t+f6t+classes[B6t]+b5C+opts[V8C]+J6t+d6t+Z6t+classes[U8C]+A8C+G6t);var input=this[Q8C](M6t,opts);if(input!==S8C){var o6t=W9C;o6t+=k8C;o6t+=N8C;_editor_el(o6t,template)[L8C](input);}else{var T6t=S2C;T6t+=O8C;T6t+=D8C;template[C8C](T6t,E8C);}this[l8C]=$[y6t](I4C,{},Editor[U3C][K8C][l8C],{container:template,inputControl:_editor_el(j6t,template),label:_editor_el(m6t,template),fieldInfo:_editor_el(q6t,template),labelInfo:_editor_el(c6t,template),fieldError:_editor_el(r8C,template),fieldMessage:_editor_el(W8C,template),multi:_editor_el(u8C,template),multiReturn:_editor_el(i8C,template),multiInfo:_editor_el(h8C,template),processing:_editor_el(f8C,template)});this[l8C][P6t][w6t](Y6t,function(){var v6t=R6C;v6t+=P6C;if(that[O2C][B8C][J8C]&&!template[d8C](classes[Z8C])&&opts[v6t]!==G8C){var a6t=M8C;a6t+=o8C;var g6t=G0C;g6t+=y7n.X7C;g6t+=v3C;that[g6t](l4C);that[a6t]();}});this[t6t][T8C][H6t](y8C,function(){var j8C="ltiRestore";var b6t=I2C;b6t+=j8C;var e6t=y7n.v7C;e6t+=y7n.g7C;y7n[e6t]();that[b6t]();});$[R6t](this[O2C][X6t],function(name,fn){if(typeof fn===y7n.s2C&&that[name]===undefined){that[name]=function(){var p6t=m8C;p6t+=C6C;p6t+=q8C;var n6t=y7n.t7C;n6t+=y7n.X7C;n6t+=v3C;n6t+=v3C;var I6t=c8C;I6t+=W9C;I6t+=B9C;var z6t=y7n.v7C;z6t+=y7n.g7C;y7n[z6t]();var args=Array[P8C][I6t][n6t](arguments);args[p6t](name);var ret=that[Q8C][w8C](that,args);return ret===undefined?that:ret;};}});};Editor[U3C][P8C]={def:function(set){var Y8C="functio";var v8C='default';var opts=this[O2C][B8C];y7n[d4C]();if(set===undefined){var s9t=Y8C;s9t+=A2C;var x9t=y7n.a7C;x9t+=D2C;x9t+=y7n.H7C;var def=opts[v8C]!==undefined?opts[v8C]:opts[x9t];return typeof def===s9t?def():def;}opts[g8C]=set;return this;},disable:function(){var V9t=y7n.a7C;V9t+=W9C;V9t+=O2C;V9t+=v6C;var F9t=y7n.t7C;F9t+=a8C;F9t+=t8C;y7n[y7n.p7C]();this[l8C][F9t][H8C](this[O2C][e8C][Z8C]);this[Q8C](V9t);return this;},displayed:function(){var O9t=A2C;O9t+=b8C;var L9t=y7n.a7C;L9t+=R8C;var N9t=y7n.t7C;N9t+=O2C;N9t+=O2C;var k9t=e4C;k9t+=b4C;var S9t=X8C;S9t+=y7n.a7C;S9t+=M3C;var Q9t=z3C;Q9t+=y7n.X7C;Q9t+=z8C;Q9t+=I8C;var A9t=n8C;A9t+=t8C;var U9t=y7n.X7C;U9t+=y7n.g7C;y7n[U9t]();var container=this[l8C][A9t];return container[Q9t](S9t)[k9t]&&container[N9t](L9t)!=O9t?I4C:X4C;},enable:function(){var U7X='enable';var E9t=p8C;E9t+=o2C;E9t+=c1C;E9t+=A2C;var C9t=X2C;C9t+=z2C;var D9t=y7n.t7C;D9t+=x7X;D9t+=O2C;D9t+=s7X;this[l8C][F7X][V7X](this[O2C][D9t][C9t]);this[E9t](U7X);y7n[y7n.p7C]();return this;},enabled:function(){var N7X="containe";var W9t=A7X;W9t+=Q7X;var r9t=S7X;r9t+=k7X;var K9t=N7X;K9t+=Z3C;var l9t=y7n.a7C;l9t+=r6C;l9t+=y7n.z7C;return this[l9t][K9t][r9t](this[O2C][W9t][Z8C])===X4C;},error:function(msg,fn){var L7X="typeFn";var r7X="ntaine";var l7X="oveC";var u7X='errorMessage';var J9t=t2C;J9t+=L7X;var classes=this[O2C][e8C];if(msg){var i9t=O7X;i9t+=D7X;var u9t=y7n.a7C;u9t+=r6C;u9t+=y7n.z7C;this[u9t][i9t][H8C](classes[C7X]);}else{var B9t=E7X;B9t+=l7X;B9t+=K7X;var f9t=y7n.t7C;f9t+=r6C;f9t+=r7X;f9t+=Z3C;var h9t=y7n.a7C;h9t+=W7X;this[h9t][f9t][B9t](classes[C7X]);}this[J9t](u7X,msg);return this[i7X](this[l8C][h7X],msg,fn);},fieldInfo:function(msg){var B7X="dInf";var Z9t=y7n.H7C;Z9t+=f7X;Z9t+=B7X;Z9t+=r6C;var d9t=y7n.a7C;d9t+=r6C;d9t+=y7n.z7C;return this[i7X](this[d9t][Z9t],msg);},isMultiValue:function(){y7n[y7n.p7C]();return this[O2C][J7X]&&this[O2C][d7X][Z7X]!==s7C;},inError:function(){var M9t=G7X;M9t+=D2C;M9t+=O2C;var G9t=y7n.a7C;G9t+=r6C;G9t+=y7n.z7C;y7n[y7n.p7C]();return this[G9t][F7X][d8C](this[O2C][M9t][C7X]);},input:function(){var o9t=n8C;o9t+=t8C;return this[O2C][A9C][z5C]?this[Q8C](M7X):$(o7X,this[l8C][o9t]);},focus:function(){var T7X="cu";var y7X="peFn";var j9t=x3C;j9t+=T7X;j9t+=O2C;var y9t=k2C;y9t+=M3C;y9t+=z3C;y9t+=D2C;var T9t=y7n.v7C;T9t+=y7n.g7C;y7n[T9t]();if(this[O2C][y9t][j9t]){var m9t=p8C;m9t+=M3C;m9t+=y7X;this[m9t](j7X);}else{var P9t=y7n.H7C;P9t+=r6C;P9t+=m7X;var c9t=y7n.t7C;c9t+=a8C;c9t+=q7X;c9t+=c7X;var q9t=y7n.a7C;q9t+=W7X;$(o7X,this[q9t][c9t])[P9t]();}return this;},get:function(){var P7X="_typeF";var Y7X='get';var w9t=P7X;w9t+=A2C;if(this[w7X]()){return undefined;}var val=this[w9t](Y7X);return val!==undefined?val:this[g8C]();},hide:function(animate){var H7X="slideUp";var g9t=S2C;g9t+=O2C;g9t+=v7X;var v9t=g7X;v9t+=a7X;var Y9t=y7n.a7C;Y9t+=r6C;Y9t+=y7n.z7C;var el=this[Y9t][v9t];if(animate===undefined){animate=I4C;}if(this[O2C][t7X][g9t]()&&animate&&$[o4C][H7X]){el[H7X]();}else{var H9t=A2C;H9t+=b8C;var t9t=y7n.a7C;t9t+=R8C;var a9t=e7X;a9t+=O2C;el[a9t](t9t,H9t);}return this;},label:function(str){var b7X="lInfo";var b9t=v3C;b9t+=y7n.X7C;b9t+=F0C;b9t+=b7X;var e9t=y7n.a7C;e9t+=W7X;y7n[y7n.p7C]();var label=this[e9t][C5C];var labelInfo=this[l8C][b9t][R7X]();if(str===undefined){return label[X7X]();}label[X7X](str);label[z7X](labelInfo);return this;},labelInfo:function(msg){var I7X="labelInfo";return this[i7X](this[l8C][I7X],msg);},message:function(msg,fn){var n7X="fieldMessage";var R9t=t2C;R9t+=y7n.z7C;R9t+=O2C;R9t+=Q1C;y7n[d4C]();return this[R9t](this[l8C][n7X],msg,fn);},multiGet:function(id){var p7X="tiVa";var z9t=y7n.X7C;z9t+=y7n.g7C;var X9t=x0C;X9t+=p7X;X9t+=x2X;X9t+=O2C;var value;var multiValues=this[O2C][X9t];var multiIds=this[O2C][d7X];y7n[z9t]();var isMultiValue=this[w7X]();if(id===undefined){var I9t=s2X;I9t+=C6C;var fieldVal=this[F2X]();value={};for(var i=x7C;i<multiIds[I9t];i++){value[multiIds[i]]=isMultiValue?multiValues[multiIds[i]]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else{var n9t=G0C;n9t+=y7n.X7C;n9t+=v3C;value=this[n9t]();}return value;},multiRestore:function(){var p9t=y7n.X7C;p9t+=y7n.g7C;this[O2C][J7X]=I4C;y7n[p9t]();this[V2X]();},multiSet:function(id,val){var N2X="Ids";var A2X="iVa";var S2X="Plain";var Q1t=U2X;Q1t+=A2X;Q1t+=B1C;Q1t+=D2C;var U1t=Q2X;U1t+=S2X;U1t+=k2X;var s1t=y7n.X7C;s1t+=y7n.g7C;var x1t=U2X;x1t+=W9C;x1t+=N2X;var multiValues=this[O2C][L2X];var multiIds=this[O2C][x1t];if(val===undefined){val=id;id=undefined;}y7n[s1t]();var set=function(idSrc,val){var F1t=O2X;F1t+=C1C;if($[F1t](multiIds)===-s7C){var V1t=z3C;V1t+=o8C;V1t+=C6C;multiIds[V1t](idSrc);}multiValues[idSrc]=val;};if($[U1t](val)&&id===undefined){$[P4C](val,function(idSrc,innerVal){var A1t=y7n.X7C;A1t+=y7n.g7C;y7n[A1t]();set(idSrc,innerVal);});}else if(id===undefined){$[P4C](multiIds,function(i,idSrc){set(idSrc,val);});}else{set(id,val);}this[O2C][Q1t]=I4C;this[V2X]();return this;},name:function(){var k1t=A2C;k1t+=l5C;k1t+=D2C;var S1t=y7n.X7C;S1t+=y7n.g7C;y7n[S1t]();return this[O2C][B8C][k1t];},node:function(){var N1t=y7n.a7C;N1t+=r6C;N1t+=y7n.z7C;y7n[y7n.p7C]();return this[N1t][F7X][x7C];},processing:function(set){var C1t=A2C;C1t+=r6C;C1t+=N6C;var D1t=r3C;D1t+=K9C;D1t+=D2X;var O1t=S2C;O1t+=O2C;O1t+=f1C;O1t+=C1C;var L1t=U9C;L1t+=C2X;this[l8C][L1t][C8C](O1t,set?D1t:C1t);return this;},set:function(val,multiCheck){var m2X="iV";var q2X="Check";var r2X="tiV";var j2X="_mult";var l2X="ntityD";var u1t=O2C;u1t+=E2X;var r1t=D2C;r1t+=l2X;r1t+=K2X;r1t+=t3C;var K1t=x0C;K1t+=r2X;K1t+=W2X;var decodeFn=function(d){var G2X='\'';var M2X='\n';var Z2X='"';var J2X='<';var i2X="eplace";var u2X="replac";var f2X='>';var l1t=u2X;l1t+=D2C;var E1t=Z3C;E1t+=i2X;return typeof d!==h2X?d:d[E1t](/&gt;/g,f2X)[B2X](/&lt;/g,J2X)[B2X](/&amp;/g,d2X)[B2X](/&quot;/g,Z2X)[l1t](/&#39;/g,G2X)[B2X](/&#10;/g,M2X);};this[O2C][K1t]=X4C;y7n[d4C]();var decode=this[O2C][B8C][r1t];if(decode===undefined||decode===I4C){if($[o2X](val)){var W1t=T2X;W1t+=y2X;W1t+=C6C;for(var i=x7C,ien=val[W1t];i<ien;i++){val[i]=decodeFn(val[i]);}}else{val=decodeFn(val);}}this[Q8C](u1t,val);if(multiCheck===undefined||multiCheck===I4C){var i1t=j2X;i1t+=m2X;i1t+=W2X;i1t+=q2X;this[i1t]();}return this;},show:function(animate){var Y2X="ideD";var c2X="slideDow";var Z1t=c2X;Z1t+=A2C;var d1t=y7n.H7C;d1t+=A2C;var J1t=P2X;J1t+=D8C;var B1t=C6C;B1t+=r6C;B1t+=O2C;B1t+=k2C;var f1t=n8C;f1t+=w2X;f1t+=a7X;var h1t=y7n.a7C;h1t+=r6C;h1t+=y7n.z7C;var el=this[h1t][f1t];if(animate===undefined){animate=I4C;}if(this[O2C][B1t][J1t]()&&animate&&$[d1t][Z1t]){var G1t=c8C;G1t+=Y2X;G1t+=r6C;G1t+=v2X;el[G1t]();}else{var M1t=y7n.a7C;M1t+=W9C;M1t+=O2C;M1t+=v7X;el[C8C](M1t,l4C);}return this;},val:function(val){var o1t=Q1C;o1t+=D2C;o1t+=k2C;y7n[d4C]();return val===undefined?this[o1t]():this[g2X](val);},compare:function(value,original){var a2X="compare";var compare=this[O2C][B8C][a2X]||_deepCompare;return compare(value,original);},dataSrc:function(){var y1t=r6C;y1t+=t2X;var T1t=y7n.v7C;T1t+=y7n.g7C;y7n[T1t]();return this[O2C][y1t][v5C];},destroy:function(){var e2X='destroy';this[l8C][F7X][H2X]();this[Q8C](e2X);return this;},multiEditable:function(){var b2X="multiE";var R2X="ditable";var j1t=b2X;j1t+=R2X;return this[O2C][B8C][j1t];},multiIds:function(){return this[O2C][d7X];},multiInfoShown:function(show){var z2X="multiI";var Y1t=A2C;Y1t+=r6C;Y1t+=A2C;Y1t+=D2C;var w1t=X2X;w1t+=r6C;w1t+=D2X;var P1t=y7n.t7C;P1t+=O2C;P1t+=O2C;var c1t=z2X;c1t+=U0C;c1t+=r6C;var q1t=y7n.a7C;q1t+=r6C;q1t+=y7n.z7C;var m1t=y7n.v7C;m1t+=y7n.g7C;y7n[m1t]();this[q1t][c1t][P1t]({display:show?w1t:Y1t});},multiReset:function(){var p2X="iIds";var n2X="iValu";var g1t=y7n.z7C;g1t+=I2X;g1t+=n2X;g1t+=s7X;var v1t=U2X;v1t+=p2X;this[O2C][v1t]=[];this[O2C][g1t]={};},submittable:function(){var t1t=x3X;t1t+=s3X;t1t+=k2C;var a1t=y7n.v7C;a1t+=y7n.g7C;y7n[a1t]();return this[O2C][B8C][t1t];},valFromData:S8C,valToData:S8C,_errorNode:function(){y7n[y7n.p7C]();return this[l8C][h7X];},_msg:function(el,msg,fn){var O3X="slideDown";var k3X=":visible";var D3X="slid";var C3X="eUp";var F3X="unc";var p1t=y7n.v7C;p1t+=y7n.g7C;var R1t=y7n.H7C;R1t+=A2C;var e1t=y7n.H7C;e1t+=F3X;e1t+=V3X;if(msg===undefined){var H1t=C6C;H1t+=k2C;H1t+=U3X;return el[H1t]();}if(typeof msg===e1t){var b1t=A3X;b1t+=z3C;b1t+=W9C;var editor=this[O2C][t7X];msg=msg(editor,new DataTable[b1t](editor[O2C][Q3X]));}if(el[S3X]()[Q2X](k3X)&&$[R1t][N3X]){var X1t=L3X;X1t+=y7n.z7C;X1t+=v3C;el[X1t](msg);if(msg){el[O3X](fn);}else{var z1t=D3X;z1t+=C3X;el[z1t](fn);}}else{var n1t=A2C;n1t+=a8C;n1t+=D2C;var I1t=y7n.t7C;I1t+=O2C;I1t+=O2C;el[X7X](msg||l4C)[I1t](E3X,msg?l3X:n1t);if(fn){fn();}}y7n[p1t]();return this;},_multiValueCheck:function(){var J3X="iEdita";var B3X="urn";var K3X="_multiI";var f3X="Ret";var W3X="ogg";var G3X="iVal";var u3X="leCla";var h3X="ulti";var q3X="multiNoEdit";var y3X="inputControl";var B4t=K3X;B4t+=h3C;var f4t=r3X;f4t+=O2C;var h4t=k2C;h4t+=W3X;h4t+=u3X;h4t+=i3X;var i4t=y7n.a7C;i4t+=r6C;i4t+=y7n.z7C;var u4t=F1C;u4t+=O6C;u4t+=h3X;var W4t=L3X;W4t+=y7n.z7C;W4t+=v3C;var r4t=I2C;r4t+=v3C;r4t+=k2C;r4t+=W9C;var K4t=y7n.X7C;K4t+=y7n.g7C;var l4t=F1C;l4t+=A2C;l4t+=D2C;var E4t=s2X;E4t+=C6C;var C4t=a0C;C4t+=f3X;C4t+=B3X;var D4t=y7n.a7C;D4t+=r6C;D4t+=y7n.z7C;var F4t=y7n.z7C;F4t+=I2X;F4t+=J3X;F4t+=d3X;var s4t=r6C;s4t+=z3C;s4t+=I8C;var x4t=I2C;x4t+=Z3X;x4t+=G3X;x4t+=M3X;var last;var ids=this[O2C][d7X];var values=this[O2C][L2X];var isMultiValue=this[O2C][x4t];var isMultiEditable=this[O2C][s4t][F4t];var val;var different=X4C;if(ids){for(var i=x7C;i<ids[Z7X];i++){val=values[ids[i]];if(i>x7C&&!_deepCompare(val,last)){different=I4C;break;}last=val;}}if(different&&isMultiValue||!isMultiEditable&&this[w7X]()){var Q4t=X2X;Q4t+=r6C;Q4t+=y7n.t7C;Q4t+=o3X;var A4t=y7n.z7C;A4t+=n3C;A4t+=Z3X;A4t+=W9C;var U4t=T3X;U4t+=y7n.z7C;var V4t=y7n.t7C;V4t+=O2C;V4t+=O2C;this[l8C][y3X][V4t]({display:j3X});this[U4t][A4t][C8C]({display:Q4t});}else{var O4t=A2C;O4t+=r6C;O4t+=N6C;var L4t=y7n.t7C;L4t+=O2C;L4t+=O2C;var N4t=y7n.a7C;N4t+=r6C;N4t+=y7n.z7C;var k4t=e7X;k4t+=O2C;var S4t=y7n.a7C;S4t+=W7X;this[S4t][y3X][k4t]({display:l3X});this[N4t][a0C][L4t]({display:O4t});if(isMultiValue&&!different){this[g2X](last,X4C);}}this[D4t][C4t][C8C]({display:ids&&ids[E4t]>s7C&&different&&!isMultiValue?l3X:l4t});y7n[K4t]();var i18n=this[O2C][t7X][o5C][r4t];this[l8C][p5C][W4t](isMultiEditable?i18n[m3X]:i18n[u4t]);this[i4t][a0C][h4t](this[O2C][f4t][q3X],!isMultiEditable);this[O2C][t7X][B4t]();return I4C;},_typeFn:function(name){var G4t=k2C;G4t+=M3C;G4t+=P6C;var Z4t=n3C;Z4t+=A2C;Z4t+=c3X;var d4t=y7n.t7C;d4t+=y7n.X7C;d4t+=P3X;var J4t=a6C;J4t+=E9C;J4t+=s1C;J4t+=P6C;var args=Array[J4t][w3X][d4t](arguments);args[c3X]();args[Z4t](this[O2C][B8C]);var fn=this[O2C][G4t][name];if(fn){var M4t=Y3X;M4t+=z3C;M4t+=v3C;M4t+=M3C;return fn[M4t](this[O2C][t7X],args);}}};Editor[o4t][T4t]={};Editor[U3C][y4t]={"className":y7n.e7C,"data":y7n.e7C,"def":y7n.e7C,"fieldInfo":y7n.e7C,"id":y7n.e7C,"label":y7n.e7C,"labelInfo":y7n.e7C,"name":S8C,"type":j4t,"message":y7n.e7C,"multiEditable":I4C,"submit":I4C};Editor[U3C][K8C][v3X]={type:S8C,name:S8C,classes:S8C,opts:S8C,host:S8C};Editor[m4t][q4t][l8C]={container:S8C,label:S8C,labelInfo:S8C,fieldInfo:S8C,fieldError:S8C,fieldMessage:S8C};Editor[c4t]={};Editor[P4t][w4t]={"init":function(dte){},"open":function(dte,append,fn){},"close":function(dte,fn){}};Editor[Y4t][m2C]={"create":function(conf){},"get":function(conf){},"set":function(conf,val){},"enable":function(conf){},"disable":function(conf){}};Editor[v4t][v3X]={"ajaxUrl":S8C,"ajax":S8C,"dataSource":S8C,"domTable":S8C,"opts":S8C,"displayController":S8C,"fields":{},"order":[],"id":-s7C,"displayed":X4C,"processing":X4C,"modifier":S8C,"action":S8C,"idSrc":S8C,"unique":x7C};Editor[K8C][g3X]={"label":S8C,"fn":S8C,"className":S8C};Editor[K8C][g4t]={onReturn:a3X,onBlur:t3X,onBackground:a4t,onComplete:t3X,onEsc:t3X,onFieldError:j7X,submit:t4t,focus:x7C,buttons:I4C,title:I4C,message:I4C,drawType:X4C,scope:H3X};Editor[H4t]={};(function(){var S6X="lass=\"DTED_Lightbox_Container\">";var x6X="v class";var n3X="</di";var A6X="Lightbox_Content_Wrapper\">";var e3X="ghtb";var y9X="_scrollTop";var b3X="ox";var F6X="ghtbox_Content\">";var R3X="<div class=\"DTED_Lightbox_Backgro";var W9X="offsetAni";var c1X='<div class="DTED_Lightbox_Close"></div>';var U6X=" class=\"DTED_";var q1X='<div class="DTED DTED_Lightbox_Wrapper">';var z3X="d\"><div/>";var r6X="_shown";var s6X="=\"DTED_Li";var W7C=25;var q5t=v3C;q5t+=W9C;q5t+=e3X;q5t+=b3X;var m5t=S2C;m5t+=O8C;m5t+=D8C;var j5t=R3X;j5t+=X3X;j5t+=z3X;j5t+=I3X;var y5t=n3X;y5t+=G0C;y5t+=i0C;var T5t=p3X;T5t+=x6X;T5t+=s6X;T5t+=F6X;var o5t=V6X;o5t+=U6X;o5t+=A6X;var M5t=Q6X;M5t+=S6X;var R4t=k6X;R4t+=y7n.a7C;var b4t=N6X;b4t+=e3X;b4t+=r6C;b4t+=T2C;var e4t=L6X;e4t+=y7n.X7C;e4t+=M3C;var self;Editor[e4t][b4t]=$[R4t](I4C,{},Editor[K8C][O6X],{"init":function(dte){var X4t=B2C;X4t+=D6X;X4t+=k2C;self[X4t]();return self;},"open":function(dte,append,callback){var f6X="_show";var E6X="own";var x0t=C6X;x0t+=C6C;x0t+=E6X;var p4t=y7n.X7C;p4t+=l6X;p4t+=r1C;p4t+=y7n.a7C;var n4t=K6X;n4t+=D2C;n4t+=A2C;n4t+=y7n.a7C;var I4t=t2C;I4t+=T3X;I4t+=y7n.z7C;var z4t=t2C;z4t+=q4C;z4t+=D2C;if(self[r6X]){if(callback){callback();}return;}self[z4t]=dte;var content=self[I4t][W6X];content[u6X]()[R7X]();content[n4t](append)[p4t](self[i6X][h6X]);self[x0t]=I4C;self[f6X](callback);},"close":function(dte,callback){var J6X="ho";var F0t=B6X;F0t+=o6C;var s0t=C6X;s0t+=J6X;s0t+=v2X;if(!self[s0t]){if(callback){callback();}return;}self[F0t]=dte;self[d6X](callback);y7n[y7n.p7C]();self[r6X]=X4C;},node:function(dte){var V0t=y7n.v7C;V0t+=y7n.g7C;y7n[V0t]();return self[i6X][Z6X][x7C];},"_init":function(){var T6X="opaci";var P6X="_ready";var G6X="acit";var c6X="conte";var o6X="ckgroun";var w6X='div.DTED_Lightbox_Content';var D0t=r6C;D0t+=z3C;D0t+=G6X;D0t+=M3C;var O0t=M6X;O0t+=o6X;O0t+=y7n.a7C;var L0t=T6X;L0t+=R6C;var N0t=y7n.t7C;N0t+=O2C;N0t+=O2C;var k0t=y6X;k0t+=j6X;k0t+=z3C;k0t+=m6X;var S0t=y6X;S0t+=q6X;var Q0t=t2C;Q0t+=T3X;Q0t+=y7n.z7C;var A0t=c6X;A0t+=o1C;var U0t=y7n.v7C;U0t+=y7n.g7C;y7n[U0t]();if(self[P6X]){return;}var dom=self[i6X];dom[A0t]=$(w6X,self[Q0t][S0t]);dom[k0t][N0t](L0t,x7C);dom[O0t][C8C](D0t,x7C);},"_show":function(callback){var K9X="htbox_Mo";var t6X="div.DTED_Lig";var x9X="backgrou";var D9X="eig";var H9X="ppen";var g6X=".DTED";var b6X="TED_Light";var Y6X="resize.DTED_Lightb";var w9X="D_Li";var e9X="not";var l9X="DTED_Lig";var g9X="ightbo";var v9X="<div class=\"DTED_L";var C9X="onte";var E9X="orientation";var L9X="round";var t9X="Shown\"/>";var Y9X="ghtbox_Shown";var R6X="bac";var H6X="htbox_Content_Wrapper";var U9X="nima";var p6X="bi";var N9X="ckg";var z6X="TED_L";var X6X="kground";var a6X="_Lightbo";var F9X="_anima";var a9X="x_";var z0t=Y6X;z0t+=b3X;var R0t=v6X;R0t+=g6X;R0t+=a6X;R0t+=T2C;var b0t=r3C;b0t+=D9C;b0t+=y7n.a7C;var e0t=y6X;e0t+=j6X;e0t+=l6X;e0t+=x6C;var H0t=t6X;H0t+=H6X;var g0t=e6X;g0t+=b6X;g0t+=X8C;g0t+=T2C;var v0t=R6X;v0t+=X6X;var w0t=e6X;w0t+=z6X;w0t+=I6X;w0t+=n6X;var P0t=p6X;P0t+=A2C;P0t+=y7n.a7C;var j0t=x9X;j0t+=s9X;var y0t=F9X;y0t+=o6C;var T0t=y6X;T0t+=Z3C;T0t+=K6X;T0t+=x6C;var o0t=V9X;o0t+=U9X;o0t+=k2C;o0t+=D2C;var M0t=B6X;M0t+=o6C;var G0t=t2C;G0t+=A9X;G0t+=L3X;G0t+=Q9X;var Z0t=S9X;Z0t+=x6C;var d0t=t2C;d0t+=l8C;var J0t=y7n.X7C;J0t+=k9X;J0t+=s9X;var B0t=M6X;B0t+=N9X;B0t+=L9X;var f0t=B6X;f0t+=W7X;var h0t=r3C;h0t+=r6C;h0t+=y7n.a7C;h0t+=M3C;var i0t=y7n.t7C;i0t+=O2C;i0t+=O2C;var u0t=y7n.X7C;u0t+=O9X;u0t+=r6C;var W0t=C6C;W0t+=D9X;W0t+=L3X;var r0t=e7X;r0t+=O2C;var K0t=y7n.t7C;K0t+=C9X;K0t+=A2C;K0t+=k2C;var C0t=B6X;C0t+=r6C;C0t+=y7n.z7C;var that=this;var dom=self[C0t];if(window[E9X]!==undefined){var l0t=l9X;l0t+=K9X;l0t+=r3C;l0t+=L2C;var E0t=X8C;E0t+=y7n.a7C;E0t+=M3C;$(E0t)[H8C](l0t);}dom[K0t][r0t](W0t,u0t);dom[Z6X][i0t]({top:-self[r9X][W9X]});$(h0t)[z7X](self[f0t][B0t])[J0t](self[d0t][Z0t]);self[G0t]();self[M0t][o0t](dom[T0t],{opacity:s7C,top:x7C},callback);self[u9X][y0t](dom[j0t],{opacity:s7C});setTimeout(function(){var h9X="v.DTE_Foo";var i9X="-indent";var c0t=o6C;c0t+=T2C;c0t+=k2C;c0t+=i9X;var q0t=y7n.t7C;q0t+=O2C;q0t+=O2C;var m0t=y7n.a7C;m0t+=W9C;m0t+=h9X;m0t+=g9C;$(m0t)[q0t](c0t,-s7C);},k7C);dom[h6X][P0t](w0t,function(e){var Y0t=y7n.X7C;Y0t+=y7n.g7C;y7n[Y0t]();self[u9X][h6X]();});dom[v0t][f9X](g0t,function(e){var B9X="backgr";var t0t=B9X;t0t+=J9X;var a0t=t2C;a0t+=q4C;a0t+=D2C;y7n[y7n.p7C]();self[a0t][t0t]();});$(H0t,dom[e0t])[b0t](R0t,function(e){var d9X="DTED";var G9X="Wrapper";var Z9X="_Lightbox_Content_";var X0t=d9X;X0t+=Z9X;X0t+=G9X;if($(e[M9X])[d8C](X0t)){self[u9X][o9X]();}});$(window)[f9X](z0t,function(){y7n[d4C]();self[T9X]();});self[y9X]=$(j9X)[m9X]();if(window[E9X]!==undefined){var s5t=y7n.X7C;s5t+=z3C;s5t+=q9X;var x5t=c9X;x5t+=P9X;x5t+=w9X;x5t+=Y9X;var p0t=v9X;p0t+=g9X;p0t+=a9X;p0t+=t9X;var n0t=y7n.X7C;n0t+=H9X;n0t+=y7n.a7C;var I0t=r3C;I0t+=j1C;I0t+=M3C;var kids=$(j9X)[u6X]()[e9X](dom[o9X])[e9X](dom[Z6X]);$(I0t)[n0t](p0t);$(x5t)[s5t](kids);}},"_heightCalc":function(){var I9X="div.DTE_F";var U1X='div.DTE_Header';var z9X="y_Conten";var p9X="outerHeigh";var X9X="div.DTE_Bo";var R9X="He";var n9X="ooter";var N5t=b9X;N5t+=T2C;N5t+=R9X;N5t+=I6X;var k5t=X9X;k5t+=y7n.a7C;k5t+=z9X;k5t+=k2C;var S5t=W5C;S5t+=k9X;S5t+=Z3C;var Q5t=I9X;Q5t+=n9X;var A5t=p9X;A5t+=k2C;var U5t=x1X;U5t+=K6X;U5t+=x6C;var V5t=n8C;V5t+=y7n.H7C;var F5t=s1X;F5t+=W9C;F5t+=F1X;var dom=self[i6X];y7n[d4C]();var maxHeight=$(window)[F5t]()-self[V5t][V1X]*F7C-$(U1X,dom[U5t])[A5t]()-$(Q5t,dom[S5t])[A1X]();$(k5t,dom[Z6X])[C8C](N5t,maxHeight);},"_hide":function(callback){var O1X="click.DTED";var Z1X='div.DTED_Lightbox_Shown';var k1X="div.DTED_Li";var d1X="child";var K1X="click.DTE";var h1X="TED_Lightbox_Mobile";var E1X="backgro";var C1X="unbin";var B1X="tati";var L1X="_Wrap";var N1X="ghtbox_Content";var W1X="unbi";var i1X="imat";var D1X="_Lightbox";var f1X="rien";var r1X="D_Lightbox";var G5t=Q1X;G5t+=S1X;var Z5t=k1X;Z5t+=N1X;Z5t+=L1X;Z5t+=m6X;var d5t=O1X;d5t+=D1X;var J5t=C1X;J5t+=y7n.a7C;var B5t=E1X;B5t+=l1X;var f5t=K1X;f5t+=r1X;var h5t=W1X;h5t+=s9X;var i5t=y7n.t7C;i5t+=K9C;i5t+=O2C;i5t+=D2C;var W5t=t2C;W5t+=u1X;W5t+=i1X;W5t+=D2C;var r5t=t2C;r5t+=y7n.a7C;r5t+=o6C;var l5t=O7X;l5t+=A2C;l5t+=y7n.H7C;var E5t=d2C;E5t+=h1X;var C5t=r3C;C5t+=j1C;C5t+=M3C;var L5t=r6C;L5t+=f1X;L5t+=B1X;L5t+=a8C;var dom=self[i6X];if(!callback){callback=function(){};}if(window[L5t]!==undefined){var D5t=r3C;D5t+=J1X;var O5t=d1X;O5t+=z8C;var show=$(Z1X);show[O5t]()[G1X](D5t);show[H2X]();}$(C5t)[V7X](E5t)[m9X](self[y9X]);self[u9X][M1X](dom[Z6X],{opacity:x7C,top:self[l5t][W9X]},function(){var o1X="det";var K5t=o1X;K5t+=T1X;$(this)[K5t]();callback();});self[r5t][W5t](dom[o9X],{opacity:x7C},function(){var u5t=y7n.a7C;u5t+=D2C;u5t+=k2C;u5t+=T1X;y7n[y7n.p7C]();$(this)[u5t]();});dom[i5t][h5t](f5t);dom[B5t][J5t](d5t);$(Z5t,dom[Z6X])[G5t](y1X);$(window)[j1X](m1X);},"_dte":S8C,"_ready":X4C,"_shown":X4C,"_dom":{"wrapper":$(q1X+M5t+o5t+T5t+X5C+y5t+X5C+X5C),"background":$(j5t),"close":$(c1X),"content":S8C}});y7n[y7n.p7C]();self=Editor[m5t][q5t];self[r9X]={"offsetAni":W7C,"windowPadding":W7C};}());(function(){var v1X="<div class=\"DTED_En";var S5X='<div class="DTED_Envelope_Shadow"></div>';var t1X="ainer\"></div>";var R1X="env";var c7C=600;var Y1X="\">&times;";var w1X="v class=\"DTED_Envelope_Close";var k4X="backg";var n4X="wrap";var b1X="elope_Wrapper\">";var M0X="_do";var P1X="velop";var D4X="kgroun";var F4X="appendChild";var Z7C=50;var X1X="elope";var A4X="yl";var g1X="e_Background\"><div/></div>";var a1X="<div class=\"DTED_Envelope_Cont";var e1X="DTED DTED_Env";var K2Y=Z3C;K2Y+=r6C;K2Y+=y6X;var l2Y=r1C;l2Y+=P1X;l2Y+=D2C;var E2Y=p3X;E2Y+=w1X;E2Y+=Y1X;E2Y+=I3X;var C2Y=v1X;C2Y+=P1X;C2Y+=g1X;var D2Y=a1X;D2Y+=t1X;var O2Y=H1X;O2Y+=y4C;O2Y+=e1X;O2Y+=b1X;var P5t=R1X;P5t+=X1X;var c5t=P2X;c5t+=v3C;c5t+=C1C;var self;Editor[c5t][P5t]=$[T5C](I4C,{},Editor[K8C][O6X],{"init":function(dte){var z1X="dte";var Y5t=B2C;Y5t+=A2C;Y5t+=W9C;Y5t+=k2C;var w5t=t2C;w5t+=z1X;self[w5t]=dte;self[Y5t]();return self;},"open":function(dte,append,callback){var p1X="dChi";var s4X="cont";var b5t=t2C;b5t+=I1X;var e5t=y7n.t7C;e5t+=a8C;e5t+=o6C;e5t+=o1C;var H5t=t2C;H5t+=T3X;H5t+=y7n.z7C;var t5t=n1X;t5t+=p1X;t5t+=p6C;var a5t=W2C;a5t+=x4X;var g5t=s4X;g5t+=r1C;g5t+=k2C;var v5t=B6X;v5t+=W7X;self[u9X]=dte;$(self[v5t][g5t])[u6X]()[a5t]();self[i6X][W6X][t5t](append);self[H5t][e5t][F4X](self[i6X][h6X]);self[b5t](callback);},"close":function(dte,callback){var R5t=t2C;R5t+=C6C;R5t+=V4X;y7n[y7n.p7C]();self[u9X]=dte;self[R5t](callback);},node:function(dte){var X5t=W5C;X5t+=z3C;X5t+=z3C;X5t+=x6C;return self[i6X][X5t][x7C];},"_init":function(){var J4X='opacity';var C4X="vis";var L4X="ssBackgroundOpacity";var B4X='hidden';var i4X='div.DTED_Envelope_Container';var r4X="ackground";var l4X="ckgr";var Q4X="ground";var K4X="endChild";var u4X="ready";var O4X="styl";var d4X="visbility";var E4X="bility";var U4X="ible";var h8t=G0C;h8t+=Q2X;h8t+=U4X;var i8t=O2C;i8t+=k2C;i8t+=A4X;i8t+=D2C;var u8t=r3C;u8t+=y7n.X7C;u8t+=D2X;u8t+=Q4X;var W8t=y7n.a7C;W8t+=S4X;W8t+=A0C;W8t+=M3C;var r8t=Q6C;r8t+=M3C;r8t+=v3C;r8t+=D2C;var K8t=k4X;K8t+=j9C;K8t+=l1X;var l8t=t2C;l8t+=y7n.a7C;l8t+=r6C;l8t+=y7n.z7C;var E8t=e7X;E8t+=O2C;var C8t=N4X;C8t+=L4X;var D8t=X2X;D8t+=r6C;D8t+=y7n.t7C;D8t+=o3X;var O8t=L1C;O8t+=z3C;O8t+=D8C;var L8t=O4X;L8t+=D2C;var N8t=r3C;N8t+=n4C;N8t+=D4X;N8t+=y7n.a7C;var k8t=B6X;k8t+=W7X;var S8t=C4X;S8t+=E4X;var Q8t=M6X;Q8t+=l4X;Q8t+=J9X;var A8t=t2C;A8t+=y7n.a7C;A8t+=W7X;var U8t=B6X;U8t+=W7X;var V8t=Y3X;V8t+=z3C;V8t+=K4X;var F8t=r3C;F8t+=r4X;var s8t=t2C;s8t+=T3X;s8t+=y7n.z7C;var x8t=r3C;x8t+=r6C;x8t+=y7n.a7C;x8t+=M3C;var p5t=t2C;p5t+=T3X;p5t+=y7n.z7C;var n5t=O7X;n5t+=o1C;n5t+=W4X;var I5t=t2C;I5t+=T3X;I5t+=y7n.z7C;var z5t=t2C;z5t+=u4X;if(self[z5t]){return;}self[I5t][n5t]=$(i4X,self[p5t][Z6X])[x7C];document[x8t][F4X](self[s8t][F8t]);document[h4X][V8t](self[U8t][Z6X]);self[A8t][Q8t][f4X][S8t]=B4X;self[k8t][N8t][L8t][O8t]=D8t;self[C8t]=$(self[i6X][o9X])[E8t](J4X);self[l8t][K8t][r8t][W8t]=j3X;self[i6X][u8t][i8t][d4X]=h8t;},"_show":function(callback){var c4X="anim";var F0X="opacity";var t4X="cit";var N0X="windowScroll";var M4X="TED_Envelope";var x0X="Wid";var y4X="lope";var S0X="_cssBackgroundOpacity";var q4X="In";var Z4X="resize.DTED_Envelop";var o4X="backgroun";var e4X="setHeight";var v4X="tyle";var G4X="ck.D";var m4X="fa";var R4X="ginL";var D0X="offsetHeight";var k0X='normal';var Q0X="px";var V0X="_findAttachRow";var l0X='click.DTED_Envelope';var P4X="rou";var z4X="yle";var C0X="nim";var E0X='div.DTED_Lightbox_Content_Wrapper';var b4X="mar";var T4X="TED_Enve";var O0X="html,b";var g4X="roun";var i7Y=Z4X;i7Y+=D2C;var u7Y=r3C;u7Y+=W9C;u7Y+=s9X;var E7Y=W5C;E7Y+=k9X;E7Y+=Z3C;var C7Y=t2C;C7Y+=y7n.a7C;C7Y+=r6C;C7Y+=y7n.z7C;var D7Y=u1C;D7Y+=W9C;D7Y+=G4X;D7Y+=M4X;var O7Y=o4X;O7Y+=y7n.a7C;var L7Y=B6X;L7Y+=W7X;var k7Y=e6X;k7Y+=T4X;k7Y+=y4X;var S7Y=r3C;S7Y+=W9C;S7Y+=A2C;S7Y+=y7n.a7C;var Q7Y=j4X;Q7Y+=w2C;var p8t=y7n.t7C;p8t+=r6C;p8t+=A2C;p8t+=y7n.H7C;var n8t=m4X;n8t+=W2C;n8t+=q4X;var I8t=B6X;I8t+=W7X;var z8t=c4X;z8t+=W1C;var X8t=k4X;X8t+=P4X;X8t+=s9X;var R8t=X2X;R8t+=w4X;R8t+=o3X;var b8t=S2C;b8t+=O2C;b8t+=Y4X;b8t+=M3C;var e8t=O2C;e8t+=v4X;var H8t=k4X;H8t+=g4X;H8t+=y7n.a7C;var t8t=r6C;t8t+=a4X;t8t+=t4X;t8t+=M3C;var a8t=t2C;a8t+=y7n.a7C;a8t+=r6C;a8t+=y7n.z7C;var g8t=z3C;g8t+=T2C;var v8t=H4X;v8t+=e4X;var Y8t=k2C;Y8t+=p9C;var w8t=S9X;w8t+=x6C;var P8t=t2C;P8t+=T3X;P8t+=y7n.z7C;var c8t=z3C;c8t+=T2C;var q8t=b4X;q8t+=R4X;q8t+=X4X;var m8t=Q6C;m8t+=z4X;var j8t=t2C;j8t+=y7n.a7C;j8t+=r6C;j8t+=y7n.z7C;var y8t=z3C;y8t+=T2C;var T8t=I4X;T8t+=k2C;T8t+=C6C;var o8t=O2C;o8t+=k2C;o8t+=A4X;o8t+=D2C;var M8t=n4X;M8t+=m6X;var G8t=p4X;G8t+=x0X;G8t+=k2C;G8t+=C6C;var Z8t=S2C;Z8t+=O2C;Z8t+=Y4X;Z8t+=M3C;var d8t=y7n.X7C;d8t+=O9X;d8t+=r6C;var J8t=O2C;J8t+=R6C;J8t+=v3C;J8t+=D2C;var B8t=O7X;B8t+=A2C;B8t+=y2C;B8t+=k2C;var f8t=B6X;f8t+=r6C;f8t+=y7n.z7C;var that=this;y7n[y7n.p7C]();var formHeight;if(!callback){callback=function(){};}self[f8t][B8t][J8t][s0X]=d8t;var style=self[i6X][Z6X][f4X];style[F0X]=x7C;style[Z8t]=l3X;var targetRow=self[V0X]();var height=self[T9X]();var width=targetRow[G8t];style[U0X]=j3X;style[F0X]=s7C;self[i6X][M8t][o8t][T8t]=width+y8t;self[j8t][Z6X][m8t][q8t]=-(width/F7C)+c8t;self[P8t][w8t][f4X][A0X]=$(targetRow)[p4X]()[Y8t]+targetRow[v8t]+Q0X;self[i6X][W6X][f4X][A0X]=-s7C*height-l7C+g8t;self[a8t][o9X][f4X][t8t]=x7C;self[i6X][H8t][e8t][b8t]=R8t;$(self[i6X][X8t])[z8t]({'opacity':self[S0X]},k0X);$(self[I8t][Z6X])[n8t]();if(self[p8t][N0X]){var F7Y=k2C;F7Y+=r6C;F7Y+=z3C;var s7Y=L0X;s7Y+=k2C;var x7Y=O0X;x7Y+=J1X;$(x7Y)[N3X]({"scrollTop":$(targetRow)[s7Y]()[F7Y]+targetRow[D0X]-self[r9X][V1X]},function(){var V7Y=c4X;V7Y+=y7n.X7C;V7Y+=o6C;$(self[i6X][W6X])[V7Y]({"top":x7C},c7C,callback);});}else{var A7Y=y7n.X7C;A7Y+=C0X;A7Y+=W1C;var U7Y=B6X;U7Y+=W7X;$(self[U7Y][W6X])[A7Y]({"top":x7C},c7C,callback);}$(self[i6X][Q7Y])[S7Y](k7Y,function(e){var N7Y=y7n.X7C;N7Y+=y7n.g7C;y7n[N7Y]();self[u9X][h6X]();});$(self[L7Y][O7Y])[f9X](D7Y,function(e){y7n[y7n.p7C]();self[u9X][o9X]();});$(E0X,self[C7Y][E7Y])[f9X](l0X,function(e){var h0X="grou";var i0X="back";var f0X="_dt";var u0X='DTED_Envelope_Content_Wrapper';var r0X="sClass";var K7Y=K0X;K7Y+=r0X;var l7Y=k2C;l7Y+=D6C;l7Y+=W0X;y7n[d4C]();if($(e[l7Y])[K7Y](u0X)){var W7Y=i0X;W7Y+=h0X;W7Y+=s9X;var r7Y=f0X;r7Y+=D2C;self[r7Y][W7Y]();}});$(window)[u7Y](i7Y,function(){self[T9X]();});},"_heightCalc":function(){var B0X="outer";var Z0X="uterHeight";var o0X="v.DTE_Header";var y0X="ding";var d0X="div.DTE_Body_C";var q0X='div.DTE_Footer';var j0X="heightCa";var J0X="Height";var c0X='maxHeight';var m0X="lc";var T0X="windowP";var w7Y=B0X;w7Y+=J0X;var P7Y=y7n.a7C;P7Y+=r6C;P7Y+=y7n.z7C;var c7Y=t2C;c7Y+=y7n.a7C;c7Y+=k2C;c7Y+=D2C;var q7Y=y7n.t7C;q7Y+=O2C;q7Y+=O2C;var m7Y=d0X;m7Y+=a8C;m7Y+=y2C;m7Y+=k2C;var j7Y=r6C;j7Y+=Z0X;var y7Y=y6X;y7Y+=Z3C;y7Y+=G0X;y7Y+=Z3C;var T7Y=M0X;T7Y+=y7n.z7C;var o7Y=S2C;o7Y+=o0X;var M7Y=T0X;M7Y+=r9C;M7Y+=y0X;var G7Y=A9X;G7Y+=C6C;G7Y+=k2C;var Z7Y=O7X;Z7Y+=o1C;Z7Y+=D2C;Z7Y+=o1C;var d7Y=n4X;d7Y+=m6X;var J7Y=t2C;J7Y+=y7n.a7C;J7Y+=r6C;J7Y+=y7n.z7C;var B7Y=j0X;B7Y+=m0X;var f7Y=y7n.t7C;f7Y+=r6C;f7Y+=U0C;var h7Y=s1X;h7Y+=I6X;h7Y+=Q9X;var formHeight;formHeight=self[r9X][h7Y]?self[f7Y][B7Y](self[J7Y][d7Y]):$(self[i6X][Z7Y])[u6X]()[G7Y]();var maxHeight=$(window)[s0X]()-self[r9X][M7Y]*F7C-$(o7Y,self[T7Y][Z6X])[A1X]()-$(q0X,self[i6X][y7Y])[j7Y]();$(m7Y,self[i6X][Z6X])[q7Y](c0X,maxHeight);return $(self[c7Y][P7Y][Z6X])[w7Y]();},"_hide":function(callback){var a0X="nb";var H0X="Lig";var e0X="htbo";var P0X="div.DTED_Lightbox_";var X0X="eight";var w0X="Conte";var b0X="of";var v0X="click.";var g0X="DTED_L";var Y0X="nt_Wrapper";var t0X="click.DTED_";var R0X="fsetH";var p7Y=Q1X;p7Y+=W9C;p7Y+=s9X;var n7Y=W5C;n7Y+=l6X;n7Y+=D2C;n7Y+=Z3C;var I7Y=t2C;I7Y+=T3X;I7Y+=y7n.z7C;var z7Y=P0X;z7Y+=w0X;z7Y+=Y0X;var X7Y=v0X;X7Y+=g0X;X7Y+=m6C;var R7Y=n3C;R7Y+=a0X;R7Y+=S1X;var b7Y=M6X;b7Y+=y7n.t7C;b7Y+=D4X;b7Y+=y7n.a7C;var e7Y=t0X;e7Y+=H0X;e7Y+=e0X;e7Y+=T2C;var g7Y=b0X;g7Y+=R0X;g7Y+=X0X;var v7Y=B6X;v7Y+=r6C;v7Y+=y7n.z7C;var Y7Y=O7X;Y7Y+=z0X;Y7Y+=o1C;if(!callback){callback=function(){};}$(self[i6X][Y7Y])[N3X]({"top":-(self[v7Y][W6X][g7Y]+Z7C)},c7C,function(){var I0X="nor";var n0X="mal";var H7Y=I0X;H7Y+=n0X;var t7Y=x1X;t7Y+=Y3X;t7Y+=m6X;var a7Y=M0X;a7Y+=y7n.z7C;$([self[a7Y][t7Y],self[i6X][o9X]])[p0X](H7Y,callback);});$(self[i6X][h6X])[j1X](e7Y);$(self[i6X][b7Y])[R7Y](X7Y);$(z7Y,self[I7Y][n7Y])[j1X](y1X);$(window)[p7Y](m1X);},"_findAttachRow":function(){var V5X="atta";var s5X="eat";var Q2Y=x5X;Q2Y+=s5X;Q2Y+=D2C;var A2Y=y7n.X7C;A2Y+=F5X;A2Y+=W9C;A2Y+=a8C;var U2Y=C6C;U2Y+=D2C;U2Y+=y7n.X7C;U2Y+=y7n.a7C;var V2Y=V5X;V2Y+=U5X;var F2Y=y7n.t7C;F2Y+=r6C;F2Y+=A2C;F2Y+=y7n.H7C;var s2Y=t2C;s2Y+=y7n.a7C;s2Y+=k2C;s2Y+=D2C;var x2Y=A3X;x2Y+=z3C;x2Y+=W9C;var dt=new $[o4C][W4C][x2Y](self[s2Y][O2C][Q3X]);y7n[y7n.p7C]();if(self[F2Y][V2Y]===U2Y){return dt[Q3X]()[A5X]();}else if(self[u9X][O2C][A2Y]===Q2Y){return dt[Q3X]()[A5X]();}else{var L2Y=F1C;L2Y+=y7n.a7C;L2Y+=D2C;var N2Y=y7n.z7C;N2Y+=Q5X;N2Y+=i9C;N2Y+=x6C;var k2Y=B6X;k2Y+=k2C;k2Y+=D2C;var S2Y=Z3C;S2Y+=r6C;S2Y+=y6X;return dt[S2Y](self[k2Y][O2C][N2Y])[L2Y]();}},"_dte":S8C,"_ready":X4C,"_cssBackgroundOpacity":s7C,"_dom":{"wrapper":$(O2Y+S5X+D2Y+X5C)[x7C],"background":$(C2Y)[x7C],"close":$(E2Y)[x7C],"content":S8C}});self=Editor[U0X][l2Y];self[r9X]={"windowPadding":Z7C,"heightCalc":S8C,"attach":K2Y,"windowScroll":I4C};}());Editor[P8C][r2Y]=function(cfg,after){var y5X="editF";var r5X="Error adding fi";var Z5X="ing field '";var P5X="ice";var J5X=" this nam";var D5X="reverse";var W5X="eld. Th";var L5X="isArra";var k5X="splayReo";var f5X="'. A fie";var B5X="ld already exists with";var u5X="e field req";var i5X="uires a `name` option";var d5X=" add";var G5X='initField';var K5X="_dataSourc";var t2Y=r6C;t2Y+=Z3C;t2Y+=W2C;t2Y+=Z3C;var a2Y=t2C;a2Y+=S2C;a2Y+=k5X;a2Y+=N5X;var W2Y=L5X;W2Y+=M3C;if($[W2Y](cfg)){var u2Y=v3C;u2Y+=r1C;u2Y+=O5X;if(after!==undefined){cfg[D5X]();}for(var i=x7C;i<cfg[u2Y];i++){var i2Y=r9C;i2Y+=y7n.a7C;this[i2Y](cfg[i],after);}}else{var c2Y=y7n.H7C;c2Y+=W9C;c2Y+=C5X;var M2Y=Z1C;M2Y+=W2C;var G2Y=u1C;G2Y+=E5X;var Z2Y=c1C;Z2Y+=W9C;Z2Y+=l5X;var d2Y=K5X;d2Y+=D2C;var h2Y=A2C;h2Y+=y7n.X7C;h2Y+=y7n.z7C;h2Y+=D2C;var name=cfg[h2Y];if(name===undefined){var f2Y=r5X;f2Y+=W5X;f2Y+=u5X;f2Y+=i5X;throw f2Y;}if(this[O2C][h5X][name]){var J2Y=f5X;J2Y+=B5X;J2Y+=J5X;J2Y+=D2C;var B2Y=C3C;B2Y+=d5X;B2Y+=Z5X;throw B2Y+name+J2Y;}this[d2Y](G5X,cfg);var field=new Editor[Z2Y](cfg,this[G2Y][M5X],this);if(this[O2C][M2Y]){var y2Y=o5X;y2Y+=C6C;var T2Y=a0C;T2Y+=T5X;T2Y+=g2X;var o2Y=y5X;o2Y+=W9C;o2Y+=D2C;o2Y+=S1C;var editFields=this[O2C][o2Y];field[T2Y]();$[y2Y](editFields,function(idSrc,edit){var m5X="tiSet";var q2Y=y7n.a7C;q2Y+=j5X;var m2Y=x0C;m2Y+=m5X;var j2Y=y7n.v7C;j2Y+=y7n.g7C;var val;if(edit[v5C]){val=field[q5X](edit[v5C]);}y7n[j2Y]();field[m2Y](idSrc,val!==undefined?val:field[q2Y]());});}this[O2C][c2Y][name]=field;if(after===undefined){var P2Y=z3C;P2Y+=n3C;P2Y+=O2C;P2Y+=C6C;this[O2C][c5X][P2Y](name);}else if(after===S8C){var w2Y=m8C;w2Y+=C6C;w2Y+=q8C;this[O2C][c5X][w2Y](name);}else{var g2Y=O2C;g2Y+=f1C;g2Y+=P5X;var v2Y=r6C;v2Y+=Z3C;v2Y+=W2C;v2Y+=Z3C;var Y2Y=N2C;Y2Y+=y7n.a7C;Y2Y+=x6C;var idx=$[w5X](after,this[O2C][Y2Y]);this[O2C][v2Y][g2Y](idx+s7C,x7C,name);}}this[a2Y](this[t2Y]());return this;};Editor[H2Y][e2Y]=function(newAjax){var R2Y=y7n.X7C;R2Y+=h1C;R2Y+=y7n.X7C;R2Y+=T2C;if(newAjax){var b2Y=y7n.X7C;b2Y+=h1C;b2Y+=Y5X;this[O2C][b2Y]=newAjax;return this;}y7n[y7n.p7C]();return this[O2C][R2Y];};Editor[P8C][o9X]=function(){var v5X="fun";var p2Y=y7n.v7C;p2Y+=y7n.g7C;var I2Y=u1C;I2Y+=i1C;var z2Y=r3C;z2Y+=v3C;z2Y+=n3C;z2Y+=Z3C;var X2Y=v5X;X2Y+=g5X;var onBackground=this[O2C][a5X][t5X];if(typeof onBackground===X2Y){onBackground(this);}else if(onBackground===z2Y){this[H5X]();}else if(onBackground===I2Y){this[h6X]();}else if(onBackground===a3X){var n2Y=e5X;n2Y+=Y6C;this[n2Y]();}y7n[p2Y]();return this;};Editor[P8C][H5X]=function(){var x3Y=b5X;x3Y+=B1C;x3Y+=Z3C;y7n[y7n.p7C]();this[x3Y]();return this;};Editor[s3Y][R5X]=function(cells,fieldNames,show,opts){var V8X="oolean";var n5X="ubbl";var z5X="vi";var I5X="dual";var p5X="rmOpti";var X5X="bub";var k3Y=X5X;k3Y+=X2X;k3Y+=D2C;var S3Y=S1X;S3Y+=W9C;S3Y+=z5X;S3Y+=I5X;var Q3Y=r3C;Q3Y+=n5X;Q3Y+=D2C;var A3Y=x3C;A3Y+=p5X;A3Y+=x8X;var U3Y=s8X;U3Y+=F8X;U3Y+=k2X;var V3Y=r3C;V3Y+=V8X;var that=this;if(this[U8X](function(){var F3Y=X5X;F3Y+=X2X;F3Y+=D2C;y7n[d4C]();that[F3Y](cells,fieldNames,opts);})){return this;}if($[A8X](fieldNames)){opts=fieldNames;fieldNames=undefined;show=I4C;}else if(typeof fieldNames===V3Y){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[U3Y](show)){opts=show;show=I4C;}if(show===undefined){show=I4C;}opts=$[T5C]({},this[O2C][A3Y][Q3Y],opts);var editFields=this[Q8X](S3Y,cells,fieldNames);this[S8X](cells,editFields,k3Y,opts,function(){var c8X="pointer";var q8X='<div class="DTE_Processing_Indicator"><span></div>';var W8X="iv ";var C8X="repend";var Y8X="prepe";var h8X="eNo";var o8X="concat";var T8X='"><div/></div>';var f8X="des";var P8X="ndTo";var r8X="<d";var B8X="_pr";var N8X="nimate";var O8X="tton";var G8X='resize.';var X3Y=t2C;X3Y+=y7n.H7C;X3Y+=k8X;var R3Y=V9X;R3Y+=N8X;var g3Y=y7n.X7C;g3Y+=y7n.a7C;g3Y+=y7n.a7C;var v3Y=L8X;v3Y+=O8X;v3Y+=O2C;var P3Y=k2C;P3Y+=D8X;P3Y+=v3C;P3Y+=D2C;var m3Y=y7n.H7C;m3Y+=r6C;m3Y+=Z3C;m3Y+=y7n.z7C;var j3Y=T3X;j3Y+=y7n.z7C;var y3Y=z3C;y3Y+=C8X;var T3Y=T3X;T3Y+=y7n.z7C;var o3Y=E8X;o3Y+=r1C;var M3Y=E8X;M3Y+=r1C;var G3Y=D2C;G3Y+=l8X;var Z3Y=E8X;Z3Y+=r1C;var J3Y=r0C;J3Y+=W0C;J3Y+=u0C;J3Y+=i0C;var B3Y=V6X;B3Y+=W6C;B3Y+=u5C;var f3Y=O0C;f3Y+=u0C;f3Y+=i0C;var h3Y=y7n.t7C;h3Y+=K8X;var i3Y=k2C;i3Y+=y7n.X7C;i3Y+=r3C;i3Y+=M6C;var u3Y=y4C;u3Y+=i0C;var W3Y=y4C;W3Y+=i0C;var r3Y=H1X;r3Y+=y4C;var K3Y=r3C;K3Y+=Q1C;var l3Y=r8X;l3Y+=W8X;l3Y+=u5C;var E3Y=r3X;E3Y+=O2C;var C3Y=u8X;C3Y+=n4C;C3Y+=C6C;var D3Y=i8X;D3Y+=v3C;D3Y+=h8X;D3Y+=f8X;var L3Y=B8X;L3Y+=D2C;L3Y+=r6C;L3Y+=J8X;var N3Y=d8X;N3Y+=R3C;var namespace=that[N3Y](opts);var ret=that[L3Y](Z8X);if(!ret){return that;}$(window)[a8C](G8X+namespace,function(){var M8X="bubblePositi";var O3Y=M8X;O3Y+=a8C;that[O3Y]();});var nodes=[];that[O2C][D3Y]=nodes[o8X][w8C](nodes,_pluck(editFields,C3Y));var classes=that[E3Y][R5X];var background=$(l3Y+classes[K3Y]+T8X);var container=$(r3Y+classes[Z6X]+W3Y+y8X+classes[j8X]+u3Y+y8X+classes[i3Y]+b5C+y8X+classes[h3Y]+m8X+q8X+f3Y+X5C+B3Y+classes[c8X]+m8X+J3Y);if(show){var d3Y=G0X;d3Y+=P8X;container[G1X](j9X);background[d3Y](j9X);}var liner=container[Z3Y]()[G3Y](x7C);var table=liner[M3Y]();var close=table[o3Y]();liner[z7X](that[T3Y][w8X]);table[y3Y](that[j3Y][m3Y]);if(opts[e6C]){var c3Y=y7n.a7C;c3Y+=r6C;c3Y+=y7n.z7C;var q3Y=Y8X;q3Y+=s9X;liner[q3Y](that[c3Y][v8X]);}if(opts[P3Y]){var Y3Y=s1X;Y3Y+=y7n.X7C;Y3Y+=y7n.a7C;Y3Y+=x6C;var w3Y=y7n.a7C;w3Y+=r6C;w3Y+=y7n.z7C;liner[L8C](that[w3Y][Y3Y]);}if(opts[v3Y]){table[z7X](that[l8C][g8X]);}y7n[y7n.p7C]();var pair=$()[a8X](container)[g3Y](background);that[t8X](function(submitComplete){var H8X="_anim";var a3Y=H8X;a3Y+=W1C;that[a3Y](pair,{opacity:x7C},function(){var e8X="_clearDyn";var R8X="esi";var b8X="micInfo";var e3Y=e8X;e3Y+=y7n.X7C;e3Y+=b8X;var H3Y=Z3C;H3Y+=R8X;H3Y+=X8X;var t3Y=y7n.a7C;t3Y+=D2C;t3Y+=x4X;pair[t3Y]();$(window)[H4X](H3Y+namespace);that[e3Y]();});});background[v6X](function(){var b3Y=y7n.v7C;b3Y+=y7n.g7C;y7n[b3Y]();that[H5X]();});close[v6X](function(){that[z8X]();});that[I8X]();that[R3Y](pair,{opacity:s7C});that[X3Y](that[O2C][n8X],opts[p8X]);that[x7y](Z8X);});return this;};Editor[z3Y][I8X]=function(){var C7C=15;var F7y="terWidth";var i7y='below';var O7y='div.DTE_Bubble_Liner';var l7y="left";var W7y="dClas";var Q7y="righ";var f7y="lef";var V7y="ig";var k7y="leN";var N7y="odes";var L7y='div.DTE_Bubble';var u7y="ott";var C6Y=k2C;C6Y+=r6C;C6Y+=z3C;var D6Y=I4X;D6Y+=k2C;D6Y+=C6C;var O6Y=s7y;O6Y+=F7y;var L6Y=Z3C;L6Y+=V7y;L6Y+=C6C;L6Y+=k2C;var N6Y=M6C;N6Y+=A2C;N6Y+=y2X;N6Y+=C6C;var k6Y=r3C;k6Y+=r6C;k6Y+=U7y;k6Y+=W7X;var S6Y=M6C;S6Y+=A7y;var Q6Y=Q7y;Q6Y+=k2C;var A6Y=v3C;A6Y+=S7y;A6Y+=b4C;var U6Y=M6C;U6Y+=y7n.H7C;U6Y+=k2C;var I3Y=i8X;I3Y+=k7y;I3Y+=N7y;var wrapper=$(L7y),liner=$(O7y),nodes=this[O2C][I3Y];var position={top:x7C,left:x7C,right:x7C,bottom:x7C};$[P4C](nodes,function(i,node){var E7y="ffs";var C7y="bot";var K7y="right";var D7y="tHeight";var r7y="offsetWidth";var V6Y=L0X;V6Y+=D7y;var F6Y=C7y;F6Y+=e9C;F6Y+=y7n.z7C;var s6Y=v3C;s6Y+=X4X;var x6Y=k2C;x6Y+=r6C;x6Y+=z3C;var p3Y=k2C;p3Y+=r6C;p3Y+=z3C;var n3Y=r6C;n3Y+=E7y;n3Y+=E2X;var pos=$(node)[n3Y]();node=$(node)[W0X](x7C);position[p3Y]+=pos[x6Y];position[l7y]+=pos[s6Y];position[K7y]+=pos[l7y]+node[r7y];y7n[d4C]();position[F6Y]+=pos[A0X]+node[V6Y];});position[A0X]/=nodes[Z7X];position[U6Y]/=nodes[A6Y];position[Q6Y]/=nodes[S6Y];position[k6Y]/=nodes[N6Y];var top=position[A0X],left=(position[l7y]+position[L6Y])/F7C,width=liner[O6Y](),visLeft=left-width/F7C,visRight=visLeft+width,docWidth=$(window)[D6Y](),padding=C7C,classes=this[e8C][R5X];wrapper[C8C]({top:top,left:left});if(liner[Z7X]&&liner[p4X]()[C6Y]<x7C){var K6Y=r9C;K6Y+=W7y;K6Y+=O2C;var l6Y=r3C;l6Y+=u7y;l6Y+=W7X;var E6Y=k2C;E6Y+=r6C;E6Y+=z3C;wrapper[C8C](E6Y,position[l6Y])[K6Y](i7y);}else{wrapper[V7X](i7y);}if(visRight+padding>docWidth){var W6Y=M6C;W6Y+=h7y;var r6Y=y7n.t7C;r6Y+=O2C;r6Y+=O2C;var diff=visRight-docWidth;liner[r6Y](W6Y,visLeft<padding?-(visLeft-padding):-(diff+padding));}else{var u6Y=f7y;u6Y+=k2C;liner[C8C](u6Y,visLeft<padding?-(visLeft-padding):x7C);}return this;};Editor[P8C][g8X]=function(buttons){var f6Y=D2C;f6Y+=T1X;var that=this;if(buttons===B7y){var i6Y=e5X;i6Y+=Y6C;buttons=[{text:this[o5C][this[O2C][J7y]][i6Y],action:function(){var h6Y=x3X;h6Y+=y7n.z7C;h6Y+=D8X;this[h6Y]();}}];}else if(!$[o2X](buttons)){buttons=[buttons];}$(this[l8C][g8X])[d7y]();$[f6Y](buttons,function(i,btn){var o7y="tabin";var P7y='<button/>';var q7y="tri";var M7y="tabInd";var t7y='keypress';var Y7y="tabIndex";var T7y="lassName";var y7y="classNa";var R6Y=L8X;R6Y+=k2C;R6Y+=Z7y;R6Y+=O2C;var b6Y=Y3X;b6Y+=q9X;b6Y+=c3C;b6Y+=r6C;var t6Y=y7n.t7C;t6Y+=G7y;var a6Y=r6C;a6Y+=A2C;var v6Y=r6C;v6Y+=A2C;var c6Y=M7y;c6Y+=N0C;var q6Y=o7y;q6Y+=y7n.a7C;q6Y+=N0C;var m6Y=y7n.t7C;m6Y+=T7y;var j6Y=y7y;j6Y+=f2C;var y6Y=r3C;y6Y+=O9X;y6Y+=e9C;y6Y+=A2C;var T6Y=y7n.H7C;T6Y+=r6C;T6Y+=e3C;var o6Y=A7X;o6Y+=Q7X;var M6Y=y7n.H7C;M6Y+=A2C;var G6Y=n4C;G6Y+=k2C;G6Y+=j7y;G6Y+=A2C;var Z6Y=m7y;Z6Y+=D2C;Z6Y+=v3C;var d6Y=k2C;d6Y+=D2C;d6Y+=C2C;var B6Y=O2C;B6Y+=q7y;B6Y+=c7y;if(typeof btn===B6Y){btn={text:btn,action:function(){var J6Y=x3X;J6Y+=s3X;J6Y+=k2C;this[J6Y]();}};}var text=btn[d6Y]||btn[Z6Y];y7n[d4C]();var action=btn[G6Y]||btn[M6Y];$(P7y,{'class':that[o6Y][T6Y][y6Y]+(btn[j6Y]?H5C+btn[m6Y]:l4C)})[X7X](typeof text===y7n.s2C?text(that):text||l4C)[w7y](q6Y,btn[Y7y]!==undefined?btn[c6Y]:x7C)[a8C](v7y,function(e){var w6Y=g7y;w6Y+=a7y;var P6Y=y7n.X7C;P6Y+=y7n.g7C;y7n[P6Y]();if(e[w6Y]===O7C&&action){var Y6Y=y7n.t7C;Y6Y+=y7n.X7C;Y6Y+=v3C;Y6Y+=v3C;action[Y6Y](that);}})[v6Y](t7y,function(e){var e7y="Cod";var g6Y=o3X;g6Y+=H7y;g6Y+=e7y;g6Y+=D2C;if(e[g6Y]===O7C){e[b7y]();}})[a6Y](t6Y,function(e){var z7y="Default";var e6Y=y7n.X7C;e6Y+=y7n.g7C;var H6Y=R7y;H6Y+=X7y;H6Y+=k2C;H6Y+=z7y;e[H6Y]();y7n[e6Y]();if(action){action[I7y](that);}})[b6Y](that[l8C][R6Y]);});return this;};Editor[X6Y][z6Y]=function(fieldName){var U2y="_fi";var p7y="orde";var A2y="dNa";var n7y="udeFi";var S9Y=y7n.v7C;S9Y+=y7n.g7C;var that=this;var fields=this[O2C][h5X];if(typeof fieldName===h2X){var F9Y=D9C;F9Y+=u1C;F9Y+=n7y;F9Y+=C5X;var s9Y=O2X;s9Y+=C1C;var x9Y=O8C;x9Y+=v3C;x9Y+=W9C;x9Y+=B9C;var p6Y=p7y;p6Y+=Z3C;var n6Y=W9C;n6Y+=A2C;n6Y+=x2y;var I6Y=y7n.H7C;I6Y+=s2y;I6Y+=v3C;I6Y+=y7n.a7C;that[I6Y](fieldName)[F2y]();delete fields[fieldName];var orderIdx=$[n6Y](fieldName,this[O2C][c5X]);this[O2C][p6Y][x9Y](orderIdx,s7C);var includeIdx=$[s9Y](fieldName,this[O2C][F9Y]);if(includeIdx!==-s7C){this[O2C][n8X][V2y](includeIdx,s7C);}}else{var U9Y=U2y;U9Y+=T9C;U9Y+=A2y;U9Y+=Q2y;var V9Y=D2C;V9Y+=y7n.X7C;V9Y+=y7n.t7C;V9Y+=C6C;$[V9Y](this[U9Y](fieldName),function(i,name){var S2y="lear";var Q9Y=y7n.t7C;Q9Y+=S2y;var A9Y=y7n.v7C;A9Y+=y7n.g7C;y7n[A9Y]();that[Q9Y](name);});}y7n[S9Y]();return this;};Editor[k9Y][N9Y]=function(){var L9Y=y7n.v7C;L9Y+=y7n.g7C;y7n[L9Y]();this[z8X](X4C);return this;};Editor[O9Y][D9Y]=function(arg1,arg2,arg3,arg4){var N2y="Cr";var O2y="ock";var D2y="modif";var k2y="init";var L2y="vent";var d9Y=k2y;d9Y+=N2y;d9Y+=L0C;var J9Y=t2C;J9Y+=D2C;J9Y+=L2y;var u9Y=D2C;u9Y+=y7n.X7C;u9Y+=y7n.t7C;u9Y+=C6C;var W9Y=X2X;W9Y+=O2y;var r9Y=y7n.a7C;r9Y+=r6C;r9Y+=y7n.z7C;var K9Y=D2y;K9Y+=C2y;var l9Y=E2y;l9Y+=W1C;var E9Y=t2C;E9Y+=k2C;E9Y+=W9C;E9Y+=l2y;var C9Y=y7n.H7C;C9Y+=s2y;C9Y+=p6C;C9Y+=O2C;var that=this;var fields=this[O2C][C9Y];var count=s7C;if(this[E9Y](function(){y7n[d4C]();that[K2y](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1===r2y){count=arg1;arg1=arg2;arg2=arg3;}this[O2C][W2y]={};for(var i=x7C;i<count;i++){this[O2C][W2y][i]={fields:this[O2C][h5X]};}var argOpts=this[u2y](arg1,arg2,arg3,arg4);this[O2C][y1C]=i2y;this[O2C][J7y]=l9Y;this[O2C][K9Y]=S8C;this[r9Y][g3C][f4X][U0X]=W9Y;this[h2y]();this[f2y](this[h5X]());$[u9Y](fields,function(name,field){var B2y="ultiRes";var B9Y=W2C;B9Y+=y7n.H7C;var h9Y=y7n.z7C;h9Y+=B2y;h9Y+=E2X;var i9Y=y7n.v7C;i9Y+=y7n.g7C;y7n[i9Y]();field[h9Y]();for(var i=x7C;i<count;i++){var f9Y=y7n.a7C;f9Y+=j5X;field[J2y](i,field[f9Y]());}field[g2X](field[B9Y]());});this[J9Y](d9Y,S8C,function(){var d2y="_formO";var Z2y="ption";var M9Y=r6C;M9Y+=t2X;var G9Y=d2y;G9Y+=Z2y;G9Y+=O2C;var Z9Y=y7n.X7C;Z9Y+=y7n.g7C;y7n[Z9Y]();that[G2y]();that[G9Y](argOpts[M9Y]);argOpts[M2y]();});return this;};Editor[P8C][o2y]=function(parent){var j2y="penden";var T2y="isA";var m9Y=A2C;m9Y+=t3C;var T9Y=T2y;T9Y+=y2y;T9Y+=M3C;var o9Y=y7n.X7C;o9Y+=y7n.g7C;y7n[o9Y]();if($[T9Y](parent)){var y9Y=M6C;y9Y+=c7y;y9Y+=b4C;for(var i=x7C,ien=parent[y9Y];i<ien;i++){var j9Y=l1X;j9Y+=D2C;j9Y+=j2y;j9Y+=k2C;this[j9Y](parent[i]);}return this;}var field=this[M5X](parent);$(field[m9Y]())[H4X](m2y);return this;};Editor[P8C][q9Y]=function(parent,url,opts){var P2y="depend";var s1Y=F1C;s1Y+=y7n.a7C;s1Y+=D2C;var v9Y=q2y;v9Y+=s9X;var Y9Y=h1C;Y9Y+=O2C;Y9Y+=a8C;var w9Y=y7n.v7C;w9Y+=y7n.g7C;if($[o2X](parent)){var c9Y=v3C;c9Y+=c2y;for(var i=x7C,ien=parent[c9Y];i<ien;i++){var P9Y=P2y;P9Y+=W4X;this[P9Y](parent[i],url,opts);}return this;}y7n[w9Y]();var that=this;var field=this[M5X](parent);var ajaxOpts={type:w2y,dataType:Y9Y};opts=$[v9Y]({event:Y2y,data:S8C,preUpdate:S8C,postUpdate:S8C},opts);var update=function(json){var X2y='hide';var H2y="Upd";var n2y="postUpdate";var z2y='show';var R2y='error';var t2y="pdat";var b2y='message';var e2y="preUpdate";var x1Y=y3C;x1Y+=O2C;x1Y+=v2y;var I9Y=S2C;I9Y+=g2y;I9Y+=X2X;I9Y+=D2C;var z9Y=a2y;z9Y+=r3C;z9Y+=v3C;z9Y+=D2C;var X9Y=D2C;X9Y+=y7n.X7C;X9Y+=U5X;var R9Y=y7n.v7C;R9Y+=y7n.g7C;var H9Y=G0C;H9Y+=y7n.X7C;H9Y+=v3C;var t9Y=n3C;t9Y+=t2y;t9Y+=D2C;var a9Y=m7y;a9Y+=D2C;a9Y+=v3C;var g9Y=R7y;g9Y+=H2y;g9Y+=y7n.X7C;g9Y+=o6C;if(opts[g9Y]){opts[e2y](json);}$[P4C]({labels:a9Y,options:t9Y,values:H9Y,messages:b2y,errors:R2y},function(jsonProp,fieldFn){if(json[jsonProp]){var e9Y=D2C;e9Y+=T1X;$[e9Y](json[jsonProp],function(field,val){var b9Y=i9C;b9Y+=D2C;b9Y+=p6C;that[b9Y](field)[fieldFn](val);});}});y7n[R9Y]();$[X9Y]([X2y,z2y,z9Y,I9Y],function(i,key){var n9Y=y7n.v7C;n9Y+=y7n.g7C;y7n[n9Y]();if(json[key]){var p9Y=u1X;p9Y+=W9C;p9Y+=I2y;p9Y+=D2C;that[key](json[key],json[p9Y]);}});if(opts[n2y]){opts[n2y](json);}field[x1Y](X4C);};$(field[s1Y]())[a8C](opts[p2y]+m2y,function(e){var F3y="editFi";var U3y="values";var k3y="PlainObj";var L1Y=y7n.H7C;L1Y+=x3y;var k1Y=Z3C;k1Y+=r6C;k1Y+=y6X;k1Y+=O2C;var S1Y=Z3C;S1Y+=s3y;S1Y+=O2C;var Q1Y=Z3C;Q1Y+=r6C;Q1Y+=y6X;var A1Y=y7n.a7C;A1Y+=y7n.X7C;A1Y+=w2X;var U1Y=F3y;U1Y+=C5X;var V1Y=y7n.H7C;V1Y+=W9C;V1Y+=A2C;V1Y+=y7n.a7C;var F1Y=F1C;F1Y+=y7n.a7C;F1Y+=D2C;if($(field[F1Y]())[V1Y](e[M9X])[Z7X]===x7C){return;}field[U8C](I4C);var data={};data[V3y]=that[O2C][U1Y]?_pluck(that[O2C][W2y],A1Y):S8C;data[Q1Y]=data[S1Y]?data[k1Y][x7C]:S8C;y7n[y7n.p7C]();data[U3y]=that[F2X]();if(opts[v5C]){var N1Y=A3y;N1Y+=k2C;N1Y+=y7n.X7C;var ret=opts[N1Y](data);if(ret){opts[v5C]=ret;}}if(typeof url===L1Y){var O1Y=G0C;O1Y+=y7n.X7C;O1Y+=v3C;var o=url(field[O1Y](),data,update);if(o){var D1Y=Q3y;D1Y+=j7y;D1Y+=A2C;if(typeof o===y7n.F2C&&typeof o[S3y]===D1Y){var C1Y=k2C;C1Y+=C6C;C1Y+=r1C;o[C1Y](function(resolved){if(resolved){update(resolved);}});}else{update(o);}}}else{var r1Y=y7n.X7C;r1Y+=h1C;r1Y+=y7n.X7C;r1Y+=T2C;var E1Y=Q2X;E1Y+=k3y;E1Y+=K2X;E1Y+=k2C;if($[E1Y](url)){var l1Y=D2C;l1Y+=T2C;l1Y+=y2C;l1Y+=y7n.a7C;$[l1Y](ajaxOpts,url);}else{var K1Y=n3C;K1Y+=Z3C;K1Y+=v3C;ajaxOpts[K1Y]=url;}$[r1Y]($[T5C](ajaxOpts,{url:url,data:data,success:update}));}});return this;};Editor[W1Y][F2y]=function(){var N3y=".d";var E3y="template";var C3y="clear";var O3y="Controller";var L3y="splay";var B1Y=y7n.a7C;B1Y+=r6C;B1Y+=y7n.z7C;var f1Y=N3y;f1Y+=k2C;f1Y+=D2C;var h1Y=S2C;h1Y+=L3y;h1Y+=O3y;if(this[O2C][D3y]){this[h6X]();}this[C3y]();if(this[O2C][E3y]){var i1Y=n1X;i1Y+=y7n.a7C;var u1Y=r3C;u1Y+=j1C;u1Y+=M3C;$(u1Y)[i1Y](this[O2C][E3y]);}var controller=this[O2C][h1Y];if(controller[F2y]){controller[F2y](this);}$(document)[H4X](f1Y+this[O2C][l3y]);this[B1Y]=S8C;this[O2C]=S8C;};Editor[P8C][K3y]=function(name){var W3y="eldName";var J1Y=r3y;J1Y+=W9C;J1Y+=W3y;J1Y+=O2C;var that=this;y7n[d4C]();$[P4C](this[J1Y](name),function(i,n){var u3y="sable";var Z1Y=y7n.a7C;Z1Y+=W9C;Z1Y+=u3y;var d1Y=i3y;d1Y+=v3C;d1Y+=y7n.a7C;that[d1Y](n)[Z1Y]();});return this;};Editor[P8C][G1Y]=function(show){if(show===undefined){return this[O2C][D3y];}return this[show?h3y:t3X]();};Editor[P8C][D3y]=function(){var M1Y=f3y;M1Y+=B3y;return $[J3y](this[O2C][M1Y],function(field,name){var o1Y=y7n.v7C;o1Y+=y7n.g7C;y7n[o1Y]();return field[D3y]()?name:S8C;});};Editor[P8C][T1Y]=function(){var y1Y=A2C;y1Y+=r6C;y1Y+=y7n.a7C;y1Y+=D2C;return this[O2C][O6X][y1Y](this);};Editor[P8C][d3y]=function(items,arg1,arg2,arg3,arg4){var m1Y=b9X;m1Y+=D9C;var that=this;if(this[U8X](function(){var j1Y=Z3y;j1Y+=k2C;that[j1Y](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[u2y](arg1,arg2,arg3,arg4);this[S8X](items,this[Q8X](G3y,items),m1Y,argOpts[B8C],function(){var o3y="sembleMai";var M3y="_as";var c1Y=d8X;c1Y+=R3C;var q1Y=M3y;q1Y+=o3y;q1Y+=A2C;that[q1Y]();that[c1Y](argOpts[B8C]);y7n[y7n.p7C]();argOpts[M2y]();});return this;};Editor[P8C][T3y]=function(name){var j3y="dNames";var y3y="_fiel";var w1Y=y3y;w1Y+=j3y;var P1Y=D2C;P1Y+=y7n.X7C;P1Y+=y7n.t7C;P1Y+=C6C;var that=this;$[P1Y](this[w1Y](name),function(i,n){var v1Y=a2y;v1Y+=r3C;v1Y+=v3C;v1Y+=D2C;var Y1Y=i3y;Y1Y+=v3C;Y1Y+=y7n.a7C;that[Y1Y](n)[v1Y]();});y7n[y7n.p7C]();return this;};Editor[g1Y][a1Y]=function(name,msg){var m3y="formErr";var q3y="_message";var H1Y=y7n.v7C;H1Y+=y7n.g7C;if(msg===undefined){var t1Y=m3y;t1Y+=r6C;t1Y+=Z3C;this[q3y](this[l8C][t1Y],name);this[O2C][c3y]=name;}else{this[M5X](name)[C7X](msg);}y7n[H1Y]();return this;};Editor[e1Y][b1Y]=function(name){var P3y='Unknown field name - ';var R1Y=i3y;R1Y+=p6C;R1Y+=O2C;var fields=this[O2C][R1Y];if(!fields[name]){throw P3y+name;}return fields[name];};Editor[P8C][X1Y]=function(){var z1Y=y7n.z7C;z1Y+=y7n.X7C;z1Y+=z3C;return $[z1Y](this[O2C][h5X],function(field,name){return name;});};Editor[P8C][w3y]=_api_file;Editor[P8C][Y4C]=_api_files;Editor[I1Y][n1Y]=function(name){var that=this;y7n[y7n.p7C]();if(!name){var p1Y=i3y;p1Y+=v3C;p1Y+=B3y;name=this[p1Y]();}if($[o2X](name)){var out={};$[P4C](name,function(i,n){var x4Y=Q1C;x4Y+=E2X;out[n]=that[M5X](n)[x4Y]();});return out;}return this[M5X](name)[W0X]();};Editor[P8C][Y3y]=function(names,animate){var s4Y=D2C;s4Y+=y7n.X7C;s4Y+=y7n.t7C;s4Y+=C6C;var that=this;$[s4Y](this[v3y](names),function(i,n){var F4Y=i9C;F4Y+=T9C;F4Y+=y7n.a7C;that[F4Y](n)[Y3y](animate);});return this;};Editor[P8C][V4Y]=function(includeHash){var g3y="ditF";var A4Y=D2C;A4Y+=g3y;A4Y+=a3y;var U4Y=y7n.z7C;U4Y+=Y3X;return $[U4Y](this[O2C][A4Y],function(edit,idSrc){return includeHash===I4C?t3y+idSrc:idSrc;});};Editor[Q4Y][S4Y]=function(inNames){var H3y="ldNames";var k4Y=r3y;k4Y+=s2y;k4Y+=H3y;var formError=$(this[l8C][w8X]);y7n[d4C]();if(this[O2C][c3y]){return I4C;}var names=this[k4Y](inNames);for(var i=x7C,ien=names[Z7X];i<ien;i++){var L4Y=W9C;L4Y+=A2C;L4Y+=C3C;var N4Y=y7n.H7C;N4Y+=W9C;N4Y+=l5X;if(this[N4Y](names[i])[L4Y]()){return I4C;}}return X4C;};Editor[O4Y][e3y]=function(cell,fieldName,opts){var Q6y='div.DTE_Field';var R3y="ine";var X3y="_ti";var z3y="ndiv";var I3y="ual";var h4Y=b3y;h4Y+=R3y;var i4Y=X3y;i4Y+=l2y;var u4Y=v3C;u4Y+=r1C;u4Y+=O5X;var E4Y=y7n.t7C;E4Y+=x7X;E4Y+=Q7X;var C4Y=W9C;C4Y+=z3y;C4Y+=c5C;C4Y+=I3y;var D4Y=W9C;D4Y+=n3y;D4Y+=W9C;D4Y+=N6C;var that=this;if($[A8X](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[T5C]({},this[O2C][p3y][D4Y],opts);var editFields=this[Q8X](C4Y,cell,fieldName);var node,field;var countOuter=x7C,countInner;var closed=X4C;var classes=this[E4Y][e3y];$[P4C](editFields,function(i,editField){var V6y="row inline at a time";var s6y="Cannot edit more than on";var F6y="e ";var r4Y=L1C;r4Y+=z3C;r4Y+=x6y;r4Y+=B3y;var K4Y=y7n.X7C;K4Y+=U7y;K4Y+=n4C;K4Y+=C6C;if(countOuter>x7C){var l4Y=s6y;l4Y+=F6y;l4Y+=V6y;throw l4Y;}node=$(editField[K4Y][x7C]);countInner=x7C;$[P4C](editField[r4Y],function(j,f){var A6y=" time";var U6y="e field inline at a";if(countInner>x7C){var W4Y=s6y;W4Y+=U6y;W4Y+=A6y;throw W4Y;}y7n[y7n.p7C]();field=f;countInner++;});countOuter++;});if($(Q6y,node)[u4Y]){return this;}if(this[i4Y](function(){y7n[y7n.p7C]();that[e3y](cell,fieldName,opts);})){return this;}this[S8X](cell,editFields,h4Y,opts,function(){var K6y="ntents";var r6y="_formOptions";var u6y='px">';var B6y="butto";var l6y=" style=\"width:";var i6y='<div class="DTE_Processing_Indicator"><span/></div>';var O6y="mEr";var N6y="closeRe";var p4Y=S6y;p4Y+=k6y;p4Y+=A0X;p4Y+=r1C;var n4Y=y7n.H7C;n4Y+=r6C;n4Y+=m7X;var g4Y=t2C;g4Y+=N6y;g4Y+=Q1C;var c4Y=r3C;c4Y+=O9X;c4Y+=L6y;var q4Y=x3C;q4Y+=Z3C;q4Y+=O6y;q4Y+=D6y;var m4Y=y7n.a7C;m4Y+=r6C;m4Y+=y7n.z7C;var j4Y=G0X;j4Y+=A2C;j4Y+=y7n.a7C;var y4Y=F1C;y4Y+=y7n.a7C;y4Y+=D2C;var T4Y=S2C;T4Y+=C6y;var o4Y=r0C;o4Y+=j0C;o4Y+=E6y;var M4Y=y6X;M4Y+=W9C;M4Y+=y7n.a7C;M4Y+=b4C;var G4Y=y4C;G4Y+=l6y;var Z4Y=r0C;Z4Y+=u0C;Z4Y+=W6C;Z4Y+=u5C;var d4Y=x1X;d4Y+=G0X;d4Y+=Z3C;var J4Y=W2C;J4Y+=k2C;J4Y+=T1X;var B4Y=O7X;B4Y+=K6y;var f4Y=D9C;f4Y+=v3C;f4Y+=D9C;f4Y+=D2C;var namespace=that[r6y](opts);var ret=that[W6y](f4Y);if(!ret){return that;}var children=node[B4Y]()[J4Y]();node[z7X]($(y8X+classes[d4Y]+b5C+Z4Y+classes[j8X]+G4Y+node[M4Y]()+u6y+i6y+X5C+y8X+classes[g8X]+I5C+o4Y));node[h6y](T4Y+classes[j8X][B2X](/ /g,f6y))[z7X](field[y4Y]())[j4Y](that[m4Y][q4Y]);if(opts[c4Y]){var v4Y=B6y;v4Y+=A2C;v4Y+=O2C;var Y4Y=G0X;Y4Y+=s9X;var w4Y=y7n.a7C;w4Y+=W9C;w4Y+=G0C;w4Y+=J6y;var P4Y=i9C;P4Y+=A2C;P4Y+=y7n.a7C;node[P4Y](w4Y+classes[g8X][B2X](/ /g,f6y))[Y4Y](that[l8C][v4Y]);}that[g4Y](function(submitComplete,action){var G6y="contents";var a4Y=y7n.t7C;a4Y+=d6y;a4Y+=o3X;closed=I4C;$(document)[H4X](a4Y+namespace);if(!submitComplete||action!==Z6y){node[G6y]()[R7X]();node[z7X](children);}that[M6y]();});setTimeout(function(){var t4Y=u1C;t4Y+=o6y;t4Y+=o3X;if(closed){return;}$(document)[a8C](t4Y+namespace,function(e){var j6y="dSelf";var c6y="addBa";var q6y="Back";var m6y="dd";var P6y='owns';var I4Y=a4X;I4Y+=Z3C;I4Y+=T6y;var z4Y=y6y;z4Y+=Z3C;z4Y+=Z3C;z4Y+=C1C;var X4Y=k2C;X4Y+=D6C;X4Y+=Q1C;X4Y+=E2X;var R4Y=u1X;R4Y+=j6y;var b4Y=y7n.X7C;b4Y+=m6y;b4Y+=q6y;var e4Y=c6y;e4Y+=D2X;var H4Y=y7n.X7C;H4Y+=y7n.g7C;y7n[H4Y]();var back=$[o4C][e4Y]?b4Y:R4Y;if(!field[Q8C](P6y,e[X4Y])&&$[z4Y](node[x7C],$(e[M9X])[I4Y]()[back]())===-s7C){that[H5X]();}});},x7C);that[w6y]([field],opts[n4Y]);that[p4Y](Y6y);});return this;};Editor[P8C][x0Y]=function(name,msg){var g6y="essag";var v6y="_m";if(msg===undefined){var F0Y=T3X;F0Y+=y7n.z7C;var s0Y=v6y;s0Y+=g6y;s0Y+=D2C;this[s0Y](this[F0Y][v8X],name);}else{var V0Y=y7n.H7C;V0Y+=s2y;V0Y+=p6C;this[V0Y](name)[e6C](msg);}return this;};Editor[U0Y][A0Y]=function(mode){var R6y="Changi";var X6y="ng f";var b6y="ot currently in an editing mode";var z6y="rom create mode is not supported";var O0Y=a6y;O0Y+=w3C;var N0Y=y7n.t7C;N0Y+=t6y;N0Y+=o6C;var k0Y=x5X;k0Y+=L0C;var Q0Y=H6y;Q0Y+=A2C;if(!mode){return this[O2C][J7y];}if(!this[O2C][Q0Y]){var S0Y=e6y;S0Y+=b6y;throw new Error(S0Y);}else if(this[O2C][J7y]===k0Y&&mode!==N0Y){var L0Y=R6y;L0Y+=X6y;L0Y+=z6y;throw new Error(L0Y);}this[O2C][O0Y]=mode;return this;};Editor[P8C][I6y]=function(){var n6y="odifier";var C0Y=y7n.z7C;C0Y+=n6y;var D0Y=y7n.X7C;D0Y+=y7n.g7C;y7n[D0Y]();return this[O2C][C0Y];};Editor[E0Y][p6y]=function(fieldNames){var u0Y=i9C;u0Y+=D2C;u0Y+=p6C;var K0Y=Q2X;K0Y+=A3X;K0Y+=y2y;K0Y+=M3C;var that=this;if(fieldNames===undefined){var l0Y=y7n.H7C;l0Y+=s2y;l0Y+=S1C;fieldNames=this[l0Y]();}if($[K0Y](fieldNames)){var out={};$[P4C](fieldNames,function(i,name){var W0Y=i9C;W0Y+=l5X;var r0Y=y7n.v7C;r0Y+=y7n.g7C;y7n[r0Y]();out[name]=that[W0Y](name)[p6y]();});return out;}y7n[d4C]();return this[u0Y](fieldNames)[p6y]();};Editor[P8C][J2y]=function(fieldNames,val){var x9y="ltiSet";var that=this;if($[A8X](fieldNames)&&val===undefined){$[P4C](fieldNames,function(name,value){var f0Y=I2C;f0Y+=x9y;var h0Y=f3y;h0Y+=y7n.a7C;var i0Y=y7n.X7C;i0Y+=y7n.g7C;y7n[i0Y]();that[h0Y](name)[f0Y](value);});}else{var B0Y=I2C;B0Y+=x9y;this[M5X](fieldNames)[B0Y](val);}return this;};Editor[J0Y][d0Y]=function(name){var Z0Y=W9C;Z0Y+=s9y;Z0Y+=y7n.X7C;Z0Y+=M3C;var that=this;if(!name){name=this[c5X]();}return $[Z0Y](name)?$[J3y](name,function(n){var M0Y=A2C;M0Y+=j1C;M0Y+=D2C;var G0Y=y7n.H7C;G0Y+=s2y;G0Y+=v3C;G0Y+=y7n.a7C;return that[G0Y](n)[M0Y]();}):this[M5X](name)[F9y]();};Editor[o0Y][H4X]=function(name,fn){$(this)[H4X](this[V9y](name),fn);y7n[y7n.p7C]();return this;};Editor[T0Y][y0Y]=function(name,fn){$(this)[a8C](this[V9y](name),fn);return this;};Editor[j0Y][b8C]=function(name,fn){var A9y="tN";var q0Y=U9y;q0Y+=A9y;q0Y+=y7n.X7C;q0Y+=f2C;var m0Y=r6C;m0Y+=N6C;$(this)[m0Y](this[q0Y](name),fn);return this;};Editor[c0Y][P0Y]=function(){var L9y="layReorder";var k9y="pper";var N9y="_di";var S9y="tope";var I0Y=Q9y;I0Y+=O2C;I0Y+=S9y;I0Y+=A2C;var H0Y=y6X;H0Y+=j6X;H0Y+=k9y;var t0Y=y7n.a7C;t0Y+=r6C;t0Y+=y7n.z7C;var a0Y=p9C;a0Y+=r1C;var Y0Y=t2C;Y0Y+=h6X;Y0Y+=T5X;Y0Y+=Q1C;var w0Y=N9y;w0Y+=O8C;w0Y+=L9y;var that=this;this[w0Y]();this[Y0Y](function(submitComplete){var v0Y=j4X;v0Y+=O2C;v0Y+=D2C;that[O2C][O6X][v0Y](that,function(){var D9y="namicIn";var O9y="_clearDy";var g0Y=O9y;g0Y+=D9y;g0Y+=y7n.H7C;g0Y+=r6C;y7n[d4C]();that[g0Y]();});});var ret=this[W6y](i2y);if(!ret){return this;}this[O2C][O6X][a0Y](this,this[t0Y][H0Y],function(){var z0Y=M8C;z0Y+=o8C;var R0Y=r6C;R0Y+=Z3C;R0Y+=C9y;var b0Y=y7n.z7C;b0Y+=Y3X;var e0Y=X6C;e0Y+=y7n.t7C;e0Y+=o8C;that[e0Y]($[b0Y](that[O2C][R0Y],function(name){var X0Y=y7n.H7C;X0Y+=s2y;X0Y+=p6C;X0Y+=O2C;y7n[d4C]();return that[O2C][X0Y][name];}),that[O2C][a5X][z0Y]);});this[I0Y](i2y);return this;};Editor[n0Y][p0Y]=function(set){var r9y="All fields, and no additional fields, must be provided for ordering.";var E9y="sort";var k5Y=r6C;k5Y+=N5X;var S5Y=D2C;S5Y+=C2C;S5Y+=K1C;var Q5Y=O2C;Q5Y+=r6C;Q5Y+=Z3C;Q5Y+=k2C;var A5Y=O2C;A5Y+=d6y;A5Y+=D2C;var U5Y=h1C;U5Y+=r6C;U5Y+=D9C;var V5Y=c8C;V5Y+=W9C;V5Y+=B9C;var F5Y=r6C;F5Y+=Z3C;F5Y+=W2C;F5Y+=Z3C;var x5Y=Q2X;x5Y+=x2y;if(!set){return this[O2C][c5X];}if(arguments[Z7X]&&!$[x5Y](set)){var s5Y=O2C;s5Y+=N6X;s5Y+=y7n.t7C;s5Y+=D2C;set=Array[P8C][s5Y][I7y](arguments);}if(this[O2C][F5Y][V5Y]()[E9y]()[U5Y](l9y)!==set[A5Y]()[Q5Y]()[K9y](l9y)){throw r9y;}$[S5Y](this[O2C][k5Y],set);this[f2y]();return this;};Editor[N5Y][L5Y]=function(items,arg1,arg2,arg3,arg4){var B9y="modifi";var W9y="ini";var J9y="_cru";var u9y="tRemove";var f9y="orm";var d9y="dArgs";var i9y="_acti";var h5Y=A3y;h5Y+=k2C;h5Y+=y7n.X7C;var i5Y=A2C;i5Y+=r6C;i5Y+=W2C;var u5Y=W9y;u5Y+=u9y;var W5Y=i9y;W5Y+=a8C;W5Y+=h9y;W5Y+=i3X;var r5Y=A2C;r5Y+=r6C;r5Y+=A2C;r5Y+=D2C;var K5Y=y7n.H7C;K5Y+=f9y;var l5Y=B9y;l5Y+=D2C;l5Y+=Z3C;var E5Y=y7n.X7C;E5Y+=y7n.t7C;E5Y+=t9C;E5Y+=a8C;var C5Y=y7n.H7C;C5Y+=s2y;C5Y+=p6C;C5Y+=O2C;var D5Y=J9y;D5Y+=d9y;var O5Y=t2C;O5Y+=t9C;O5Y+=l2y;var that=this;if(this[O5Y](function(){y7n[d4C]();that[H2X](items,arg1,arg2,arg3,arg4);})){return this;}if(items[Z7X]===undefined){items=[items];}var argOpts=this[D5Y](arg1,arg2,arg3,arg4);var editFields=this[Q8X](C5Y,items);this[O2C][E5Y]=H2X;this[O2C][l5Y]=items;this[O2C][W2y]=editFields;this[l8C][K5Y][f4X][U0X]=r5Y;this[W5Y]();this[Z9y](u5Y,[_pluck(editFields,i5Y),_pluck(editFields,h5Y),items],function(){var G9y='initMultiRemove';y7n[y7n.p7C]();that[Z9y](G9y,[editFields,items],function(){var T9y="ocu";var o9y="rmOpt";var B5Y=M9y;B5Y+=O2C;var f5Y=t2C;f5Y+=x3C;f5Y+=o9y;f5Y+=R3C;that[G2y]();that[f5Y](argOpts[B5Y]);y7n[y7n.p7C]();argOpts[M2y]();var opts=that[O2C][a5X];if(opts[p8X]!==S8C){var Z5Y=y7n.H7C;Z5Y+=T9y;Z5Y+=O2C;var d5Y=D2C;d5Y+=l8X;var J5Y=y9y;J5Y+=e9C;J5Y+=A2C;$(J5Y,that[l8C][g8X])[d5Y](opts[Z5Y])[p8X]();}});});return this;};Editor[P8C][g2X]=function(set,val){var j9y="isPla";var m9y="nObject";var G5Y=j9y;G5Y+=W9C;G5Y+=m9y;var that=this;if(!$[G5Y](set)){var o={};o[set]=val;set=o;}$[P4C](set,function(n,v){that[M5X](n)[g2X](v);});return this;};Editor[M5Y][I1X]=function(names,animate){var o5Y=D2C;o5Y+=y7n.X7C;o5Y+=y7n.t7C;o5Y+=C6C;var that=this;y7n[y7n.p7C]();$[o5Y](this[v3y](names),function(i,n){var y5Y=O2C;y5Y+=C6C;y5Y+=r6C;y5Y+=y6X;var T5Y=f3y;T5Y+=y7n.a7C;that[T5Y](n)[y5Y](animate);});return this;};Editor[P8C][j5Y]=function(successCallback,errorCallback,formatdata,hide){var c9y="proc";var P9y="essi";var g5Y=q9y;g5Y+=U5X;var w5Y=D2C;w5Y+=T1X;var q5Y=a6y;q5Y+=w3C;var m5Y=c9y;m5Y+=P9y;m5Y+=c7y;var that=this,fields=this[O2C][h5X],errorFields=[],errorReady=x7C,sent=X4C;if(this[O2C][m5Y]||!this[O2C][q5Y]){return this;}this[w9y](I4C);var send=function(){var Y9y='initSubmit';var c5Y=a6y;c5Y+=w3C;y7n[d4C]();if(errorFields[Z7X]!==errorReady||sent){return;}that[Z9y](Y9y,[that[O2C][c5Y]],function(result){var P5Y=C6X;P5Y+=v9y;y7n[d4C]();if(result===X4C){that[w9y](X4C);return;}sent=I4C;that[P5Y](successCallback,errorCallback,formatdata,hide);});};this[C7X]();$[w5Y](fields,function(name,field){var g9y="nEr";var Y5Y=W9C;Y5Y+=g9y;Y5Y+=D6y;if(field[Y5Y]()){var v5Y=z3C;v5Y+=o8C;v5Y+=C6C;errorFields[v5Y](name);}});$[g5Y](errorFields,function(i,name){fields[name][C7X](l4C,function(){errorReady++;send();});});send();return this;};Editor[P8C][a5Y]=function(set){var a9y="tem";var t9y="plate";var H9y="mplate";var H5Y=a9y;H5Y+=t9y;y7n[y7n.p7C]();if(set===undefined){var t5Y=o6C;t5Y+=H9y;return this[O2C][t5Y];}this[O2C][H5Y]=set===S8C?S8C:$(set);return this;};Editor[e5Y][b5Y]=function(title){var b9y="ader";var e9y="iv.";var s8Y=L3X;s8Y+=U3X;var n5Y=u1C;n5Y+=E5X;var I5Y=y7n.a7C;I5Y+=e9y;var z5Y=U5X;z5Y+=W9C;z5Y+=p6C;z5Y+=z8C;var X5Y=s1X;X5Y+=b9y;var R5Y=y7n.a7C;R5Y+=r6C;R5Y+=y7n.z7C;var header=$(this[R5Y][X5Y])[z5Y](I5Y+this[n5Y][A5X][W6X]);if(title===undefined){return header[X7X]();}if(typeof title===y7n.s2C){var x8Y=w2X;x8Y+=X2X;x8Y+=D2C;var p5Y=A3X;p5Y+=z3C;p5Y+=W9C;title=title(this,new DataTable[p5Y](this[O2C][x8Y]));}header[s8Y](title);y7n[y7n.p7C]();return this;};Editor[F8Y][F2X]=function(field,value){var U8Y=Q1C;U8Y+=D2C;U8Y+=k2C;if(value!==undefined||$[A8X](field)){var V8Y=O2C;V8Y+=E2X;return this[V8Y](field,value);}return this[U8Y](field);};var apiRegister=DataTable[A8Y][Q8Y];function __getInst(api){var X9y="oInit";var R9y="context";var S8Y=D2C;S8Y+=w1C;var ctx=api[R9y][x7C];return ctx[X9y][S8Y]||ctx[z9y];}function __setBasic(inst,opts,type,plural){var Q1y='1';var p9y="itl";var V1y="confir";var I9y="asic";var A1y=/%d/;var N8Y=y9y;N8Y+=L6y;var k8Y=y7n.X7C;k8Y+=y7n.g7C;y7n[k8Y]();if(!opts){opts={};}if(opts[N8Y]===undefined){var L8Y=b5X;L8Y+=I9y;opts[g8X]=L8Y;}if(opts[n9y]===undefined){var O8Y=k2C;O8Y+=p9y;O8Y+=D2C;opts[n9y]=inst[o5C][type][O8Y];}if(opts[e6C]===undefined){if(type===x1y){var E8Y=s1y;E8Y+=f1C;E8Y+=F1y;var C8Y=V1y;C8Y+=y7n.z7C;var D8Y=W9C;D8Y+=y7n.b7C;D8Y+=U1y;var confirm=inst[D8Y][type][C8Y];opts[e6C]=plural!==s7C?confirm[t2C][E8Y](A1y,plural):confirm[Q1y];}else{opts[e6C]=l4C;}}return opts;}apiRegister(l8Y,function(){var K8Y=y7n.X7C;K8Y+=y7n.g7C;y7n[K8Y]();return __getInst(this);});apiRegister(r8Y,function(opts){var W8Y=y7n.t7C;W8Y+=t6y;W8Y+=o6C;var inst=__getInst(this);inst[K2y](__setBasic(inst,opts,W8Y));y7n[y7n.p7C]();return this;});apiRegister(S1y,function(opts){var inst=__getInst(this);y7n[d4C]();inst[d3y](this[x7C][x7C],__setBasic(inst,opts,Z6y));return this;});apiRegister(u8Y,function(opts){var i8Y=Z3y;i8Y+=k2C;var inst=__getInst(this);inst[i8Y](this[x7C],__setBasic(inst,opts,Z6y));y7n[y7n.p7C]();return this;});apiRegister(h8Y,function(opts){var inst=__getInst(this);inst[H2X](this[x7C][x7C],__setBasic(inst,opts,x1y,s7C));return this;});apiRegister(f8Y,function(opts){var B8Y=Z3C;B8Y+=z9C;B8Y+=r6C;B8Y+=V2C;var inst=__getInst(this);inst[B8Y](this[x7C],__setBasic(inst,opts,x1y,this[x7C][Z7X]));return this;});apiRegister(k1y,function(type,opts){if(!type){type=Y6y;}else if($[A8X](type)){var J8Y=b3y;J8Y+=W9C;J8Y+=A2C;J8Y+=D2C;opts=type;type=J8Y;}__getInst(this)[type](this[x7C][x7C],opts);y7n[y7n.p7C]();return this;});apiRegister(d8Y,function(opts){__getInst(this)[R5X](this[x7C],opts);return this;});apiRegister(Z8Y,_api_file);apiRegister(N1y,_api_files);$(document)[a8C](L1y,function(e,ctx,json){var O1y="namespace";var D1y='dt';var G8Y=y7n.H7C;G8Y+=a4C;G8Y+=D2C;G8Y+=O2C;if(e[O1y]!==D1y){return;}if(json&&json[G8Y]){var o8Y=y7n.H7C;o8Y+=a4C;o8Y+=s7X;var M8Y=q9y;M8Y+=U5X;$[M8Y](json[o8Y],function(name,files){var y8Y=D2C;y8Y+=C1y;y8Y+=s9X;var T8Y=y7n.v7C;T8Y+=y7n.g7C;if(!Editor[Y4C][name]){Editor[Y4C][name]={};}y7n[T8Y]();$[y8Y](Editor[Y4C][name],files);});}});Editor[j8Y]=function(msg,tn){var E1y=' For more information, please refer to https://datatables.net/tn/';y7n[y7n.p7C]();throw tn?msg+E1y+tn:msg;};Editor[m8Y]=function(data,props,fn){var u1y="isPlainOb";var W1y='value';var i1y="labe";var r1y='label';var c8Y=W9C;c8Y+=l1y;c8Y+=K1y;var q8Y=N0C;q8Y+=o6C;q8Y+=A2C;q8Y+=y7n.a7C;var i,ien,dataPoint;y7n[y7n.p7C]();props=$[q8Y]({label:r1y,value:W1y},props);if($[c8Y](data)){for(i=x7C,ien=data[Z7X];i<ien;i++){var P8Y=u1y;P8Y+=h1C;P8Y+=D2C;P8Y+=F5X;dataPoint=data[i];if($[P8Y](dataPoint)){var v8Y=i1y;v8Y+=v3C;var Y8Y=i1y;Y8Y+=v3C;var w8Y=G0C;w8Y+=B5C;w8Y+=n3C;w8Y+=D2C;fn(dataPoint[props[w8Y]]===undefined?dataPoint[props[Y8Y]]:dataPoint[props[h1y]],dataPoint[props[v8Y]],i,dataPoint[w7y]);}else{fn(dataPoint,dataPoint,i);}}}else{i=x7C;$[P4C](data,function(key,val){fn(val,key,i);y7n[y7n.p7C]();i++;});}};Editor[f1y]=function(id){return id[B2X](/\./g,l9y);};Editor[g8Y]=function(editor,conf,files,progressCallback,completeCallback){var d1y="dText";var d4y="_limitLeft";var a1y="readAsDataURL";var J1y="fileRea";var Z4y="plice";var Z1y='A server error occurred while uploading the file';var M1y="<i>Uploading file</i>";var B1y="oa";var p7J=y7n.z7C;p7J+=y7n.X7C;p7J+=z3C;var e8Y=r6C;e8Y+=n3y;e8Y+=B1y;e8Y+=y7n.a7C;var H8Y=J1y;H8Y+=d1y;var a8Y=Q3y;a8Y+=W9C;a8Y+=a8C;var reader=new FileReader();var counter=x7C;var ids=[];var generalError=Z1y;editor[C7X](conf[q5C],l4C);if(typeof conf[G1y]===a8Y){conf[G1y](files,function(ids){var t8Y=y7n.t7C;t8Y+=y7n.X7C;t8Y+=P3X;y7n[d4C]();completeCallback[t8Y](editor,ids);});return;}progressCallback(conf,conf[H8Y]||M1y);reader[e8Y]=function(e){var m1y='uploadField';var P1y="up";var q1y="ajaxData";var H1y='preSubmit.DTE_Upload';var j1y='upload';var v1y='No Ajax option specified for upload plug-in';var o1y="eUploa";var c1y="aja";var w1y="jax";var e1y='post';var K7J=r6C;K7J+=A2C;var E7J=z3C;E7J+=Z3C;E7J+=o1y;E7J+=y7n.a7C;var C7J=t2C;C7J+=T1y;C7J+=o1C;var k7J=y7n.H7C;k7J+=x3y;var S7J=y7n.a7C;S7J+=y7n.X7C;S7J+=k2C;S7J+=y7n.X7C;var Q7J=Q6C;Q7J+=Z3C;Q7J+=W9C;Q7J+=c7y;var U7J=y7n.X7C;U7J+=h1C;U7J+=y7n.X7C;U7J+=T2C;var n8Y=y1y;n8Y+=Y5X;var z8Y=K6X;z8Y+=D2C;z8Y+=A2C;z8Y+=y7n.a7C;var X8Y=G0X;X8Y+=s9X;var R8Y=y7n.X7C;R8Y+=g5X;var b8Y=y7n.v7C;b8Y+=y7n.g7C;var data=new FormData();y7n[b8Y]();var ajax;data[z7X](R8Y,j1y);data[X8Y](m1y,conf[q5C]);data[z8Y](j1y,files[counter]);if(conf[q1y]){conf[q1y](data);}if(conf[G1y]){var I8Y=y7n.X7C;I8Y+=h1C;I8Y+=y7n.X7C;I8Y+=T2C;ajax=conf[I8Y];}else if($[A8X](editor[O2C][n8Y])){var V7J=c1y;V7J+=T2C;var F7J=P1y;F7J+=K9C;F7J+=y7n.X7C;F7J+=y7n.a7C;var s7J=y7n.X7C;s7J+=w1y;var x7J=Y1y;x7J+=y7n.a7C;var p8Y=y7n.X7C;p8Y+=h1C;p8Y+=y7n.X7C;p8Y+=T2C;ajax=editor[O2C][p8Y][x7J]?editor[O2C][s7J][F7J]:editor[O2C][V7J];}else if(typeof editor[O2C][U7J]===h2X){var A7J=y7n.X7C;A7J+=h1C;A7J+=y7n.X7C;A7J+=T2C;ajax=editor[O2C][A7J];}if(!ajax){throw v1y;}if(typeof ajax===Q7J){ajax={url:ajax};}if(typeof ajax[S7J]===k7J){var L7J=q9y;L7J+=U5X;var N7J=Q6C;N7J+=g1y;N7J+=c7y;var d={};var ret=ajax[v5C](d);if(ret!==undefined&&typeof ret!==N7J){d=ret;}$[L7J](d,function(key,value){var D7J=y7n.X7C;D7J+=z3C;D7J+=P6C;D7J+=s9X;var O7J=y7n.v7C;O7J+=y7n.g7C;y7n[O7J]();data[D7J](key,value);});}var preRet=editor[C7J](E7J,[conf[q5C],files[counter],data]);if(preRet===X4C){if(counter<files[Z7X]-s7C){counter++;reader[a1y](files[counter]);}else{var l7J=t1y;l7J+=v3C;completeCallback[l7J](editor,ids);}return;}var submit=X4C;editor[K7J](H1y,function(){submit=I4C;y7n[y7n.p7C]();return X4C;});$[G1y]($[T5C]({},ajax,{type:e1y,data:data,dataType:b1y,contentType:X4C,processData:X4C,xhr:function(){var I1y="nloadend";var R1y="ajaxSe";var X1y="ings";var n1y="onprogr";var u7J=y7n.X7C;u7J+=y7n.g7C;var W7J=T2C;W7J+=C6C;W7J+=Z3C;var r7J=R1y;r7J+=k2C;r7J+=k2C;r7J+=X1y;var xhr=$[r7J][W7J]();y7n[u7J]();if(xhr[z1y]){var d7J=r6C;d7J+=I1y;var h7J=n1y;h7J+=o0C;var i7J=n3C;i7J+=z3C;i7J+=p1y;i7J+=y7n.a7C;xhr[i7J][h7J]=function(e){var U4y=':';var V4y="%";var F4y="toFixed";var s4y="total";var x4y="ngthComput";var f7J=M6C;f7J+=x4y;f7J+=y7n.X7C;f7J+=d3X;if(e[f7J]){var J7J=M6C;J7J+=A7y;var B7J=K9C;B7J+=r9C;B7J+=D2C;B7J+=y7n.a7C;var percent=(e[B7J]/e[s4y]*T7C)[F4y](x7C)+V4y;progressCallback(conf,files[J7J]===s7C?percent:counter+U4y+files[Z7X]+H5C+percent);}};xhr[z1y][d7J]=function(e){var S4y="processingText";var A4y="Process";var Z7J=A4y;Z7J+=Q4y;progressCallback(conf,conf[S4y]||Z7J);};}return xhr;},success:function(json){var O4y="dXhrSu";var D4y="ccess";var C4y="_eve";var u4y="sh";var k4y="ieldErrors";var l4y="statu";var i4y="les";var g7J=n3C;g7J+=z3C;g7J+=p1y;g7J+=y7n.a7C;var m7J=v3C;m7J+=r1C;m7J+=O5X;var j7J=y7n.H7C;j7J+=k4y;var y7J=f3y;y7J+=N4y;y7J+=L4y;var T7J=P5C;T7J+=D2C;var o7J=Y1y;o7J+=O4y;o7J+=D4y;var M7J=C4y;M7J+=o1C;var G7J=r6C;G7J+=y7n.H7C;G7J+=y7n.H7C;y7n[y7n.p7C]();editor[G7J](H1y);editor[M7J](o7J,[conf[T7J],json]);if(json[y7J]&&json[j7J][m7J]){var q7J=s2X;q7J+=C6C;var errors=json[E4y];for(var i=x7C,ien=errors[q7J];i<ien;i++){var w7J=l4y;w7J+=O2C;var P7J=A2C;P7J+=y7n.X7C;P7J+=y7n.z7C;P7J+=D2C;var c7J=D2C;c7J+=Z3C;c7J+=j9C;c7J+=Z3C;editor[c7J](errors[i][P7J],errors[i][w7J]);}}else if(json[C7X]){var v7J=K4y;v7J+=Z3C;var Y7J=x6C;Y7J+=Z3C;Y7J+=r6C;Y7J+=Z3C;editor[Y7J](json[v7J]);}else if(!json[g7J]||!json[z1y][c5C]){var t7J=r4y;t7J+=y7n.z7C;t7J+=D2C;var a7J=D2C;a7J+=Z3C;a7J+=j9C;a7J+=Z3C;editor[a7J](conf[t7J],generalError);}else{var I7J=W9C;I7J+=y7n.a7C;var z7J=W4y;z7J+=u4y;var H7J=y7n.H7C;H7J+=W9C;H7J+=i4y;if(json[H7J]){$[P4C](json[Y4C],function(table,files){var X7J=i9C;X7J+=v3C;X7J+=s7X;var R7J=D2C;R7J+=h4y;var e7J=y7n.H7C;e7J+=a4C;e7J+=D2C;e7J+=O2C;y7n[y7n.p7C]();if(!Editor[e7J][table]){var b7J=y7n.H7C;b7J+=W9C;b7J+=M6C;b7J+=O2C;Editor[b7J][table]={};}$[R7J](Editor[X7J][table],files);});}ids[z7J](json[z1y][I7J]);if(counter<files[Z7X]-s7C){counter++;reader[a1y](files[counter]);}else{var n7J=f4y;n7J+=v3C;n7J+=v3C;completeCallback[n7J](editor,ids);if(submit){editor[B4y]();}}}progressCallback(conf);},error:function(xhr){var J4y='uploadXhrError';editor[Z9y](J4y,[conf[q5C],xhr]);editor[C7X](conf[q5C],generalError);progressCallback(conf);}}));};files=$[p7J](files,function(val){return val;});if(conf[d4y]!==undefined){var x2J=O2C;x2J+=Z4y;files[x2J](conf[d4y],files[Z7X]);}reader[a1y](files[x7C]);};Editor[s2J][G4y]=function(init){var k0y="t\" ";var c4y="essin";var b4y=" da";var I4y="a-dte-e=\"form_";var K0y="idSr";var R4y="ta-dte";var t4y="m_buttons\" class=\"";var w0y="ON";var w4y="yCo";var O0y="wrappe";var P0y="UTT";var g4y="uttons";var e0y='form_content';var Q0y="<div data-dte-e=\"body_";var R0y='body_content';var p4y="<div data-dt";var y0y='<div data-dte-e="head" class="';var F5y="troller";var m4y="nit.dt.d";var t0y="events";var d0y="indicator";var F0y="dte-e=\"form\" cl";var C0y="mpla";var D0y="ettin";var u0y="mTab";var q4y="roc";var f0y="domTable";var l0y="tabl";var o0y="tag";var y4y="uni";var x0y="e-e=\"form_content\" class=\"";var P4y="bod";var Z0y='<div data-dte-e="body" class="';var X4y="-e=\"form_info\" class=\"";var S0y="conten";var v0y="Too";var o4y="Comp";var n0y='xhr.dt.dte';var i0y="ults";var N0y="<div data-dte-e=\"pro";var a4y="<div data-dte-e=\"for";var L0y="essing\" class=\"";var I0y="nTable";var s0y="<form data-";var H4y="/></di";var c0y="B";var E0y="dataSourc";var n4y="error\" class=\"";var B0y="dataSources";var M4y="nit";var G0y='<div data-dte-e="foot" class="';var b0y='foot';var j0y='"><div class="';var j4y="que";var T0y='</form>';var s5y="ayCon";var W0y="dbTab";var v4y="ataTabl";var W3J=W9C;W3J+=M4y;W3J+=o4y;W3J+=T4y;var L3J=y4y;L3J+=j4y;var N3J=r6C;N3J+=A2C;var S3J=W9C;S3J+=m4y;S3J+=o6C;var Q3J=r6C;Q3J+=A2C;var A3J=i9C;A3J+=D2C;A3J+=p6C;A3J+=O2C;var U3J=z3C;U3J+=q4y;U3J+=c4y;U3J+=Q1C;var V3J=P4y;V3J+=w4y;V3J+=Y4y;var F3J=X8C;F3J+=l2y;var s3J=y7n.a7C;s3J+=W7X;var z2J=D2C;z2J+=T1X;var v2J=y7n.a7C;v2J+=v4y;v2J+=D2C;var Y2J=y7n.H7C;Y2J+=A2C;var w2J=y4C;w2J+=W0C;w2J+=i0C;var P2J=r3C;P2J+=g4y;var c2J=y7n.H7C;c2J+=r6C;c2J+=Z3C;c2J+=y7n.z7C;var q2J=a4y;q2J+=t4y;var m2J=y4C;m2J+=H4y;m2J+=G0C;m2J+=i0C;var j2J=e4y;j2J+=x6C;var y2J=V6X;y2J+=b4y;y2J+=R4y;y2J+=X4y;var T2J=y4C;T2J+=z4y;var o2J=x3C;o2J+=Z3C;o2J+=y7n.z7C;var M2J=H0C;M2J+=I4y;M2J+=n4y;var G2J=O7X;G2J+=Y4y;var Z2J=J1C;Z2J+=y7n.z7C;var d2J=p4y;d2J+=x0y;var J2J=y4C;J2J+=i0C;var B2J=x3C;B2J+=Z3C;B2J+=y7n.z7C;var f2J=s0y;f2J+=F0y;f2J+=w0C;f2J+=Y0C;var h2J=r0C;h2J+=V0y;var i2J=y7n.H7C;i2J+=r6C;i2J+=r6C;i2J+=g9C;var u2J=U0y;u2J+=A0y;var W2J=x1X;W2J+=Y3X;W2J+=P6C;W2J+=Z3C;var r2J=r0C;r2J+=W0C;r2J+=u0C;r2J+=i0C;var K2J=Q0y;K2J+=S0y;K2J+=k0y;K2J+=u5C;var l2J=N0y;l2J+=y7n.t7C;l2J+=L0y;var E2J=O0y;E2J+=Z3C;var C2J=O2C;C2J+=D0y;C2J+=M5C;var D2J=k2C;D2J+=D2C;D2J+=C0y;D2J+=o6C;var O2J=o6C;O2J+=b9C;O2J+=D2C;var L2J=E0y;L2J+=D2C;L2J+=O2C;var N2J=l0y;N2J+=D2C;var k2J=K0y;k2J+=y7n.t7C;var S2J=y7n.X7C;S2J+=r0y;S2J+=T2C;var Q2J=W0y;Q2J+=v3C;Q2J+=D2C;var A2J=k2C;A2J+=y7n.X7C;A2J+=r3C;A2J+=M6C;var U2J=T3X;U2J+=u0y;U2J+=M6C;var V2J=D2C;V2J+=C1y;V2J+=A2C;V2J+=y7n.a7C;var F2J=y7n.a7C;F2J+=j5X;F2J+=y7n.X7C;F2J+=i0y;init=$[T5C](I4C,{},Editor[F2J],init);this[O2C]=$[V2J](I4C,{},Editor[K8C][v3X],{table:init[U2J]||init[A2J],dbTable:init[Q2J]||S8C,ajaxUrl:init[h0y],ajax:init[S2J],idSrc:init[k2J],dataSource:init[f0y]||init[N2J]?Editor[B0y][W4C]:Editor[L2J][X7X],formOptions:init[p3y],legacyAjax:init[J0y],template:init[O2J]?$(init[D2J])[R7X]():S8C});this[e8C]=$[T5C](I4C,{},Editor[e8C]);this[o5C]=init[o5C];Editor[K8C][C2J][l3y]++;var that=this;var classes=this[e8C];this[l8C]={"wrapper":$(y8X+classes[E2J]+b5C+l2J+classes[U8C][d0y]+A8C+Z0y+classes[h4X][Z6X]+b5C+K2J+classes[h4X][W6X]+I5C+r2J+G0y+classes[M0y][W2J]+b5C+u2J+classes[i2J][W6X]+I5C+X5C+h2J)[x7C],"form":$(f2J+classes[B2J][o0y]+J2J+d2J+classes[Z2J][G2J]+I5C+T0y)[x7C],"formError":$(M2J+classes[o2J][C7X]+T2J)[x7C],"formInfo":$(y2J+classes[g3C][m3X]+I5C)[x7C],"header":$(y0y+classes[j2J][Z6X]+j0y+classes[A5X][W6X]+m2J)[x7C],"buttons":$(q2J+classes[c2J][P2J]+w2J)[x7C]};if($[Y2J][v2J][m0y]){var b2J=E7X;b2J+=q0y;b2J+=D2C;var e2J=y7n.t7C;e2J+=t6y;e2J+=o6C;var H2J=o5X;H2J+=C6C;var t2J=c0y;t2J+=P0y;t2J+=w0y;t2J+=V6C;var a2J=Y0y;a2J+=v0y;a2J+=H3C;var g2J=y7n.H7C;g2J+=A2C;var ttButtons=$[g2J][W4C][a2J][t2J];var i18n=this[o5C];$[H2J]([e2J,Z6y,b2J],function(i,val){var g0y="tonText";var X2J=O2C;X2J+=c0y;X2J+=O9X;X2J+=g0y;var R2J=E2C;R2J+=W9C;R2J+=a0y;R2J+=t2C;y7n[y7n.p7C]();ttButtons[R2J+val][X2J]=i18n[val][g3X];});}$[z2J](init[t0y],function(evt,fn){var I2J=r6C;I2J+=A2C;that[I2J](evt,function(){var x3J=y7n.X7C;x3J+=l6X;x3J+=v3C;x3J+=M3C;var p2J=y7n.X7C;p2J+=y7n.g7C;var n2J=c8C;n2J+=W9C;n2J+=B9C;var args=Array[P8C][n2J][I7y](arguments);y7n[p2J]();args[c3X]();fn[x3J](that,args);});});var dom=this[s3J];var wrapper=dom[Z6X];dom[H0y]=_editor_el(e0y,dom[g3C])[x7C];dom[M0y]=_editor_el(b0y,wrapper)[x7C];dom[F3J]=_editor_el(j9X,wrapper)[x7C];dom[V3J]=_editor_el(R0y,wrapper)[x7C];dom[U3J]=_editor_el(X0y,wrapper)[x7C];if(init[A3J]){this[a8X](init[h5X]);}$(document)[Q3J](S3J+this[O2C][l3y],function(e,settings,json){var k3J=z0y;k3J+=M6C;if(that[O2C][k3J]&&settings[I0y]===$(that[O2C][Q3X])[W0X](x7C)){settings[z9y]=that;}})[N3J](n0y+this[O2C][L3J],function(e,settings,json){var p0y="ab";var C3J=k2C;C3J+=p0y;C3J+=v3C;C3J+=D2C;var D3J=z0y;D3J+=v3C;D3J+=D2C;var O3J=y7n.X7C;O3J+=y7n.g7C;y7n[O3J]();if(json&&that[O2C][D3J]&&settings[I0y]===$(that[O2C][C3J])[W0X](x7C)){that[x5y](json);}});try{var K3J=W9C;K3J+=D6X;K3J+=k2C;var l3J=y7n.a7C;l3J+=R8C;var E3J=L6X;E3J+=s5y;E3J+=F5y;this[O2C][E3J]=Editor[l3J][init[U0X]][K3J](this);}catch(e){var V5y="Canno";var A5y="lay controller ";var U5y="t find d";var r3J=V5y;r3J+=U5y;r3J+=S4X;r3J+=A5y;throw r3J+init[U0X];}this[Z9y](W3J,[]);};Editor[u3J][h2y]=function(){var N5y="ddClas";var k5y="apper";var S5y="oi";var G3J=s1y;G3J+=Q5y;var d3J=D2C;d3J+=y7n.a7C;d3J+=W9C;d3J+=k2C;var J3J=E2y;J3J+=W1C;var B3J=h1C;B3J+=S5y;B3J+=A2C;var f3J=x1X;f3J+=k5y;var h3J=y7n.a7C;h3J+=r6C;h3J+=y7n.z7C;var i3J=n4C;i3J+=t9C;i3J+=a8C;i3J+=O2C;y7n[d4C]();var classesActions=this[e8C][i3J];var action=this[O2C][J7y];var wrapper=$(this[h3J][f3J]);wrapper[V7X]([classesActions[K2y],classesActions[d3y],classesActions[H2X]][B3J](H5C));if(action===J3J){wrapper[H8C](classesActions[K2y]);}else if(action===d3J){var Z3J=y7n.X7C;Z3J+=N5y;Z3J+=O2C;wrapper[Z3J](classesActions[d3y]);}else if(action===G3J){var M3J=Z3C;M3J+=z9C;M3J+=I9C;wrapper[H8C](classesActions[M3J]);}};Editor[P8C][o3J]=function(data,success,error,submitParams){var X5y='?';var e5y="exO";var D5y="LETE";var T5y="xUrl";var v5y="mple";var m5y="xO";var G5y="Url";var R5y="url";var C5y="repl";var a5y="comple";var l5y="stri";var K5y="ditFie";var g5y="shi";var Z5y=',';var o5y="Of";var b5y="param";var O5y="Bo";var L5y="delete";var j5y=/_id_/;var d5y='idSrc';var H5y="deleteBody";var P5y="omp";var r6J=y7n.X7C;r6J+=h1C;r6J+=Y5X;var C6J=L5y;C6J+=O5y;C6J+=y7n.a7C;C6J+=M3C;var D6J=d2C;D6J+=Q2C;D6J+=D5y;var O6J=y7n.a7C;O6J+=y7n.X7C;O6J+=w2X;var k6J=y7n.a7C;k6J+=y7n.X7C;k6J+=k2C;k6J+=y7n.X7C;var S6J=C5y;S6J+=F1y;var Q6J=E5y;Q6J+=v3C;var A6J=n3C;A6J+=Z3C;A6J+=v3C;var t3J=l5y;t3J+=c7y;var q3J=D2C;q3J+=K5y;q3J+=S1C;var m3J=r5y;m3J+=V2C;var that=this;var action=this[O2C][J7y];var thrown;var opts={type:w2y,dataType:b1y,data:S8C,error:[function(xhr,text,err){var T3J=y7n.v7C;T3J+=y7n.g7C;y7n[T3J]();thrown=err;}],success:[],complete:[function(xhr,text){var h5y='null';var J5y="responseText";var y7C=204;var f5y="responseJSON";var u5y="sponseTe";var B5y="parseJSON";var W5y="isPlainObje";var j3J=W5y;j3J+=F5X;var y3J=s1y;y3J+=u5y;y3J+=T2C;y3J+=k2C;var json=S8C;if(xhr[i5y]===y7C||xhr[y3J]===h5y){json={};}else{try{json=xhr[f5y]?xhr[f5y]:$[B5y](xhr[J5y]);}catch(e){}}if($[j3J](json)||$[o2X](json)){success(json,xhr[i5y]>=j7C,xhr);}else{error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[O2C][G1y]||this[O2C][h0y];var id=action===Z6y||action===m3J?_pluck(this[O2C][q3J],d5y):S8C;if($[o2X](id)){var c3J=h1C;c3J+=r6C;c3J+=W9C;c3J+=A2C;id=id[c3J](Z5y);}if($[A8X](ajaxSrc)&&ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}y7n[y7n.p7C]();if(typeof ajaxSrc===y7n.s2C){var P3J=y1y;P3J+=y7n.X7C;P3J+=T2C;P3J+=G5y;var uri=S8C;var method=S8C;if(this[O2C][P3J]){var a3J=Z3C;a3J+=D2C;a3J+=M5y;var v3J=D9C;v3J+=W2C;v3J+=T2C;v3J+=o5y;var Y3J=y7n.t7C;Y3J+=Z3C;Y3J+=L0C;var w3J=y1y;w3J+=y7n.X7C;w3J+=T5y;var url=this[O2C][w3J];if(url[Y3J]){uri=url[action];}if(uri[v3J](H5C)!==-s7C){var g3J=y5y;g3J+=k2C;a=uri[g3J](H5C);method=a[x7C];uri=a[s7C];}uri=uri[a3J](j5y,id);}ajaxSrc(method,uri,data,success,error);return;}else if(typeof ajaxSrc===t3J){var H3J=S1X;H3J+=D2C;H3J+=m5y;H3J+=y7n.H7C;if(ajaxSrc[H3J](H5C)!==-s7C){var b3J=E5y;b3J+=v3C;var e3J=S9C;e3J+=D2C;a=ajaxSrc[q5y](H5C);opts[e3J]=a[x7C];opts[b3J]=a[s7C];}else{var R3J=n3C;R3J+=Z3C;R3J+=v3C;opts[R3J]=ajaxSrc;}}else{var U6J=c5y;U6J+=D2C;U6J+=s9X;var x6J=D2C;x6J+=Z3C;x6J+=Z3C;x6J+=N2C;var X3J=y7n.t7C;X3J+=P5y;X3J+=T4y;var optsCopy=$[T5C]({},ajaxSrc||{});if(optsCopy[X3J]){var p3J=O7X;p3J+=w5y;p3J+=v3C;p3J+=Y5y;var n3J=O7X;n3J+=v5y;n3J+=o6C;var I3J=n3C;I3J+=A2C;I3J+=g5y;I3J+=h7y;var z3J=a5y;z3J+=k2C;z3J+=D2C;opts[z3J][I3J](optsCopy[n3J]);delete optsCopy[p3J];}if(optsCopy[x6J]){var V6J=x6C;V6J+=j9C;V6J+=Z3C;var F6J=X3X;F6J+=c3X;var s6J=t5y;s6J+=N2C;opts[s6J][F6J](optsCopy[V6J]);delete optsCopy[C7X];}opts=$[U6J]({},opts,optsCopy);}opts[A6J]=opts[Q6J][S6J](j5y,id);if(opts[k6J]){var L6J=y7n.a7C;L6J+=K2C;L6J+=y7n.X7C;var N6J=A3y;N6J+=w2X;var isFn=typeof opts[v5C]===y7n.s2C;var newData=isFn?opts[N6J](data):opts[L6J];data=isFn&&newData?newData:$[T5C](I4C,data,newData);}opts[O6J]=data;if(opts[A9C]===D6J&&(opts[C6J]===undefined||opts[H5y]===I4C)){var K6J=A3y;K6J+=k2C;K6J+=y7n.X7C;var l6J=S1X;l6J+=e5y;l6J+=y7n.H7C;var E6J=A3y;E6J+=w2X;var params=$[b5y](opts[E6J]);opts[R5y]+=opts[R5y][l6J](X5y)===-s7C?X5y+params:d2X+params;delete opts[K6J];}$[r6J](opts);};Editor[P8C][M1X]=function(target,style,time,callback){var z5y="mate";var u6J=u1X;u6J+=W9C;u6J+=z5y;var W6J=y7n.H7C;W6J+=A2C;if($[W6J][u6J]){var i6J=O2C;i6J+=k2C;i6J+=r6C;i6J+=z3C;target[i6J]()[N3X](style,time,callback);}else{var h6J=y7n.H7C;h6J+=x3y;target[C8C](style);if(typeof time===h6J){time[I7y](target);}else if(callback){var f6J=y7n.t7C;f6J+=B5C;f6J+=v3C;callback[f6J](target);}}};Editor[P8C][B6J]=function(){var n5y="prepen";var p5y="bodyContent";var o6J=y7n.X7C;o6J+=z3C;o6J+=J8X;o6J+=y7n.a7C;var M6J=Y3X;M6J+=J8X;M6J+=y7n.a7C;var G6J=g3C;G6J+=I5y;G6J+=D6y;var Z6J=n5y;Z6J+=y7n.a7C;var d6J=y7n.a7C;d6J+=W7X;var J6J=y7n.X7C;J6J+=y7n.g7C;y7n[J6J]();var dom=this[d6J];$(dom[Z6X])[Z6J](dom[A5X]);$(dom[M0y])[z7X](dom[G6J])[z7X](dom[g8X]);$(dom[p5y])[M6J](dom[v8X])[o6J](dom[g3C]);};Editor[T6J][x8y]=function(){var U8y='preBlur';var s8y="unct";var A8y="_cl";var q6J=y7n.t7C;q6J+=K9C;q6J+=w2C;var m6J=y7n.H7C;m6J+=s8y;m6J+=j7y;m6J+=A2C;var j6J=F8y;j6J+=V2C;j6J+=A2C;j6J+=k2C;var y6J=y7n.X7C;y6J+=y7n.g7C;y7n[y6J]();var opts=this[O2C][a5X];var onBlur=opts[V8y];if(this[j6J](U8y)===X4C){return;}if(typeof onBlur===m6J){onBlur(this);}else if(onBlur===a3X){this[B4y]();}else if(onBlur===q6J){var c6J=A8y;c6J+=r6C;c6J+=O2C;c6J+=D2C;this[c6J]();}};Editor[P6J][M6y]=function(){var Q8y='div.';var Y6J=y6X;Y6J+=q6X;var w6J=y7n.X7C;w6J+=y7n.g7C;if(!this[O2C]){return;}y7n[w6J]();var errorClass=this[e8C][M5X][C7X];var fields=this[O2C][h5X];$(Q8y+errorClass,this[l8C][Y6J])[V7X](errorClass);$[P4C](fields,function(name,field){var v6J=D2C;v6J+=Z3C;v6J+=j9C;v6J+=Z3C;field[v6J](l4C)[e6C](l4C);});this[C7X](l4C)[e6C](l4C);};Editor[g6J][a6J]=function(submitComplete,mode){var E8y="loseIcb";var k8y="editor-f";var D8y="eCb";var N8y="preClo";var S8y="cus.";var n6J=u1C;n6J+=r6C;n6J+=O2C;n6J+=D2C;var I6J=t2C;I6J+=D2C;I6J+=X7y;I6J+=k2C;var z6J=y7n.a7C;z6J+=R8C;z6J+=D2C;z6J+=y7n.a7C;var X6J=x3C;X6J+=S8y;X6J+=k8y;X6J+=k8X;var R6J=r3C;R6J+=r6C;R6J+=y7n.a7C;R6J+=M3C;var H6J=N8y;H6J+=O2C;H6J+=D2C;var t6J=t2C;t6J+=L8y;t6J+=D2C;t6J+=o1C;if(this[t6J](H6J)===X4C){return;}if(this[O2C][O8y]){var e6J=y7n.t7C;e6J+=v3C;e6J+=k6y;e6J+=D8y;this[O2C][e6J](submitComplete,mode);this[O2C][O8y]=S8C;}if(this[O2C][C8y]){var b6J=y7n.t7C;b6J+=E8y;this[O2C][b6J]();this[O2C][C8y]=S8C;}$(R6J)[H4X](X6J);this[O2C][z6J]=X4C;this[I6J](n6J);};Editor[p6J][t8X]=function(fn){this[O2C][O8y]=fn;};Editor[x9J][u2y]=function(arg1,arg2,arg3,arg4){var l8y="bool";var r8y="utto";var K8y="itle";var Q9J=y7n.z7C;Q9J+=y7n.X7C;Q9J+=W9C;Q9J+=A2C;var A9J=c5y;A9J+=D2C;A9J+=A2C;A9J+=y7n.a7C;var F9J=l8y;F9J+=q9y;F9J+=A2C;var s9J=y7n.v7C;s9J+=y7n.g7C;y7n[s9J]();var that=this;var title;var buttons;var show;var opts;if($[A8X](arg1)){opts=arg1;}else if(typeof arg1===F9J){show=arg1;opts=arg2;}else{title=arg1;buttons=arg2;show=arg3;opts=arg4;}if(show===undefined){show=I4C;}if(title){var V9J=k2C;V9J+=K8y;that[V9J](title);}if(buttons){var U9J=r3C;U9J+=r8y;U9J+=W8y;that[U9J](buttons);}return{opts:$[A9J]({},this[O2C][p3y][Q9J],opts),maybeOpen:function(){var u8y="open";if(show){that[u8y]();}}};};Editor[P8C][S9J]=function(name){var f8y="hift";var h8y="rce";var i8y="So";var L9J=v5C;L9J+=i8y;L9J+=n3C;L9J+=h8y;var N9J=O2C;N9J+=f8y;var k9J=y7n.t7C;k9J+=B5C;k9J+=v3C;var args=Array[P8C][w3X][k9J](arguments);args[N9J]();var fn=this[O2C][L9J][name];if(fn){var O9J=y7n.X7C;O9J+=l6X;O9J+=v3C;O9J+=M3C;return fn[O9J](this,args);}};Editor[P8C][D9J]=function(includeFields){var Z8y="ai";var P8y='displayOrder';var d8y="ild";var M8y="udeFields";var G8y="templa";var J8y="eta";var B8y="isplayed";var m9J=n4C;m9J+=t9C;m9J+=a8C;var j9J=y7n.a7C;j9J+=B8y;var y9J=t2C;y9J+=D2C;y9J+=V2C;y9J+=o1C;var T9J=y7n.z7C;T9J+=y7n.X7C;T9J+=W9C;T9J+=A2C;var u9J=y7n.a7C;u9J+=J8y;u9J+=U5X;var W9J=y7n.t7C;W9J+=C6C;W9J+=d8y;W9J+=z8C;var K9J=y7n.z7C;K9J+=Z8y;K9J+=A2C;var l9J=Z1C;l9J+=W2C;var E9J=G8y;E9J+=k2C;E9J+=D2C;var C9J=y7n.X7C;C9J+=y7n.g7C;var that=this;var formContent=$(this[l8C][H0y]);y7n[C9J]();var fields=this[O2C][h5X];var order=this[O2C][c5X];var template=this[O2C][E9J];var mode=this[O2C][l9J]||K9J;if(includeFields){this[O2C][n8X]=includeFields;}else{var r9J=D9C;r9J+=u1C;r9J+=M8y;includeFields=this[O2C][r9J];}formContent[W9J]()[u9J]();$[P4C](order,function(i,fieldOrName){var m8y="eld[name=";var j8y="editor-";var y8y="aft";var o8y="_weakInAr";var q8y='[data-editor-template="';var h9J=o8y;h9J+=K1y;var i9J=m1C;i9J+=y7n.a7C;var name=fieldOrName instanceof Editor[i9J]?fieldOrName[q5C]():fieldOrName;if(that[h9J](name,includeFields)!==-s7C){var f9J=y7n.z7C;f9J+=F8X;if(template&&mode===f9J){var M9J=Y3X;M9J+=q9X;var G9J=T8y;G9J+=y7n.a7C;var Z9J=A2C;Z9J+=t3C;var d9J=y8y;d9J+=x6C;var J9J=y4C;J9J+=j4C;var B9J=j8y;B9J+=i9C;B9J+=m8y;B9J+=y4C;template[h6y](B9J+name+J9J)[d9J](fields[name][Z9J]());template[G9J](q8y+name+c8y)[M9J](fields[name][F9y]());}else{var o9J=y7n.X7C;o9J+=z3C;o9J+=q9X;formContent[o9J](fields[name][F9y]());}}});if(template&&mode===T9J){template[G1X](formContent);}this[y9J](P8y,[this[O2C][j9J],this[O2C][m9J],formContent]);};Editor[P8C][S8X]=function(items,editFields,type,formOptions,setupDone){var a8y="editFiel";var Y8y="Clas";var w8y="itEd";var n8y='node';var v8y="tyl";var L1J=y7n.a7C;L1J+=y7n.X7C;L1J+=k2C;L1J+=y7n.X7C;var N1J=D9C;N1J+=w8y;N1J+=D8X;var k1J=t2C;k1J+=T1y;k1J+=A2C;k1J+=k2C;var A1J=M6C;A1J+=c7y;A1J+=k2C;A1J+=C6C;var a9J=V9X;a9J+=g5X;a9J+=Y8y;a9J+=O2C;var g9J=y7n.z7C;g9J+=r6C;g9J+=y7n.a7C;g9J+=D2C;var v9J=r3C;v9J+=K9C;v9J+=y7n.t7C;v9J+=o3X;var Y9J=O2C;Y9J+=v8y;Y9J+=D2C;var w9J=y7n.H7C;w9J+=r6C;w9J+=Z3C;w9J+=y7n.z7C;var P9J=E2C;P9J+=D8X;P9J+=g8y;P9J+=y7n.X7C;var c9J=a8y;c9J+=B3y;var q9J=y7n.H7C;q9J+=W9C;q9J+=l5X;q9J+=O2C;var that=this;var fields=this[O2C][q9J];var usedFields=[];var includeInOrder;var editData={};this[O2C][c9J]=editFields;this[O2C][P9J]=editData;this[O2C][I6y]=items;this[O2C][J7y]=d3y;this[l8C][w9J][Y9J][U0X]=v9J;this[O2C][g9J]=type;this[a9J]();$[P4C](fields,function(name,field){var t8y="ltiRese";var U1J=M6C;U1J+=c7y;U1J+=b4C;var e9J=D2C;e9J+=y7n.X7C;e9J+=y7n.t7C;e9J+=C6C;var H9J=I2C;H9J+=t8y;H9J+=k2C;var t9J=y7n.X7C;t9J+=y7n.g7C;y7n[t9J]();field[H9J]();includeInOrder=X4C;editData[name]={};$[e9J](editFields,function(idSrc,edit){var H8y="sco";var R8y="Se";var e8y="sli";var b8y="layFields";var R9J=i9C;R9J+=D2C;R9J+=v3C;R9J+=B3y;var b9J=y7n.X7C;b9J+=y7n.g7C;y7n[b9J]();if(edit[R9J][name]){var I9J=H8y;I9J+=z3C;I9J+=D2C;var z9J=e8y;z9J+=y7n.t7C;z9J+=D2C;var X9J=y7n.a7C;X9J+=y7n.X7C;X9J+=k2C;X9J+=y7n.X7C;var val=field[q5X](edit[X9J]);editData[name][idSrc]=val===S8C?l4C:$[o2X](val)?val[z9J]():val;if(!formOptions||formOptions[I9J]===H3X){var x1J=P2X;x1J+=b8y;var p9J=W2C;p9J+=y7n.H7C;var n9J=a0C;n9J+=R8y;n9J+=k2C;field[n9J](idSrc,val!==undefined?val:field[p9J]());if(!edit[x1J]||edit[X8y][name]){includeInOrder=I4C;}}else{var F1J=P2X;F1J+=x6y;F1J+=y7n.a7C;F1J+=O2C;var s1J=L6X;s1J+=C1C;s1J+=c1C;s1J+=a3y;if(!edit[s1J]||edit[F1J][name]){var V1J=y7n.a7C;V1J+=D2C;V1J+=y7n.H7C;field[J2y](idSrc,val!==undefined?val:field[V1J]());includeInOrder=I4C;}}}});if(field[d7X]()[U1J]!==x7C&&includeInOrder){usedFields[w4C](name);}});var currOrder=this[c5X]()[w3X]();for(var i=currOrder[A1J]-s7C;i>=x7C;i--){var Q1J=y6y;Q1J+=z8y;if($[Q1J](currOrder[i][I8y](),usedFields)===-s7C){var S1J=O8C;S1J+=N6X;S1J+=y7n.t7C;S1J+=D2C;currOrder[S1J](i,s7C);}}this[f2y](currOrder);this[k1J](N1J,[_pluck(editFields,n8y)[x7C],_pluck(editFields,L1J)[x7C],items,type],function(){var p8y='initMultiEdit';var D1J=t2C;D1J+=L8y;D1J+=W4X;var O1J=y7n.v7C;O1J+=y7n.g7C;y7n[O1J]();that[D1J](p8y,[editFields,items,type],function(){setupDone();});});};Editor[P8C][Z9y]=function(trigger,args,promiseComplete){var V7v="Handler";var S7v="Eve";var Q7v='pre';var N7v='Cancelled';var O7v="result";var s7v="resul";var L7v="esul";var U7v="Event";var x7v="Arr";var C1J=W9C;C1J+=O2C;C1J+=x7v;C1J+=C1C;if(!args){args=[];}if($[C1J](trigger)){for(var i=x7C,ien=trigger[Z7X];i<ien;i++){var E1J=t2C;E1J+=D2C;E1J+=V2C;E1J+=o1C;this[E1J](trigger[i],args);}}else{var K1J=s7v;K1J+=k2C;var l1J=F7v;l1J+=V7v;var e=$[U7v](trigger);$(this)[l1J](e,args);if(trigger[A7v](Q7v)===x7C&&e[K1J]===X4C){var r1J=S7v;r1J+=A2C;r1J+=k2C;$(this)[k7v]($[r1J](trigger+N7v),args);}if(promiseComplete){var u1J=k2C;u1J+=s1X;u1J+=A2C;var W1J=Z3C;W1J+=L7v;W1J+=k2C;if(e[O7v]&&typeof e[W1J]===y7n.F2C&&e[O7v][u1J]){var i1J=s1y;i1J+=e5X;i1J+=v3C;i1J+=k2C;e[i1J][S3y](promiseComplete);}else{promiseComplete();}}return e[O7v];}};Editor[P8C][V9y]=function(input){var E7v=/^on([A-Z])/;var D7v="jo";var W7v="werCa";var r7v="Lo";var l7v="ubs";var Z1J=D7v;Z1J+=W9C;Z1J+=A2C;var f1J=v3C;f1J+=C7v;f1J+=C6C;var h1J=D1C;h1J+=D8X;var name;var names=input[h1J](H5C);for(var i=x7C,ien=names[f1J];i<ien;i++){var B1J=I2y;B1J+=U5X;name=names[i];var onStyle=name[B1J](E7v);if(onStyle){var d1J=O2C;d1J+=l7v;d1J+=K7v;d1J+=Q4y;var J1J=e9C;J1J+=r7v;J1J+=W7v;J1J+=w2C;name=onStyle[s7C][J1J]()+name[d1J](V7C);}names[i]=name;}return names[Z1J](H5C);};Editor[G1J][M1J]=function(node){var T1J=y7n.H7C;T1J+=P1C;T1J+=O2C;var o1J=D2C;o1J+=y7n.X7C;o1J+=y7n.t7C;o1J+=C6C;y7n[y7n.p7C]();var foundField=S8C;$[o1J](this[O2C][T1J],function(name,field){var y1J=A2C;y1J+=r6C;y1J+=W2C;y7n[y7n.p7C]();if($(field[y1J]())[h6y](node)[Z7X]){foundField=field;}});return foundField;};Editor[j1J][v3y]=function(fieldNames){if(fieldNames===undefined){return this[h5X]();}else if(!$[o2X](fieldNames)){return[fieldNames];}return fieldNames;};Editor[P8C][w6y]=function(fieldsIn,focus){var h7v='jq:';var B7v=/^jq:/;var f7v='div.DTE ';var u7v="tFoc";var i7v="xOf";var w1J=w2C;w1J+=u7v;w1J+=o8C;var m1J=b9X;m1J+=z3C;var that=this;var field;var fields=$[m1J](fieldsIn,function(fieldOrName){var q1J=i9C;q1J+=C5X;return typeof fieldOrName===h2X?that[O2C][q1J][fieldOrName]:fieldOrName;});if(typeof focus===r2y){field=fields[focus];}else if(focus){var c1J=D9C;c1J+=y7n.a7C;c1J+=D2C;c1J+=i7v;if(focus[c1J](h7v)===x7C){field=$(f7v+focus[B2X](B7v,l4C));}else{var P1J=y7n.H7C;P1J+=a3y;field=this[O2C][P1J][focus];}}this[O2C][w1J]=field;if(field){field[p8X]();}};Editor[Y1J][v1J]=function(opts){var J7v="sage";var G7v="rn";var R7v="ssage";var Y7v="itOn";var y7v="Co";var T7v="eOn";var q7v="eIn";var I7v='keydown';var d7v="ditO";var M7v="mitOnBlur";var P7v="closeOnComplete";var V2v="canReturnSubmit";var g7v="non";var o7v="clos";var j7v="mplete";var v7v="Blur";var z7v='boolean';var m7v=".dt";var Z7v="bmitOnRetu";var H7v="blurOnBackground";var a7v="onReturn";var p7v="keyCode";var X7v="messag";var t7v="submitOnReturn";var c7v="Comple";var L4J=r6C;L4J+=A2C;var A4J=Q2y;A4J+=J7v;var U4J=Q6C;U4J+=Z3C;U4J+=Q4y;var V4J=f2C;V4J+=i3X;V4J+=y7n.X7C;V4J+=U1C;var s4J=Q3y;s4J+=j7y;s4J+=A2C;var x4J=t9C;x4J+=k2C;x4J+=v3C;x4J+=D2C;var p1J=k2C;p1J+=D8X;p1J+=M6C;var n1J=D2C;n1J+=d7v;n1J+=z3C;n1J+=I8C;var X1J=e5X;X1J+=Z7v;X1J+=G7v;var b1J=x3X;b1J+=M7v;var a1J=o7v;a1J+=T7v;a1J+=y7v;a1J+=j7v;var g1J=m7v;g1J+=q7v;g1J+=N6X;g1J+=N6C;var that=this;var inlineCount=__inlineCounter++;var namespace=g1J+inlineCount;if(opts[a1J]!==undefined){var e1J=A2C;e1J+=a8C;e1J+=D2C;var H1J=y7n.t7C;H1J+=v3C;H1J+=r6C;H1J+=w2C;var t1J=a8C;t1J+=c7v;t1J+=o6C;opts[t1J]=opts[P7v]?H1J:e1J;}y7n[y7n.p7C]();if(opts[b1J]!==undefined){var R1J=w7v;R1J+=Y7v;R1J+=v7v;opts[V8y]=opts[R1J]?a3X:t3X;}if(opts[X1J]!==undefined){var z1J=g7v;z1J+=D2C;opts[a7v]=opts[t7v]?a3X:z1J;}if(opts[H7v]!==undefined){var I1J=X2X;I1J+=E5y;opts[t5X]=opts[H7v]?I1J:j3X;}this[O2C][n1J]=opts;this[O2C][e7v]=inlineCount;if(typeof opts[p1J]===h2X||typeof opts[x4J]===s4J){var F4J=t9C;F4J+=k2C;F4J+=v3C;F4J+=D2C;this[n9y](opts[n9y]);opts[F4J]=I4C;}if(typeof opts[V4J]===U4J||typeof opts[A4J]===y7n.s2C){var k4J=y7n.z7C;k4J+=b7v;var S4J=y7n.z7C;S4J+=D2C;S4J+=R7v;var Q4J=X7v;Q4J+=D2C;this[Q4J](opts[S4J]);opts[k4J]=I4C;}if(typeof opts[g8X]!==z7v){var N4J=r3C;N4J+=O9X;N4J+=k2C;N4J+=x8X;this[g8X](opts[N4J]);opts[g8X]=I4C;}$(document)[L4J](I7v+namespace,function(e){var s2v="anReturnSubmit";var F2v="_fieldFromNode";var D4J=L1C;D4J+=f1C;D4J+=n7v;D4J+=y7n.a7C;var O4J=y7n.v7C;O4J+=y7n.g7C;y7n[O4J]();if(e[p7v]===O7C&&that[O2C][D4J]){var el=$(document[x2v]);if(el){var C4J=y7n.t7C;C4J+=s2v;var field=that[F2v](el);if(field&&typeof field[C4J]===y7n.s2C&&field[V2v](el)){e[b7y]();}}}});$(document)[a8C](v7y+namespace,function(e){var Q2v="activeEl";var C2v="preventDefau";var W2v="sc";var J7C=37;var O2v="onR";var i2v="onEsc";var r2v="nEsc";var N2v="fieldFr";var J2v="utt";var l2v="eventDe";var E2v="Return";var S2v="canRet";var A2v="key";var K2v="fault";var k2v="urnSub";var D2v="tur";var f2v='.DTE_Form_Buttons';var L2v="omNode";var d7C=39;var u2v="nE";var m4J=v3C;m4J+=S7y;m4J+=b4C;var J4J=g7y;J4J+=a7y;var K4J=U2v;K4J+=M3C;K4J+=E2C;var l4J=A2v;l4J+=y7v;l4J+=W2C;var E4J=Q2v;E4J+=z9C;E4J+=D2C;E4J+=o1C;var el=$(document[E4J]);if(e[l4J]===O7C&&that[O2C][K4J]){var W4J=S2v;W4J+=k2v;W4J+=s3X;W4J+=k2C;var r4J=t2C;r4J+=N2v;r4J+=L2v;var field=that[r4J](el);if(field&&typeof field[W4J]===y7n.s2C&&field[V2v](el)){var i4J=w7v;i4J+=D8X;var u4J=O2v;u4J+=D2C;u4J+=D2v;u4J+=A2C;if(opts[u4J]===i4J){var h4J=C2v;h4J+=Z3X;e[h4J]();that[B4y]();}else if(typeof opts[a7v]===y7n.s2C){var B4J=r6C;B4J+=A2C;B4J+=E2v;var f4J=a6C;f4J+=l2v;f4J+=K2v;e[f4J]();opts[B4J](that,e);}}}else if(e[J4J]===u7C){var y4J=r6C;y4J+=r2v;var o4J=a8C;o4J+=Q2C;o4J+=W2v;var G4J=r3C;G4J+=v3C;G4J+=n3C;G4J+=Z3C;var Z4J=r6C;Z4J+=u2v;Z4J+=W2v;var d4J=r6C;d4J+=r2v;e[b7y]();if(typeof opts[d4J]===y7n.s2C){opts[i2v](that,e);}else if(opts[Z4J]===G4J){var M4J=r3C;M4J+=v3C;M4J+=n3C;M4J+=Z3C;that[M4J]();}else if(opts[o4J]===t3X){var T4J=y7n.t7C;T4J+=K8X;that[T4J]();}else if(opts[y4J]===a3X){var j4J=e5X;j4J+=r3C;j4J+=y7n.z7C;j4J+=D8X;that[j4J]();}}else if(el[h2v](f2v)[m4J]){var q4J=g7y;q4J+=B2v;q4J+=t3C;if(e[q4J]===J7C){var P4J=y9y;P4J+=Z7y;var c4J=a6C;c4J+=L8y;el[c4J](P4J)[p8X]();}else if(e[p7v]===d7C){var v4J=x3C;v4J+=m7X;var Y4J=r3C;Y4J+=J2v;Y4J+=a8C;var w4J=A2C;w4J+=N0C;w4J+=k2C;el[w4J](Y4J)[v4J]();}}});this[O2C][C8y]=function(){var d2v="keyd";var g4J=d2v;g4J+=r6C;g4J+=y6X;g4J+=A2C;$(document)[H4X](g4J+namespace);$(document)[H4X](v7y+namespace);};return namespace;};Editor[a4J][Z2v]=function(direction,action,data){var G2v='send';if(!this[O2C][J0y]||!data){return;}if(direction===G2v){var t4J=D2C;t4J+=y7n.a7C;t4J+=D8X;if(action===M2v||action===t4J){var b4J=D2C;b4J+=o2v;var H4J=y7n.a7C;H4J+=y7n.X7C;H4J+=w2X;var id;$[P4C](data[H4J],function(rowId,values){var y2v="data forma";var T2v="Editor: Multi-row editing is not supported by the legacy Ajax ";if(id!==undefined){var e4J=T2v;e4J+=y2v;e4J+=k2C;throw e4J;}id=rowId;});data[v5C]=data[v5C][id];if(action===b4J){var R4J=W9C;R4J+=y7n.a7C;data[R4J]=id;}}else{data[c5C]=$[J3y](data[v5C],function(values,id){return id;});delete data[v5C];}}else{var I4J=A3y;I4J+=w2X;var X4J=j2v;X4J+=y7n.X7C;if(!data[X4J]&&data[c9C]){var z4J=y7n.a7C;z4J+=y7n.X7C;z4J+=k2C;z4J+=y7n.X7C;data[z4J]=[data[c9C]];}else if(!data[I4J]){var n4J=y7n.a7C;n4J+=y7n.X7C;n4J+=k2C;n4J+=y7n.X7C;data[n4J]=[];}}};Editor[P8C][x5y]=function(json){var p4J=M9y;p4J+=W9C;p4J+=x8X;var that=this;if(json[p4J]){var x0J=i9C;x0J+=C5X;$[P4C](this[O2C][x0J],function(name,field){var q2v="update";var c2v="optio";if(json[m2v][name]!==undefined){var s0J=f3y;s0J+=y7n.a7C;var fieldInst=that[s0J](name);if(fieldInst&&fieldInst[q2v]){var F0J=c2v;F0J+=A2C;F0J+=O2C;fieldInst[q2v](json[F0J][name]);}}});}};Editor[V0J][U0J]=function(el,msg){var Y2v="layed";var P2v="anima";var v2v="deIn";var S0J=y7n.H7C;S0J+=x3y;var Q0J=P2v;Q0J+=o6C;var A0J=y7n.H7C;A0J+=A2C;var canAnimate=$[A0J][Q0J]?I4C:X4C;if(typeof msg===S0J){msg=msg(this,new DataTable[w2v](this[O2C][Q3X]));}el=$(el);if(canAnimate){var k0J=O2C;k0J+=k2C;k0J+=r6C;k0J+=z3C;el[k0J]();}if(!msg){var N0J=P2X;N0J+=Y2v;if(this[O2C][N0J]&&canAnimate){el[p0X](function(){var L0J=C6C;L0J+=k2C;L0J+=y7n.z7C;L0J+=v3C;el[L0J](l4C);});}else{var D0J=A2C;D0J+=b8C;var O0J=y7n.t7C;O0J+=O2C;O0J+=O2C;el[X7X](l4C)[O0J](E3X,D0J);}}else{if(this[O2C][D3y]&&canAnimate){var C0J=y7n.H7C;C0J+=y7n.X7C;C0J+=v2v;el[X7X](msg)[C0J]();}else{var K0J=S2C;K0J+=O2C;K0J+=z3C;K0J+=D8C;var l0J=y7n.t7C;l0J+=O2C;l0J+=O2C;var E0J=C6C;E0J+=k2C;E0J+=U3X;el[E0J](msg)[l0J](K0J,l3X);}}};Editor[r0J][g2v]=function(){var H2v="multiInfoShown";var t2v="ultiValue";var a2v="isM";var W0J=i3y;W0J+=v3C;W0J+=B3y;var fields=this[O2C][W0J];var include=this[O2C][n8X];var show=I4C;var state;if(!include){return;}for(var i=x7C,ien=include[Z7X];i<ien;i++){var u0J=a2v;u0J+=t2v;var field=fields[include[i]];var multiEditable=field[J8C]();if(field[w7X]()&&multiEditable&&show){state=I4C;show=X4C;}else if(field[u0J]()&&!multiEditable){state=I4C;}else{state=X4C;}fields[include[i]][H2v](state);}};Editor[i0J][x7y]=function(type){var z2v="captureF";var b2v="or-internal";var X2v="r-internal";var n2v="focus.editor-f";var e2v="submit.edit";var w0J=n4C;w0J+=t9C;w0J+=r6C;w0J+=A2C;var P0J=r6C;P0J+=z3C;P0J+=D2C;P0J+=A2C;var c0J=t2C;c0J+=T1y;c0J+=o1C;var Z0J=e2v;Z0J+=b2v;var d0J=B4y;d0J+=J6y;d0J+=R2v;d0J+=X2v;var J0J=r6C;J0J+=y7n.H7C;J0J+=y7n.H7C;var B0J=x3C;B0J+=e3C;var f0J=T3X;f0J+=y7n.z7C;var h0J=z2v;h0J+=w4X;h0J+=o8C;var that=this;var focusCapture=this[O2C][O6X][h0J];if(focusCapture===undefined){focusCapture=I4C;}$(this[f0J][B0J])[J0J](d0J)[a8C](Z0J,function(e){var I2v="eventDefault";var G0J=a6C;G0J+=I2v;e[G0J]();});if(focusCapture&&(type===i2y||type===Z8X)){var o0J=n2v;o0J+=k8X;var M0J=r6C;M0J+=A2C;$(j9X)[M0J](o0J,function(){var p2v="ctiveElem";var s3v="setFocus";var F3v="tF";var x3v='.DTED';var m0J=y7n.X7C;m0J+=p2v;m0J+=W4X;var j0J=v3C;j0J+=C7v;j0J+=C6C;var y0J=J6y;y0J+=d2C;y0J+=c3C;y0J+=Q2C;var T0J=S3X;T0J+=O2C;if($(document[x2v])[T0J](y0J)[j0J]===x7C&&$(document[m0J])[h2v](x3v)[Z7X]===x7C){if(that[O2C][s3v]){var q0J=O2C;q0J+=D2C;q0J+=F3v;q0J+=k8X;that[O2C][q0J][p8X]();}}});}this[g2v]();this[c0J](P0J,[type,this[O2C][w0J]]);return I4C;};Editor[P8C][W6y]=function(type){var V3v="eOp";var O3v="eIcb";var L3v="los";var A3v="cb";var Q3v="_clearD";var k3v="amicInfo";var S3v="yn";var U3v="eI";var N3v='cancelOpen';var g0J=n4C;g0J+=t9C;g0J+=r6C;g0J+=A2C;var v0J=a6C;v0J+=V3v;v0J+=D2C;v0J+=A2C;var Y0J=t2C;Y0J+=L8y;Y0J+=D2C;Y0J+=o1C;if(this[Y0J](v0J,[type,this[O2C][g0J]])===X4C){var b0J=j4X;b0J+=O2C;b0J+=U3v;b0J+=A3v;var e0J=y7n.z7C;e0J+=t3C;var H0J=D9C;H0J+=N6X;H0J+=A2C;H0J+=D2C;var t0J=a6y;t0J+=w3C;var a0J=Q3v;a0J+=S3v;a0J+=k3v;this[a0J]();this[Z9y](N3v,[type,this[O2C][t0J]]);if((this[O2C][y1C]===H0J||this[O2C][e0J]===Z8X)&&this[O2C][b0J]){var R0J=y7n.t7C;R0J+=L3v;R0J+=O3v;this[O2C][R0J]();}this[O2C][C8y]=S8C;return X4C;}this[O2C][D3y]=type;return I4C;};Editor[P8C][w9y]=function(processing){var D3v="_ev";var l3v="toggleClass";var C3v="rapp";var x5J=D3v;x5J+=W4X;var p0J=y6X;p0J+=C3v;p0J+=D2C;p0J+=Z3C;var n0J=y7n.a7C;n0J+=r6C;n0J+=y7n.z7C;var I0J=c9X;I0J+=P9X;var z0J=y7n.X7C;z0J+=F5X;z0J+=E3v;z0J+=D2C;var X0J=a6C;X0J+=r6C;X0J+=C2X;var procClass=this[e8C][X0J][z0J];$([I0J,this[n0J][p0J]])[l3v](procClass,processing);this[O2C][U8C]=processing;this[x5J](X0y,[processing]);};Editor[s5J][K3v]=function(successCallback,errorCallback,formatdata,hide){var W3v="O";var P3v='allIfChanged';var r3v="_aj";var Y3v="mitCo";var u3v="tData";var v3v="mplet";var J3v="dbTabl";var i3v="editCou";var B3v="dbTable";var g3v="roce";var e3v="_submitTable";var f3v="dataSource";var t3v="onCom";var H3v='preSubmit';var v5J=f4y;v5J+=v3C;v5J+=v3C;var Y5J=r3v;Y5J+=Y5X;var w5J=y7n.X7C;w5J+=r0y;w5J+=T2C;var P5J=w2C;P5J+=s9X;var j5J=r5y;j5J+=G0C;j5J+=D2C;var L5J=D2C;L5J+=o2v;var k5J=e5X;k5J+=r3C;k5J+=s3X;k5J+=k2C;var S5J=d3y;S5J+=W3v;S5J+=t2X;var Q5J=D2C;Q5J+=S2C;Q5J+=u3v;var A5J=y7n.z7C;A5J+=Q5X;A5J+=y7n.H7C;A5J+=C2y;var U5J=i3v;U5J+=o1C;var V5J=y7n.H7C;V5J+=W9C;V5J+=C5X;var F5J=r6C;F5J+=A3X;F5J+=z3C;F5J+=W9C;var that=this;var i,iLen,eventRet,errorNodes;var changed=X4C,allData={},changedData={};var setBuilder=DataTable[c5y][F5J][h3v];var dataSource=this[O2C][f3v];var fields=this[O2C][V5J];var editCount=this[O2C][U5J];var modifier=this[O2C][A5J];var editFields=this[O2C][W2y];var editData=this[O2C][Q5J];var opts=this[O2C][S5J];var changedSubmit=opts[k5J];var submitParamsLocal;var action=this[O2C][J7y];var submitParams={"action":action,"data":{}};if(this[O2C][B3v]){var N5J=J3v;N5J+=D2C;submitParams[Q3X]=this[O2C][N5J];}if(action===K2y||action===L5J){var J5J=y7n.X7C;J5J+=v3C;J5J+=v3C;var B5J=x5X;B5J+=q9y;B5J+=k2C;B5J+=D2C;var O5J=D2C;O5J+=y7n.X7C;O5J+=U5X;$[O5J](editFields,function(idSrc,edit){var Z3v="sEmpty";var d3v="isEmpty";var f5J=d3v;f5J+=k2X;var h5J=W9C;h5J+=Z3v;h5J+=k2X;var allRowData={};var changedRowData={};$[P4C](fields,function(name,field){var G3v="itta";var q3v="G";var T3v="any-";var m3v="exOf";var y3v="unt";var M3v="mpar";var o3v="-m";var c3v=/\[.*$/;var j3v="[";var C5J=w7v;C5J+=G3v;C5J+=d3X;var D5J=y7n.H7C;D5J+=f7X;D5J+=y7n.a7C;D5J+=O2C;if(edit[D5J][name]&&field[C5J]()){var i5J=O7X;i5J+=M3v;i5J+=D2C;var u5J=D2C;u5J+=y7n.a7C;u5J+=W9C;u5J+=k2C;var W5J=o3v;W5J+=T3v;W5J+=O7X;W5J+=y3v;var r5J=j3v;r5J+=j4C;var K5J=W9C;K5J+=A2C;K5J+=y7n.a7C;K5J+=m3v;var E5J=x0C;E5J+=t9C;E5J+=q3v;E5J+=E2X;var multiGet=field[E5J]();var builder=setBuilder(name);if(multiGet[idSrc]===undefined){var l5J=y7n.a7C;l5J+=K2C;l5J+=y7n.X7C;var originalVal=field[q5X](edit[l5J]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=$[o2X](value)&&name[K5J](r5J)!==-s7C?setBuilder(name[B2X](c3v,l4C)+W5J):S8C;builder(allRowData,value);if(manyBuilder){manyBuilder(allRowData,value[Z7X]);}if(action===u5J&&(!editData[name]||!field[i5J](value,editData[name][idSrc]))){builder(changedRowData,value);changed=I4C;if(manyBuilder){manyBuilder(changedRowData,value[Z7X]);}}}});if(!$[h5J](allRowData)){allData[idSrc]=allRowData;}if(!$[f5J](changedRowData)){changedData[idSrc]=changedRowData;}});if(action===B5J||changedSubmit===J5J||changedSubmit===P3v&&changed){submitParams[v5C]=allData;}else if(changedSubmit===w3v&&changed){var d5J=j2v;d5J+=y7n.X7C;submitParams[d5J]=changedData;}else{var y5J=x3X;y5J+=Y3v;y5J+=v3v;y5J+=D2C;var T5J=U9y;T5J+=k2C;var o5J=t2C;o5J+=z3C;o5J+=g3v;o5J+=j3C;var Z5J=y7n.t7C;Z5J+=v3C;Z5J+=k6y;Z5J+=D2C;this[O2C][J7y]=S8C;if(opts[a3v]===Z5J&&(hide===undefined||hide)){this[z8X](X4C);}else if(typeof opts[a3v]===y7n.s2C){var G5J=t3v;G5J+=z3C;G5J+=T4y;opts[G5J](this);}if(successCallback){var M5J=t1y;M5J+=v3C;successCallback[M5J](this);}this[o5J](X4C);this[T5J](y5J);return;}}else if(action===j5J){var m5J=D2C;m5J+=y7n.X7C;m5J+=y7n.t7C;m5J+=C6C;$[m5J](editFields,function(idSrc,edit){var c5J=A3y;c5J+=w2X;var q5J=y7n.a7C;q5J+=y7n.X7C;q5J+=k2C;q5J+=y7n.X7C;y7n[y7n.p7C]();submitParams[q5J][idSrc]=edit[c5J];});}this[Z2v](P5J,action,submitParams);submitParamsLocal=$[T5C](I4C,{},submitParams);if(formatdata){formatdata(submitParams);}if(this[Z9y](H3v,[submitParams,action])===X4C){this[w9y](X4C);return;}var submitWire=this[O2C][w5J]||this[O2C][h0y]?this[Y5J]:this[e3v];submitWire[v5J](this,submitParams,function(json,notGood,xhr){var g5J=H6y;g5J+=A2C;that[b3v](json,notGood,submitParams,submitParamsLocal,that[O2C][g5J],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var a5J=y7n.X7C;a5J+=y7n.g7C;y7n[a5J]();that[R3v](xhr,err,thrown,errorCallback,submitParams,that[O2C][J7y]);},submitParams);};Editor[t5J][H5J]=function(data,success,error,submitParams){var n3v="ObjectDataFn";var V6v="difi";var I3v="_fnGet";var z3v="idS";var F6v="modi";var U6v="aSource";var p3v="cti";var A6v='individual';var Q8J=y7n.v7C;Q8J+=y7n.g7C;var z5J=Z3C;z5J+=X3v;var X5J=z3v;X5J+=Z3C;X5J+=y7n.t7C;var R5J=D2C;R5J+=T2C;R5J+=k2C;var b5J=I3v;b5J+=n3v;var e5J=y7n.X7C;e5J+=p3v;e5J+=r6C;e5J+=A2C;var that=this;var action=data[e5J];var out={data:[]};var idGet=DataTable[c5y][x6v][b5J](this[O2C][s6v]);var idSet=DataTable[R5J][x6v][h3v](this[O2C][X5J]);if(action!==z5J){var x8J=F6v;x8J+=y7n.H7C;x8J+=C2y;var p5J=Z1C;p5J+=V6v;p5J+=D2C;p5J+=Z3C;var n5J=t2C;n5J+=j2v;n5J+=U6v;var I5J=y7n.z7C;I5J+=j1C;I5J+=D2C;var originalData=this[O2C][I5J]===i2y?this[n5J](G3y,this[p5J]()):this[Q8X](A6v,this[x8J]());$[P4C](data[v5C],function(key,vals){var Q6v="oAp";var k6v="eEx";var S6v="dataTabl";var A8J=z3C;A8J+=n3C;A8J+=O2C;A8J+=C6C;var U8J=j2v;U8J+=y7n.X7C;var V8J=Q6v;V8J+=W9C;var F8J=S6v;F8J+=k6v;F8J+=k2C;var s8J=y7n.H7C;s8J+=A2C;var toSave;var extender=$[s8J][F8J][V8J][N6v];if(action===Z6y){var rowData=originalData[key][v5C];toSave=extender({},rowData,I4C);toSave=extender(toSave,vals,I4C);}else{toSave=extender({},vals,I4C);}var overrideId=idGet(toSave);if(action===M2v&&overrideId===undefined){idSet(toSave,+new Date()+l4C+key);}else{idSet(toSave,overrideId);}out[U8J][A8J](toSave);});}y7n[Q8J]();success(out);};Editor[S8J][b3v]=function(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var c6v="_dataSo";var d6v='submitUnsuccessful';var g6v="pos";var a6v="tR";var q6v="Edit";var t6v="dataS";var e6v="preR";var z6v="ncti";var H6v="ourc";var M6v='setData';var b6v="ataSour";var v6v="comm";var C6v="ece";var X6v="fu";var w6v='preEdit';var n6v='submitSuccess';var j6v="taSource";var Y6v='commit';var O6v="Sub";var R6v='prep';var y6v="_da";var m6v="reCre";var P6v="urce";var I6v="onCompl";var D7l=t2C;D7l+=p2y;var E8J=v3C;E8J+=S7y;E8J+=b4C;var C8J=f3y;C8J+=N4y;C8J+=L4y;var O8J=L6v;O8J+=O6v;O8J+=D6v;var L8J=Z3C;L8J+=C6v;L8J+=E3v;L8J+=D2C;var N8J=E2C;N8J+=W9C;N8J+=k2C;N8J+=E6v;var k8J=M5X;k8J+=O2C;var that=this;var setData;var fields=this[O2C][k8J];var opts=this[O2C][N8J];var modifier=this[O2C][I6y];this[Z2v](L8J,action,json);this[Z9y](O8J,[json,submitParams,action,xhr]);if(!json[C7X]){var D8J=K4y;D8J+=Z3C;json[D8J]=y7n.e7C;}if(!json[E4y]){json[E4y]=[];}if(notGood||json[C7X]||json[C8J][E8J]){var m8J=l6v;m8J+=Z3C;m8J+=i0C;var j8J=h1C;j8J+=K6v;var K8J=q9y;K8J+=U5X;var globalError=[];if(json[C7X]){var l8J=D2C;l8J+=Z3C;l8J+=D6y;globalError[w4C](json[l8J]);}$[K8J](json[E4y],function(i,err){var h6v="sit";var i6v="po";var B6v="onField";var J6v=': ';var W6v='Unknown field: ';var f6v="bodyCo";var u6v="onFieldError";var u8J=S2C;u8J+=D1C;u8J+=n7v;u8J+=y7n.a7C;var r8J=A2C;r8J+=y7n.X7C;r8J+=y7n.z7C;r8J+=D2C;var field=fields[err[r8J]];if(!field){var W8J=A2C;W8J+=r6v;throw new Error(W6v+err[W8J]);}else if(field[u8J]()){var h8J=O2C;h8J+=w2X;h8J+=k2C;h8J+=o8C;var i8J=x6C;i8J+=D6y;field[i8J](err[h8J]||C3C);if(i===x7C){var M8J=y7n.H7C;M8J+=x3y;var f8J=x3C;f8J+=y7n.t7C;f8J+=n3C;f8J+=O2C;if(opts[u6v]===f8J){var G8J=y7n.H7C;G8J+=k8X;var Z8J=k2C;Z8J+=r6C;Z8J+=z3C;var d8J=i6v;d8J+=h6v;d8J+=j7y;d8J+=A2C;var J8J=A2C;J8J+=j1C;J8J+=D2C;var B8J=f6v;B8J+=z0X;B8J+=o1C;that[M1X]($(that[l8C][B8J],that[O2C][Z6X]),{scrollTop:$(field[J8J]())[d8J]()[Z8J]},m7C);field[G8J]();}else if(typeof opts[u6v]===M8J){var o8J=B6v;o8J+=I5y;o8J+=Z3C;o8J+=N2C;opts[o8J](that,err);}}}else{var y8J=I5y;y8J+=D6y;var T8J=r4y;T8J+=f2C;globalError[w4C](field[T8J]()+J6v+(err[i5y]||y8J));}});this[C7X](globalError[j8J](m8J));this[Z9y](d6v,[json]);if(errorCallback){errorCallback[I7y](that,json);}}else{var O7l=t2C;O7l+=Z6v;O7l+=k2C;var q8J=E2C;q8J+=W9C;q8J+=k2C;var store={};if(json[v5C]&&(action===K2y||action===q8J)){var P8J=y7n.a7C;P8J+=x5C;var c8J=z3C;c8J+=Z3C;c8J+=G6v;this[Q8X](c8J,action,modifier,submitParamsLocal,json,store);for(var i=x7C;i<json[P8J][Z7X];i++){var Y8J=x5X;Y8J+=D2C;Y8J+=K2C;Y8J+=D2C;var w8J=W9C;w8J+=y7n.a7C;setData=json[v5C][i];var id=this[Q8X](w8J,setData);this[Z9y](M6v,[json,setData,action]);if(action===Y8J){var t8J=L6v;t8J+=o6v;t8J+=T6v;var a8J=E2y;a8J+=W1C;var g8J=y6v;g8J+=j6v;var v8J=z3C;v8J+=m6v;v8J+=y7n.X7C;v8J+=o6C;this[Z9y](v8J,[json,setData,id]);this[g8J](M2v,fields,setData,store);this[Z9y]([a8J,t8J],[json,setData,id]);}else if(action===d3y){var X8J=L6v;X8J+=q6v;var R8J=Z3y;R8J+=k2C;var b8J=t2C;b8J+=D2C;b8J+=G0C;b8J+=W4X;var e8J=c6v;e8J+=P6v;var H8J=F8y;H8J+=V2C;H8J+=A2C;H8J+=k2C;this[H8J](w6v,[json,setData,id]);this[e8J](Z6y,modifier,fields,setData,store);this[b8J]([R8J,X8J],[json,setData,id]);}}this[Q8X](Y6v,action,modifier,json[v5C],store);}else if(action===H2X){var Q7l=v6v;Q7l+=D8X;var A7l=W9C;A7l+=y7n.a7C;A7l+=O2C;var U7l=g6v;U7l+=a6v;U7l+=z9C;U7l+=I9C;var V7l=Z3C;V7l+=z9C;V7l+=I9C;var F7l=F8y;F7l+=G0C;F7l+=D2C;F7l+=o1C;var s7l=s1y;s7l+=Q5y;var x7l=t2C;x7l+=t6v;x7l+=H6v;x7l+=D2C;var p8J=W9C;p8J+=B3y;var n8J=e6v;n8J+=X3v;var I8J=t2C;I8J+=L8y;I8J+=D2C;I8J+=o1C;var z8J=B6X;z8J+=b6v;z8J+=B9C;this[z8J](R6v,action,modifier,submitParamsLocal,json,store);this[I8J](n8J,[json,this[p8J]()]);this[x7l](s7l,modifier,fields,store);this[F7l]([V7l,U7l],[json,this[A7l]()]);this[Q8X](Q7l,action,modifier,json[v5C],store);}if(editCount===this[O2C][e7v]){var L7l=X6v;L7l+=z6v;L7l+=a8C;var k7l=I6v;k7l+=Y5y;var S7l=y7n.X7C;S7l+=F5X;S7l+=j7y;S7l+=A2C;var action=this[O2C][J7y];this[O2C][S7l]=S8C;if(opts[k7l]===t3X&&(hide===undefined||hide)){var N7l=y7n.a7C;N7l+=y7n.X7C;N7l+=k2C;N7l+=y7n.X7C;this[z8X](json[N7l]?I4C:X4C,action);}else if(typeof opts[a3v]===L7l){opts[a3v](this);}}if(successCallback){successCallback[I7y](that,json);}this[O7l](n6v,[json,setData,action]);}this[w9y](X4C);this[D7l](p6v,[json,setData,action]);};Editor[P8C][R3v]=function(xhr,err,thrown,errorCallback,submitParams,action){var s9v="bmitError";var F9v="postS";var V9v="system";var x9v="submitCo";var K7l=x9v;K7l+=w5y;K7l+=v3C;K7l+=Y5y;var l7l=e5X;l7l+=s9v;var E7l=t5y;E7l+=N2C;var C7l=F9v;C7l+=v9y;this[Z9y](C7l,[S8C,submitParams,action,xhr]);this[E7l](this[o5C][C7X][V9v]);this[w9y](X4C);if(errorCallback){errorCallback[I7y](this,xhr,err,thrown);}this[Z9y]([l7l,K7l],[xhr,err,thrown,submitParams]);};Editor[P8C][U8X]=function(fn){var L9v="itComplete";var N9v="ting";var A9v="lin";var k9v="eatures";var Q9v="bS";var S9v="verS";var O9v="lur";var U9v="bb";var d7l=L8X;d7l+=U9v;d7l+=v3C;d7l+=D2C;var J7l=W9C;J7l+=A2C;J7l+=A9v;J7l+=D2C;var B7l=L1C;B7l+=v7X;y7n[d4C]();var that=this;var dt=this[O2C][Q3X]?new $[o4C][W4C][w2v](this[O2C][Q3X]):S8C;var ssp=X4C;if(dt){var u7l=Q9v;u7l+=x6C;u7l+=S9v;u7l+=V4X;var W7l=r6C;W7l+=c1C;W7l+=k9v;var r7l=g2X;r7l+=N9v;r7l+=O2C;ssp=dt[r7l]()[x7C][W7l][u7l];}if(this[O2C][U8C]){var h7l=w7v;h7l+=L9v;var i7l=r6C;i7l+=A2C;i7l+=D2C;this[i7l](h7l,function(){if(ssp){var f7l=y7n.a7C;f7l+=Z3C;f7l+=y7n.X7C;f7l+=y6X;dt[b8C](f7l,fn);}else{setTimeout(function(){fn();},k7C);}});return I4C;}else if(this[B7l]()===J7l||this[U0X]()===d7l){var o7l=r3C;o7l+=O9v;this[b8C](t3X,function(){if(!that[O2C][U8C]){setTimeout(function(){if(that[O2C]){fn();}},k7C);}else{var Z7l=r6C;Z7l+=A2C;Z7l+=D2C;that[Z7l](p6v,function(e,json){if(ssp&&json){var M7l=y7n.a7C;M7l+=Z3C;M7l+=y7n.X7C;M7l+=y6X;var G7l=r6C;G7l+=A2C;G7l+=D2C;dt[G7l](M7l,fn);}else{setTimeout(function(){if(that[O2C]){fn();}},k7C);}});}})[o7l]();return I4C;}return X4C;};Editor[T7l][D9v]=function(name,arr){var y7l=M6C;y7l+=A2C;y7l+=y2X;y7l+=C6C;y7n[d4C]();for(var i=x7C,ien=arr[y7l];i<ien;i++){if(name==arr[i]){return i;}}return-s7C;};Editor[y5C]={"table":S8C,"ajaxUrl":S8C,"fields":[],"display":j7l,"ajax":S8C,"idSrc":C9v,"events":{},"i18n":{"create":{"button":E9v,"title":m7l,"submit":l9v},"edit":{"button":q7l,"title":K9v,"submit":r9v},"remove":{"button":c7l,"title":W9v,"submit":P7l,"confirm":{"_":u9v,"1":w7l}},"error":{"system":i9v},multi:{title:h9v,info:Y7l,restore:v7l,noMulti:f9v},datetime:{previous:B9v,next:J9v,months:[g7l,d9v,a7l,t7l,Z9v,H7l,e7l,b7l,R7l,X7l,G9v,z7l],weekdays:[M9v,o9v,I7l,n7l,T9v,y9v,j9v],amPm:[m9v,p7l],hours:q9v,minutes:c9v,seconds:P9v,unknown:l9y}},formOptions:{bubble:$[T5C]({},Editor[x2l][s2l],{title:X4C,message:X4C,buttons:B7y,submit:w3v}),inline:$[T5C]({},Editor[F2l][V2l],{buttons:X4C,submit:w3v}),main:$[T5C]({},Editor[U2l][A2l])},legacyAjax:X4C};(function(){var l1v="cell";var M1v="ataFn";var x1v="exes";var v4v='keyless';var g9v="oFeatures";var w9v="Tab";var b1v="cancelled";var Y9v="ataSources";var d1v="_fnG";var v1v="any";var J1v="dS";var a9v="bServerSide";var e1v="rowIds";var Y2l=v5C;Y2l+=w9v;Y2l+=v3C;Y2l+=D2C;var Q2l=y7n.a7C;Q2l+=Y9v;y7n[y7n.p7C]();var __dataSources=Editor[Q2l]={};var __dtIsSsp=function(dt,editor){var t9v="drawType";var v9v="setting";var k2l=D2C;k2l+=o2v;k2l+=E6v;var S2l=v9v;S2l+=O2C;return dt[S2l]()[x7C][g9v][a9v]&&editor[O2C][k2l][t9v]!==j3X;};var __dtApi=function(table){var H9v="ataTab";var N2l=d2C;N2l+=H9v;N2l+=v3C;N2l+=D2C;return $(table)[N2l]();};var __dtHighlight=function(node){node=$(node);setTimeout(function(){var b9v="dCla";var e9v="ighlight";var O2l=C6C;O2l+=e9v;var L2l=r9C;L2l+=b9v;L2l+=O2C;L2l+=O2C;node[L2l](O2l);setTimeout(function(){var q7C=550;var R9v="oveCla";var z9v='noHighlight';var X9v="dClass";var I9v='highlight';var E2l=E7X;E2l+=R9v;E2l+=O2C;E2l+=O2C;var C2l=r9C;C2l+=X9v;var D2l=y7n.X7C;D2l+=y7n.g7C;y7n[D2l]();node[C2l](z9v)[E2l](I9v);setTimeout(function(){var p9v="ghligh";var n9v="noHi";var K2l=n9v;K2l+=p9v;K2l+=k2C;var l2l=y7n.X7C;l2l+=y7n.g7C;y7n[l2l]();node[V7X](K2l);},q7C);},m7C);},l7C);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){var r2l=W9C;r2l+=s9X;r2l+=x1v;dt[V3y](identifier)[r2l]()[P4C](function(idx){var s1v="rro";var D7C=14;var F1v='Unable to find row identifier';var f2l=Z3C;f2l+=r6C;f2l+=y6X;var h2l=A2C;h2l+=j1C;h2l+=D2C;var u2l=A3y;u2l+=k2C;u2l+=y7n.X7C;var W2l=Z3C;W2l+=r6C;W2l+=y6X;var row=dt[W2l](idx);var data=row[u2l]();var idSrc=idFn(data);if(idSrc===undefined){var i2l=D2C;i2l+=s1v;i2l+=Z3C;Editor[i2l](F1v,D7C);}out[idSrc]={idSrc:idSrc,data:data,node:row[h2l](),fields:fields,type:f2l};});};var __dtFieldsFromIdx=function(dt,fields,idx){var U1v="editField";var V1v="aoColumns";var A1v="mData";var S1v="isEmptyObject";var k1v='Unable to automatically determine field from source. Please specify the field name.';var field;var col=dt[v3X]()[x7C][V1v][idx];var dataSrc=col[U1v]!==undefined?col[U1v]:col[A1v];var resolvedFields={};y7n[d4C]();var run=function(field,dataSrc){if(field[q5C]()===dataSrc){var B2l=A2C;B2l+=l5C;B2l+=D2C;resolvedFields[field[B2l]()]=field;}};$[P4C](fields,function(name,fieldInst){var Q1v="isArr";var d2l=Q1v;d2l+=C1C;var J2l=y7n.X7C;J2l+=y7n.g7C;y7n[J2l]();if($[d2l](dataSrc)){for(var i=x7C;i<dataSrc[Z7X];i++){run(fieldInst,dataSrc[i]);}}else{run(fieldInst,dataSrc);}});if($[S1v](resolvedFields)){Editor[C7X](k1v,N7C);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var Z2l=D2C;Z2l+=y7n.X7C;Z2l+=y7n.t7C;Z2l+=C6C;dt[N1v](identifier)[L1v]()[Z2l](function(idx){var u1v="yFie";var E1v="bject";var D1v="playFields";var W1v="spla";var K1v="column";var C1v="tta";var i1v="attach";var O1v="isplayFi";var m2l=y7n.a7C;m2l+=O1v;m2l+=l5X;m2l+=O2C;var j2l=N0C;j2l+=k2C;j2l+=K1C;var y2l=L1C;y2l+=D1v;var T2l=y7n.X7C;T2l+=C1v;T2l+=y7n.t7C;T2l+=C6C;var G2l=r6C;G2l+=E1v;var cell=dt[l1v](idx);var row=dt[c9C](idx[c9C]);var data=row[v5C]();var idSrc=idFn(data);var fields=forceFields||__dtFieldsFromIdx(dt,allFields,idx[K1v]);var isNode=typeof identifier===G2l&&identifier[r1v]||identifier instanceof $;var prevDisplayFields,prevAttach;if(out[idSrc]){var o2l=S2C;o2l+=W1v;o2l+=u1v;o2l+=S1C;var M2l=y7n.X7C;M2l+=U7y;M2l+=T1X;prevAttach=out[idSrc][M2l];prevDisplayFields=out[idSrc][o2l];}__dtRowSelector(out,dt,idx[c9C],allFields,idFn);out[idSrc][T2l]=prevAttach||[];out[idSrc][i1v][w4C](isNode?$(identifier)[W0X](x7C):cell[F9y]());y7n[y7n.p7C]();out[idSrc][y2l]=prevDisplayFields||{};$[j2l](out[idSrc][m2l],fields);});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var h1v="cel";var c2l=W9C;c2l+=A2C;c2l+=y7n.a7C;c2l+=x1v;var q2l=h1v;q2l+=H3C;y7n[y7n.p7C]();dt[q2l](S8C,identifier)[c2l]()[P4C](function(idx){y7n[y7n.p7C]();__dtCellSelector(out,dt,idx,fields,idFn);});};var __dtjqId=function(id){var B1v='\\$1';var f1v="tring";var w2l=O2C;w2l+=f1v;var P2l=y7n.v7C;P2l+=y7n.g7C;y7n[P2l]();return typeof id===w2l?t3y+id[B2X](/(:|\.|\[|\]|,)/g,B1v):t3y+id;};__dataSources[Y2l]={id:function(data){var G1v="ctD";var Z1v="etObje";var t2l=W9C;t2l+=J1v;t2l+=Z3C;t2l+=y7n.t7C;var a2l=d1v;a2l+=Z1v;a2l+=G1v;a2l+=M1v;var g2l=r6C;g2l+=a9C;g2l+=W9C;var v2l=D2C;v2l+=T2C;v2l+=k2C;var idFn=DataTable[v2l][g2l][a2l](this[O2C][t2l]);y7n[d4C]();return idFn(data);},individual:function(identifier,fieldNames){var y1v="ataF";var o1v="_fnGetObjec";var T1v="tD";var e2l=y7n.v7C;e2l+=y7n.g7C;var H2l=o1v;H2l+=T1v;H2l+=y1v;H2l+=A2C;var idFn=DataTable[c5y][x6v][H2l](this[O2C][s6v]);var dt=__dtApi(this[O2C][Q3X]);var fields=this[O2C][h5X];var out={};y7n[e2l]();var forceFields;var responsiveNode;if(fieldNames){var R2l=D2C;R2l+=T1X;var b2l=W9C;b2l+=O2C;b2l+=A3X;b2l+=z8y;if(!$[b2l](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[R2l](fieldNames,function(i,name){y7n[y7n.p7C]();forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var m1v="nGetO";var q1v="bjectD";var j1v="ainObj";var P1v="umns";var n2l=s8X;n2l+=j1v;n2l+=z4C;var I2l=i3y;I2l+=S1C;var z2l=r3y;z2l+=m1v;z2l+=q1v;z2l+=M1v;var X2l=r6C;X2l+=w2v;var idFn=DataTable[c5y][X2l][z2l](this[O2C][s6v]);var dt=__dtApi(this[O2C][Q3X]);var fields=this[O2C][I2l];var out={};if($[n2l](identifier)&&(identifier[V3y]!==undefined||identifier[c1v]!==undefined||identifier[N1v]!==undefined)){var s3l=l1v;s3l+=O2C;if(identifier[V3y]!==undefined){var p2l=Z3C;p2l+=r6C;p2l+=y6X;p2l+=O2C;__dtRowSelector(out,dt,identifier[p2l],fields,idFn);}if(identifier[c1v]!==undefined){var x3l=O7X;x3l+=v3C;x3l+=P1v;__dtColumnSelector(out,dt,identifier[x3l],fields,idFn);}if(identifier[s3l]!==undefined){var F3l=l1v;F3l+=O2C;__dtCellSelector(out,dt,identifier[F3l],fields,idFn);}}else{__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var V3l=z0y;V3l+=M6C;var dt=__dtApi(this[O2C][V3l]);if(!__dtIsSsp(dt,this)){var U3l=Z3C;U3l+=r6C;U3l+=y6X;var row=dt[U3l][a8X](data);__dtHighlight(row[F9y]());}},edit:function(identifier,fields,data,store){var Y1v="awTy";var t1v="pi";var a1v="owIds";var H1v="ableE";var S3l=w1v;S3l+=Y1v;S3l+=P6C;var Q3l=D2C;Q3l+=S2C;Q3l+=k2C;Q3l+=E6v;var A3l=k2C;A3l+=y7n.X7C;A3l+=d3X;var that=this;y7n[d4C]();var dt=__dtApi(this[O2C][A3l]);if(!__dtIsSsp(dt,this)||this[O2C][Q3l][S3l]===j3X){var l3l=y7n.X7C;l3l+=A2C;l3l+=M3C;var N3l=y7n.t7C;N3l+=B5C;N3l+=v3C;var k3l=W9C;k3l+=y7n.a7C;var rowId=__dataSources[W4C][k3l][N3l](this,data);var row;try{var L3l=j9C;L3l+=y6X;row=dt[L3l](__dtjqId(rowId));}catch(e){row=dt;}if(!row[v1v]()){var O3l=Z3C;O3l+=r6C;O3l+=y6X;row=dt[O3l](function(rowIdx,rowData,rowNode){var g1v="Ta";var E3l=y7n.t7C;E3l+=y7n.X7C;E3l+=P3X;var C3l=W9C;C3l+=y7n.a7C;var D3l=v5C;D3l+=g1v;D3l+=d3X;return rowId==__dataSources[D3l][C3l][E3l](that,rowData);});}if(row[l3l]()){var W3l=Z3C;W3l+=a1v;var r3l=d5C;r3l+=t1v;var K3l=v5C;K3l+=c3C;K3l+=H1v;K3l+=C2C;var extender=$[o4C][K3l][r3l][N6v];var toSave=extender({},row[v5C](),I4C);toSave=extender(toSave,data,I4C);row[v5C](toSave);var idx=$[w5X](rowId,store[e1v]);store[W3l][V2y](idx,s7C);}else{var u3l=Z3C;u3l+=s3y;row=dt[u3l][a8X](data);}__dtHighlight(row[F9y]());}},remove:function(identifier,fields,store){var R1v="ws";var that=this;var dt=__dtApi(this[O2C][Q3X]);var cancelled=store[b1v];if(cancelled[Z7X]===x7C){dt[V3y](identifier)[H2X]();}else{var J3l=Z3C;J3l+=D2C;J3l+=Z1C;J3l+=V2C;var B3l=Z3C;B3l+=r6C;B3l+=y6X;B3l+=O2C;var h3l=D2C;h3l+=V2C;h3l+=Z3C;h3l+=M3C;var i3l=j9C;i3l+=R1v;var indexes=[];dt[i3l](identifier)[h3l](function(){var X1v="index";var f3l=y7n.a7C;f3l+=y7n.X7C;f3l+=k2C;f3l+=y7n.X7C;var id=__dataSources[W4C][c5C][I7y](that,this[f3l]());if($[w5X](id,cancelled)===-s7C){indexes[w4C](this[X1v]());}});dt[B3l](indexes)[J3l]();}},prep:function(action,identifier,submit,json,store){var p1v="ncel";var o3l=Z3C;o3l+=X3v;var d3l=D2C;d3l+=y7n.a7C;d3l+=W9C;d3l+=k2C;if(action===d3l){var Z3l=y7n.a7C;Z3l+=y7n.X7C;Z3l+=k2C;Z3l+=y7n.X7C;var cancelled=json[b1v]||[];store[e1v]=$[J3y](submit[Z3l],function(val,key){var n1v="yObject";var z1v="Arra";var I1v="sEmpt";var M3l=D9C;M3l+=z1v;M3l+=M3C;var G3l=W9C;G3l+=I1v;G3l+=n1v;y7n[d4C]();return!$[G3l](submit[v5C][key])&&$[M3l](key,cancelled)===-s7C?key:undefined;});}else if(action===o3l){var y3l=y7n.t7C;y3l+=y7n.X7C;y3l+=p1v;y3l+=z2C;var T3l=f4y;T3l+=p1v;T3l+=z2C;store[T3l]=json[y3l]||[];}},commit:function(action,identifier,data,store){var x4v="awType";var s4v="editOp";var t3l=A2C;t3l+=a8C;t3l+=D2C;var a3l=y7n.a7C;a3l+=Z3C;a3l+=x4v;var g3l=s4v;g3l+=k2C;g3l+=O2C;var j3l=k2C;j3l+=y7n.X7C;j3l+=X2X;j3l+=D2C;var that=this;y7n[y7n.p7C]();var dt=__dtApi(this[O2C][j3l]);if(!__dtIsSsp(dt,this)&&action===Z6y&&store[e1v][Z7X]){var m3l=c9C;m3l+=F4v;m3l+=y7n.a7C;m3l+=O2C;var ids=store[m3l];var row;var compare=function(id){return function(rowIdx,rowData,rowNode){var V4v="all";var P3l=y7n.t7C;P3l+=V4v;var c3l=W9C;c3l+=y7n.a7C;var q3l=y7n.X7C;q3l+=y7n.g7C;y7n[q3l]();return id==__dataSources[W4C][c3l][P3l](that,rowData);};};for(var i=x7C,ien=ids[Z7X];i<ien;i++){var Y3l=u1X;Y3l+=M3C;try{var w3l=j9C;w3l+=y6X;row=dt[w3l](__dtjqId(ids[i]));}catch(e){row=dt;}if(!row[Y3l]()){row=dt[c9C](compare(ids[i]));}if(row[v1v]()&&!dt[v3X]()[x7C][g9v][a9v]){var v3l=Z3C;v3l+=z9C;v3l+=I9C;row[v3l]();}}}var drawType=this[O2C][g3l][a3l];if(drawType!==t3l){var H3l=y7n.a7C;H3l+=Z3C;H3l+=y7n.X7C;H3l+=y6X;dt[H3l](drawType);}}};function __html_id(identifier){var U4v="eyle";var S4v='Could not find an element with `data-editor-id` or `id` of: ';var Q4v='[data-editor-id="';var e3l=o3X;e3l+=U4v;e3l+=i3X;y7n[y7n.p7C]();var context=document;if(identifier!==e3l){var X3l=v3C;X3l+=D2C;X3l+=A4v;X3l+=C6C;var R3l=M6C;R3l+=A2C;R3l+=Q1C;R3l+=b4C;var b3l=y4C;b3l+=j4C;context=$(Q4v+identifier+b3l);if(context[R3l]===x7C){context=typeof identifier===h2X?$(__dtjqId(identifier)):$(identifier);}if(context[X3l]===x7C){throw S4v+identifier;}}return context;}function __html_el(identifier,name){var N4v="itor-fiel";var L4v="d=\"";var k4v="[data-ed";var z3l=k4v;z3l+=N4v;z3l+=L4v;y7n[y7n.p7C]();var context=__html_id(identifier);return $(z3l+name+c8y,context);}function __html_els(identifier,names){var out=$();for(var i=x7C,ien=names[Z7X];i<ien;i++){var I3l=r9C;I3l+=y7n.a7C;out=out[I3l](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var E4v="r-value]";var O4v="data-edi";var C4v="[data-edito";var D4v="r-value";var s6l=O4v;s6l+=k2C;s6l+=r6C;s6l+=D4v;var x6l=y7n.X7C;x6l+=k2C;x6l+=k2C;x6l+=Z3C;var p3l=v3C;p3l+=D2C;p3l+=A4v;p3l+=C6C;var n3l=C4v;n3l+=E4v;var el=__html_el(identifier,dataSrc);return el[l4v](n3l)[p3l]?el[x6l](s6l):el[X7X]();}function __html_set(identifier,fields,data){$[P4C](fields,function(name,field){var u4v="taSrc";var W4v="omDa";var h4v="data-";var f4v="r-val";var r4v="lFr";var i4v='[data-editor-value]';var F6l=K4v;F6l+=r4v;F6l+=W4v;F6l+=w2X;var val=field[F6l](data);if(val!==undefined){var U6l=v3C;U6l+=D2C;U6l+=c7y;U6l+=b4C;var V6l=A3y;V6l+=u4v;var el=__html_el(identifier,field[V6l]());if(el[l4v](i4v)[U6l]){var Q6l=h4v;Q6l+=R2v;Q6l+=f4v;Q6l+=M3X;var A6l=y7n.X7C;A6l+=k2C;A6l+=k2C;A6l+=Z3C;el[A6l](Q6l,val);}else{var S6l=D2C;S6l+=T1X;el[S6l](function(){var d4v="removeChild";var B4v="hildN";var J4v="rstChild";var N6l=T2X;N6l+=y2X;N6l+=C6C;var k6l=y7n.t7C;k6l+=B4v;k6l+=t3C;k6l+=O2C;while(this[k6l][N6l]){var L6l=i9C;L6l+=J4v;this[d4v](this[L6l]);}})[X7X](val);}}});}__dataSources[X7X]={id:function(data){var Z4v="etO";var E6l=y7n.X7C;E6l+=y7n.g7C;var C6l=W9C;C6l+=J1v;C6l+=Z3C;C6l+=y7n.t7C;var D6l=d1v;D6l+=Z4v;D6l+=f5C;var O6l=D2C;O6l+=T2C;O6l+=k2C;var idFn=DataTable[O6l][x6v][D6l](this[O2C][C6l]);y7n[E6l]();return idFn(data);},initField:function(cfg){var M4v="tor-labe";var o4v="l=\"";var G4v="[data-e";var K6l=y4C;K6l+=j4C;var l6l=G4v;l6l+=S2C;l6l+=M4v;l6l+=o4v;var label=$(l6l+(cfg[v5C]||cfg[q5C])+K6l);if(!cfg[C5C]&&label[Z7X]){var r6l=L3X;r6l+=y7n.z7C;r6l+=v3C;cfg[C5C]=label[r6l]();}},individual:function(identifier,fieldNames){var j4v="tor-";var m4v="addBac";var g4v="Cannot automatically ";var P4v='addBack';var w4v='andSelf';var y4v="eN";var q4v="data-ed";var T4v="nod";var a4v="determine";var c4v="itor-field";var Y4v='[data-editor-id]';var t4v=" field name from data source";var y6l=D2C;y6l+=y7n.X7C;y6l+=y7n.t7C;y6l+=C6C;var o6l=y7n.H7C;o6l+=W9C;o6l+=D2C;o6l+=S1C;var M6l=f4y;M6l+=v3C;M6l+=v3C;var G6l=i9C;G6l+=l5X;G6l+=O2C;var d6l=v3C;d6l+=D2C;d6l+=A7y;var W6l=T4v;W6l+=y4v;W6l+=r6v;var attachEl;if(identifier instanceof $||identifier[W6l]){var J6l=Z3y;J6l+=j4v;J6l+=W9C;J6l+=y7n.a7C;var B6l=z3C;B6l+=y7n.X7C;B6l+=Z3C;B6l+=T6y;var f6l=m4v;f6l+=o3X;var h6l=y7n.H7C;h6l+=A2C;attachEl=identifier;if(!fieldNames){var i6l=q4v;i6l+=c4v;var u6l=K2C;u6l+=K7v;fieldNames=[$(identifier)[u6l](i6l)];}var back=$[h6l][f6l]?P4v:w4v;identifier=$(identifier)[B6l](Y4v)[back]()[v5C](J6l);}if(!identifier){identifier=v4v;}if(fieldNames&&!$[o2X](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames||fieldNames[d6l]===x7C){var Z6l=g4v;Z6l+=a4v;Z6l+=t4v;throw Z6l;}var out=__dataSources[X7X][G6l][M6l](this,identifier);var fields=this[O2C][o6l];var forceFields={};$[P4C](fieldNames,function(i,name){var T6l=y7n.v7C;T6l+=y7n.g7C;y7n[T6l]();forceFields[name]=fields[name];});$[y6l](out,function(id,set){var H4v="attac";var c6l=k2C;c6l+=d5C;c6l+=z8y;var q6l=H4v;q6l+=C6C;var m6l=y7n.X7C;m6l+=y7n.g7C;var j6l=B9C;j6l+=v3C;j6l+=v3C;set[A9C]=j6l;y7n[m6l]();set[q6l]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[c6l]();set[h5X]=fields;set[X8y]=forceFields;});return out;},fields:function(identifier){var v6l=Z3C;v6l+=r6C;v6l+=y6X;var out={};var self=__dataSources[X7X];if($[o2X](identifier)){for(var i=x7C,ien=identifier[Z7X];i<ien;i++){var P6l=y7n.H7C;P6l+=a3y;var res=self[P6l][I7y](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[O2C][h5X];if(!identifier){identifier=v4v;}$[P4C](fields,function(name,field){var e4v="aSrc";var Y6l=j2v;Y6l+=e4v;var w6l=y7n.v7C;w6l+=y7n.g7C;y7n[w6l]();var val=__html_get(identifier,field[Y6l]());field[t5C](data,val===S8C?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:v6l};return out;},create:function(fields,data){y7n[d4C]();if(data){var a6l=W9C;a6l+=y7n.a7C;var g6l=C6C;g6l+=k2C;g6l+=y7n.z7C;g6l+=v3C;var id=__dataSources[g6l][a6l][I7y](this,data);try{var t6l=v3C;t6l+=C7v;t6l+=C6C;if(__html_id(id)[t6l]){__html_set(id,fields,data);}}catch(e){}}},edit:function(identifier,fields,data){var b4v="less";var R6l=o3X;R6l+=H7y;R6l+=b4v;var b6l=y7n.t7C;b6l+=y7n.X7C;b6l+=P3X;var e6l=W9C;e6l+=y7n.a7C;var H6l=C6C;H6l+=k2C;H6l+=U3X;var id=__dataSources[H6l][e6l][b6l](this,data)||R6l;__html_set(id,fields,data);},remove:function(identifier,fields){var z6l=s1y;z6l+=Q5y;var X6l=y7n.X7C;X6l+=y7n.g7C;y7n[X6l]();__html_id(identifier)[z6l]();}};}());Editor[e8C]={"wrapper":I6l,"processing":{"indicator":n6l,"active":p6l},"header":{"wrapper":R4v,"content":x9l},"body":{"wrapper":s9l,"content":X4v},"footer":{"wrapper":F9l,"content":z4v},"form":{"wrapper":I4v,"content":V9l,"tag":y7n.e7C,"info":U9l,"error":A9l,"buttons":n4v,"button":Q9l,"buttonInternal":p4v},"field":{"wrapper":x0v,"typePrefix":S9l,"namePrefix":s0v,"label":F0v,"input":k9l,"inputControl":V0v,"error":N9l,"msg-label":L9l,"msg-error":O9l,"msg-message":D9l,"msg-info":C9l,"multiValue":U0v,"multiInfo":E9l,"multiRestore":A0v,"multiNoEdit":Q0v,"disabled":l9l,"processing":S0v},"actions":{"create":K9l,"edit":k0v,"remove":r9l},"inline":{"wrapper":N0v,"liner":W9l,"buttons":L0v},"bubble":{"wrapper":O0v,"liner":D0v,"table":C0v,"close":u9l,"pointer":i9l,"bg":E0v}};(function(){var d0v="BUTTONS";var B5v="editSingle";var u0v="-edit";var Q5v='preOpen';var d5v='selectedSingle';var r0v="edSing";var o0v="formButtons";var W0v="butt";var Z0v="editor_create";var T0v="editor_edit";var J0v="select_";var i0v="sele";var J5v="removeSingle";var B0v="editor_rem";var w0v="editor";var D5v="formTitle";var f0v="Tools";var M0v="bm";var l5v='buttons-remove';var x5v='buttons-create';var I0v="confirm";var p1l=N0C;p1l+=l0v;var n1l=E7X;n1l+=r6C;n1l+=V2C;var I1l=K0v;I1l+=z4C;I1l+=r0v;I1l+=M6C;var z1l=D2C;z1l+=y7n.a7C;z1l+=W9C;z1l+=k2C;var X1l=c5y;X1l+=D2C;X1l+=A2C;X1l+=y7n.a7C;var y1l=Z3C;y1l+=r6C;y1l+=y6X;y1l+=O2C;var B1l=W0v;B1l+=x8X;B1l+=u0v;var u1l=i0v;u1l+=h0v;var U1l=D2C;U1l+=T2C;U1l+=o6C;U1l+=s9X;var V1l=y9y;V1l+=L6y;var h9l=Y0y;h9l+=f0v;if(DataTable[h9l]){var Y9l=O2C;Y9l+=T9C;Y9l+=z4C;var w9l=N0C;w9l+=o6C;w9l+=s9X;var P9l=B0v;P9l+=I9C;var M9l=J0v;M9l+=v2y;M9l+=M6C;var f9l=c5y;f9l+=K1C;var ttButtons=DataTable[m0y][d0v];var ttButtonBase={sButtonText:S8C,editor:S8C,formTitle:S8C};ttButtons[Z0v]=$[f9l](I4C,ttButtons[G0v],ttButtonBase,{formButtons:[{label:S8C,fn:function(e){var B9l=e5X;B9l+=M0v;B9l+=W9C;B9l+=k2C;this[B9l]();}}],fnClick:function(button,config){var G9l=x5X;G9l+=L0C;var Z9l=A0C;Z9l+=Q5C;var d9l=W9C;d9l+=y7n.b7C;d9l+=y7n.g7C;d9l+=A2C;var J9l=d3y;J9l+=r6C;J9l+=Z3C;var editor=config[J9l];var i18nCreate=editor[d9l][K2y];var buttons=config[o0v];if(!buttons[x7C][Z9l]){buttons[x7C][C5C]=i18nCreate[B4y];}editor[G9l]({title:i18nCreate[n9y],buttons:buttons});}});ttButtons[T0v]=$[T5C](I4C,ttButtons[M9l],ttButtonBase,{formButtons:[{label:S8C,fn:function(e){this[B4y]();}}],fnClick:function(button,config){var q0v="fnGetSelec";var P0v="xes";var y0v="tit";var j0v="mBu";var c0v="tedInde";var c9l=y0v;c9l+=M6C;var q9l=D2C;q9l+=y7n.a7C;q9l+=D8X;var y9l=J1C;y9l+=j0v;y9l+=m0v;y9l+=W8y;var T9l=D2C;T9l+=y7n.a7C;T9l+=D8X;var o9l=q0v;o9l+=c0v;o9l+=P0v;var selected=this[o9l]();y7n[y7n.p7C]();if(selected[Z7X]!==s7C){return;}var editor=config[w0v];var i18nEdit=editor[o5C][T9l];var buttons=config[y9l];if(!buttons[x7C][C5C]){var m9l=e5X;m9l+=M0v;m9l+=D8X;var j9l=A0C;j9l+=F0C;j9l+=v3C;buttons[x7C][j9l]=i18nEdit[m9l];}editor[q9l](selected[x7C],{title:i18nEdit[c9l],buttons:buttons});}});ttButtons[P9l]=$[w9l](I4C,ttButtons[Y9l],ttButtonBase,{question:S8C,formButtons:[{label:S8C,fn:function(e){var that=this;this[B4y](function(json){var a0v="aT";var v0v="Tabl";var t0v="fnSelectNone";var Y0v="nGetInstance";var g0v="eTool";var e9l=A2C;e9l+=r6C;e9l+=y7n.a7C;e9l+=D2C;var H9l=y7n.H7C;H9l+=Y0v;var t9l=v0v;t9l+=g0v;t9l+=O2C;var a9l=y7n.a7C;a9l+=K2C;a9l+=a0v;a9l+=v6C;var g9l=y7n.H7C;g9l+=A2C;var v9l=y7n.X7C;v9l+=y7n.g7C;y7n[v9l]();var tt=$[g9l][a9l][t9l][H9l]($(that[O2C][Q3X])[T4C]()[Q3X]()[e9l]());tt[t0v]();});}}],fnClick:function(button,config){var z0v="GetSelectedIndex";var X0v="mov";var e0v="irm";var H0v="onf";var b0v="confi";var F1l=E7X;F1l+=I9C;var x1l=y7n.t7C;x1l+=H0v;x1l+=W9C;x1l+=e3C;var p9l=O7X;p9l+=U0C;p9l+=e0v;var n9l=b0v;n9l+=Z3C;n9l+=y7n.z7C;var I9l=R0v;I9l+=Q1C;var z9l=b0v;z9l+=Z3C;z9l+=y7n.z7C;var X9l=s1y;X9l+=X0v;X9l+=D2C;var R9l=M6C;R9l+=A4v;R9l+=C6C;var b9l=o4C;b9l+=z0v;b9l+=s7X;var rows=this[b9l]();if(rows[R9l]===x7C){return;}var editor=config[w0v];var i18nRemove=editor[o5C][X9l];var buttons=config[o0v];var question=typeof i18nRemove[z9l]===I9l?i18nRemove[I0v]:i18nRemove[n9l][rows[Z7X]]?i18nRemove[p9l][rows[Z7X]]:i18nRemove[x1l][t2C];y7n[d4C]();if(!buttons[x7C][C5C]){var s1l=A0C;s1l+=r3C;s1l+=T9C;buttons[x7C][s1l]=i18nRemove[B4y];}editor[F1l](rows,{message:question[B2X](/%d/g,rows[Z7X]),title:i18nRemove[n9y],buttons:buttons});}});}var _buttons=DataTable[c5y][V1l];$[U1l](_buttons,{create:{text:function(dt,node,config){var p0v="ns.cre";var S1l=W9C;S1l+=n0v;var Q1l=Z3y;Q1l+=e9C;Q1l+=Z3C;var A1l=W0v;A1l+=r6C;A1l+=p0v;A1l+=W1C;return dt[o5C](A1l,config[Q1l][S1l][K2y][g3X]);},className:x5v,editor:S8C,formButtons:{text:function(editor){var s5v="bmi";var N1l=O2C;N1l+=n3C;N1l+=s5v;N1l+=k2C;var k1l=y7n.t7C;k1l+=T6v;return editor[o5C][k1l][N1l];},action:function(e){var F5v="ubmi";var O1l=O2C;O1l+=F5v;O1l+=k2C;var L1l=y7n.X7C;L1l+=y7n.g7C;y7n[L1l]();this[O1l]();}},formMessage:S8C,formTitle:S8C,action:function(e,dt,node,config){var V5v="reat";var A5v="formTit";var W1l=y7n.t7C;W1l+=V5v;W1l+=D2C;var r1l=U5v;r1l+=y7n.g7C;r1l+=A2C;var K1l=A5v;K1l+=M6C;var l1l=J1C;l1l+=y7n.z7C;l1l+=O6C;l1l+=b7v;var E1l=x5X;E1l+=D2C;E1l+=y7n.X7C;E1l+=o6C;var D1l=E2C;D1l+=W9C;D1l+=e9C;D1l+=Z3C;var that=this;var editor=config[D1l];var buttons=config[o0v];this[U8C](I4C);editor[b8C](Q5v,function(){var S5v="proces";var C1l=S5v;C1l+=v2y;y7n[d4C]();that[C1l](X4C);})[E1l]({buttons:config[o0v],message:config[l1l],title:config[K1l]||editor[r1l][W1l][n9y]});}},edit:{extend:u1l,text:function(dt,node,config){var k5v='buttons.edit';var f1l=y9y;f1l+=e9C;f1l+=A2C;var h1l=D2C;h1l+=y7n.a7C;h1l+=D8X;var i1l=y7n.v7C;i1l+=y7n.g7C;y7n[i1l]();return dt[o5C](k5v,config[w0v][o5C][h1l][f1l]);},className:B1l,editor:S8C,formButtons:{text:function(editor){var d1l=D2C;d1l+=o2v;var J1l=U5v;J1l+=U1y;return editor[J1l][d1l][B4y];},action:function(e){this[B4y]();}},formMessage:S8C,formTitle:S8C,action:function(e,dt,node,config){var L5v="inde";var N5v="formMessa";var O5v="xe";var T1l=N5v;T1l+=Q1C;T1l+=D2C;var o1l=r6C;o1l+=A2C;o1l+=D2C;var M1l=T2X;M1l+=y2X;M1l+=C6C;var G1l=y7n.v7C;G1l+=y7n.g7C;var Z1l=L5v;Z1l+=O5v;Z1l+=O2C;var that=this;var editor=config[w0v];var rows=dt[V3y]({selected:I4C})[Z1l]();var columns=dt[c1v]({selected:I4C})[L1v]();var cells=dt[N1v]({selected:I4C})[L1v]();y7n[G1l]();var items=columns[Z7X]||cells[M1l]?{rows:rows,columns:columns,cells:cells}:rows;this[U8C](I4C);editor[o1l](Q5v,function(){y7n[d4C]();that[U8C](X4C);})[d3y](items,{message:config[T1l],buttons:config[o0v],title:config[D5v]||editor[o5C][d3y][n9y]});}},remove:{extend:C5v,limitTo:[y1l],text:function(dt,node,config){var E5v='buttons.remove';var j1l=W9C;j1l+=n0v;return dt[j1l](E5v,config[w0v][o5C][H2X][g3X]);},className:l5v,editor:S8C,formButtons:{text:function(editor){var q1l=r5y;q1l+=G0C;q1l+=D2C;var m1l=W9C;m1l+=y7n.b7C;m1l+=y7n.g7C;m1l+=A2C;return editor[m1l][q1l][B4y];},action:function(e){var P1l=x3X;P1l+=s3X;P1l+=k2C;var c1l=y7n.X7C;c1l+=y7n.g7C;y7n[c1l]();this[P1l]();}},formMessage:function(editor,dt){var Y1l=v3C;Y1l+=c2y;var w1l=n8C;w1l+=i9C;w1l+=e3C;var rows=dt[V3y]({selected:I4C})[L1v]();var i18n=editor[o5C][H2X];var question=typeof i18n[I0v]===h2X?i18n[I0v]:i18n[I0v][rows[Z7X]]?i18n[w1l][rows[Z7X]]:i18n[I0v][t2C];return question[B2X](/%d/g,rows[Y1l]);},formTitle:S8C,action:function(e,dt,node,config){var u5v="formB";var i5v="ndex";var h5v="eO";var r5v="Mess";var K5v="18";var W5v="ag";var R1l=k2C;R1l+=D8X;R1l+=v3C;R1l+=D2C;var b1l=W9C;b1l+=K5v;b1l+=A2C;var e1l=g3C;e1l+=r5v;e1l+=W5v;e1l+=D2C;var H1l=u5v;H1l+=O9X;H1l+=L6y;var t1l=W9C;t1l+=i5v;t1l+=D2C;t1l+=O2C;var v1l=a6C;v1l+=h5v;v1l+=z3C;v1l+=r1C;var that=this;var editor=config[w0v];this[U8C](I4C);editor[b8C](v1l,function(){var f5v="ssi";var a1l=U9C;a1l+=B9C;a1l+=f5v;a1l+=c7y;var g1l=y7n.v7C;g1l+=y7n.g7C;y7n[g1l]();that[a1l](X4C);})[H2X](dt[V3y]({selected:I4C})[t1l](),{buttons:config[H1l],message:config[e1l],title:config[D5v]||editor[b1l][H2X][R1l]});}}});_buttons[B5v]=$[X1l]({},_buttons[z1l]);_buttons[B5v][T5C]=I1l;_buttons[J5v]=$[T5C]({},_buttons[n1l]);_buttons[J5v][p1l]=d5v;}());Editor[x4l]={};Editor[s4l]=function(input,opts){var o5v="rma";var E8v="Editor datetime: Without momentjs only the format 'YYYY-MM-DD' can be used";var U8v="/but";var V8v="\">";var q5v="-t";var m5v="rror";var A8v="</b";var n5v="\"/>";var i8v="previous";var k8v="<div clas";var g5v="nutes\"";var Z8v='-seconds"/>';var M5v="orma";var e5v="-cal";var m8v=/[Hhm]|LT|LTS/;var B8v='-label">';var d8v='-year"/>';var G8v='-date';var f8v='<span/>';var r8v='-date">';var s8v="-l";var v5v="-mi";var T5v="Date";var W8v='-title">';var w5v="error\"/>";var o8v="_instance";var j5v="-e";var x8v="lect class=\"";var N8v="v cl";var M8v='editor-dateime-';var R5v="\"/";var Q8v="-iconLe";var j8v=/[YMD]|L(?!T)|l/;var Y5v="cla";var u8v='<button>';var H5v="-time\"";var q8v=/[haA]/;var p5v="<se";var b5v="endar";var O8v="rmat";var F8v="abel";var z5v="an/";var c5v="calendar";var P5v="-ti";var h8v='-iconRight">';var J8v='<select class="';var S8v="t\">";var G5v="tle";var Z5v="dar";var t5v="urs\"/>";var R4l=f4y;R4l+=v3C;R4l+=r1C;R4l+=Z5v;var b4l=K6X;b4l+=K1C;var e4l=t9C;e4l+=G5v;var H4l=T3X;H4l+=y7n.z7C;var t4l=y7n.X7C;t4l+=z3C;t4l+=J8X;t4l+=y7n.a7C;var a4l=y7n.a7C;a4l+=r6C;a4l+=y7n.z7C;var g4l=Y3X;g4l+=z3C;g4l+=D2C;g4l+=s9X;var v4l=y7n.H7C;v4l+=M5v;v4l+=k2C;var Y4l=J1C;Y4l+=y7n.z7C;Y4l+=K2C;var w4l=y7n.H7C;w4l+=r6C;w4l+=o5v;w4l+=k2C;var P4l=T5v;P4l+=y5v;var c4l=j5v;c4l+=m5v;var q4l=q5v;q4l+=W9C;q4l+=y7n.z7C;q4l+=D2C;var m4l=f0C;m4l+=c5v;var j4l=y7n.H7C;j4l+=W9C;j4l+=s9X;var y4l=P5v;y4l+=G5v;var T4l=i9C;T4l+=s9X;var o4l=i9C;o4l+=s9X;var M4l=O0C;M4l+=S2C;M4l+=G0C;M4l+=i0C;var G4l=f0C;G4l+=w5v;var Z4l=U0y;Z4l+=A0y;var d4l=c0C;d4l+=Y5v;d4l+=i3X;d4l+=A0y;var J4l=v5v;J4l+=g5v;J4l+=W0C;J4l+=i0C;var B4l=a5v;B4l+=r6C;B4l+=t5v;var f4l=H5v;f4l+=i0C;var h4l=e5v;h4l+=b5v;h4l+=R5v;h4l+=i0C;var i4l=X5v;i4l+=z5v;i4l+=i0C;var u4l=f0C;u4l+=Z1C;u4l+=I5v;u4l+=n5v;var W4l=p5v;W4l+=x8v;var r4l=s8v;r4l+=F8v;r4l+=V8v;var K4l=r0C;K4l+=U8v;K4l+=e9C;K4l+=g0C;var l4l=N6C;l4l+=T2C;l4l+=k2C;var E4l=r0C;E4l+=W0C;E4l+=S2C;E4l+=m0C;var C4l=A8v;C4l+=O9X;C4l+=e9C;C4l+=g0C;var D4l=Q8v;D4l+=y7n.H7C;D4l+=S8v;var O4l=k8v;O4l+=Y0C;var L4l=r0C;L4l+=S2C;L4l+=N8v;L4l+=d0C;var N4l=c0C;N4l+=Y5v;N4l+=L8v;var k4l=y4C;k4l+=i0C;var S4l=V6X;S4l+=E5C;var A4l=x3C;A4l+=O8v;var U4l=y7n.z7C;U4l+=W7X;U4l+=D2C;U4l+=o1C;var V4l=W9C;V4l+=n0v;var F4l=T5v;F4l+=y5v;this[y7n.t7C]=$[T5C](I4C,{},Editor[F4l][y5C],opts);var classPrefix=this[y7n.t7C][D8v];var i18n=this[y7n.t7C][V4l];if(!window[U4l]&&this[y7n.t7C][A4l]!==C8v){throw E8v;}var timeBlock=function(type){var l8v="imeblock\">";var Q4l=q5v;Q4l+=l8v;return y8X+classPrefix+Q4l+X5C;};var gap=function(){var K8v='<span>:</span>';y7n[y7n.p7C]();return K8v;};y7n[y7n.p7C]();var structure=$(S4l+classPrefix+k4l+N4l+classPrefix+r8v+L4l+classPrefix+W8v+O4l+classPrefix+D4l+u8v+i18n[i8v]+C4l+E4l+y8X+classPrefix+h8v+u8v+i18n[l4l]+K4l+X5C+y8X+classPrefix+r4l+f8v+W4l+classPrefix+u4l+X5C+y8X+classPrefix+B8v+i4l+J8v+classPrefix+d8v+X5C+X5C+y8X+classPrefix+h4l+X5C+y8X+classPrefix+f4l+y8X+classPrefix+B4l+y8X+classPrefix+J4l+d4l+classPrefix+Z8v+X5C+Z4l+classPrefix+G4l+M4l);this[l8C]={container:structure,date:structure[o4l](f6y+classPrefix+G8v),title:structure[T4l](f6y+classPrefix+y4l),calendar:structure[j4l](f6y+classPrefix+m4l),time:structure[h6y](f6y+classPrefix+q4l),error:structure[h6y](f6y+classPrefix+c4l),input:$(input)};this[O2C]={d:S8C,display:S8C,minutesRange:S8C,secondsRange:S8C,namespace:M8v+Editor[P4l][o8v]++,parts:{date:this[y7n.t7C][T8v][y8v](j8v)!==S8C,time:this[y7n.t7C][w4l][y8v](m8v)!==S8C,seconds:this[y7n.t7C][Y4l][A7v](K4C)!==-s7C,hours12:this[y7n.t7C][v4l][y8v](q8v)!==S8C}};this[l8C][F7X][z7X](this[l8C][c8v])[g4l](this[a4l][r2C])[t4l](this[l8C][C7X]);this[H4l][c8v][z7X](this[l8C][e4l])[b4l](this[l8C][R4l]);this[G4y]();};$[X4l](Editor[P8v][z4l],{destroy:function(){var Y8v="mpt";var w8v="editor-datetime";var s0l=J6y;s0l+=w8v;var x0l=W9C;x0l+=k8C;x0l+=k2C;var p4l=y7n.a7C;p4l+=r6C;p4l+=y7n.z7C;var n4l=D2C;n4l+=Y8v;n4l+=M3C;var I4l=r6C;I4l+=y7n.H7C;I4l+=y7n.H7C;this[d6X]();this[l8C][F7X][I4l]()[n4l]();this[p4l][x0l][H4X](s0l);},errorMsg:function(msg){var F0l=y7n.a7C;F0l+=r6C;F0l+=y7n.z7C;var error=this[F0l][C7X];if(msg){var V0l=C6C;V0l+=k2C;V0l+=y7n.z7C;V0l+=v3C;error[V0l](msg);}else{error[d7y]();}},hide:function(){var v8v="_hi";var U0l=v8v;U0l+=y7n.a7C;U0l+=D2C;this[U0l]();},max:function(date){var a8v="_optionsTitle";this[y7n.t7C][g8v]=date;this[a8v]();y7n[y7n.p7C]();this[t8v]();},min:function(date){var H8v="etCalan";var b8v="sT";var e8v="_option";var R8v="inDate";var k0l=C6X;k0l+=H8v;k0l+=y7n.a7C;k0l+=x6C;var S0l=y7n.X7C;S0l+=y7n.g7C;var Q0l=e8v;Q0l+=b8v;Q0l+=D8X;Q0l+=M6C;var A0l=y7n.z7C;A0l+=R8v;this[y7n.t7C][A0l]=date;this[Q0l]();y7n[S0l]();this[k0l]();},owns:function(node){y7n[y7n.p7C]();return $(node)[h2v]()[l4v](this[l8C][F7X])[Z7X]>x7C;},val:function(set,write){var z8v="oment";var F7w=/(\d{4})\-(\d{2})\-(\d{2})/;var I8v="oDate";var n8v="isVali";var u0l=y7n.v7C;u0l+=y7n.g7C;var W0l=L1C;W0l+=z3C;W0l+=A0C;W0l+=M3C;var N0l=R0v;N0l+=Q1C;if(set===undefined){return this[O2C][y7n.a7C];}if(set instanceof Date){this[O2C][y7n.a7C]=this[X8v](set);}else if(set===S8C||set===l4C){this[O2C][y7n.a7C]=S8C;}else if(typeof set===N0l){var L0l=y7n.z7C;L0l+=z8v;if(window[L0l]){var E0l=k2C;E0l+=I8v;var C0l=n8v;C0l+=y7n.a7C;var D0l=g3C;D0l+=K2C;var O0l=y7n.z7C;O0l+=W7X;O0l+=W4X;var m=window[O0l][p8v](set,this[y7n.t7C][D0l],this[y7n.t7C][x7w],this[y7n.t7C][s7w]);this[O2C][y7n.a7C]=m[C0l]()?m[E0l]():S8C;}else{var match=set[y8v](F7w);this[O2C][y7n.a7C]=match?new Date(Date[V7w](match[s7C],match[F7C]-s7C,match[V7C])):S8C;}}if(write||write===undefined){if(this[O2C][y7n.a7C]){this[U7w]();}else{var r0l=G0C;r0l+=y7n.X7C;r0l+=v3C;var K0l=D9C;K0l+=z3C;K0l+=O9X;var l0l=y7n.a7C;l0l+=r6C;l0l+=y7n.z7C;this[l0l][K0l][r0l](set);}}if(!this[O2C][y7n.a7C]){this[O2C][y7n.a7C]=this[X8v](new Date());}this[O2C][W0l]=new Date(this[O2C][y7n.a7C][I8y]());this[O2C][U0X][A7w](s7C);y7n[u0l]();this[Q7w]();this[t8v]();this[S7w]();},_constructor:function(){var n7w="urs";var k7w="tain";var i7w='-seconds';var J7w='focus.editor-datetime click.editor-datetime';var f7w="eq";var u7w="parts";var K7w="rt";var C7w="sec";var G7w=':visible';var M7w='keyup.editor-datetime';var o7w='select';var D7w="nsTitle";var r7w="assPrefix";var O7w="_opti";var N7w="ff";var B7w='autocomplete';var y5l=r6C;y5l+=A2C;var V5l=n8C;V5l+=k7w;V5l+=x6C;var F5l=y7n.a7C;F5l+=r6C;F5l+=y7n.z7C;var x5l=r6C;x5l+=A2C;var R0l=r6C;R0l+=A2C;var b0l=r6C;b0l+=N7w;var e0l=W9C;e0l+=L7w;var H0l=y7n.v7C;H0l+=y7n.g7C;var t0l=O7w;t0l+=r6C;t0l+=D7w;var P0l=C7w;P0l+=r6C;P0l+=E7w;var T0l=k2C;T0l+=l7w;T0l+=D2C;var o0l=z3C;o0l+=y7n.X7C;o0l+=K7w;o0l+=O2C;var d0l=z3C;d0l+=y7n.X7C;d0l+=K7w;d0l+=O2C;var i0l=y7n.t7C;i0l+=v3C;i0l+=r7w;var that=this;var classPrefix=this[y7n.t7C][i0l];var onChange=function(){var W7w="onChange";var J0l=y7n.a7C;J0l+=W7X;var B0l=G0C;B0l+=B5C;var f0l=y7n.a7C;f0l+=r6C;f0l+=y7n.z7C;var h0l=y7n.t7C;h0l+=y7n.X7C;h0l+=v3C;h0l+=v3C;y7n[d4C]();that[y7n.t7C][W7w][h0l](that,that[f0l][z5C][B0l](),that[O2C][y7n.a7C],that[J0l][z5C]);};if(!this[O2C][d0l][c8v]){var M0l=F1C;M0l+=A2C;M0l+=D2C;var G0l=L1C;G0l+=v7X;var Z0l=A3y;Z0l+=k2C;Z0l+=D2C;this[l8C][Z0l][C8C](G0l,M0l);}if(!this[O2C][o0l][T0l]){var c0l=F1C;c0l+=N6C;var q0l=S2C;q0l+=O2C;q0l+=z3C;q0l+=D8C;var m0l=y7n.t7C;m0l+=O2C;m0l+=O2C;var j0l=k2C;j0l+=W9C;j0l+=f2C;var y0l=y7n.a7C;y0l+=r6C;y0l+=y7n.z7C;this[y0l][j0l][m0l](q0l,c0l);}if(!this[O2C][u7w][P0l]){var a0l=E7X;a0l+=q0y;a0l+=D2C;var g0l=y7n.a7C;g0l+=W9C;g0l+=C6y;var v0l=E8X;v0l+=r1C;var Y0l=k2C;Y0l+=G2C;var w0l=y7n.a7C;w0l+=r6C;w0l+=y7n.z7C;this[w0l][Y0l][v0l](g0l+classPrefix+i7w)[H2X]();this[l8C][r2C][u6X](h7w)[f7w](s7C)[a0l]();}this[t0l]();y7n[H0l]();this[l8C][e0l][w7y](B7w,b0l)[R0l](J7w,function(){var d7w=":di";var Z7w="sab";var p0l=C6X;p0l+=C6C;p0l+=r6C;p0l+=y6X;var n0l=G0C;n0l+=y7n.X7C;n0l+=v3C;var I0l=d7w;I0l+=Z7w;I0l+=z2C;var z0l=W9C;z0l+=O2C;var X0l=T3X;X0l+=y7n.z7C;if(that[l8C][F7X][Q2X](G7w)||that[X0l][z5C][z0l](I0l)){return;}that[F2X](that[l8C][z5C][n0l](),X4C);that[p0l]();})[x5l](M7w,function(){var s5l=y7n.a7C;s5l+=r6C;s5l+=y7n.z7C;if(that[s5l][F7X][Q2X](G7w)){that[F2X](that[l8C][z5C][F2X](),X4C);}});this[F5l][V5l][a8C](Y2y,o7w,function(){var q7w="ours";var H7w="iteOutput";var j7w="mpm";var F2w="setSe";var e7w="_setT";var s2w="_se";var Y7w="alander";var g7w="_correctMonth";var y7w="hasC";var T7w="sition";var P7w='-month';var p7w='-minutes';var a7w="tUTCFul";var I7w="setUTCH";var b7w="hours12";var v7w="setTitle";var t7w="lYear";var m7w="Class";var R7w="setUTC";var w7w="setC";var T5l=Q9y;T5l+=T7w;var o5l=x3C;o5l+=y7n.t7C;o5l+=o8C;var M5l=y7n.a7C;M5l+=r6C;M5l+=y7n.z7C;var d5l=y7w;d5l+=v3C;d5l+=k7X;var D5l=f0C;D5l+=y7n.X7C;D5l+=j7w;var O5l=K0X;O5l+=O2C;O5l+=m7w;var L5l=a5v;L5l+=q7w;var N5l=y7w;N5l+=K7X;var S5l=f0C;S5l+=c7w;S5l+=Z3C;var U5l=y7n.v7C;U5l+=y7n.g7C;var select=$(this);var val=select[F2X]();y7n[U5l]();if(select[d8C](classPrefix+P7w)){var Q5l=t2C;Q5l+=w7w;Q5l+=Y7w;var A5l=t2C;A5l+=v7w;that[g7w](that[O2C][U0X],val);that[A5l]();that[Q5l]();}else if(select[d8C](classPrefix+S5l)){var k5l=w2C;k5l+=a7w;k5l+=t7w;that[O2C][U0X][k5l](val);that[Q7w]();that[t8v]();}else if(select[N5l](classPrefix+L5l)||select[O5l](classPrefix+D5l)){var J5l=t2C;J5l+=x1X;J5l+=H7w;var B5l=e7w;B5l+=G2C;var C5l=z3C;C5l+=y7n.X7C;C5l+=Z3C;C5l+=I8C;if(that[O2C][C5l][b7w]){var h5l=R7w;h5l+=X7w;var i5l=f0C;i5l+=y7n.X7C;i5l+=j7w;var u5l=n8C;u5l+=q7X;u5l+=A2C;u5l+=x6C;var W5l=T3X;W5l+=y7n.z7C;var r5l=K4v;r5l+=v3C;var K5l=a5v;K5l+=s7y;K5l+=Z3C;K5l+=O2C;var l5l=y7n.H7C;l5l+=W9C;l5l+=A2C;l5l+=y7n.a7C;var E5l=O7X;E5l+=D7X;var hours=$(that[l8C][E5l])[l5l](f6y+classPrefix+K5l)[r5l]()*s7C;var pm=$(that[W5l][u5l])[h6y](f6y+classPrefix+i5l)[F2X]()===z7w;that[O2C][y7n.a7C][h5l](hours===L7C&&!pm?x7C:pm&&hours!==L7C?hours+L7C:hours);}else{var f5l=I7w;f5l+=r6C;f5l+=n7w;that[O2C][y7n.a7C][f5l](val);}that[B5l]();that[J5l](I4C);onChange();}else if(select[d8C](classPrefix+p7w)){that[O2C][y7n.a7C][x2w](val);that[S7w]();that[U7w](I4C);onChange();}else if(select[d5l](classPrefix+i7w)){var G5l=s2w;G5l+=k2C;G5l+=y5v;var Z5l=F2w;Z5l+=O7X;Z5l+=E7w;that[O2C][y7n.a7C][Z5l](val);that[G5l]();that[U7w](I4C);onChange();}that[M5l][z5C][o5l]();that[T5l]();})[y5l](y8C,function(e){var J2w="ispl";var F3w="iteO";var V2w="pare";var S3w="llYear";var V3w="utput";var M2w='-time';var L2w="-icon";var x3w="rts";var O2w="Righ";var N2w="par";var P2w="inu";var U3w="UTCD";var c2w="UTCHour";var s3w="_w";var l2w="sabled";var i2w="etUTCMonth";var o2w="_writeOut";var b2w="Cl";var B2w="getUTCMo";var v2w='range';var K2w="blu";var q2w="nut";var Q3w="TCFu";var y2w="etT";var r2w="_set";var f2w="TCMonth";var u2w="nder";var t2w="Rang";var X2w="secondsRan";var A2w="arg";var Q2w="toLowerCase";var p2w='setSeconds';var k3w="setUTCD";var d2w="_co";var W2w="Cala";var e2w="has";var Z2w="rre";var w2w="tes";var U2w="ntNod";var z2w="tU";var A3w="mon";var E2w="hasCla";var I2w="TCHour";var k2w='button';var H2w="sCla";var R2w="secondsRange";var q5l=V2w;q5l+=U2w;q5l+=D2C;var m5l=O2C;m5l+=z3C;m5l+=y7n.X7C;m5l+=A2C;var j5l=k2C;j5l+=A2w;j5l+=E2X;var d=that[O2C][y7n.a7C];var nodeName=e[j5l][r1v][Q2w]();var target=nodeName===m5l?e[M9X][q5l]:e[M9X];nodeName=target[r1v][Q2w]();if(nodeName===o7w){return;}e[S2w]();if(nodeName===k2w){var s8l=N2w;s8l+=r1C;s8l+=I8C;var R5l=L2w;R5l+=O2w;R5l+=k2C;var v5l=f0C;v5l+=o6y;v5l+=a8C;v5l+=D2w;var w5l=Z3C;w5l+=C2w;var P5l=E2w;P5l+=i3X;var c5l=S2C;c5l+=l2w;var button=$(target);var parent=button[S3X]();if(parent[d8C](c5l)&&!parent[P5l](w5l)){var Y5l=K2w;Y5l+=Z3C;button[Y5l]();return;}if(parent[d8C](classPrefix+v5l)){var b5l=x3C;b5l+=y7n.t7C;b5l+=n3C;b5l+=O2C;var e5l=r2w;e5l+=W2w;e5l+=u2w;var H5l=Q1C;H5l+=i2w;var t5l=L1C;t5l+=f1C;t5l+=y7n.X7C;t5l+=M3C;var a5l=g2X;a5l+=h2w;a5l+=f2w;var g5l=U2v;g5l+=M3C;that[O2C][g5l][a5l](that[O2C][t5l][H5l]()-s7C);that[Q7w]();that[e5l]();that[l8C][z5C][b5l]();}else if(parent[d8C](classPrefix+R5l)){var x8l=y7n.H7C;x8l+=r6C;x8l+=m7X;var p5l=W9C;p5l+=k8C;p5l+=k2C;var n5l=B2w;n5l+=A2C;n5l+=k2C;n5l+=C6C;var I5l=y7n.a7C;I5l+=W9C;I5l+=O8C;I5l+=D8C;var z5l=y7n.a7C;z5l+=J2w;z5l+=y7n.X7C;z5l+=M3C;var X5l=d2w;X5l+=Z2w;X5l+=F5X;X5l+=G2w;that[X5l](that[O2C][z5l],that[O2C][I5l][n5l]()+s7C);that[Q7w]();that[t8v]();that[l8C][p5l][x8l]();}else if(button[s8l](f6y+classPrefix+M2w)[Z7X]){var h8l=o2w;h8l+=T2w;var i8l=C6X;i8l+=y2w;i8l+=W9C;i8l+=f2C;var u8l=O2C;u8l+=j2w;u8l+=m2w;var W8l=s3X;W8l+=q2w;W8l+=D2C;W8l+=O2C;var r8l=g2X;r8l+=c2w;r8l+=O2C;var K8l=C6C;K8l+=r6C;K8l+=n7w;var l8l=z3C;l8l+=y7n.z7C;var C8l=y7n.X7C;C8l+=y7n.z7C;var N8l=C7w;N8l+=a8C;N8l+=y7n.a7C;N8l+=O2C;var Q8l=y7n.z7C;Q8l+=P2w;Q8l+=w2w;var A8l=n3C;A8l+=A2C;A8l+=W9C;A8l+=k2C;var U8l=y7n.a7C;U8l+=y7n.X7C;U8l+=k2C;U8l+=y7n.X7C;var V8l=G0C;V8l+=y7n.X7C;V8l+=v3C;V8l+=M3X;var F8l=y7n.a7C;F8l+=y7n.X7C;F8l+=k2C;F8l+=y7n.X7C;var val=button[F8l](V8l);var unit=button[U8l](A8l);if(unit===Q8l){var S8l=S7X;S8l+=k7X;if(parent[d8C](Y2w)&&parent[S8l](v2w)){that[O2C][g2w]=val;that[S7w]();return;}else{var k8l=a2w;k8l+=s7X;k8l+=t2w;k8l+=D2C;that[O2C][k8l]=S8C;}}if(unit===N8l){var O8l=K0X;O8l+=H2w;O8l+=i3X;var L8l=e2w;L8l+=b2w;L8l+=w0C;L8l+=O2C;if(parent[L8l](Y2w)&&parent[O8l](v2w)){that[O2C][R2w]=val;that[S7w]();return;}else{var D8l=X2w;D8l+=U1C;that[O2C][D8l]=S8C;}}if(val===C8l){var E8l=U1C;E8l+=z2w;E8l+=I2w;E8l+=O2C;if(d[E8l]()>=L7C){val=d[n2w]()-L7C;}else{return;}}else if(val===l8l){if(d[n2w]()<L7C){val=d[n2w]()+L7C;}else{return;}}var set=unit===K8l?r8l:unit===W8l?u8l:p2w;d[set](val);that[i8l]();that[h8l](I4C);onChange();}else{var y8l=a4X;y8l+=x3w;var T8l=s3w;T8l+=Z3C;T8l+=F3w;T8l+=V3w;var o8l=y7n.a7C;o8l+=y7n.X7C;o8l+=M3C;var M8l=g2X;M8l+=U3w;M8l+=K2C;M8l+=D2C;var G8l=A3w;G8l+=b4C;var Z8l=y7n.a7C;Z8l+=y7n.X7C;Z8l+=k2C;Z8l+=y7n.X7C;var d8l=g2X;d8l+=V7w;d8l+=G2w;var J8l=M3C;J8l+=D2C;J8l+=y7n.X7C;J8l+=Z3C;var B8l=O2C;B8l+=j2w;B8l+=Q3w;B8l+=S3w;var f8l=k3w;f8l+=W1C;if(!d){d=that[X8v](new Date());}d[f8l](s7C);d[B8l](button[v5C](J8l));d[d8l](button[Z8l](G8l));d[M8l](button[v5C](o8l));that[T8l](I4C);if(!that[O2C][y8l][r2C]){setTimeout(function(){var N3w="_h";var j8l=N3w;j8l+=W9C;j8l+=y7n.a7C;j8l+=D2C;that[j8l]();},k7C);}else{that[t8v]();}onChange();}}else{var m8l=y7n.a7C;m8l+=r6C;m8l+=y7n.z7C;that[m8l][z5C][p8X]();}});},_compareDates:function(a,b){var L3w="_dateToUtcString";var q8l=y7n.v7C;q8l+=y7n.g7C;y7n[q8l]();return this[L3w](a)===this[L3w](b);},_correctMonth:function(date,month){var E3w="Mont";var D3w="CFullYea";var O3w="etUT";var K3w="setUTCMonth";var C3w="aysIn";var P8l=Q1C;P8l+=O3w;P8l+=D3w;P8l+=Z3C;var c8l=B6X;c8l+=C3w;c8l+=E3w;c8l+=C6C;var days=this[c8l](date[P8l](),month);var correctDays=date[l3w]()>days;date[K3w](month);if(correctDays){date[A7w](days);date[K3w](month);}},_daysInMonth:function(year,month){var f7C=30;var h7C=29;var B7C=31;var i7C=28;var isLeap=year%U7C===x7C&&(year%T7C!==x7C||year%j7C===x7C);var months=[B7C,isLeap?h7C:i7C,B7C,f7C,B7C,f7C,B7C,B7C,f7C,B7C,f7C,B7C];return months[month];},_dateToUtc:function(s){var h3w="getMinutes";var i3w="getMonth";var r3w="etH";var Y8l=Q1C;Y8l+=r3w;Y8l+=W3w;Y8l+=O2C;var w8l=U1C;w8l+=k2C;w8l+=g8y;w8l+=D2C;return new Date(Date[V7w](s[u3w](),s[i3w](),s[w8l](),s[Y8l](),s[h3w](),s[f3w]()));},_dateToUtcString:function(d){var d3w="_pad";var B3w="tUTCDat";var v8l=U1C;v8l+=B3w;v8l+=D2C;y7n[d4C]();return d[J3w]()+l9y+this[d3w](d[Z3w]()+s7C)+l9y+this[d3w](d[v8l]());},_hide:function(){var M3w='div.DTE_Body_Content';var G3w='keydown.';var b8l=u1C;b8l+=o6y;b8l+=o3X;b8l+=J6y;var e8l=y7n.v7C;e8l+=y7n.g7C;var H8l=r6C;H8l+=y7n.H7C;H8l+=y7n.H7C;var t8l=y7n.a7C;t8l+=E2X;t8l+=y7n.X7C;t8l+=U5X;var a8l=g7X;a8l+=D9C;a8l+=x6C;var g8l=P5C;g8l+=s7X;g8l+=a4X;g8l+=B9C;var namespace=this[O2C][g8l];this[l8C][a8l][t8l]();$(window)[H8l](f6y+namespace);y7n[e8l]();$(document)[H4X](G3w+namespace);$(M3w)[H4X](o3w+namespace);$(j9X)[H4X](b8l+namespace);},_hours24To12:function(val){y7n[d4C]();return val===x7C?L7C:val>L7C?val-L7C:val;},_htmlDay:function(day){var a3w='<td class="empty"></td>';var Y3w="utton";var n3w="month";var P3w="day=\"";var w3w="-year=\"";var H3w="today";var y3w="</s";var m3w="span";var R3w="day";var I3w='" data-month="';var z3w='-day" type="button" ';var q3w="\" ";var v3w="\" clas";var e3w="lected";var b3w='<td data-day="';var c3w="ta-";var t3w='selectable';var g3w="sabl";var L7S=O0C;L7S+=k2C;L7S+=T3w;var N7S=y3w;N7S+=z3C;N7S+=j3w;var k7S=r0C;k7S+=m3w;k7S+=i0C;var S7S=y4C;S7S+=i0C;var Q7S=y7n.a7C;Q7S+=C1C;var A7S=q3w;A7S+=A3y;A7S+=c3w;A7S+=P3w;var U7S=c7w;U7S+=Z3C;var V7S=A3y;V7S+=w2X;V7S+=w3w;var F7S=l6v;F7S+=Y3w;F7S+=E5C;var s7S=h1C;s7S+=r6C;s7S+=W9C;s7S+=A2C;var x7S=v3w;x7S+=Y0C;var n8l=K0v;n8l+=D2C;n8l+=h0v;var R8l=S2C;R8l+=g3w;R8l+=D2C;R8l+=y7n.a7C;if(day[d7y]){return a3w;}var classes=[t3w];var classPrefix=this[y7n.t7C][D8v];if(day[R8l]){var X8l=S2C;X8l+=g2y;X8l+=d3X;X8l+=y7n.a7C;classes[w4C](X8l);}if(day[H3w]){var I8l=F1C;I8l+=y6X;var z8l=z3C;z8l+=n3C;z8l+=O2C;z8l+=C6C;classes[z8l](I8l);}if(day[n8l]){var p8l=w2C;p8l+=e3w;classes[w4C](p8l);}return b3w+day[R3w]+x7S+classes[s7S](H5C)+b5C+F7S+classPrefix+X3w+classPrefix+z3w+V7S+day[U7S]+I3w+day[n3w]+A7S+day[Q7S]+S7S+k7S+day[R3w]+N7S+p3w+L7S;},_htmlMonth:function(year,month){var Z6w="areD";var L6w="InMon";var r6w="Day";var K7C=23;var K6w="_html";var O6w="getUTCDay";var l6w="setSeconds";var i6w="CDay";var w6w="onRigh";var N6w="days";var F6w="<ta";var T6w="_htmlWeekOfYear";var U6w="ek";var B6w="_compare";var q6w="mber";var E6w="TCHours";var m6w=" weekNu";var j6w='-table';var x6w="</tb";var G6w="ates";var o6w="showWeekNumber";var g6w='<tbody>';var W6w="func";var P6w="-ic";var f6w="eDays";var S6w="nDate";var Y6w="_htmlMonthHead";var A6w="umber";var C6w="Seconds";var v6w='</thead>';var u6w="getUT";var c6w="icon";var V6w="showWe";var J6w="Dates";var d6w="_comp";var Q6w="axDat";var k6w="rstDay";var h6w="sA";var R7S=x6w;R7S+=r6C;R7S+=l2y;R7S+=i0C;var b7S=h1C;b7S+=K6v;var e7S=s6w;e7S+=T3w;var H7S=F6w;H7S+=d3X;H7S+=E5C;var M7S=V6w;M7S+=U6w;M7S+=e6y;M7S+=A6w;var E7S=y7n.z7C;E7S+=Q6w;E7S+=D2C;var C7S=s3X;C7S+=S6w;var D7S=i9C;D7S+=k6w;var O7S=t2C;O7S+=N6w;O7S+=L6w;O7S+=b4C;var now=this[X8v](new Date()),days=this[O7S](year,month),before=new Date(Date[V7w](year,month,s7C))[O6w](),data=[],row=[];if(this[y7n.t7C][D7S]>x7C){before-=this[y7n.t7C][D6w];if(before<x7C){before+=Q7C;}}var cells=days+before,after=cells;while(after>Q7C){after-=Q7C;}cells+=Q7C-after;var minDate=this[y7n.t7C][C7S];var maxDate=this[y7n.t7C][E7S];if(minDate){var r7S=g2X;r7S+=C6w;var K7S=O2C;K7S+=E2X;K7S+=h2w;K7S+=m2w;var l7S=g2X;l7S+=V7w;l7S+=X7w;minDate[l7S](x7C);minDate[K7S](x7C);minDate[r7S](x7C);}if(maxDate){var W7S=O2C;W7S+=j2w;W7S+=E6w;maxDate[W7S](K7C);maxDate[x2w](G7C);maxDate[l6w](G7C);}for(var i=x7C,r=x7C;i<cells;i++){var d7S=K6w;d7S+=r6w;var J7S=W6w;J7S+=V3X;var B7S=u6w;B7S+=i6w;var f7S=W9C;f7S+=h6w;f7S+=Z3C;f7S+=K1y;var h7S=X2C;h7S+=v3C;h7S+=f6w;var i7S=B6w;i7S+=J6w;var u7S=d6w;u7S+=Z6w;u7S+=G6w;var day=new Date(Date[V7w](year,month,s7C+(i-before))),selected=this[O2C][y7n.a7C]?this[u7S](day,this[O2C][y7n.a7C]):X4C,today=this[i7S](day,now),empty=i<before||i>=days+before,disabled=minDate&&day<minDate||maxDate&&day>maxDate;var disableDays=this[y7n.t7C][h7S];if($[f7S](disableDays)&&$[w5X](day[B7S](),disableDays)!==-s7C){disabled=I4C;}else if(typeof disableDays===J7S&&disableDays(day)===I4C){disabled=I4C;}var dayConfig={day:s7C+(i-before),month:month,year:year,selected:selected,today:today,disabled:disabled,empty:empty};row[w4C](this[d7S](dayConfig));if(++r===Q7C){var G7S=O0C;G7S+=k2C;G7S+=M6w;if(this[y7n.t7C][o6w]){var Z7S=n3C;Z7S+=W8y;Z7S+=C6C;Z7S+=q8C;row[Z7S](this[T6w](i-before,month,year));}data[w4C](y6w+row[K9y](l4C)+G7S);row=[];r=x7C;}}var classPrefix=this[y7n.t7C][D8v];var className=classPrefix+j6w;if(this[y7n.t7C][M7S]){var o7S=m6w;o7S+=q6w;className+=o7S;}if(minDate){var w7S=X2X;w7S+=r6C;w7S+=y7n.t7C;w7S+=o3X;var P7S=A2C;P7S+=a8C;P7S+=D2C;var c7S=L1C;c7S+=z3C;c7S+=D8C;var q7S=y7n.t7C;q7S+=O2C;q7S+=O2C;var m7S=f0C;m7S+=c6w;m7S+=D2w;var j7S=S2C;j7S+=G0C;j7S+=J6y;var y7S=k2C;y7S+=W9C;y7S+=k2C;y7S+=M6C;var T7S=h2w;T7S+=c3C;T7S+=o6v;var underMin=minDate>=new Date(Date[T7S](year,month,s7C,x7C,x7C,x7C));this[l8C][y7S][h6y](j7S+classPrefix+m7S)[q7S](c7S,underMin?P7S:w7S);}if(maxDate){var t7S=r3C;t7S+=K9C;t7S+=D2X;var a7S=A2C;a7S+=r6C;a7S+=N6C;var g7S=P6w;g7S+=w6w;g7S+=k2C;var v7S=y7n.a7C;v7S+=W9C;v7S+=G0C;v7S+=J6y;var Y7S=h2w;Y7S+=c3C;Y7S+=o6v;var overMax=maxDate<new Date(Date[Y7S](year,month+s7C,s7C,x7C,x7C,x7C));this[l8C][n9y][h6y](v7S+classPrefix+g7S)[C8C](E3X,overMax?a7S:t7S);}return H7S+className+b5C+e7S+this[Y6w]()+v6w+g6w+data[b7S](l4C)+R7S+a6w;},_htmlMonthHead:function(){var X6w='<th>';var H6w="eekNumber";var R6w="ush";var b6w='<th></th>';var t6w="showW";var x2S=h1C;x2S+=r6C;x2S+=W9C;x2S+=A2C;var z7S=t6w;z7S+=H6w;var a=[];var firstDay=this[y7n.t7C][D6w];var i18n=this[y7n.t7C][o5C];var dayName=function(day){var e6w="eekd";var X7S=y6X;X7S+=e6w;X7S+=C1C;X7S+=O2C;day+=firstDay;while(day>=Q7C){day-=Q7C;}return i18n[X7S][day];};if(this[y7n.t7C][z7S]){var I7S=W4y;I7S+=O2C;I7S+=C6C;a[I7S](b6w);}for(var i=x7C;i<Q7C;i++){var p7S=r0C;p7S+=W0C;p7S+=b4C;p7S+=i0C;var n7S=z3C;n7S+=R6w;a[n7S](X6w+dayName(i)+p7S);}y7n[d4C]();return a[x2S](l4C);},_htmlWeekOfYear:function(d,m,y){var F9w="getDate";var x9w="getDa";var w7C=86400000;var n6w="ek\">";var I6w="-w";var p6w="<td cla";var z6w="</td";var A2S=z6w;A2S+=i0C;var U2S=I6w;U2S+=D2C;U2S+=n6w;var V2S=p6w;V2S+=L8v;var F2S=B9C;F2S+=W9C;F2S+=v3C;var s2S=x9w;s2S+=M3C;var date=new Date(y,m,d,x7C,x7C,x7C,x7C);date[s9w](date[F9w]()+U7C-(date[s2S]()||Q7C));var oneJan=new Date(y,x7C,s7C);var weekNum=Math[F2S](((date-oneJan)/w7C+s7C)/Q7C);return V2S+this[y7n.t7C][D8v]+U2S+weekNum+A2S;},_options:function(selector,values,labels){var Q9w='<option value="';var U9w="aine";var S9w='</option>';var V9w="ont";var k2S=y7n.v7C;k2S+=y7n.g7C;var S2S=i9C;S2S+=s9X;var Q2S=y7n.t7C;Q2S+=V9w;Q2S+=U9w;Q2S+=Z3C;if(!labels){labels=values;}var select=this[l8C][Q2S][S2S](A9w+this[y7n.t7C][D8v]+l9y+selector);y7n[k2S]();select[d7y]();for(var i=x7C,ien=values[Z7X];i<ien;i++){var N2S=y7n.X7C;N2S+=k9X;N2S+=A2C;N2S+=y7n.a7C;select[N2S](Q9w+values[i]+b5C+labels[i]+S9w);}},_optionSet:function(selector,val){var N9w="are";var k9w="known";var r2S=X3X;r2S+=k9w;var K2S=U5v;K2S+=y7n.g7C;K2S+=A2C;var l2S=M6C;l2S+=c7y;l2S+=k2C;l2S+=C6C;var E2S=C6C;E2S+=k2C;E2S+=U3X;var C2S=G0C;C2S+=y7n.X7C;C2S+=v3C;var D2S=E8X;D2S+=D2C;D2S+=A2C;var O2S=z3C;O2S+=N9w;O2S+=o1C;var L2S=y7n.H7C;L2S+=W9C;L2S+=A2C;L2S+=y7n.a7C;var select=this[l8C][F7X][L2S](A9w+this[y7n.t7C][D8v]+l9y+selector);var span=select[O2S]()[D2S](h7w);select[C2S](val);var selected=select[h6y](L9w);span[E2S](selected[l2S]!==x7C?selected[G0v]():this[y7n.t7C][K2S][r2S]);},_optionsTime:function(unit,count,val,allowed,range){var Y9w="</t";var T9w="amPm";var u9w="onta";var O9w="<t";var j9w="/t";var D9w="body>";var E9w="d><tr>";var c9w="y>";var P9w="</tbody></thead><ta";var A7C=6;var r9w="e class";var w9w="ble class=\"";var l9w="<th colspan=";var K9w="<tab";var o9w="<tr";var C9w="</th></tr></t";var v9w='</tbody>';var W9w="sPrefix";var q9w="pace\"><tbod";var m9w="-nos";var y9w='</tr>';var I2S=O9w;I2S+=D9w;var z2S=C9w;z2S+=e4y;z2S+=i0C;var X2S=s6w;X2S+=E9w;X2S+=l9w;X2S+=y4C;var R2S=K9w;R2S+=v3C;R2S+=r9w;R2S+=A0y;var G2S=e4C;G2S+=b4C;var Z2S=W9C;Z2S+=y7n.b7C;Z2S+=U1y;var d2S=f0C;d2S+=z0y;d2S+=M6C;var J2S=A7X;J2S+=W9w;var B2S=S6y;B2S+=r9C;var h2S=S2C;h2S+=G0C;h2S+=J6y;var i2S=y7n.H7C;i2S+=S1X;var u2S=y7n.t7C;u2S+=u9w;u2S+=W9C;u2S+=c7X;var W2S=y7n.a7C;W2S+=r6C;W2S+=y7n.z7C;var classPrefix=this[y7n.t7C][D8v];var container=this[W2S][u2S][i2S](h2S+classPrefix+l9y+unit);var i,j;var render=count===L7C?function(i){var f2S=y7n.v7C;f2S+=y7n.g7C;y7n[f2S]();return i;}:this[B2S];var classPrefix=this[y7n.t7C][J2S];var className=classPrefix+d2S;var i18n=this[y7n.t7C][Z2S];if(!container[G2S]){return;}var a=l4C;var span=k7C;var button=function(value,label,className){var d9w="ss=\"selectable ";var Z9w=' disabled';var B9w="=\"button\" data-unit=\"";var M9w='</td>';var f9w="-day\" type";var J9w="<td ";var h9w="\" data-value=";var q2S=i9w;q2S+=y7n.X7C;q2S+=A2C;q2S+=i0C;var m2S=X5v;m2S+=y7n.X7C;m2S+=g0C;var j2S=y4C;j2S+=i0C;var y2S=h9w;y2S+=y4C;var T2S=f9w;T2S+=B9w;var o2S=J9w;o2S+=u1C;o2S+=y7n.X7C;o2S+=d9w;var M2S=y7n.X7C;M2S+=y7n.z7C;y7n[d4C]();if(count===L7C&&val>=L7C&&typeof value===r2y){value+=L7C;}var selected=val===value||value===M2S&&val<L7C||value===z7w&&val>=L7C?C5v:l4C;if(allowed&&$[w5X](value,allowed)===-s7C){selected+=Z9w;}if(className){selected+=H5C+className;}return o2S+selected+b5C+G9w+classPrefix+X3w+classPrefix+T2S+unit+y2S+value+j2S+m2S+label+q2S+p3w+M9w;};if(count===L7C){var P2S=o9w;P2S+=i0C;var c2S=r0C;c2S+=K7v;c2S+=i0C;a+=c2S;for(i=s7C;i<=A7C;i++){a+=button(i,render(i));}a+=button(m9v,i18n[T9w][x7C]);a+=y9w;a+=P2S;for(i=Q7C;i<=L7C;i++){a+=button(i,render(i));}a+=button(z7w,i18n[T9w][s7C]);a+=y9w;span=Q7C;}else if(count===r7C){var c=x7C;for(j=x7C;j<U7C;j++){var w2S=r0C;w2S+=j9w;w2S+=Z3C;w2S+=i0C;a+=y6w;for(i=x7C;i<A7C;i++){a+=button(c,render(c));c++;}a+=w2S;}span=A7C;}else{var b2S=r0C;b2S+=j9w;b2S+=Z3C;b2S+=i0C;var e2S=r0C;e2S+=k2C;e2S+=Z3C;e2S+=i0C;var H2S=y7n.H7C;H2S+=v3C;H2S+=r6C;H2S+=N2C;var t2S=m9w;t2S+=q9w;t2S+=c9w;var a2S=P9w;a2S+=w9w;var g2S=Y9w;g2S+=M6w;var Y2S=r0C;Y2S+=k2C;Y2S+=Z3C;Y2S+=i0C;a+=Y2S;for(j=x7C;j<M7C;j+=k7C){var v2S=Z3C;v2S+=u1X;v2S+=U1C;a+=button(j,render(j),v2S);}a+=g2S;a+=a2S+className+H5C+className+t2S;var start=range!==S8C?range:Math[H2S](val/k7C)*k7C;a+=e2S;for(j=start+s7C;j<start+k7C;j++){a+=button(j,render(j));}a+=b2S;span=A7C;}container[d7y]()[z7X](R2S+className+b5C+X2S+span+b5C+i18n[unit]+z2S+I2S+a+v9w+a6w);},_optionsTitle:function(){var X9w="months";var e9w="minDa";var R9w="_range";var a9w="_o";var H9w="earRange";var t9w="pti";var b9w="yearRange";var F3S=g9w;F3S+=c7y;F3S+=D2C;var s3S=y7n.z7C;s3S+=r6C;s3S+=A2C;s3S+=b4C;var x3S=a9w;x3S+=t9w;x3S+=r6C;x3S+=W8y;var p2S=M3C;p2S+=H9w;var n2S=e9w;n2S+=o6C;var i18n=this[y7n.t7C][o5C];var min=this[y7n.t7C][n2S];var max=this[y7n.t7C][g8v];var minYear=min?min[u3w]():S8C;var maxYear=max?max[u3w]():S8C;var i=minYear!==S8C?minYear:new Date()[u3w]()-this[y7n.t7C][b9w];var j=maxYear!==S8C?maxYear:new Date()[u3w]()+this[y7n.t7C][p2S];this[x3S](s3S,this[R9w](x7C,N7C),i18n[X9w]);this[z9w](I9w,this[F3S](i,j));},_pad:function(i){var n9w='0';return i<k7C?n9w+i:i;},_position:function(){var p9w="widt";var V1w="outerWidth";var x1w="To";var s1w="outerHe";var U1w='top';var F1w="ntain";var A1w="width";var E3S=p9w;E3S+=C6C;var C3S=v3C;C3S+=D2C;C3S+=y7n.H7C;C3S+=k2C;var O3S=k2C;O3S+=r6C;O3S+=z3C;var L3S=r3C;L3S+=r6C;L3S+=l2y;var N3S=G0X;N3S+=s9X;N3S+=x1w;var k3S=v3C;k3S+=D2C;k3S+=y7n.H7C;k3S+=k2C;var S3S=s1w;S3S+=W9C;S3S+=F1X;var Q3S=y7n.a7C;Q3S+=r6C;Q3S+=y7n.z7C;var A3S=O7X;A3S+=F1w;A3S+=D2C;A3S+=Z3C;var U3S=W9C;U3S+=A2C;U3S+=z3C;U3S+=O9X;var V3S=y7n.a7C;V3S+=r6C;V3S+=y7n.z7C;var offset=this[V3S][U3S][p4X]();var container=this[l8C][A3S];y7n[d4C]();var inputHeight=this[Q3S][z5C][S3S]();container[C8C]({top:offset[A0X]+inputHeight,left:offset[k3S]})[N3S](L3S);var calHeight=container[A1X]();var calWidth=container[V1w]();var scrollTop=$(window)[m9X]();if(offset[O3S]+inputHeight+calHeight-scrollTop>$(window)[s0X]()){var D3S=k2C;D3S+=r6C;D3S+=z3C;var newTop=offset[D3S]-calHeight;container[C8C](U1w,newTop<x7C?x7C:newTop);}if(calWidth+offset[C3S]>$(window)[E3S]()){var K3S=M6C;K3S+=h7y;var l3S=y7n.t7C;l3S+=O2C;l3S+=O2C;var newLeft=$(window)[A1w]()-calWidth;container[l3S](K3S,newLeft<x7C?x7C:newLeft);}},_range:function(start,end,inc){y7n[y7n.p7C]();var a=[];if(!inc){inc=s7C;}for(var i=start;i<=end;i+=inc){var r3S=z3C;r3S+=n3C;r3S+=O2C;r3S+=C6C;a[r3S](i);}return a;},_setCalander:function(){var S1w="_htmlMonth";var Q1w="lend";var W3S=S2C;W3S+=O8C;W3S+=D8C;y7n[d4C]();if(this[O2C][W3S]){var u3S=f4y;u3S+=Q1w;u3S+=y7n.X7C;u3S+=Z3C;this[l8C][u3S][d7y]()[z7X](this[S1w](this[O2C][U0X][J3w](),this[O2C][U0X][Z3w]()));}},_setTitle:function(){var N1w="_optionSet";var k1w="optionSet";var B3S=S2C;B3S+=O2C;B3S+=f1C;B3S+=C1C;var f3S=t2C;f3S+=k1w;var h3S=y7n.X7C;h3S+=y7n.g7C;var i3S=Z1C;i3S+=I5v;this[N1w](i3S,this[O2C][U0X][Z3w]());y7n[h3S]();this[f3S](I9w,this[O2C][B3S][J3w]());},_setTime:function(){var C1w="ionsT";var O1w="dsR";var f1w="hoursAvailable";var B1w='minutes';var K1w="_optio";var D1w="_op";var r1w="nsTime";var l1w="12";var E1w="getUTCMinut";var L1w="secon";var v3S=L1w;v3S+=O1w;v3S+=C2w;var Y3S=L1w;Y3S+=y7n.a7C;Y3S+=O2C;var w3S=w2C;w3S+=O7X;w3S+=E7w;var P3S=D1w;P3S+=k2C;P3S+=C1w;P3S+=G2C;var c3S=E1w;c3S+=s7X;var q3S=a2w;q3S+=D2C;q3S+=O2C;var m3S=z9w;m3S+=y5v;var j3S=C6C;j3S+=W3w;j3S+=O2C;j3S+=l1w;var y3S=z3C;y3S+=y7n.X7C;y3S+=Z3C;y3S+=I8C;var T3S=C6C;T3S+=W3w;T3S+=O2C;var o3S=K1w;o3S+=r1w;var J3S=y7n.X7C;J3S+=y7n.g7C;var that=this;var d=this[O2C][y7n.a7C];y7n[J3S]();var hours=d?d[n2w]():x7C;var allowed=function(prop){var i1w="Availab";var u1w="ment";var W1w="Incre";var h1w='Available';var M3S=W1w;M3S+=u1w;var G3S=g9w;G3S+=A2C;G3S+=U1C;var Z3S=i1w;Z3S+=M6C;var d3S=y7n.X7C;d3S+=y7n.g7C;y7n[d3S]();return that[y7n.t7C][prop+h1w]?that[y7n.t7C][prop+Z3S]:that[G3S](x7C,G7C,that[y7n.t7C][prop+M3S]);};this[o3S](T3S,this[O2C][y3S][j3S]?L7C:r7C,hours,this[y7n.t7C][f1w]);this[m3S](q3S,M7C,d?d[c3S]():x7C,allowed(B1w),this[O2C][g2w]);this[P3S](w3S,M7C,d?d[f3w]():x7C,allowed(Y3S),this[O2C][v3S]);},_show:function(){var M1w="pace";var o1w="_position";var d1w="div.DTE";var G1w="resi";var J1w="eydown";var Z1w="_Body_Co";var z3S=o3X;z3S+=J1w;z3S+=J6y;var X3S=r6C;X3S+=A2C;var R3S=y7n.X7C;R3S+=y7n.g7C;var H3S=d1w;H3S+=Z1w;H3S+=Y4y;var t3S=W6C;t3S+=G1w;t3S+=X8X;var a3S=r6C;a3S+=A2C;var g3S=r4y;g3S+=Q2y;g3S+=M1w;var that=this;var namespace=this[O2C][g3S];this[o1w]();$(window)[a3S](o3w+namespace+t3S+namespace,function(){y7n[d4C]();that[o1w]();});$(H3S)[a8C](o3w+namespace,function(){var T1w="si";var b3S=Q9y;b3S+=T1w;b3S+=t9C;b3S+=a8C;var e3S=y7n.v7C;e3S+=y7n.g7C;y7n[e3S]();that[b3S]();});y7n[R3S]();$(document)[X3S](z3S+namespace,function(e){var S7C=9;var m1w="_hid";var y1w="Code";var j1w="eyCode";var p3S=o3X;p3S+=H7y;p3S+=y1w;var n3S=g7y;n3S+=B2v;n3S+=r6C;n3S+=W2C;var I3S=o3X;I3S+=j1w;if(e[I3S]===S7C||e[n3S]===u7C||e[p3S]===O7C){var x6S=m1w;x6S+=D2C;that[x6S]();}});setTimeout(function(){var q1w='click.';var F6S=r6C;F6S+=A2C;var s6S=r3C;s6S+=r6C;s6S+=y7n.a7C;s6S+=M3C;$(s6S)[F6S](q1w+namespace,function(e){var P1w="ontai";var Q6S=W9C;Q6S+=c1w;Q6S+=n3C;Q6S+=k2C;var A6S=y7n.t7C;A6S+=P1w;A6S+=A2C;A6S+=x6C;var U6S=i9C;U6S+=v3C;U6S+=k2C;U6S+=x6C;var V6S=y7n.v7C;V6S+=y7n.g7C;y7n[V6S]();var parents=$(e[M9X])[h2v]();if(!parents[U6S](that[l8C][A6S])[Z7X]&&e[M9X]!==that[l8C][Q6S][x7C]){that[d6X]();}});},k7C);},_writeOutput:function(focus){var Y1w="moment";var w1w="etUTC";var D6S=W9C;D6S+=L7w;var O6S=y7n.X7C;O6S+=y7n.g7C;var L6S=t2C;L6S+=z3C;L6S+=y7n.X7C;L6S+=y7n.a7C;var N6S=Q1C;N6S+=w1w;N6S+=G2w;var k6S=t2C;k6S+=z3C;k6S+=y7n.X7C;k6S+=y7n.a7C;var S6S=y7n.z7C;S6S+=W7X;S6S+=r1C;S6S+=k2C;var date=this[O2C][y7n.a7C];var out=window[Y1w]?window[S6S][p8v](date,undefined,this[y7n.t7C][x7w],this[y7n.t7C][s7w])[T8v](this[y7n.t7C][T8v]):date[J3w]()+l9y+this[k6S](date[N6S]()+s7C)+l9y+this[L6S](date[l3w]());y7n[O6S]();this[l8C][D6S][F2X](out);if(focus){var C6S=x3C;C6S+=y7n.t7C;C6S+=o8C;this[l8C][z5C][C6S]();}}});Editor[E6S][l6S]=x7C;Editor[K6S][y5C]={classPrefix:v1w,disableDays:S8C,firstDay:s7C,format:C8v,hoursAvailable:S8C,i18n:Editor[r6S][o5C][W6S],maxDate:S8C,minDate:S8C,minutesAvailable:S8C,minutesIncrement:s7C,momentStrict:I4C,momentLocale:u6S,onChange:function(){},secondsAvailable:S8C,secondsIncrement:s7C,showWeekNumber:X4C,yearRange:k7C};(function(){var y5w="radio";var a1w="chec";var U5w='<label for="';var X1w="hi";var Z4w="_input";var E0w="select";var m0w="_lastSet";var r0w="_v";var w0w="separator";var f5w="Id";var F5w='_';var b1w="don";var H4w="bled";var g1w="dio";var b8w="_container";var R5w="datepicker";var p1w="yp";var k0w="_inpu";var t4w="_ena";var K0w="_edi";var a8w="uploadMany";var i8w="_picker";var D8w="datetime";var R1w="ly";var Z0w="optionsPair";var x5w='<div>';var n1w="fieldT";var H0w="_editor_val";var B0w="placeholder";var G4w="_enabled";var w4w="uplo";var x4w="_in";var P0w="multiple";var H1w="xten";var D0w="textarea";var I1w="eldT";var U0w="prop";var p0w="fe";var A5w='input:last';var z1w="dde";var S0w='text';var t1w="kbo";var Q0w='<input/>';var e1w="sswor";var A0w="_val";var k4w="</d";var Y0w="inpu";var n4w='div.rendered';var c8w="noFileText";var q0w="_addOptions";var L5w='input:checked';var m4w="rop";var p4w='div.clearValue button';var g5S=D2C;g5S+=h4y;var r5S=Y1y;r5S+=y7n.a7C;var J4S=D2C;J4S+=T2C;J4S+=l0v;var B4S=Z3C;B4S+=y7n.X7C;B4S+=g1w;var a1S=c5y;a1S+=D2C;a1S+=A2C;a1S+=y7n.a7C;var g1S=a1w;g1S+=t1w;g1S+=T2C;var v9S=D2C;v9S+=H1w;v9S+=y7n.a7C;var Y9S=z3C;Y9S+=y7n.X7C;Y9S+=e1w;Y9S+=y7n.a7C;var m9S=D2C;m9S+=T2C;m9S+=o6C;m9S+=s9X;var j9S=k2C;j9S+=D2C;j9S+=T2C;j9S+=k2C;var M9S=D2C;M9S+=C2C;M9S+=r1C;M9S+=y7n.a7C;var G9S=t6y;G9S+=b1w;G9S+=R1w;var d9S=X1w;d9S+=z1w;d9S+=A2C;var W9S=i9C;W9S+=I1w;W9S+=o2C;var r9S=N0C;r9S+=o6C;r9S+=A2C;r9S+=y7n.a7C;var i6S=n1w;i6S+=p1w;i6S+=s7X;var fieldTypes=Editor[i6S];function _buttonText(conf,text){var V4w='div.upload button';var F4w="Choose file...";var s4w="uploadText";var h6S=x4w;h6S+=W4y;h6S+=k2C;if(text===S8C||text===undefined){text=conf[s4w]||F4w;}conf[h6S][h6y](V4w)[X7X](text);}function _commonUpload(editor,conf,dropCallback,multiple){var L4w="<input type=";var W4w="nternal";var S4w="ell\">";var E4w="d limitHide\">";var o4w="div.d";var K4w="ow\">";var D4w="le\" ";var Q4w="ass=\"c";var l4w="<div class=\"r";var y4w=" drop a file here to upload";var r4w="buttonI";var J4w='<div class="cell limitHide">';var d4w='<div class="drop"><span/></div>';var M4w="FileReader";var e4w='dragover';var u4w='<div class="editor_upload">';var B4w='<div class="row second">';var g4w='over';var i4w='<div class="eu_table">';var s0w='input[type=file]';var j4w="drag";var N4w="ltiple";var q4w="Text";var U4w="dragDr";var T4w="Drag and";var h4w='/>';var c4w='div.drop span';var a4w='dragleave dragexit';var C4w="lass=\"cell uploa";var O4w="\"fi";var A4w="=\"rendered\"/>";var I4w='noDrop';var f4w='<div class="cell clearValue">';var L9S=y7n.t7C;L9S+=K0X;L9S+=c7y;L9S+=D2C;var k9S=y7n.t7C;k9S+=N6X;k9S+=D2X;var S9S=r6C;S9S+=A2C;var P6S=U4w;P6S+=p9C;var c6S=r0C;c6S+=V0y;var q6S=O0C;q6S+=y7n.a7C;q6S+=W9C;q6S+=m0C;var m6S=U0y;m6S+=A4w;var j6S=c0C;j6S+=u1C;j6S+=Q4w;j6S+=S4w;var y6S=r0C;y6S+=W0C;y6S+=S2C;y6S+=m0C;var T6S=r0C;T6S+=W0C;T6S+=S2C;T6S+=m0C;var o6S=y4C;o6S+=W6C;o6S+=W0C;o6S+=i0C;var M6S=k4w;M6S+=E3v;M6S+=i0C;var G6S=I2C;G6S+=N4w;var Z6S=L4w;Z6S+=O4w;Z6S+=D4w;var d6S=Q6X;d6S+=C4w;d6S+=E4w;var J6S=l4w;J6S+=K4w;var B6S=r4w;B6S+=W4w;var f6S=G7X;f6S+=D2C;f6S+=O2C;var btnClass=editor[f6S][g3C][B6S];var container=$(u4w+i4w+J6S+d6S+G9w+btnClass+m8X+Z6S+(multiple?G6S:l4C)+h4w+M6S+f4w+G9w+btnClass+o6S+T6S+X5C+B4w+J4w+d4w+y6S+j6S+m6S+q6S+X5C+c6S+X5C);conf[Z4w]=container;conf[G4w]=I4C;_buttonText(conf);if(window[M4w]&&conf[P6S]!==X4C){var U9S=r6C;U9S+=A2C;var s9S=r6C;s9S+=z3C;s9S+=D2C;s9S+=A2C;var x9S=r6C;x9S+=A2C;var H6S=w1v;H6S+=r6C;H6S+=z3C;var t6S=r6C;t6S+=A2C;var a6S=o4w;a6S+=Z3C;a6S+=p9C;var g6S=y7n.H7C;g6S+=S1X;var v6S=T4w;v6S+=y4w;var Y6S=j4w;Y6S+=d2C;Y6S+=m4w;Y6S+=q4w;var w6S=T8y;w6S+=y7n.a7C;container[w6S](c4w)[G0v](conf[Y6S]||v6S);var dragDrop=container[g6S](a6S);dragDrop[t6S](H6S,function(e){var v4w="dataTransfer";var P4w="_enab";var Y4w="originalEvent";var e6S=P4w;e6S+=z2C;if(conf[e6S]){var R6S=y7n.H7C;R6S+=a4C;R6S+=s7X;var b6S=w4w;b6S+=r9C;Editor[b6S](editor,conf,e[Y4w][v4w][R6S],_buttonText,dropCallback);dragDrop[V7X](g4w);}return X4C;})[a8C](a4w,function(e){var z6S=t4w;z6S+=H4w;var X6S=y7n.v7C;X6S+=y7n.g7C;y7n[X6S]();if(conf[z6S]){var I6S=H2X;I6S+=o6v;I6S+=v3C;I6S+=k7X;dragDrop[I6S](g4w);}return X4C;})[a8C](e4w,function(e){var b4w="ddC";var n6S=F8y;n6S+=A2C;n6S+=y7n.X7C;n6S+=H4w;y7n[y7n.p7C]();if(conf[n6S]){var p6S=y7n.X7C;p6S+=b4w;p6S+=v3C;p6S+=k7X;dragDrop[p6S](g4w);}return X4C;});editor[x9S](s9S,function(){var R4w='dragover.DTE_Upload drop.DTE_Upload';var F9S=r6C;F9S+=A2C;$(j9X)[F9S](R4w,function(e){var V9S=y7n.X7C;V9S+=y7n.g7C;y7n[V9S]();return X4C;});})[U9S](t3X,function(){var z4w="d drop.DTE_Upload";var X4w="agover.DTE_Uploa";var Q9S=w1v;Q9S+=X4w;Q9S+=z4w;var A9S=y7n.X7C;A9S+=y7n.g7C;y7n[A9S]();$(j9X)[H4X](Q9S);});}else{container[H8C](I4w);container[z7X](container[h6y](n4w));}container[h6y](p4w)[S9S](k9S,function(){var N9S=t1y;N9S+=v3C;Editor[x0w][z1y][g2X][N9S](editor,conf,l4C);});container[h6y](s0w)[a8C](L9S,function(){var O9S=y7n.X7C;O9S+=y7n.g7C;y7n[O9S]();Editor[z1y](editor,conf,this[Y4C],_buttonText,function(ids){var V0w="e=file]";var F0w="input[";var l9S=K4v;l9S+=v3C;var E9S=F0w;E9S+=S9C;E9S+=V0w;var C9S=y7n.H7C;C9S+=W9C;C9S+=A2C;C9S+=y7n.a7C;var D9S=t1y;D9S+=v3C;dropCallback[D9S](editor,ids);container[C9S](E9S)[l9S](l4C);});});return container;}function _triggerChange(input){setTimeout(function(){var K9S=y7n.v7C;K9S+=y7n.g7C;y7n[K9S]();input[F7v](Y2y,{editor:I4C,editorSet:I4C});},x7C);}var baseFieldType=$[r9S](I4C,{},Editor[K8C][W9S],{get:function(conf){var u9S=y7n.v7C;u9S+=y7n.g7C;y7n[u9S]();return conf[Z4w][F2X]();},set:function(conf,val){var i9S=B2C;i9S+=L7w;conf[i9S][F2X](val);_triggerChange(conf[Z4w]);},enable:function(conf){y7n[y7n.p7C]();conf[Z4w][U0w](Y2w,X4C);},disable:function(conf){var B9S=y7n.a7C;B9S+=W9C;B9S+=g2y;B9S+=H4w;var f9S=a6C;f9S+=p9C;var h9S=t2C;h9S+=W9C;h9S+=A2C;h9S+=T2w;conf[h9S][f9S](B9S,I4C);},canReturnSubmit:function(conf,node){var J9S=y7n.X7C;J9S+=y7n.g7C;y7n[J9S]();return I4C;}});fieldTypes[d9S]={create:function(conf){var Z9S=y7n.X7C;Z9S+=y7n.g7C;y7n[Z9S]();conf[A0w]=conf[h1y];return S8C;},get:function(conf){return conf[A0w];},set:function(conf,val){conf[A0w]=val;}};fieldTypes[G9S]=$[M9S](I4C,{},baseFieldType,{create:function(conf){var y9S=y7n.X7C;y9S+=k2C;y9S+=K7v;var T9S=g2y;T9S+=y7n.H7C;T9S+=O5C;var o9S=x4w;o9S+=z3C;o9S+=O9X;conf[o9S]=$(Q0w)[w7y]($[T5C]({id:Editor[T9S](conf[c5C]),type:S0w,readonly:G8C},conf[y9S]||{}));return conf[Z4w][x7C];}});y7n[d4C]();fieldTypes[j9S]=$[m9S](I4C,{},baseFieldType,{create:function(conf){var w9S=x4w;w9S+=T2w;var P9S=k2C;P9S+=N0C;P9S+=k2C;var c9S=y7n.X7C;c9S+=k2C;c9S+=k2C;c9S+=Z3C;var q9S=t2C;q9S+=W9C;q9S+=A2C;q9S+=T2w;conf[q9S]=$(Q0w)[c9S]($[T5C]({id:Editor[f1y](conf[c5C]),type:P9S},conf[w7y]||{}));y7n[y7n.p7C]();return conf[w9S][x7C];}});fieldTypes[Y9S]=$[v9S](I4C,{},baseFieldType,{create:function(conf){var O0w="af";var N0w="passwo";var L0w="rd";var e9S=k0w;e9S+=k2C;var H9S=u8X;H9S+=Z3C;var t9S=N0w;t9S+=L0w;var a9S=O2C;a9S+=O0w;a9S+=O5C;var g9S=N0C;g9S+=l0v;conf[Z4w]=$(Q0w)[w7y]($[g9S]({id:Editor[a9S](conf[c5C]),type:t9S},conf[H9S]||{}));y7n[y7n.p7C]();return conf[e9S][x7C];}});fieldTypes[D0w]=$[T5C](I4C,{},baseFieldType,{create:function(conf){var C0w='<textarea/>';var z9S=y7n.v7C;z9S+=y7n.g7C;var X9S=W9C;X9S+=y7n.a7C;var R9S=y7n.X7C;R9S+=U7y;R9S+=Z3C;var b9S=t2C;b9S+=W9C;b9S+=c1w;b9S+=O9X;conf[b9S]=$(C0w)[R9S]($[T5C]({id:Editor[f1y](conf[X9S])},conf[w7y]||{}));y7n[z9S]();return conf[Z4w][x7C];},canReturnSubmit:function(conf,node){var I9S=y7n.X7C;I9S+=y7n.g7C;y7n[I9S]();return X4C;}});fieldTypes[E0w]=$[T5C](I4C,{},baseFieldType,{_addOptions:function(conf,opts,append){var d0w="ir";var i0w="holde";var l0w="placeh";var W0w="hid";var u0w="ceholderDis";var f0w="placeholderValue";var h0w="rValu";var J0w="placeholderDisabled";var n9S=p9C;n9S+=k2C;n9S+=j7y;n9S+=W8y;var elOpts=conf[Z4w][x7C][n9S];var countOffset=x7C;if(!append){var x1S=l0w;x1S+=X0C;x1S+=C9y;var p9S=s2X;p9S+=C6C;elOpts[p9S]=x7C;if(conf[x1S]!==undefined){var U1S=K0w;U1S+=a0y;U1S+=r0w;U1S+=B5C;var V1S=W0w;V1S+=y7n.a7C;V1S+=D2C;V1S+=A2C;var F1S=Y4X;F1S+=u0w;F1S+=v6C;F1S+=y7n.a7C;var s1S=M5y;s1S+=i0w;s1S+=h0w;s1S+=D2C;var placeholderValue=conf[f0w]!==undefined?conf[s1S]:l4C;countOffset+=s7C;elOpts[x7C]=new Option(conf[B0w],placeholderValue);var disabled=conf[J0w]!==undefined?conf[F1S]:I4C;elOpts[x7C][V1S]=disabled;elOpts[x7C][Z8C]=disabled;elOpts[x7C][U1S]=placeholderValue;}}else{countOffset=elOpts[Z7X];}if(opts){var A1S=z3C;A1S+=y7n.X7C;A1S+=d0w;A1S+=O2C;Editor[A1S](opts,conf[Z0w],function(val,label,i,attr){var Q1S=z9y;Q1S+=A0w;var option=new Option(label,val);y7n[y7n.p7C]();option[Q1S]=val;if(attr){var S1S=y7n.X7C;S1S+=k2C;S1S+=k2C;S1S+=Z3C;$(option)[S1S](attr);}elOpts[i+countOffset]=option;});}},create:function(conf){var o0w="change.d";var M0w="elect";var G0w="ipOpt";var T0w="feId";var y0w='<select/>';var i1S=B2C;i1S+=k8C;i1S+=k2C;var u1S=G0w;u1S+=O2C;var W1S=O2C;W1S+=M0w;var E1S=o0w;E1S+=k2C;E1S+=D2C;var C1S=r6C;C1S+=A2C;var D1S=K2C;D1S+=k2C;D1S+=Z3C;var O1S=U2X;O1S+=W9C;O1S+=z3C;O1S+=M6C;var L1S=g2y;L1S+=T0w;var N1S=k6X;N1S+=y7n.a7C;var k1S=y7n.X7C;k1S+=y7n.g7C;y7n[k1S]();conf[Z4w]=$(y0w)[w7y]($[N1S]({id:Editor[L1S](conf[c5C]),multiple:conf[O1S]===I4C},conf[D1S]||{}))[C1S](E1S,function(e,d){var j0w="lect";var l1S=d3y;l1S+=N2C;if(!d||!d[l1S]){var r1S=Q1C;r1S+=D2C;r1S+=k2C;var K1S=O2C;K1S+=D2C;K1S+=j0w;conf[m0w]=fieldTypes[K1S][r1S](conf);}});fieldTypes[W1S][q0w](conf,conf[m2v]||conf[u1S]);return conf[i1S][x7C];},update:function(conf,options,append){var f1S=t2C;f1S+=a8X;f1S+=a3C;var h1S=w2C;h1S+=v3C;h1S+=K2X;h1S+=k2C;fieldTypes[h1S][f1S](conf,options,append);var lastSet=conf[m0w];if(lastSet!==undefined){fieldTypes[E0w][g2X](conf,lastSet,I4C);}_triggerChange(conf[Z4w]);},get:function(conf){var Z1S=e4C;Z1S+=b4C;var d1S=k2C;d1S+=d5C;d1S+=y2y;d1S+=M3C;var B1S=y7n.H7C;B1S+=W9C;B1S+=A2C;B1S+=y7n.a7C;var val=conf[Z4w][B1S](L9w)[J3y](function(){var c0w="r_val";var J1S=t2C;J1S+=R2v;J1S+=c0w;return this[J1S];})[d1S]();if(conf[P0w]){return conf[w0w]?val[K9y](conf[w0w]):val;}return val[Z1S]?val[x7C]:S8C;},set:function(conf,val,localUpdate){var a0w="lastSet";var g0w="para";var t0w='option';var v0w="_inp";var b0w="ected";var c1S=D2C;c1S+=T1X;var q1S=p9C;q1S+=V3X;var m1S=t2C;m1S+=Y0w;m1S+=k2C;var j1S=y7n.X7C;j1S+=y7n.g7C;var y1S=v0w;y1S+=n3C;y1S+=k2C;var o1S=W9C;o1S+=s9y;o1S+=y7n.X7C;o1S+=M3C;var M1S=w2C;M1S+=g0w;M1S+=k2C;M1S+=N2C;if(!localUpdate){var G1S=t2C;G1S+=a0w;conf[G1S]=val;}if(conf[P0w]&&conf[M1S]&&!$[o1S](val)){var T1S=Q6C;T1S+=g1y;T1S+=c7y;val=typeof val===T1S?val[q5y](conf[w0w]):[];}else if(!$[o2X](val)){val=[val];}var i,len=val[Z7X],found,allFound=X4C;var options=conf[y1S][h6y](t0w);y7n[j1S]();conf[m1S][h6y](q1S)[c1S](function(){var e0w="selected";found=X4C;for(i=x7C;i<len;i++){if(this[H0w]==val[i]){found=I4C;allFound=I4C;break;}}this[e0w]=found;});if(conf[B0w]&&!allFound&&!conf[P0w]&&options[Z7X]){var P1S=K0v;P1S+=b0w;options[x7C][P1S]=I4C;}if(!localUpdate){_triggerChange(conf[Z4w]);}return allFound;},destroy:function(conf){var R0w="hange";var X0w=".dte";var v1S=y7n.t7C;v1S+=R0w;v1S+=X0w;var Y1S=r6C;Y1S+=y7n.H7C;Y1S+=y7n.H7C;var w1S=t2C;w1S+=z5C;y7n[y7n.p7C]();conf[w1S][Y1S](v1S);}});fieldTypes[g1S]=$[a1S](I4C,{},baseFieldType,{_addOptions:function(conf,opts,append){var z0w="pairs";var H1S=y7n.X7C;H1S+=y7n.g7C;var t1S=B2C;t1S+=A2C;t1S+=z3C;t1S+=O9X;var val,label;var jqInput=conf[t1S];y7n[H1S]();var offset=x7C;if(!append){jqInput[d7y]();}else{var e1S=Q0C;e1S+=O9X;offset=$(e1S,jqInput)[Z7X];}if(opts){Editor[z0w](opts,conf[Z0w],function(val,label,i,attr){var V5w='" type="checkbox" />';var s5w='<input id="';var I0w="</la";var n0w="bel>";var I1S=G0C;I1S+=y7n.X7C;I1S+=x2X;var z1S=k4w;z1S+=E6y;var X1S=I0w;X1S+=n0w;var R1S=W9C;R1S+=y7n.a7C;var b1S=g2y;b1S+=p0w;b1S+=F4v;b1S+=y7n.a7C;jqInput[z7X](x5w+s5w+Editor[b1S](conf[c5C])+F5w+(i+offset)+V5w+U5w+Editor[f1y](conf[R1S])+F5w+(i+offset)+b5C+label+X1S+z1S);$(A5w,jqInput)[w7y](I1S,val)[x7C][H0w]=val;y7n[d4C]();if(attr){$(A5w,jqInput)[w7y](attr);}});}},create:function(conf){var Q5w="checkbox";var S5w="ipOpts";var s4S=t2C;s4S+=D9C;s4S+=W4y;s4S+=k2C;var x4S=p9C;x4S+=t9C;x4S+=r6C;x4S+=W8y;var p1S=c0C;p1S+=z4y;var n1S=t2C;n1S+=z5C;conf[n1S]=$(p1S);fieldTypes[Q5w][q0w](conf,conf[x4S]||conf[S5w]);return conf[s4S][x7C];},get:function(conf){var k5w="epar";var O5w="selectedValue";var N5w="unselectedV";var k4S=O2C;k4S+=k5w;k4S+=K2C;k4S+=N2C;var A4S=N5w;A4S+=W2X;var F4S=M6C;F4S+=A2C;F4S+=O5X;var out=[];var selected=conf[Z4w][h6y](L5w);if(selected[F4S]){var V4S=q9y;V4S+=y7n.t7C;V4S+=C6C;selected[V4S](function(){var U4S=y7n.X7C;U4S+=y7n.g7C;y7n[U4S]();out[w4C](this[H0w]);});}else if(conf[A4S]!==undefined){var S4S=n3C;S4S+=A2C;S4S+=O5w;var Q4S=z3C;Q4S+=n3C;Q4S+=O2C;Q4S+=C6C;out[Q4S](conf[S4S]);}return conf[w0w]===undefined||conf[w0w]===S8C?out:out[K9y](conf[k4S]);},set:function(conf,val){var C5w='|';var D5w="epara";var C4S=M6C;C4S+=A2C;C4S+=O5X;var D4S=W9C;D4S+=l1y;D4S+=j6X;D4S+=M3C;var N4S=y7n.H7C;N4S+=W9C;N4S+=A2C;N4S+=y7n.a7C;var jqInputs=conf[Z4w][N4S](M7X);if(!$[o2X](val)&&typeof val===h2X){var O4S=O2C;O4S+=D5w;O4S+=k2C;O4S+=N2C;var L4S=D1C;L4S+=D8X;val=val[L4S](conf[O4S]||C5w);}else if(!$[D4S](val)){val=[val];}var i,len=val[C4S],found;jqInputs[P4C](function(){var l5w="_va";var E5w="ked";var l4S=a1w;l4S+=E5w;found=X4C;for(i=x7C;i<len;i++){var E4S=K0w;E4S+=a0y;E4S+=l5w;E4S+=v3C;if(this[E4S]==val[i]){found=I4C;break;}}this[l4S]=found;});_triggerChange(jqInputs);},enable:function(conf){var u4S=X2C;u4S+=v3C;u4S+=D2C;u4S+=y7n.a7C;var W4S=D9C;W4S+=z3C;W4S+=n3C;W4S+=k2C;var r4S=y7n.H7C;r4S+=W9C;r4S+=s9X;var K4S=t2C;K4S+=W9C;K4S+=L7w;conf[K4S][r4S](W4S)[U0w](u4S,X4C);},disable:function(conf){var K5w="disa";var h4S=K5w;h4S+=H4w;var i4S=k0w;i4S+=k2C;conf[i4S][h6y](M7X)[U0w](h4S,I4C);},update:function(conf,options,append){var f4S=a1w;f4S+=o3X;f4S+=n6X;var checkbox=fieldTypes[f4S];var currVal=checkbox[W0X](conf);checkbox[q0w](conf,options,append);checkbox[g2X](conf,currVal);}});fieldTypes[B4S]=$[J4S](I4C,{},baseFieldType,{_addOptions:function(conf,opts,append){var r5w="irs";var d4S=B2C;d4S+=c1w;d4S+=O9X;var val,label;var jqInput=conf[d4S];var offset=x7C;if(!append){var Z4S=D2C;Z4S+=w5y;Z4S+=R6C;jqInput[Z4S]();}else{var G4S=T2X;G4S+=Q1C;G4S+=b4C;offset=$(M7X,jqInput)[G4S];}if(opts){var M4S=z3C;M4S+=y7n.X7C;M4S+=r5w;Editor[M4S](opts,conf[Z0w],function(val,label,i,attr){var W5w="itor_val";var i5w="ype=\"radio";var Z5w="ast";var J5w='</label>';var u5w="\" t";var h5w="\" name=\"";var d5w="input:l";var B5w="input id=\"";var w4S=y7n.X7C;w4S+=y7n.g7C;var P4S=F8y;P4S+=y7n.a7C;P4S+=W5w;var c4S=K4v;c4S+=v3C;c4S+=M3X;var q4S=r4y;q4S+=y7n.z7C;q4S+=D2C;var m4S=u5w;m4S+=i5w;m4S+=h5w;var j4S=W9C;j4S+=y7n.a7C;var y4S=L5C;y4S+=D2C;y4S+=f5w;var T4S=r0C;T4S+=B5w;var o4S=Y3X;o4S+=J8X;o4S+=y7n.a7C;jqInput[o4S](x5w+T4S+Editor[y4S](conf[j4S])+F5w+(i+offset)+m4S+conf[q4S]+m8X+U5w+Editor[f1y](conf[c5C])+F5w+(i+offset)+b5C+label+J5w+X5C);$(A5w,jqInput)[w7y](c4S,val)[x7C][P4S]=val;y7n[w4S]();if(attr){var v4S=y7n.X7C;v4S+=k2C;v4S+=k2C;v4S+=Z3C;var Y4S=d5w;Y4S+=Z5w;$(Y4S,jqInput)[v4S](attr);}});}},create:function(conf){var M5w="ddO";var G5w="pO";var T5w="v ";var o5w="pt";var n4S=B2C;n4S+=A2C;n4S+=W4y;n4S+=k2C;var I4S=y7n.X7C;I4S+=y7n.g7C;var H4S=r6C;H4S+=A2C;var t4S=W9C;t4S+=G5w;t4S+=z3C;t4S+=I8C;var a4S=V9X;a4S+=M5w;a4S+=o5w;a4S+=R3C;var g4S=p3X;g4S+=T5w;g4S+=W0C;g4S+=i0C;conf[Z4w]=$(g4S);fieldTypes[y5w][a4S](conf,conf[m2v]||conf[t4S]);this[H4S](h3y,function(){var R4S=D2C;R4S+=y7n.X7C;R4S+=y7n.t7C;R4S+=C6C;var b4S=Q0C;b4S+=O9X;var e4S=y7n.X7C;e4S+=y7n.g7C;y7n[e4S]();conf[Z4w][h6y](b4S)[R4S](function(){var m5w="che";var j5w="_preCheck";var X4S=j5w;X4S+=E2C;if(this[X4S]){var z4S=m5w;z4S+=y7n.t7C;z4S+=o3X;z4S+=E2C;this[z4S]=I4C;}});});y7n[I4S]();return conf[n4S][x7C];},get:function(conf){var q5w="input:c";var c5w="hec";var s0S=M6C;s0S+=A2C;s0S+=Q1C;s0S+=b4C;var x0S=q5w;x0S+=c5w;x0S+=g7y;x0S+=y7n.a7C;var p4S=B2C;p4S+=L7w;var el=conf[p4S][h6y](x0S);return el[s0S]?el[x7C][H0w]:undefined;},set:function(conf,val){var A0S=B2C;A0S+=c1w;A0S+=n3C;A0S+=k2C;var U0S=y7n.X7C;U0S+=y7n.g7C;var F0S=t2C;F0S+=z5C;var that=this;conf[F0S][h6y](M7X)[P4C](function(){var Y5w="_preC";var w5w="checked";var P5w="_preChecked";var v5w="hecked";this[P5w]=X4C;if(this[H0w]==val){this[w5w]=I4C;this[P5w]=I4C;}else{var V0S=Y5w;V0S+=v5w;this[w5w]=X4C;this[V0S]=X4C;}});y7n[U0S]();_triggerChange(conf[A0S][h6y](L5w));},enable:function(conf){var Q0S=a6C;Q0S+=r6C;Q0S+=z3C;conf[Z4w][h6y](M7X)[Q0S](Y2w,X4C);},disable:function(conf){var g5w="abled";var k0S=L1C;k0S+=g5w;var S0S=i9C;S0S+=s9X;conf[Z4w][S0S](M7X)[U0w](k0S,I4C);},update:function(conf,options,append){var t5w='[value="';var a5w="ilt";var C0S=G0C;C0S+=y7n.X7C;C0S+=x2X;var D0S=D2C;D0S+=l8X;var O0S=y7n.H7C;O0S+=a5w;O0S+=x6C;var L0S=y7n.v7C;L0S+=y7n.g7C;var N0S=Y0w;N0S+=k2C;var radio=fieldTypes[y5w];var currVal=radio[W0X](conf);radio[q0w](conf,options,append);var inputs=conf[Z4w][h6y](N0S);y7n[L0S]();radio[g2X](conf,inputs[O0S](t5w+currVal+c8y)[Z7X]?currVal:inputs[D0S](x7C)[w7y](C0S));}});fieldTypes[c8v]=$[T5C](I4C,{},baseFieldType,{create:function(conf){var z5w='jqueryui';var I5w="eFor";var b5w="t />";var e5w="<inpu";var X5w="Format";var V8w='type';var n5w="RFC_2822";var H5w="safe";var j0S=t2C;j0S+=W9C;j0S+=c1w;j0S+=O9X;var u0S=k2C;u0S+=N0C;u0S+=k2C;var W0S=H5w;W0S+=f5w;var r0S=q2y;r0S+=s9X;var K0S=y7n.X7C;K0S+=k2C;K0S+=K7v;var l0S=e5w;l0S+=b5w;var E0S=t2C;E0S+=D9C;E0S+=z3C;E0S+=O9X;conf[E0S]=$(l0S)[K0S]($[r0S]({id:Editor[W0S](conf[c5C]),type:u0S},conf[w7y]));if($[R5w]){var i0S=c8v;i0S+=X5w;conf[Z4w][H8C](z5w);if(!conf[i0S]){var h0S=j2v;h0S+=I5w;h0S+=b9X;h0S+=k2C;conf[h0S]=$[R5w][n5w];}setTimeout(function(){var x8w="picker-div";var s8w="Image";var p5w="#ui-date";var F8w="eFormat";var T0S=A2C;T0S+=r6C;T0S+=A2C;T0S+=D2C;var o0S=p5w;o0S+=x8w;var M0S=r6C;M0S+=z3C;M0S+=k2C;M0S+=O2C;var J0S=c8v;J0S+=s8w;var B0S=j2v;B0S+=F8w;var f0S=D2C;f0S+=h4y;$(conf[Z4w])[R5w]($[f0S]({dateFormat:conf[B0S],buttonImage:conf[J0S],buttonImageOnly:I4C,onSelect:function(){var G0S=y7n.t7C;G0S+=d6y;G0S+=o3X;var Z0S=M8C;Z0S+=o8C;var d0S=x4w;d0S+=W4y;d0S+=k2C;conf[d0S][Z0S]()[G0S]();}},conf[M0S]));$(o0S)[C8C](E3X,T0S);},k7C);}else{var y0S=y7n.a7C;y0S+=y7n.X7C;y0S+=o6C;conf[Z4w][w7y](V8w,y0S);}return conf[j0S][x7C];},set:function(conf,val){var U8w='hasDatepicker';var A8w="change";var q0S=K0X;q0S+=O2C;q0S+=o6v;q0S+=K7X;var m0S=y7n.v7C;m0S+=y7n.g7C;y7n[m0S]();if($[R5w]&&conf[Z4w][q0S](U8w)){var c0S=B2C;c0S+=A2C;c0S+=W4y;c0S+=k2C;conf[c0S][R5w](s9w,val)[A8w]();}else{$(conf[Z4w])[F2X](val);}},enable:function(conf){var S8w="icker";var Q8w="enabl";var P0S=y7n.v7C;P0S+=y7n.g7C;y7n[P0S]();if($[R5w]){var Y0S=Q8w;Y0S+=D2C;var w0S=j2v;w0S+=G6v;w0S+=S8w;conf[Z4w][w0S](Y0S);}else{var v0S=B2C;v0S+=A2C;v0S+=T2w;$(conf[v0S])[U0w](Y2w,X4C);}},disable:function(conf){y7n[y7n.p7C]();if($[R5w]){conf[Z4w][R5w](K3y);}else{var a0S=z3C;a0S+=Z3C;a0S+=r6C;a0S+=z3C;var g0S=B2C;g0S+=c1w;g0S+=O9X;$(conf[g0S])[a0S](Y2w,I4C);}},owns:function(conf,node){var O8w='div.ui-datepicker';var L8w="ker-header";var N8w="i-datepic";var k8w="div.u";var H0S=k8w;H0S+=N8w;H0S+=L8w;var t0S=a4X;t0S+=s1y;t0S+=A2C;t0S+=I8C;y7n[d4C]();return $(node)[t0S](O8w)[Z7X]||$(node)[h2v](H0S)[Z7X]?I4C:X4C;}});fieldTypes[D8w]=$[T5C](I4C,{},baseFieldType,{create:function(conf){var W8w="_picke";var l8w="_clo";var K8w="seFn";var C8w="_closeF";var E8w="Input";var r8w="datet";var h8w="keydo";var u8w='<input />';var S5S=C8w;S5S+=A2C;var Q5S=r6C;Q5S+=A2C;var V5S=o3X;V5S+=D2C;V5S+=M3C;V5S+=E8w;var x5S=l8w;x5S+=K8w;var p0S=r6C;p0S+=z3C;p0S+=k2C;p0S+=O2C;var z0S=r8w;z0S+=G2C;var X0S=g8y;X0S+=D2C;X0S+=y5v;var R0S=W8w;R0S+=Z3C;var b0S=g2y;b0S+=p0w;b0S+=F4v;b0S+=y7n.a7C;var e0S=y7n.X7C;e0S+=y7n.g7C;y7n[e0S]();conf[Z4w]=$(u8w)[w7y]($[T5C](I4C,{id:Editor[b0S](conf[c5C]),type:S0w},conf[w7y]));conf[R0S]=new Editor[X0S](conf[Z4w],$[T5C]({format:conf[T8v],i18n:this[o5C][z0S],onChange:function(){var n0S=t2C;n0S+=Y0w;n0S+=k2C;var I0S=y7n.v7C;I0S+=y7n.g7C;y7n[I0S]();_triggerChange(conf[n0S]);}},conf[p0S]));conf[x5S]=function(){var F5S=C6C;F5S+=c5C;F5S+=D2C;var s5S=y7n.v7C;s5S+=y7n.g7C;y7n[s5S]();conf[i8w][F5S]();};if(conf[V5S]===X4C){var A5S=h8w;A5S+=y6X;A5S+=A2C;var U5S=r6C;U5S+=A2C;conf[Z4w][U5S](A5S,function(e){e[b7y]();});}this[Q5S](t3X,conf[S5S]);return conf[Z4w][x7C];},set:function(conf,val){var f8w="picke";var k5S=t2C;k5S+=f8w;k5S+=Z3C;conf[k5S][F2X](val);_triggerChange(conf[Z4w]);},owns:function(conf,node){var L5S=r6C;L5S+=v2X;L5S+=O2C;var N5S=y7n.v7C;N5S+=y7n.g7C;y7n[N5S]();return conf[i8w][L5S](node);},errorMessage:function(conf,msg){var B8w="errorMsg";conf[i8w][B8w](msg);},destroy:function(conf){var J8w="pick";var Z8w="loseFn";var d8w="eydow";var l5S=W2C;l5S+=Q6C;l5S+=j9C;l5S+=M3C;var E5S=t2C;E5S+=J8w;E5S+=x6C;var C5S=o3X;C5S+=d8w;C5S+=A2C;var D5S=t2C;D5S+=D9C;D5S+=T2w;var O5S=N4X;O5S+=Z8w;this[H4X](t3X,conf[O5S]);conf[D5S][H4X](C5S);conf[E5S][l5S]();},minDate:function(conf,min){var K5S=y7n.z7C;K5S+=D9C;y7n[y7n.p7C]();conf[i8w][K5S](min);},maxDate:function(conf,max){var G8w="max";conf[i8w][G8w](max);}});fieldTypes[r5S]=$[T5C](I4C,{},baseFieldType,{create:function(conf){var W5S=y7n.X7C;W5S+=y7n.g7C;y7n[W5S]();var editor=this;var container=_commonUpload(editor,conf,function(val){var M8w='postUpload';var u5S=n3C;u5S+=z3C;u5S+=p1y;u5S+=y7n.a7C;Editor[x0w][u5S][g2X][I7y](editor,conf,val[x7C]);y7n[y7n.p7C]();editor[Z9y](M8w,[conf[q5C],val[x7C]]);});return container;},get:function(conf){y7n[d4C]();return conf[A0w];},set:function(conf,val){var q8w='<span>';var m8w="/span";var o8w=".edito";var v8w="noCl";var w8w="noC";var y8w="rTex";var g8w="addClas";var Y8w="clearText";var j8w="iv.rendere";var T8w="lea";var P8w='No file';var q5S=z1y;q5S+=o8w;q5S+=Z3C;var m5S=W9C;m5S+=A2C;m5S+=z3C;m5S+=O9X;var G5S=y7n.t7C;G5S+=T8w;G5S+=y8w;G5S+=k2C;var f5S=B2C;f5S+=A2C;f5S+=z3C;f5S+=O9X;var h5S=r0w;h5S+=B5C;var i5S=y7n.X7C;i5S+=y7n.g7C;y7n[i5S]();conf[h5S]=val;var container=conf[f5S];if(conf[U0X]){var B5S=y7n.a7C;B5S+=j8w;B5S+=y7n.a7C;var rendered=container[h6y](B5S);if(conf[A0w]){var d5S=r0w;d5S+=y7n.X7C;d5S+=v3C;var J5S=y7n.a7C;J5S+=W9C;J5S+=D1C;J5S+=C1C;rendered[X7X](conf[J5S](conf[d5S]));}else{var Z5S=r0C;Z5S+=m8w;Z5S+=i0C;rendered[d7y]()[z7X](q8w+(conf[c8w]||P8w)+Z5S);}}var button=container[h6y](p4w);if(val&&conf[G5S]){var T5S=w8w;T5S+=M6C;T5S+=D6C;var o5S=Z3C;o5S+=X3v;o5S+=h9y;o5S+=i3X;var M5S=L3X;M5S+=U3X;button[M5S](conf[Y8w]);container[o5S](T5S);}else{var j5S=v8w;j5S+=q9y;j5S+=Z3C;var y5S=g8w;y5S+=O2C;container[y5S](j5S);}conf[Z4w][h6y](m5S)[k7v](q5S,[conf[A0w]]);},enable:function(conf){var P5S=z3C;P5S+=Z3C;P5S+=r6C;P5S+=z3C;var c5S=W9C;c5S+=k8C;c5S+=k2C;y7n[d4C]();conf[Z4w][h6y](c5S)[P5S](Y2w,X4C);conf[G4w]=I4C;},disable:function(conf){var v5S=z3C;v5S+=m4w;var Y5S=y7n.H7C;Y5S+=W9C;Y5S+=A2C;Y5S+=y7n.a7C;var w5S=x4w;w5S+=T2w;conf[w5S][Y5S](M7X)[v5S](Y2w,I4C);conf[G4w]=X4C;},canReturnSubmit:function(conf,node){y7n[d4C]();return X4C;}});fieldTypes[a8w]=$[g5S](I4C,{},baseFieldType,{_showHide:function(conf){var e8w="Hi";var R8w="limit";var t8w="_limitLef";var H8w="div.lim";var I5S=t2C;I5S+=G0C;I5S+=B5C;var z5S=t8w;z5S+=k2C;var X5S=A2C;X5S+=r6C;X5S+=A2C;X5S+=D2C;var R5S=v3C;R5S+=W9C;R5S+=D6v;var b5S=v3C;b5S+=S7y;b5S+=k2C;b5S+=C6C;var e5S=t2C;e5S+=K4v;e5S+=v3C;var H5S=y7n.t7C;H5S+=O2C;H5S+=O2C;var t5S=H8w;t5S+=D8X;t5S+=e8w;t5S+=W2C;var a5S=v3C;a5S+=l7w;a5S+=W9C;a5S+=k2C;if(!conf[a5S]){return;}conf[b8w][h6y](t5S)[H5S](E3X,conf[e5S][b5S]>=conf[R5S]?X5S:l3X);conf[z5S]=conf[R8w]-conf[I5S][Z7X];},create:function(conf){var p8w='button.remove';var L8S=y7n.t7C;L8S+=G7y;var N8S=r6C;N8S+=A2C;var k8S=y7n.z7C;k8S+=n3C;k8S+=v3C;k8S+=t9C;var n5S=y7n.X7C;n5S+=y7n.g7C;y7n[n5S]();var editor=this;var container=_commonUpload(editor,conf,function(val){var I8w="Many";var z8w="upl";var n8w="cat";var X8w="Upload";var S8S=t2C;S8S+=G0C;S8S+=y7n.X7C;S8S+=v3C;var Q8S=A2C;Q8S+=y7n.X7C;Q8S+=y7n.z7C;Q8S+=D2C;var A8S=L6v;A8S+=X8w;var U8S=t2C;U8S+=Z6v;U8S+=k2C;var V8S=r0w;V8S+=B5C;var F8S=O2C;F8S+=D2C;F8S+=k2C;var s8S=z8w;s8S+=r6C;s8S+=r9C;s8S+=I8w;var x8S=n8C;x8S+=n8w;var p5S=r0w;p5S+=y7n.X7C;p5S+=v3C;conf[A0w]=conf[p5S][x8S](val);Editor[x0w][s8S][F8S][I7y](editor,conf,conf[V8S]);editor[U8S](A8S,[conf[Q8S],conf[S8S]]);},I4C);container[H8C](k8S)[N8S](L8S,p8w,function(e){var x7n='idx';var E8S=t2C;E8S+=G0C;E8S+=y7n.X7C;E8S+=v3C;var C8S=y5y;C8S+=B9C;var D8S=t2C;D8S+=G0C;D8S+=B5C;var O8S=y7n.a7C;O8S+=y7n.X7C;O8S+=w2X;e[S2w]();var idx=$(this)[O8S](x7n);conf[D8S][C8S](idx,s7C);Editor[x0w][a8w][g2X][I7y](editor,conf,conf[E8S]);});conf[b8w]=container;return container;},get:function(conf){var l8S=t2C;l8S+=G0C;l8S+=y7n.X7C;l8S+=v3C;return conf[l8S];},set:function(conf,val){var V7n="ypes";var F7n="howHi";var W7n='No files';var k7n="mpty";var s7n="ad.editor";var Q7n="s must have an array as a";var S7n=" value";var r7n="<s";var U7n="Ar";var N7n="l/";var A7n="Upload collectio";var w8S=t2C;w8S+=G0C;w8S+=y7n.X7C;w8S+=v3C;var P8S=w4w;P8S+=s7n;var c8S=W9C;c8S+=A2C;c8S+=W4y;c8S+=k2C;var q8S=y7n.H7C;q8S+=D9C;q8S+=y7n.a7C;var m8S=C6X;m8S+=F7n;m8S+=y7n.a7C;m8S+=D2C;var j8S=n1w;j8S+=V7n;var u8S=t2C;u8S+=Q0C;u8S+=n3C;u8S+=k2C;var W8S=t2C;W8S+=G0C;W8S+=y7n.X7C;W8S+=v3C;var K8S=Q2X;K8S+=U7n;K8S+=Z3C;K8S+=C1C;if(!val){val=[];}if(!$[K8S](val)){var r8S=A7n;r8S+=A2C;r8S+=Q7n;r8S+=S7n;throw r8S;}y7n[y7n.p7C]();conf[W8S]=val;var that=this;var container=conf[u8S];if(conf[U0X]){var h8S=D2C;h8S+=k7n;var i8S=y7n.H7C;i8S+=W9C;i8S+=A2C;i8S+=y7n.a7C;var rendered=container[i8S](n4w)[h8S]();if(val[Z7X]){var f8S=r0C;f8S+=n3C;f8S+=N7n;f8S+=i0C;var list=$(f8S)[G1X](rendered);$[P4C](val,function(i,file){var l7n='">&times;</button>';var E7n=' <button class="';var K7n='</li>';var L7n=" rem";var D7n="ta-idx=\"";var C7n='<li>';var O7n="ove\" ";var M8S=L7n;M8S+=O7n;M8S+=A3y;M8S+=D7n;var G8S=L8X;G8S+=m0v;G8S+=A2C;var Z8S=x3C;Z8S+=e3C;var d8S=u1C;d8S+=k7X;d8S+=D2C;d8S+=O2C;var J8S=y7n.X7C;J8S+=z3C;J8S+=q9X;var B8S=y7n.X7C;B8S+=y7n.g7C;y7n[B8S]();list[J8S](C7n+conf[U0X](file,i)+E7n+that[d8S][Z8S][G8S]+M8S+i+l7n+K7n);});}else{var y8S=i9w;y8S+=y7n.X7C;y8S+=A2C;y8S+=i0C;var T8S=r7n;T8S+=z3C;T8S+=j3w;var o8S=G0X;o8S+=s9X;rendered[o8S](T8S+(conf[c8w]||W7n)+y8S);}}Editor[j8S][a8w][m8S](conf);conf[Z4w][q8S](c8S)[k7v](P8S,[conf[w8S]]);},enable:function(conf){var u7n="_enabl";var g8S=u7n;g8S+=E2C;var v8S=z3C;v8S+=m4w;var Y8S=B2C;Y8S+=k8C;Y8S+=k2C;conf[Y8S][h6y](M7X)[v8S](Y2w,X4C);conf[g8S]=I4C;},disable:function(conf){var H8S=t4w;H8S+=r3C;H8S+=z2C;var t8S=z3C;t8S+=Z3C;t8S+=r6C;t8S+=z3C;var a8S=y7n.X7C;a8S+=y7n.g7C;y7n[a8S]();conf[Z4w][h6y](M7X)[t8S](Y2w,I4C);conf[H8S]=X4C;},canReturnSubmit:function(conf,node){y7n[d4C]();return X4C;}});}());if(DataTable[e8S][b8S]){var X8S=E2C;X8S+=i7n;X8S+=p6C;X8S+=O2C;var R8S=D2C;R8S+=T2C;R8S+=k2C;$[T5C](Editor[x0w],DataTable[R8S][X8S]);}DataTable[z8S][h7n]=Editor[x0w];Editor[I8S]={};Editor[P8C][f7n]=n8S;Editor[p8S]=B7n;return Editor;}));

/*! Bootstrap integration for DataTables' Editor
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs4', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs4')(root, $).$;
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/*
 * Set the default display controller to be our bootstrap control 
 */
DataTable.Editor.defaults.display = "bootstrap";


/*
 * Alter the buttons that Editor adds to TableTools so they are suitable for bootstrap
 */
var i18nDefaults = DataTable.Editor.defaults.i18n;
i18nDefaults.create.title = '<h5 class="modal-title">'+i18nDefaults.create.title+'</h5>';
i18nDefaults.edit.title = '<h5 class="modal-title">'+i18nDefaults.edit.title+'</h5>';
i18nDefaults.remove.title = '<h5 class="modal-title">'+i18nDefaults.remove.title+'</h5>';

var tt = DataTable.TableTools;
if ( tt ) {
	tt.BUTTONS.editor_create.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_edit.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_remove.formButtons[0].className = "btn btn-danger";
}


/*
 * Change the default classes from Editor to be classes for Bootstrap
 */
$.extend( true, $.fn.dataTable.Editor.classes, {
	"header": {
		"wrapper": "DTE_Header modal-header"
	},
	"body": {
		"wrapper": "DTE_Body modal-body"
	},
	"footer": {
		"wrapper": "DTE_Footer modal-footer"
	},
	"form": {
		"tag": "form-horizontal",
		"button": "btn",
		"buttonInternal": "btn btn-outline-secondary"
	},
	"field": {
		"wrapper": "DTE_Field form-group row",
		"label":   "col-lg-4 col-form-label",
		"input":   "col-lg-8",
		"error":   "error is-invalid",
		"msg-labelInfo": "form-text text-secondary small",
		"msg-info":      "form-text text-secondary small",
		"msg-message":   "form-text text-secondary small",
		"msg-error":     "form-text text-danger small",
		"multiValue":    "card multi-value",
		"multiInfo":     "small",
		"multiRestore":  "card multi-restore"
	}
} );

$.extend( true, DataTable.ext.buttons, {
	create: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	edit: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	remove: {
		formButtons: {
			className: 'btn-danger'
		}
	}
} );


/*
 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
 * modal control.
 */

var self;

DataTable.Editor.display.bootstrap = $.extend( true, {}, DataTable.Editor.models.displayController, {
	/*
	 * API methods
	 */
	"init": function ( dte ) {
		// init can be called multiple times (one for each Editor instance), but
		// we only support a single construct here (shared between all Editor
		// instances)
		if ( ! self._dom.content ) {
			self._dom.content = $(
				'<div class="modal fade DTED">'+
					'<div class="modal-dialog">'+
						'<div class="modal-content"/>'+
					'</div>'+
				'</div>'
			);

			self._dom.close = $('<button class="close">&times;</div>');

			self._dom.close.click( function () {
				self._dte.close('icon');
			} );

			$(document).on('click', 'div.modal', function (e) {
				if ( $(e.target).hasClass('modal') && self._shown ) {
					self._dte.background();
				}
			} );
		}

		// Add `form-control` to required elements
		dte.on( 'displayOrder.dtebs', function ( e, display, action, form ) {
			$.each( dte.s.fields, function ( key, field ) {
				$('input:not([type=checkbox]):not([type=radio]), select, textarea', field.node() )
					.addClass( 'form-control' );
			} );
		} );

		return self;
	},

	"open": function ( dte, append, callback ) {
		if ( self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		self._dte = dte;
		self._shown = true;
		self._fullyDisplayed = false;

		var content = self._dom.content.find('div.modal-content');
		content.children().detach();
		content.append( append );

		$('div.modal-header', append).append( self._dom.close );

		$(self._dom.content)
			.one('shown.bs.modal', function () {
				// Can only give elements focus when shown
				if ( self._dte.s.setFocus ) {
					self._dte.s.setFocus.focus();
				}

				self._fullyDisplayed = true;

				if ( callback ) {
					callback();
				}
			})
			.one('hidden', function () {
				self._shown = false;
			})
			.appendTo( 'body' )
			.modal( {
				backdrop: "static",
				keyboard: false
			} );
	},

	"close": function ( dte, callback ) {
		if ( !self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		// Check if actually displayed or not before hiding. BS4 doesn't like `hide`
		// before it has been fully displayed
		if ( ! self._fullyDisplayed ) {
			$(self._dom.content)
				.one('shown.bs.modal', function () {
					self.close( dte, callback );
				} );

			return;
		}

		$(self._dom.content)
			.one( 'hidden.bs.modal', function () {
				$(this).detach();
			} )
			.modal('hide');

		self._dte = dte;
		self._shown = false;
		self._fullyDisplayed = false;

		if ( callback ) {
			callback();
		}
	},

	node: function ( dte ) {
		return self._dom.content[0];
	},


	/*
	 * Private properties
	 */
	 "_shown": false,
	"_dte": null,
	"_dom": {}
} );

self = DataTable.Editor.display.bootstrap;


return DataTable.Editor;
}));


/*! Buttons for DataTables 1.5.6
 * ©2016-2019 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// If not created with a `new` keyword then we return a wrapper function that
	// will take the settings object for a DT. This allows easy use of new instances
	// with the `layout` option - e.g. `topLeft: $.fn.dataTable.Buttons( ... )`.
	if ( !(this instanceof Buttons) ) {
		return function (settings) {
			return new Buttons( settings, dt ).container();
		};
	}

	// If there is no config set it to an empty object
	if ( typeof( config ) === 'undefined' ) {
		config = {};	
	}
	
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( $.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton( buttons, config, false, idx );
		this._draw();

		return this;
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node).addClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node).removeClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node of the buttons container if no button is given
	 * @param  {node} [node] Button node
	 * @return {jQuery} Button element, or container
	 */
	node: function ( node )
	{
		if ( ! node ) {
			return this.dom.container;
		}

		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	processing: function ( node, flag )
	{
		var button = this._nodeToButton( node );

		if ( flag === undefined ) {
			return $(button.node).hasClass( 'processing' );
		}

		$(button.node).toggleClass( 'processing', flag );

		return this;
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode.children( linerTag ).html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function ( e, settings ) {
			if ( settings === dtSettings ) {
				that.destroy();
			}
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );
			container.append( ' ' );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, inCollection, attachPoint )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var buttons = ! $.isArray( button ) ?
			[ button ] :
			button;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			// If the configuration is an array, then expand the buttons at this
			// point
			if ( $.isArray( conf ) ) {
				this._expandButton( attachTo, conf, inCollection, attachPoint );
				continue;
			}

			var built = this._buildButton( conf, inCollection );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			if ( built.conf.buttons ) {
				var collectionDom = this.c.dom.collection;
				built.collection = $('<'+collectionDom.tag+'/>')
					.addClass( collectionDom.className )
					.attr( 'role', 'menu' ) ;
				built.conf._collection = built.collection;

				this._expandButton( built.buttons, built.conf.buttons, true, attachPoint );
			}

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var dt = this.s.dt;
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		if ( inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		}

		if ( inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, Flash buttons require Flash
		if ( config.available && ! config.available( dt, config ) ) {
			return false;
		}

		var action = function ( e, dt, button, config ) {
			config.action.call( dt.button( button ), e, dt, button, config );

			$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
				dt.button( button ), dt, button, config 
			] );
		};

		var tag = config.tag || buttonDom.tag;
		var clickBlurs = config.clickBlurs === undefined ? true : config.clickBlurs
		var button = $('<'+tag+'/>')
			.addClass( buttonDom.className )
			.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
			.attr( 'aria-controls', this.s.dt.table().node().id )
			.on( 'click.dtb', function (e) {
				e.preventDefault();

				if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
					action( e, dt, button, config );
				}
				if( clickBlurs ) {
					button.blur();
				}
			} )
			.on( 'keyup.dtb', function (e) {
				if ( e.keyCode === 13 ) {
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
				}
			} );

		// Make `a` tags act like a link
		if ( tag.toLowerCase() === 'a' ) {
			button.attr( 'href', '#' );
		}

		// Button tags should have `type=button` so they don't have any default behaviour
		if ( tag.toLowerCase() === 'button' ) {
			button.attr( 'type', 'button' );
		}

		if ( linerDom.tag ) {
			var liner = $('<'+linerDom.tag+'/>')
				.html( text( config.text ) )
				.addClass( linerDom.className );

			if ( linerDom.tag.toLowerCase() === 'a' ) {
				liner.attr( 'href', '#' );
			}

			button.append( liner );
		}
		else {
			button.html( text( config.text ) );
		}

		if ( config.enabled === false ) {
			button.addClass( buttonDom.disabled );
		}

		if ( config.className ) {
			button.addClass( config.className );
		}

		if ( config.titleAttr ) {
			button.attr( 'title', text( config.titleAttr ) );
		}

		if ( config.attr ) {
			button.attr( config.attr );
		}

		if ( ! config.namespace ) {
			config.namespace = '.dt-button-'+(_buttonCounter++);
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		// Style integration callback for DOM manipulation
		// Note that this is _not_ documented. It is currently
		// for style integration only
		if( this.c.buttonCreated ) {
			inserter = this.c.buttonCreated( config, inserter );
		}

		return {
			conf:         config,
			node:         button.get(0),
			inserter:     inserter,
			buttons:      [],
			inCollection: inCollection,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function ( character, e )
	{
		// Check if this button press already activated on another instance of Buttons
		if ( e._buttonsHandled ) {
			return;
		}

		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				e._buttonsHandled = true;
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function ( conf )
	{
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! $.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base( dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtons[ base ] ) {
						throw 'Unknown button type: '+base;
					}

					base = _dtButtons[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return $.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtons[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtons[ conf.extend ] );
			if ( $.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade, insertPoint ) {
	if ( fade === undefined ) {
		fade = 400;
	}
	if ( ! insertPoint ) {
		insertPoint = document.body;
	}

	if ( show ) {
		$('<div/>')
			.addClass( className )
			.css( 'display', 'none' )
			.insertAfter( insertPoint )
			.stop()
			.fadeIn( fade );
	}
	else {
		$('div.'+className)
			.stop()
			.fadeOut( fade, function () {
				$(this)
					.removeClass( className )
					.remove();
			} );
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( ! group ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( $.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( $.trim(input), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( $.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				node: inst.s.buttons[ selector ].node
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( $.trim(a[i]), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: 'dt-button-collection'
		},
		button: {
			// Flash buttons will not work with `<button>` in IE - it has to be `<a>`
			tag: 'ActiveXObject' in window ?
				'a' :
				'button',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '1.5.6';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		init: function ( dt, button, config ) {
			button.attr( 'aria-expanded', false );
		},
		action: function ( e, dt, button, config ) {
			var close = function () {
				dt.buttons( '[aria-haspopup="true"][aria-expanded="true"]' ).nodes().each( function() {
					var collection = $(this).siblings('.dt-button-collection');

					if ( collection.length ) {
						collection.stop().fadeOut( config.fade, function () {
							collection.detach();
						} );
					}

					$(this).attr( 'aria-expanded', 'false' );
				});

				$('div.dt-button-background').off( 'click.dtb-collection' );
				Buttons.background( false, config.backgroundClassName, config.fade, insertPoint );

				$('body').off( '.dtb-collection' );
				dt.off( 'buttons-action.b-internal' );
			};

			var wasExpanded = button.attr( 'aria-expanded' ) === 'true';

			close();

			if (!wasExpanded) {
				var host = button;
				var collectionParent = $(button).parents('div.dt-button-collection');
				var hostPosition = host.position();
				var tableContainer = $( dt.table().container() );
				var multiLevel = false;
				var insertPoint = host;

				button.attr( 'aria-expanded', 'true' );

				// Remove any old collection
				if ( collectionParent.length ) {
					multiLevel = $('.dt-button-collection').position();
					insertPoint = collectionParent;
					$('body').trigger( 'click.dtb-collection' );
				}

				if ( insertPoint.parents('body')[0] !== document.body ) {
					insertPoint = document.body.lastChild;
				}

				config._collection.find('.dt-button-collection-title').remove();
				config._collection.prepend('<div class="dt-button-collection-title">'+config.collectionTitle+'</div>');

				config._collection
					.addClass( config.collectionLayout )
					.css( 'display', 'none' )
					.insertAfter( insertPoint )
					.stop()
					.fadeIn( config.fade );

				var position = config._collection.css( 'position' );

				if ( multiLevel && position === 'absolute' ) {
					config._collection.css( {
						top: multiLevel.top,
						left: multiLevel.left
					} );
				}
				else if ( position === 'absolute' ) {
					config._collection.css( {
						top: hostPosition.top + host.outerHeight(),
						left: hostPosition.left
					} );

					// calculate overflow when positioned beneath
					var tableBottom = tableContainer.offset().top + tableContainer.height();
					var listBottom = hostPosition.top + host.outerHeight() + config._collection.outerHeight();
					var bottomOverflow = listBottom - tableBottom;

					// calculate overflow when positioned above
					var listTop = hostPosition.top - config._collection.outerHeight();
					var tableTop = tableContainer.offset().top;
					var topOverflow = tableTop - listTop;

					// if bottom overflow is larger, move to the top because it fits better, or if dropup is requested
					if (bottomOverflow > topOverflow || config.dropup) {
						config._collection.css( 'top', hostPosition.top - config._collection.outerHeight() - 5);
					}

					// Right alignment is enabled on a class, e.g. bootstrap:
					// $.fn.dataTable.Buttons.defaults.dom.collection.className += " dropdown-menu-right"; 
					if ( config._collection.hasClass( config.rightAlignClassName ) ) {
						config._collection.css( 'left', hostPosition.left + host.outerWidth() - config._collection.outerWidth() );
					}

					// Right alignment in table container
					var listRight = hostPosition.left + config._collection.outerWidth();
					var tableRight = tableContainer.offset().left + tableContainer.width();
					if ( listRight > tableRight ) {
						config._collection.css( 'left', hostPosition.left - ( listRight - tableRight ) );
					}

					// Right alignment to window
					var listOffsetRight = host.offset().left + config._collection.outerWidth();
					if ( listOffsetRight > $(window).width() ) {
						config._collection.css( 'left', hostPosition.left - (listOffsetRight-$(window).width()) );
					}
				}
				else {
					// Fix position - centre on screen
					var top = config._collection.height() / 2;
					if ( top > $(window).height() / 2 ) {
						top = $(window).height() / 2;
					}

					config._collection.css( 'marginTop', top*-1 );
				}

				if ( config.background ) {
					Buttons.background( true, config.backgroundClassName, config.fade, insertPoint );
				}

				// Need to break the 'thread' for the collection button being
				// activated by a click - it would also trigger this event
				setTimeout( function () {
					// This is bonkers, but if we don't have a click listener on the
					// background element, iOS Safari will ignore the body click
					// listener below. An empty function here is all that is
					// required to make it work...
					$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

					$('body')
						.on( 'click.dtb-collection', function (e) {
							// andSelf is deprecated in jQ1.8, but we want 1.7 compat
							var back = $.fn.addBack ? 'addBack' : 'andSelf';

							if ( ! $(e.target).parents()[back]().filter( config._collection ).length ) {
								close();
							}
						} )
						.on( 'keyup.dtb-collection', function (e) {
							if ( e.keyCode === 27 ) {
								close();
							}
						} );

					if ( config.autoClose ) {
						dt.on( 'buttons-action.b-internal', function () {
							close();
						} );
					}
				}, 10 );
			}
		},
		background: true,
		collectionLayout: '',
		collectionTitle: '',
		backgroundClassName: 'dt-button-background',
		rightAlignClassName: 'dt-button-right',
		autoClose: false,
		fade: 400,
		attr: {
			'aria-haspopup': true
		}
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
		if ( _dtButtons.copyFlash && _dtButtons.copyFlash.available( dt, conf ) ) {
			return 'copyFlash';
		}
	},
	csv: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
		if ( _dtButtons.csvFlash && _dtButtons.csvFlash.available( dt, conf ) ) {
			return 'csvFlash';
		}
	},
	excel: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
		if ( _dtButtons.excelFlash && _dtButtons.excelFlash.available( dt, conf ) ) {
			return 'excelFlash';
		}
	},
	pdf: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
		if ( _dtButtons.pdfFlash && _dtButtons.pdfFlash.available( dt, conf ) ) {
			return 'pdfFlash';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = $.isArray( lengthMenu[0] ) ? lengthMenu[0] : lengthMenu;
		var lang = $.isArray( lengthMenu[0] ) ? lengthMenu[1] : lengthMenu;
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( conf.text );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button processing state
DataTable.Api.registerPlural( 'buttons().processing()', 'button().processing()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.processing( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.processing( set.node, flag );
	} );
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Get the container elements
DataTable.Api.registerPlural( 'buttons().containers()', 'buttons().container()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var insts = Buttons.instanceSelector( groupSelector, ctx._buttons );

			for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
				jq = jq.add( insts[i].container() );
			}
		}
	} );

	return jq;
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf ) {
	var ctx = this.context;

	// Don't use `this` as it could be empty - select the instances directly
	if ( ctx.length ) {
		var inst = Buttons.instanceSelector( this._groupSelector, ctx[0]._buttons );

		if ( inst.length ) {
			inst[0].add( conf, idx );
		}
	}

	return this.button( this._groupSelector, idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		$('#datatables_buttons_info').fadeOut( function () {
			$(this).remove();
		} );
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	$('<div id="datatables_buttons_info" class="dt-button-info"/>')
		.html( title )
		.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
		.css( 'display', 'none' )
		.appendTo( 'body' )
		.fadeIn();

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register( 'buttons.exportInfo()', function ( conf ) {
	if ( ! conf ) {
		conf = {};
	}

	return {
		filename: _filename( conf ),
		title: _title( conf ),
		messageTop: _message(this, conf.message || conf.messageTop, 'top'),
		messageBottom: _message(this, conf.messageBottom, 'bottom')
	};
} );



/**
 * Get the file name for an exported file.
 *
 * @param {object}	config Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function ( config )
{
	// Backwards compatibility
	var filename = config.filename === '*' && config.title !== '*' && config.title !== undefined && config.title !== null && config.title !== '' ?
		config.title :
		config.filename;

	if ( typeof filename === 'function' ) {
		filename = filename();
	}

	if ( filename === undefined || filename === null ) {
		return null;
	}

	if ( filename.indexOf( '*' ) !== -1 ) {
		filename = $.trim( filename.replace( '*', $('head > title').text() ) );
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	var extension = _stringOrFunction( config.extension );
	if ( ! extension ) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @param {undefined|string|function} option Option
 * @return {null|string} Resolved value
 */
var _stringOrFunction = function ( option )
{
	if ( option === null || option === undefined ) {
		return null;
	}
	else if ( typeof option === 'function' ) {
		return option();
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @param {object} config	Button configuration
 */
var _title = function ( config )
{
	var title = _stringOrFunction( config.title );

	return title === null ?
		null : title.indexOf( '*' ) !== -1 ?
			title.replace( '*', $('head > title').text() || 'Exported data' ) :
			title;
};

var _message = function ( dt, option, position )
{
	var message = _stringOrFunction( option );
	if ( message === null ) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if ( message === '*' ) {
		var side = caption.css( 'caption-side' );
		if ( side !== position ) {
			return null;
		}

		return caption.length ?
			caption.text() :
			'';
	}

	return message;
};







var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return strip( d );
			},
			footer: function ( d ) {
				return strip( d );
			},
			body: function ( d ) {
				return strip( d );
			}
		},
		customizeData: null
	}, inOpts );

	var strip = function ( str ) {
		if ( typeof str !== 'string' ) {
			return str;
		}

		// Always remove script tags
		str = str.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );

		// Always remove comments
		str = str.replace( /<!\-\-.*?\-\->/g, '' );

		if ( config.stripHtml ) {
			str = str.replace( /<[^>]*>/g, '' );
		}

		if ( config.trim ) {
			str = str.replace( /^\s+|\s+$/g, '' );
		}

		if ( config.stripNewlines ) {
			str = str.replace( /\n/g, ' ' );
		}

		if ( config.decodeEntities ) {
			_exportTextarea.innerHTML = str;
			str = _exportTextarea.value;
		}

		return str;
	};


	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		var el = dt.column( idx ).header();
		return config.format.header( el.innerHTML, idx, el );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx, el );
		} ).toArray() :
		null;
	
	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend( {}, config.modifier );
	if ( dt.select && typeof dt.select.info === 'function' && modifier.selected === undefined ) {
		if ( dt.rows( config.rows, $.extend( { selected: true }, modifier ) ).any() ) {
			$.extend( modifier, { selected: true } )
		}
	}

	var rowIndexes = dt.rows( config.rows, modifier ).indexes().toArray();
	var selectedCells = dt.cells( rowIndexes, config.columns );
	var cells = selectedCells
		.render( config.orthogonal )
		.toArray();
	var cellNodes = selectedCells
		.nodes()
		.toArray();

	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [];
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = [ columns ];

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], i, j, cellNodes[ cellCounter ] );
			cellCounter++;
		}

		body[i] = row;
	}

	var data = {
		header: header,
		footer: footer,
		body:   body
	};

	if ( config.customizeData ) {
		config.customizeData( data );
	}

	return data;
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on( 'init.dt plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if ( opts && ! settings._buttons ) {
		new Buttons( settings, opts ).container();
	}
} );

function _init ( settings ) {
	var api = new DataTable.Api( settings );
	var opts = api.init().buttons || DataTable.defaults.buttons;

	return new Buttons( api, opts ).container();
}

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: _init,
	cFeature: "B"
} );

// DataTables 2 layout feature
if ( DataTable.ext.features ) {
	DataTable.ext.features.register( 'buttons', _init );
}


return Buttons;
}));


/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs4', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs4')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;

$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons btn-group'
		},
		button: {
			className: 'btn btn-secondary'
		},
		collection: {
			tag: 'div',
			className: 'dt-button-collection dropdown-menu',
			button: {
				tag: 'a',
				className: 'dt-button dropdown-item',
				active: 'active',
				disabled: 'disabled'
			}
		}
	},
	buttonCreated: function ( config, button ) {
		return config.buttons ?
			$('<div class="btn-group"/>').append(button) :
			button;
	}
} );

DataTable.ext.buttons.collection.className += ' dropdown-toggle';
DataTable.ext.buttons.collection.rightAlignClassName = 'dropdown-menu-right';

return DataTable.Buttons;
}));


/*!
 * HTML5 export buttons for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 *
 * FileSaver.js (1.3.3) - MIT license
 * Copyright © 2016 Eli Grey - http://eligrey.com
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $, jszip, pdfmake) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document, jszip, pdfmake );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, jszip, pdfmake, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;

// Allow the constructor to pass in JSZip and PDFMake from external requires.
// Otherwise, use globally defined variables, if they are available.
function _jsZip () {
	return jszip || window.JSZip;
}
function _pdfMake () {
	return pdfmake || window.pdfMake;
}

DataTable.Buttons.pdfMake = function (_) {
	if ( ! _ ) {
		return _pdfMake();
	}
	pdfmake = m_ake;
}

DataTable.Buttons.jszip = function (_) {
	if ( ! _ ) {
		return _jsZip();
	}
	jszip = _;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * FileSaver.js dependency
 */

/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

var _saveAs = (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));


// Expose file saver on the DataTables API. Can't attach to `DataTables.Buttons`
// since this file can be loaded before Button's core!
DataTable.fileSave = _saveAs;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local (private) functions
 */

/**
 * Get the sheet name for Excel exports.
 *
 * @param {object}	config Button configuration
 */
var _sheetname = function ( config )
{
	var sheetName = 'Sheet1';

	if ( config.sheetName ) {
		sheetName = config.sheetName.replace(/[\[\]\*\/\\\?\:]/g, '');
	}

	return sheetName;
};

/**
 * Get the newline character(s)
 *
 * @param {object}	config Button configuration
 * @return {string}				Newline character
 */
var _newLine = function ( config )
{
	return config.newline ?
		config.newline :
		navigator.userAgent.match(/Windows/) ?
			'\r\n' :
			'\n';
};

/**
 * Combine the data from the `buttons.exportData` method into a string that
 * will be used in the export file.
 *
 * @param	{DataTable.Api} dt		 DataTables API instance
 * @param	{object}				config Button configuration
 * @return {object}							 The data to export
 */
var _exportData = function ( dt, config )
{
	var newLine = _newLine( config );
	var data = dt.buttons.exportData( config.exportOptions );
	var boundary = config.fieldBoundary;
	var separator = config.fieldSeparator;
	var reBoundary = new RegExp( boundary, 'g' );
	var escapeChar = config.escapeChar !== undefined ?
		config.escapeChar :
		'\\';
	var join = function ( a ) {
		var s = '';

		// If there is a field boundary, then we might need to escape it in
		// the source data
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( i > 0 ) {
				s += separator;
			}

			s += boundary ?
				boundary + ('' + a[i]).replace( reBoundary, escapeChar+boundary ) + boundary :
				a[i];
		}

		return s;
	};

	var header = config.header ? join( data.header )+newLine : '';
	var footer = config.footer && data.footer ? newLine+join( data.footer ) : '';
	var body = [];

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		body.push( join( data.body[i] ) );
	}

	return {
		str: header + body.join( newLine ) + footer,
		rows: body.length
	};
};

/**
 * Older versions of Safari (prior to tech preview 18) don't support the
 * download option required.
 *
 * @return {Boolean} `true` if old Safari
 */
var _isDuffSafari = function ()
{
	var safari = navigator.userAgent.indexOf('Safari') !== -1 &&
		navigator.userAgent.indexOf('Chrome') === -1 &&
		navigator.userAgent.indexOf('Opera') === -1;

	if ( ! safari ) {
		return false;
	}

	var version = navigator.userAgent.match( /AppleWebKit\/(\d+\.\d+)/ );
	if ( version && version.length > 1 && version[1]*1 < 603.1 ) {
		return true;
	}

	return false;
};

/**
 * Convert from numeric position to letter for column names in Excel
 * @param  {int} n Column number
 * @return {string} Column letter(s) name
 */
function createCellPos( n ){
	var ordA = 'A'.charCodeAt(0);
	var ordZ = 'Z'.charCodeAt(0);
	var len = ordZ - ordA + 1;
	var s = "";

	while( n >= 0 ) {
		s = String.fromCharCode(n % len + ordA) + s;
		n = Math.floor(n / len) - 1;
	}

	return s;
}

try {
	var _serialiser = new XMLSerializer();
	var _ieExcel;
}
catch (t) {}

/**
 * Recursively add XML files from an object's structure to a ZIP file. This
 * allows the XSLX file to be easily defined with an object's structure matching
 * the files structure.
 *
 * @param {JSZip} zip ZIP package
 * @param {object} obj Object to add (recursive)
 */
function _addToZip( zip, obj ) {
	if ( _ieExcel === undefined ) {
		// Detect if we are dealing with IE's _awful_ serialiser by seeing if it
		// drop attributes
		_ieExcel = _serialiser
			.serializeToString(
				$.parseXML( excelStrings['xl/worksheets/sheet1.xml'] )
			)
			.indexOf( 'xmlns:r' ) === -1;
	}

	$.each( obj, function ( name, val ) {
		if ( $.isPlainObject( val ) ) {
			var newDir = zip.folder( name );
			_addToZip( newDir, val );
		}
		else {
			if ( _ieExcel ) {
				// IE's XML serialiser will drop some name space attributes from
				// from the root node, so we need to save them. Do this by
				// replacing the namespace nodes with a regular attribute that
				// we convert back when serialised. Edge does not have this
				// issue
				var worksheet = val.childNodes[0];
				var i, ien;
				var attrs = [];

				for ( i=worksheet.attributes.length-1 ; i>=0 ; i-- ) {
					var attrName = worksheet.attributes[i].nodeName;
					var attrValue = worksheet.attributes[i].nodeValue;

					if ( attrName.indexOf( ':' ) !== -1 ) {
						attrs.push( { name: attrName, value: attrValue } );

						worksheet.removeAttribute( attrName );
					}
				}

				for ( i=0, ien=attrs.length ; i<ien ; i++ ) {
					var attr = val.createAttribute( attrs[i].name.replace( ':', '_dt_b_namespace_token_' ) );
					attr.value = attrs[i].value;
					worksheet.setAttributeNode( attr );
				}
			}

			var str = _serialiser.serializeToString(val);

			// Fix IE's XML
			if ( _ieExcel ) {
				// IE doesn't include the XML declaration
				if ( str.indexOf( '<?xml' ) === -1 ) {
					str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+str;
				}

				// Return namespace attributes to being as such
				str = str.replace( /_dt_b_namespace_token_/g, ':' );

				// Remove testing name space that IE puts into the space preserve attr
				str = str.replace( /xmlns:NS[\d]+="" NS[\d]+:/g, '' );
			}

			// Safari, IE and Edge will put empty name space attributes onto
			// various elements making them useless. This strips them out
			str = str.replace( /<([^<>]*?) xmlns=""([^<>]*?)>/g, '<$1 $2>' );

			zip.file( name, str );
		}
	} );
}

/**
 * Create an XML node and add any children, attributes, etc without needing to
 * be verbose in the DOM.
 *
 * @param  {object} doc      XML document
 * @param  {string} nodeName Node name
 * @param  {object} opts     Options - can be `attr` (attributes), `children`
 *   (child nodes) and `text` (text content)
 * @return {node}            Created node
 */
function _createNode( doc, nodeName, opts ) {
	var tempNode = doc.createElement( nodeName );

	if ( opts ) {
		if ( opts.attr ) {
			$(tempNode).attr( opts.attr );
		}

		if ( opts.children ) {
			$.each( opts.children, function ( key, value ) {
				tempNode.appendChild( value );
			} );
		}

		if ( opts.text !== null && opts.text !== undefined ) {
			tempNode.appendChild( doc.createTextNode( opts.text ) );
		}
	}

	return tempNode;
}

/**
 * Get the width for an Excel column based on the contents of that column
 * @param  {object} data Data for export
 * @param  {int}    col  Column index
 * @return {int}         Column width
 */
function _excelColWidth( data, col ) {
	var max = data.header[col].length;
	var len, lineSplit, str;

	if ( data.footer && data.footer[col].length > max ) {
		max = data.footer[col].length;
	}

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		var point = data.body[i][col];
		str = point !== null && point !== undefined ?
			point.toString() :
			'';

		// If there is a newline character, workout the width of the column
		// based on the longest line in the string
		if ( str.indexOf('\n') !== -1 ) {
			lineSplit = str.split('\n');
			lineSplit.sort( function (a, b) {
				return b.length - a.length;
			} );

			len = lineSplit[0].length;
		}
		else {
			len = str.length;
		}

		if ( len > max ) {
			max = len;
		}

		// Max width rather than having potentially massive column widths
		if ( max > 40 ) {
			return 54; // 40 * 1.35
		}
	}

	max *= 1.35;

	// And a min width
	return max > 6 ? max : 6;
}

// Excel - Pre-defined strings to build a basic XLSX file
var excelStrings = {
	"_rels/.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'+
		'</Relationships>',

	"xl/_rels/workbook.xml.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'+
			'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+
		'</Relationships>',

	"[Content_Types].xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
			'<Default Extension="xml" ContentType="application/xml" />'+
			'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />'+
			'<Default Extension="jpeg" ContentType="image/jpeg" />'+
			'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />'+
			'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />'+
			'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />'+
		'</Types>',

	"xl/workbook.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
			'<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>'+
			'<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>'+
			'<bookViews>'+
				'<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>'+
			'</bookViews>'+
			'<sheets>'+
				'<sheet name="Sheet1" sheetId="1" r:id="rId1"/>'+
			'</sheets>'+
			'<definedNames/>'+
		'</workbook>',

	"xl/worksheets/sheet1.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<sheetData/>'+
			'<mergeCells count="0"/>'+
		'</worksheet>',

	"xl/styles.xml":
		'<?xml version="1.0" encoding="UTF-8"?>'+
		'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<numFmts count="6">'+
				'<numFmt numFmtId="164" formatCode="#,##0.00_-\ [$$-45C]"/>'+
				'<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>'+
				'<numFmt numFmtId="166" formatCode="[$€-2]\ #,##0.00"/>'+
				'<numFmt numFmtId="167" formatCode="0.0%"/>'+
				'<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>'+
				'<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>'+
			'</numFmts>'+
			'<fonts count="5" x14ac:knownFonts="1">'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<color rgb="FFFFFFFF" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<b />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<i />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<u />'+
				'</font>'+
			'</fonts>'+
			'<fills count="6">'+
				'<fill>'+
					'<patternFill patternType="none" />'+
				'</fill>'+
				'<fill>'+ // Excel appears to use this as a dotted background regardless of values but
					'<patternFill patternType="none" />'+ // to be valid to the schema, use a patternFill
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD9D9D9" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD99795" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6efce" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6cfef" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
			'</fills>'+
			'<borders count="2">'+
				'<border>'+
					'<left />'+
					'<right />'+
					'<top />'+
					'<bottom />'+
					'<diagonal />'+
				'</border>'+
				'<border diagonalUp="false" diagonalDown="false">'+
					'<left style="thin">'+
						'<color auto="1" />'+
					'</left>'+
					'<right style="thin">'+
						'<color auto="1" />'+
					'</right>'+
					'<top style="thin">'+
						'<color auto="1" />'+
					'</top>'+
					'<bottom style="thin">'+
						'<color auto="1" />'+
					'</bottom>'+
					'<diagonal />'+
				'</border>'+
			'</borders>'+
			'<cellStyleXfs count="1">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />'+
			'</cellStyleXfs>'+
			'<cellXfs count="67">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="left"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="center"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="right"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="fill"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment textRotation="90"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment wrapText="1"/>'+
				'</xf>'+
				'<xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="1" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="2" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
			'</cellXfs>'+
			'<cellStyles count="1">'+
				'<cellStyle name="Normal" xfId="0" builtinId="0" />'+
			'</cellStyles>'+
			'<dxfs count="0" />'+
			'<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />'+
		'</styleSheet>'
};
// Note we could use 3 `for` loops for the styles, but when gzipped there is
// virtually no difference in size, since the above can be easily compressed

// Pattern matching for special number formats. Perhaps this should be exposed
// via an API in future?
// Ref: section 3.8.30 - built in formatters in open spreadsheet
//   https://www.ecma-international.org/news/TC45_current_work/Office%20Open%20XML%20Part%204%20-%20Markup%20Language%20Reference.pdf
var _excelSpecials = [
	{ match: /^\-?\d+\.\d%$/,       style: 60, fmt: function (d) { return d/100; } }, // Precent with d.p.
	{ match: /^\-?\d+\.?\d*%$/,     style: 56, fmt: function (d) { return d/100; } }, // Percent
	{ match: /^\-?\$[\d,]+.?\d*$/,  style: 57 }, // Dollars
	{ match: /^\-?£[\d,]+.?\d*$/,   style: 58 }, // Pounds
	{ match: /^\-?€[\d,]+.?\d*$/,   style: 59 }, // Euros
	{ match: /^\-?\d+$/,            style: 65 }, // Numbers without thousand separators
	{ match: /^\-?\d+\.\d{2}$/,     style: 66 }, // Numbers 2 d.p. without thousands separators
	{ match: /^\([\d,]+\)$/,        style: 61, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets
	{ match: /^\([\d,]+\.\d{2}\)$/, style: 62, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets - 2d.p.
	{ match: /^\-?[\d,]+$/,         style: 63 }, // Numbers with thousand separators
	{ match: /^\-?[\d,]+\.\d{2}$/,  style: 64 }  // Numbers with 2 d.p. and thousands separators
];



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */

//
// Copy to clipboard
//
DataTable.ext.buttons.copyHtml5 = {
	className: 'buttons-copy buttons-html5',

	text: function ( dt ) {
		return dt.i18n( 'buttons.copy', 'Copy' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var that = this;
		var exportData = _exportData( dt, config );
		var info = dt.buttons.exportInfo( config );
		var newline = _newLine(config);
		var output = exportData.str;
		var hiddenDiv = $('<div/>')
			.css( {
				height: 1,
				width: 1,
				overflow: 'hidden',
				position: 'fixed',
				top: 0,
				left: 0
			} );

		if ( info.title ) {
			output = info.title + newline + newline + output;
		}

		if ( info.messageTop ) {
			output = info.messageTop + newline + newline + output;
		}

		if ( info.messageBottom ) {
			output = output + newline + newline + info.messageBottom;
		}

		if ( config.customize ) {
			output = config.customize( output, config, dt );
		}

		var textarea = $('<textarea readonly/>')
			.val( output )
			.appendTo( hiddenDiv );

		// For browsers that support the copy execCommand, try to use it
		if ( document.queryCommandSupported('copy') ) {
			hiddenDiv.appendTo( dt.table().container() );
			textarea[0].focus();
			textarea[0].select();

			try {
				var successful = document.execCommand( 'copy' );
				hiddenDiv.remove();

				if (successful) {
					dt.buttons.info(
						dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ),
						dt.i18n( 'buttons.copySuccess', {
							1: 'Copied one row to clipboard',
							_: 'Copied %d rows to clipboard'
						}, exportData.rows ),
						2000
					);

					this.processing( false );
					return;
				}
			}
			catch (t) {}
		}

		// Otherwise we show the text box and instruct the user to use it
		var message = $('<span>'+dt.i18n( 'buttons.copyKeys',
				'Press <i>ctrl</i> or <i>\u2318</i> + <i>C</i> to copy the table data<br>to your system clipboard.<br><br>'+
				'To cancel, click this message or press escape.' )+'</span>'
			)
			.append( hiddenDiv );

		dt.buttons.info( dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ), message, 0 );

		// Select the text so when the user activates their system clipboard
		// it will copy that text
		textarea[0].focus();
		textarea[0].select();

		// Event to hide the message when the user is done
		var container = $(message).closest('.dt-button-info');
		var close = function () {
			container.off( 'click.buttons-copy' );
			$(document).off( '.buttons-copy' );
			dt.buttons.info( false );
		};

		container.on( 'click.buttons-copy', close );
		$(document)
			.on( 'keydown.buttons-copy', function (e) {
				if ( e.keyCode === 27 ) { // esc
					close();
					that.processing( false );
				}
			} )
			.on( 'copy.buttons-copy cut.buttons-copy', function () {
				close();
				that.processing( false );
			} );
	},

	exportOptions: {},

	fieldSeparator: '\t',

	fieldBoundary: '',

	header: true,

	footer: false,

	title: '*',

	messageTop: '*',

	messageBottom: '*'
};

//
// CSV export
//
DataTable.ext.buttons.csvHtml5 = {
	bom: false,

	className: 'buttons-csv buttons-html5',

	available: function () {
		return window.FileReader !== undefined && window.Blob;
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.csv', 'CSV' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		// Set the text
		var output = _exportData( dt, config ).str;
		var info = dt.buttons.exportInfo(config);
		var charset = config.charset;

		if ( config.customize ) {
			output = config.customize( output, config, dt );
		}

		if ( charset !== false ) {
			if ( ! charset ) {
				charset = document.characterSet || document.charset;
			}

			if ( charset ) {
				charset = ';charset='+charset;
			}
		}
		else {
			charset = '';
		}

		if ( config.bom ) {
			output = '\ufeff' + output;
		}

		_saveAs(
			new Blob( [output], {type: 'text/csv'+charset} ),
			info.filename,
			true
		);

		this.processing( false );
	},

	filename: '*',

	extension: '.csv',

	exportOptions: {},

	fieldSeparator: ',',

	fieldBoundary: '"',

	escapeChar: '"',

	charset: null,

	header: true,

	footer: false
};

//
// Excel (xlsx) export
//
DataTable.ext.buttons.excelHtml5 = {
	className: 'buttons-excel buttons-html5',

	available: function () {
		return window.FileReader !== undefined && _jsZip() !== undefined && ! _isDuffSafari() && _serialiser;
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.excel', 'Excel' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var that = this;
		var rowPos = 0;
		var dataStartRow, dataEndRow;
		var getXml = function ( type ) {
			var str = excelStrings[ type ];

			//str = str.replace( /xmlns:/g, 'xmlns_' ).replace( /mc:/g, 'mc_' );

			return $.parseXML( str );
		};
		var rels = getXml('xl/worksheets/sheet1.xml');
		var relsGet = rels.getElementsByTagName( "sheetData" )[0];

		var xlsx = {
			_rels: {
				".rels": getXml('_rels/.rels')
			},
			xl: {
				_rels: {
					"workbook.xml.rels": getXml('xl/_rels/workbook.xml.rels')
				},
				"workbook.xml": getXml('xl/workbook.xml'),
				"styles.xml": getXml('xl/styles.xml'),
				"worksheets": {
					"sheet1.xml": rels
				}

			},
			"[Content_Types].xml": getXml('[Content_Types].xml')
		};

		var data = dt.buttons.exportData( config.exportOptions );
		var currentRow, rowNode;
		var addRow = function ( row ) {
			currentRow = rowPos+1;
			rowNode = _createNode( rels, "row", { attr: {r:currentRow} } );

			for ( var i=0, ien=row.length ; i<ien ; i++ ) {
				// Concat both the Cell Columns as a letter and the Row of the cell.
				var cellId = createCellPos(i) + '' + currentRow;
				var cell = null;

				// For null, undefined of blank cell, continue so it doesn't create the _createNode
				if ( row[i] === null || row[i] === undefined || row[i] === '' ) {
					if ( config.createEmptyCells === true ) {
						row[i] = '';
					}
					else {
						continue;
					}
				}

				var originalContent = row[i];
				row[i] = $.trim( row[i] );

				// Special number formatting options
				for ( var j=0, jen=_excelSpecials.length ; j<jen ; j++ ) {
					var special = _excelSpecials[j];

					// TODO Need to provide the ability for the specials to say
					// if they are returning a string, since at the moment it is
					// assumed to be a number
					if ( row[i].match && ! row[i].match(/^0\d+/) && row[i].match( special.match ) ) {
						var val = row[i].replace(/[^\d\.\-]/g, '');

						if ( special.fmt ) {
							val = special.fmt( val );
						}

						cell = _createNode( rels, 'c', {
							attr: {
								r: cellId,
								s: special.style
							},
							children: [
								_createNode( rels, 'v', { text: val } )
							]
						} );

						break;
					}
				}

				if ( ! cell ) {
					if ( typeof row[i] === 'number' || (
						row[i].match &&
						row[i].match(/^-?\d+(\.\d+)?$/) &&
						! row[i].match(/^0\d+/) )
					) {
						// Detect numbers - don't match numbers with leading zeros
						// or a negative anywhere but the start
						cell = _createNode( rels, 'c', {
							attr: {
								t: 'n',
								r: cellId
							},
							children: [
								_createNode( rels, 'v', { text: row[i] } )
							]
						} );
					}
					else {
						// String output - replace non standard characters for text output
						var text = ! originalContent.replace ?
							originalContent :
							originalContent.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

						cell = _createNode( rels, 'c', {
							attr: {
								t: 'inlineStr',
								r: cellId
							},
							children:{
								row: _createNode( rels, 'is', {
									children: {
										row: _createNode( rels, 't', {
											text: text,
											attr: {
												'xml:space': 'preserve'
											}
										} )
									}
								} )
							}
						} );
					}
				}

				rowNode.appendChild( cell );
			}

			relsGet.appendChild(rowNode);
			rowPos++;
		};

		if ( config.customizeData ) {
			config.customizeData( data );
		}

		var mergeCells = function ( row, colspan ) {
			var mergeCells = $('mergeCells', rels);

			mergeCells[0].appendChild( _createNode( rels, 'mergeCell', {
				attr: {
					ref: 'A'+row+':'+createCellPos(colspan)+row
				}
			} ) );
			mergeCells.attr( 'count', parseFloat(mergeCells.attr( 'count' ))+1 );
			$('row:eq('+(row-1)+') c', rels).attr( 's', '51' ); // centre
		};

		// Title and top messages
		var exportInfo = dt.buttons.exportInfo( config );
		if ( exportInfo.title ) {
			addRow( [exportInfo.title], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		if ( exportInfo.messageTop ) {
			addRow( [exportInfo.messageTop], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}


		// Table itself
		if ( config.header ) {
			addRow( data.header, rowPos );
			$('row:last c', rels).attr( 's', '2' ); // bold
		}
	
		dataStartRow = rowPos;

		for ( var n=0, ie=data.body.length ; n<ie ; n++ ) {
			addRow( data.body[n], rowPos );
		}
	
		dataEndRow = rowPos;

		if ( config.footer && data.footer ) {
			addRow( data.footer, rowPos);
			$('row:last c', rels).attr( 's', '2' ); // bold
		}

		// Below the table
		if ( exportInfo.messageBottom ) {
			addRow( [exportInfo.messageBottom], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		// Set column widths
		var cols = _createNode( rels, 'cols' );
		$('worksheet', rels).prepend( cols );

		for ( var i=0, ien=data.header.length ; i<ien ; i++ ) {
			cols.appendChild( _createNode( rels, 'col', {
				attr: {
					min: i+1,
					max: i+1,
					width: _excelColWidth( data, i ),
					customWidth: 1
				}
			} ) );
		}

		// Workbook modifications
		var workbook = xlsx.xl['workbook.xml'];

		$( 'sheets sheet', workbook ).attr( 'name', _sheetname( config ) );

		// Auto filter for columns
		if ( config.autoFilter ) {
			$('mergeCells', rels).before( _createNode( rels, 'autoFilter', {
				attr: {
					ref: 'A'+dataStartRow+':'+createCellPos(data.header.length-1)+dataEndRow
				}
			} ) );

			$('definedNames', workbook).append( _createNode( workbook, 'definedName', {
				attr: {
					name: '_xlnm._FilterDatabase',
					localSheetId: '0',
					hidden: 1
				},
				text: _sheetname(config)+'!$A$'+dataStartRow+':'+createCellPos(data.header.length-1)+dataEndRow
			} ) );
		}

		// Let the developer customise the document if they want to
		if ( config.customize ) {
			config.customize( xlsx, config, dt );
		}

		// Excel doesn't like an empty mergeCells tag
		if ( $('mergeCells', rels).children().length === 0 ) {
			$('mergeCells', rels).remove();
		}

		var jszip = _jsZip();
		var zip = new jszip();
		var zipConfig = {
			type: 'blob',
			mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		};

		_addToZip( zip, xlsx );

		if ( zip.generateAsync ) {
			// JSZip 3+
			zip
				.generateAsync( zipConfig )
				.then( function ( blob ) {
					_saveAs( blob, exportInfo.filename );
					that.processing( false );
				} );
		}
		else {
			// JSZip 2.5
			_saveAs(
				zip.generate( zipConfig ),
				exportInfo.filename
			);
			this.processing( false );
		}
	},

	filename: '*',

	extension: '.xlsx',

	exportOptions: {},

	header: true,

	footer: false,

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	createEmptyCells: false,

	autoFilter: false,

	sheetName: ''
};

//
// PDF export - using pdfMake - http://pdfmake.org
//
DataTable.ext.buttons.pdfHtml5 = {
	className: 'buttons-pdf buttons-html5',

	available: function () {
		return window.FileReader !== undefined && _pdfMake();
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.pdf', 'PDF' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var that = this;
		var data = dt.buttons.exportData( config.exportOptions );
		var info = dt.buttons.exportInfo( config );
		var rows = [];

		if ( config.header ) {
			rows.push( $.map( data.header, function ( d ) {
				return {
					text: typeof d === 'string' ? d : d+'',
					style: 'tableHeader'
				};
			} ) );
		}

		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			rows.push( $.map( data.body[i], function ( d ) {
				if ( d === null || d === undefined ) {
					d = '';
				}
				return {
					text: typeof d === 'string' ? d : d+'',
					style: i % 2 ? 'tableBodyEven' : 'tableBodyOdd'
				};
			} ) );
		}

		if ( config.footer && data.footer) {
			rows.push( $.map( data.footer, function ( d ) {
				return {
					text: typeof d === 'string' ? d : d+'',
					style: 'tableFooter'
				};
			} ) );
		}

		var doc = {
			pageSize: config.pageSize,
			pageOrientation: config.orientation,
			content: [
				{
					table: {
						headerRows: 1,
						body: rows
					},
					layout: 'noBorders'
				}
			],
			styles: {
				tableHeader: {
					bold: true,
					fontSize: 11,
					color: 'white',
					fillColor: '#2d4154',
					alignment: 'center'
				},
				tableBodyEven: {},
				tableBodyOdd: {
					fillColor: '#f3f3f3'
				},
				tableFooter: {
					bold: true,
					fontSize: 11,
					color: 'white',
					fillColor: '#2d4154'
				},
				title: {
					alignment: 'center',
					fontSize: 15
				},
				message: {}
			},
			defaultStyle: {
				fontSize: 10
			}
		};

		if ( info.messageTop ) {
			doc.content.unshift( {
				text: info.messageTop,
				style: 'message',
				margin: [ 0, 0, 0, 12 ]
			} );
		}

		if ( info.messageBottom ) {
			doc.content.push( {
				text: info.messageBottom,
				style: 'message',
				margin: [ 0, 0, 0, 12 ]
			} );
		}

		if ( info.title ) {
			doc.content.unshift( {
				text: info.title,
				style: 'title',
				margin: [ 0, 0, 0, 12 ]
			} );
		}

		if ( config.customize ) {
			config.customize( doc, config, dt );
		}

		var pdf = _pdfMake().createPdf( doc );

		if ( config.download === 'open' && ! _isDuffSafari() ) {
			pdf.open();
		}
		else {
			pdf.download( info.filename );
		}

		this.processing( false );
	},

	title: '*',

	filename: '*',

	extension: '.pdf',

	exportOptions: {},

	orientation: 'portrait',

	pageSize: 'A4',

	header: true,

	footer: false,

	messageTop: '*',

	messageBottom: '*',

	customize: null,

	download: 'download'
};


return DataTable.Buttons;
}));


/*!
 * Print button for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var _link = document.createElement( 'a' );

/**
 * Clone link and style tags, taking into account the need to change the source
 * path.
 *
 * @param  {node}     el Element to convert
 */
var _styleToAbs = function( el ) {
	var url;
	var clone = $(el).clone()[0];
	var linkHost;

	if ( clone.nodeName.toLowerCase() === 'link' ) {
		clone.href = _relToAbs( clone.href );
	}

	return clone.outerHTML;
};

/**
 * Convert a URL from a relative to an absolute address so it will work
 * correctly in the popup window which has no base URL.
 *
 * @param  {string} href URL
 */
var _relToAbs = function( href ) {
	// Assign to a link on the original page so the browser will do all the
	// hard work of figuring out where the file actually is
	_link.href = href;
	var linkHost = _link.host;

	// IE doesn't have a trailing slash on the host
	// Chrome has it on the pathname
	if ( linkHost.indexOf('/') === -1 && _link.pathname.indexOf('/') !== 0) {
		linkHost += '/';
	}

	return _link.protocol+"//"+linkHost+_link.pathname+_link.search;
};


DataTable.ext.buttons.print = {
	className: 'buttons-print',

	text: function ( dt ) {
		return dt.i18n( 'buttons.print', 'Print' );
	},

	action: function ( e, dt, button, config ) {
		var data = dt.buttons.exportData(
			$.extend( {decodeEntities: false}, config.exportOptions ) // XSS protection
		);
		var exportInfo = dt.buttons.exportInfo( config );
		var columnClasses = dt
			.columns( config.exportOptions.columns )
			.flatten()
			.map( function (idx) {
				return dt.settings()[0].aoColumns[dt.column(idx).index()].sClass;
			} )
			.toArray();

		var addRow = function ( d, tag ) {
			var str = '<tr>';

			for ( var i=0, ien=d.length ; i<ien ; i++ ) {
				// null and undefined aren't useful in the print output
				var dataOut = d[i] === null || d[i] === undefined ?
					'' :
					d[i];
				var classAttr = columnClasses[i] ?
					'class="'+columnClasses[i]+'"' :
					'';

				str += '<'+tag+' '+classAttr+'>'+dataOut+'</'+tag+'>';
			}

			return str + '</tr>';
		};

		// Construct a table for printing
		var html = '<table class="'+dt.table().node().className+'">';

		if ( config.header ) {
			html += '<thead>'+ addRow( data.header, 'th' ) +'</thead>';
		}

		html += '<tbody>';
		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			html += addRow( data.body[i], 'td' );
		}
		html += '</tbody>';

		if ( config.footer && data.footer ) {
			html += '<tfoot>'+ addRow( data.footer, 'th' ) +'</tfoot>';
		}
		html += '</table>';

		// Open a new window for the printable table
		var win = window.open( '', '' );
		win.document.close();

		// Inject the title and also a copy of the style and link tags from this
		// document so the table can retain its base styling. Note that we have
		// to use string manipulation as IE won't allow elements to be created
		// in the host document and then appended to the new window.
		var head = '<title>'+exportInfo.title+'</title>';
		$('style, link').each( function () {
			head += _styleToAbs( this );
		} );

		try {
			win.document.head.innerHTML = head; // Work around for Edge
		}
		catch (e) {
			$(win.document.head).html( head ); // Old IE
		}

		// Inject the table and other surrounding information
		win.document.body.innerHTML =
			'<h1>'+exportInfo.title+'</h1>'+
			'<div>'+(exportInfo.messageTop || '')+'</div>'+
			html+
			'<div>'+(exportInfo.messageBottom || '')+'</div>';

		$(win.document.body).addClass('dt-print-view');

		$('img', win.document.body).each( function ( i, img ) {
			img.setAttribute( 'src', _relToAbs( img.getAttribute('src') ) );
		} );

		if ( config.customize ) {
			config.customize( win, config, dt );
		}

		// Allow stylesheets time to load
		var autoPrint = function () {
			if ( config.autoPrint ) {
				win.print(); // blocking - so close will not
				win.close(); // execute until this is done
			}
		};

		if ( navigator.userAgent.match(/Trident\/\d.\d/) ) { // IE needs to call this without a setTimeout
			autoPrint();
		}
		else {
			win.setTimeout( autoPrint, 1000 );
		}
	},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	exportOptions: {},

	header: true,

	footer: false,

	autoPrint: true,

	customize: null
};


return DataTable.Buttons;
}));


/*! Responsive 2.2.2
 * 2014-2018 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Responsive
 * @description Responsive tables plug-in for DataTables
 * @version     2.2.2
 * @file        dataTables.responsive.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2014-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * Responsive is a plug-in for the DataTables library that makes use of
 * DataTables' ability to change the visibility of columns, changing the
 * visibility of columns so the displayed columns fit into the table container.
 * The end result is that complex tables will be dynamically adjusted to fit
 * into the viewport, be it on a desktop, tablet or mobile browser.
 *
 * Responsive for DataTables has two modes of operation, which can used
 * individually or combined:
 *
 * * Class name based control - columns assigned class names that match the
 *   breakpoint logic can be shown / hidden as required for each breakpoint.
 * * Automatic control - columns are automatically hidden when there is no
 *   room left to display them. Columns removed from the right.
 *
 * In additional to column visibility control, Responsive also has built into
 * options to use DataTables' child row display to show / hide the information
 * from the table that has been hidden. There are also two modes of operation
 * for this child row display:
 *
 * * Inline - when the control element that the user can use to show / hide
 *   child rows is displayed inside the first column of the table.
 * * Column - where a whole column is dedicated to be the show / hide control.
 *
 * Initialisation of Responsive is performed by:
 *
 * * Adding the class `responsive` or `dt-responsive` to the table. In this case
 *   Responsive will automatically be initialised with the default configuration
 *   options when the DataTable is created.
 * * Using the `responsive` option in the DataTables configuration options. This
 *   can also be used to specify the configuration options, or simply set to
 *   `true` to use the defaults.
 *
 *  @class
 *  @param {object} settings DataTables settings object for the host table
 *  @param {object} [opts] Configuration options
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.3+
 *
 *  @example
 *      $('#example').DataTable( {
 *        responsive: true
 *      } );
 *    } );
 */
var Responsive = function ( settings, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.10' ) ) {
		throw 'DataTables Responsive requires DataTables 1.10.10 or newer';
	}

	this.s = {
		dt: new DataTable.Api( settings ),
		columns: [],
		current: []
	};

	// Check if responsive has already been initialised on this table
	if ( this.s.dt.settings()[0].responsive ) {
		return;
	}

	// details is an object, but for simplicity the user can give it as a string
	// or a boolean
	if ( opts && typeof opts.details === 'string' ) {
		opts.details = { type: opts.details };
	}
	else if ( opts && opts.details === false ) {
		opts.details = { type: false };
	}
	else if ( opts && opts.details === true ) {
		opts.details = { type: 'inline' };
	}

	this.c = $.extend( true, {}, Responsive.defaults, DataTable.defaults.responsive, opts );
	settings.responsive = this;
	this._constructor();
};

$.extend( Responsive.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the Responsive instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtPrivateSettings = dt.settings()[0];
		var oldWindowWidth = $(window).width();

		dt.settings()[0]._responsive = this;

		// Use DataTables' throttle function to avoid processor thrashing on
		// resize
		$(window).on( 'resize.dtr orientationchange.dtr', DataTable.util.throttle( function () {
			// iOS has a bug whereby resize can fire when only scrolling
			// See: http://stackoverflow.com/questions/8898412
			var width = $(window).width();

			if ( width !== oldWindowWidth ) {
				that._resize();
				oldWindowWidth = width;
			}
		} ) );

		// DataTables doesn't currently trigger an event when a row is added, so
		// we need to hook into its private API to enforce the hidden rows when
		// new data is added
		dtPrivateSettings.oApi._fnCallbackReg( dtPrivateSettings, 'aoRowCreatedCallback', function (tr, data, idx) {
			if ( $.inArray( false, that.s.current ) !== -1 ) {
				$('>td, >th', tr).each( function ( i ) {
					var idx = dt.column.index( 'toData', i );

					if ( that.s.current[idx] === false ) {
						$(this).css('display', 'none');
					}
				} );
			}
		} );

		// Destroy event handler
		dt.on( 'destroy.dtr', function () {
			dt.off( '.dtr' );
			$( dt.table().body() ).off( '.dtr' );
			$(window).off( 'resize.dtr orientationchange.dtr' );

			// Restore the columns that we've hidden
			$.each( that.s.current, function ( i, val ) {
				if ( val === false ) {
					that._setColumnVis( i, true );
				}
			} );
		} );

		// Reorder the breakpoints array here in case they have been added out
		// of order
		this.c.breakpoints.sort( function (a, b) {
			return a.width < b.width ? 1 :
				a.width > b.width ? -1 : 0;
		} );

		this._classLogic();
		this._resizeAuto();

		// Details handler
		var details = this.c.details;

		if ( details.type !== false ) {
			that._detailsInit();

			// DataTables will trigger this event on every column it shows and
			// hides individually
			dt.on( 'column-visibility.dtr', function () {
				// Use a small debounce to allow multiple columns to be set together
				if ( that._timer ) {
					clearTimeout( that._timer );
				}

				that._timer = setTimeout( function () {
					that._timer = null;

					that._classLogic();
					that._resizeAuto();
					that._resize();

					that._redrawChildren();
				}, 100 );
			} );

			// Redraw the details box on each draw which will happen if the data
			// has changed. This is used until DataTables implements a native
			// `updated` event for rows
			dt.on( 'draw.dtr', function () {
				that._redrawChildren();
			} );

			$(dt.table().node()).addClass( 'dtr-'+details.type );
		}

		dt.on( 'column-reorder.dtr', function (e, settings, details) {
			that._classLogic();
			that._resizeAuto();
			that._resize();
		} );

		// Change in column sizes means we need to calc
		dt.on( 'column-sizing.dtr', function () {
			that._resizeAuto();
			that._resize();
		});

		// On Ajax reload we want to reopen any child rows which are displayed
		// by responsive
		dt.on( 'preXhr.dtr', function () {
			var rowIds = [];
			dt.rows().every( function () {
				if ( this.child.isShown() ) {
					rowIds.push( this.id(true) );
				}
			} );

			dt.one( 'draw.dtr', function () {
				that._resizeAuto();
				that._resize();

				dt.rows( rowIds ).every( function () {
					that._detailsDisplay( this, false );
				} );
			} );
		});

		dt.on( 'init.dtr', function (e, settings, details) {
			that._resizeAuto();
			that._resize();

			// If columns were hidden, then DataTables needs to adjust the
			// column sizing
			if ( $.inArray( false, that.s.current ) ) {
				dt.columns.adjust();
			}
		} );

		// First pass - draw the table for the current viewport size
		this._resize();
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Calculate the visibility for the columns in a table for a given
	 * breakpoint. The result is pre-determined based on the class logic if
	 * class names are used to control all columns, but the width of the table
	 * is also used if there are columns which are to be automatically shown
	 * and hidden.
	 *
	 * @param  {string} breakpoint Breakpoint name to use for the calculation
	 * @return {array} Array of boolean values initiating the visibility of each
	 *   column.
	 *  @private
	 */
	_columnsVisiblity: function ( breakpoint )
	{
		var dt = this.s.dt;
		var columns = this.s.columns;
		var i, ien;

		// Create an array that defines the column ordering based first on the
		// column's priority, and secondly the column index. This allows the
		// columns to be removed from the right if the priority matches
		var order = columns
			.map( function ( col, idx ) {
				return {
					columnIdx: idx,
					priority: col.priority
				};
			} )
			.sort( function ( a, b ) {
				if ( a.priority !== b.priority ) {
					return a.priority - b.priority;
				}
				return a.columnIdx - b.columnIdx;
			} );

		// Class logic - determine which columns are in this breakpoint based
		// on the classes. If no class control (i.e. `auto`) then `-` is used
		// to indicate this to the rest of the function
		var display = $.map( columns, function ( col, i ) {
			if ( dt.column(i).visible() === false ) {
				return 'not-visible';
			}
			return col.auto && col.minWidth === null ?
				false :
				col.auto === true ?
					'-' :
					$.inArray( breakpoint, col.includeIn ) !== -1;
		} );

		// Auto column control - first pass: how much width is taken by the
		// ones that must be included from the non-auto columns
		var requiredWidth = 0;
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( display[i] === true ) {
				requiredWidth += columns[i].minWidth;
			}
		}

		// Second pass, use up any remaining width for other columns. For
		// scrolling tables we need to subtract the width of the scrollbar. It
		// may not be requires which makes this sub-optimal, but it would
		// require another full redraw to make complete use of those extra few
		// pixels
		var scrolling = dt.settings()[0].oScroll;
		var bar = scrolling.sY || scrolling.sX ? scrolling.iBarWidth : 0;
		var widthAvailable = dt.table().container().offsetWidth - bar;
		var usedWidth = widthAvailable - requiredWidth;

		// Control column needs to always be included. This makes it sub-
		// optimal in terms of using the available with, but to stop layout
		// thrashing or overflow. Also we need to account for the control column
		// width first so we know how much width is available for the other
		// columns, since the control column might not be the first one shown
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				usedWidth -= columns[i].minWidth;
			}
		}

		// Allow columns to be shown (counting by priority and then right to
		// left) until we run out of room
		var empty = false;
		for ( i=0, ien=order.length ; i<ien ; i++ ) {
			var colIdx = order[i].columnIdx;

			if ( display[colIdx] === '-' && ! columns[colIdx].control && columns[colIdx].minWidth ) {
				// Once we've found a column that won't fit we don't let any
				// others display either, or columns might disappear in the
				// middle of the table
				if ( empty || usedWidth - columns[colIdx].minWidth < 0 ) {
					empty = true;
					display[colIdx] = false;
				}
				else {
					display[colIdx] = true;
				}

				usedWidth -= columns[colIdx].minWidth;
			}
		}

		// Determine if the 'control' column should be shown (if there is one).
		// This is the case when there is a hidden column (that is not the
		// control column). The two loops look inefficient here, but they are
		// trivial and will fly through. We need to know the outcome from the
		// first , before the action in the second can be taken
		var showControl = false;

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( ! columns[i].control && ! columns[i].never && display[i] === false ) {
				showControl = true;
				break;
			}
		}

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				display[i] = showControl;
			}

			// Replace not visible string with false from the control column detection above
			if ( display[i] === 'not-visible' ) {
				display[i] = false;
			}
		}

		// Finally we need to make sure that there is at least one column that
		// is visible
		if ( $.inArray( true, display ) === -1 ) {
			display[0] = true;
		}

		return display;
	},


	/**
	 * Create the internal `columns` array with information about the columns
	 * for the table. This includes determining which breakpoints the column
	 * will appear in, based upon class names in the column, which makes up the
	 * vast majority of this method.
	 *
	 * @private
	 */
	_classLogic: function ()
	{
		var that = this;
		var calc = {};
		var breakpoints = this.c.breakpoints;
		var dt = this.s.dt;
		var columns = dt.columns().eq(0).map( function (i) {
			var column = this.column(i);
			var className = column.header().className;
			var priority = dt.settings()[0].aoColumns[i].responsivePriority;

			if ( priority === undefined ) {
				var dataPriority = $(column.header()).data('priority');

				priority = dataPriority !== undefined ?
					dataPriority * 1 :
					10000;
			}

			return {
				className: className,
				includeIn: [],
				auto:      false,
				control:   false,
				never:     className.match(/\bnever\b/) ? true : false,
				priority:  priority
			};
		} );

		// Simply add a breakpoint to `includeIn` array, ensuring that there are
		// no duplicates
		var add = function ( colIdx, name ) {
			var includeIn = columns[ colIdx ].includeIn;

			if ( $.inArray( name, includeIn ) === -1 ) {
				includeIn.push( name );
			}
		};

		var column = function ( colIdx, name, operator, matched ) {
			var size, i, ien;

			if ( ! operator ) {
				columns[ colIdx ].includeIn.push( name );
			}
			else if ( operator === 'max-' ) {
				// Add this breakpoint and all smaller
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width <= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'min-' ) {
				// Add this breakpoint and all larger
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width >= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'not-' ) {
				// Add all but this breakpoint
				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].name.indexOf( matched ) === -1 ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
		};

		// Loop over each column and determine if it has a responsive control
		// class
		columns.each( function ( col, i ) {
			var classNames = col.className.split(' ');
			var hasClass = false;

			// Split the class name up so multiple rules can be applied if needed
			for ( var k=0, ken=classNames.length ; k<ken ; k++ ) {
				var className = $.trim( classNames[k] );

				if ( className === 'all' ) {
					// Include in all
					hasClass = true;
					col.includeIn = $.map( breakpoints, function (a) {
						return a.name;
					} );
					return;
				}
				else if ( className === 'none' || col.never ) {
					// Include in none (default) and no auto
					hasClass = true;
					return;
				}
				else if ( className === 'control' ) {
					// Special column that is only visible, when one of the other
					// columns is hidden. This is used for the details control
					hasClass = true;
					col.control = true;
					return;
				}

				$.each( breakpoints, function ( j, breakpoint ) {
					// Does this column have a class that matches this breakpoint?
					var brokenPoint = breakpoint.name.split('-');
					var re = new RegExp( '(min\\-|max\\-|not\\-)?('+brokenPoint[0]+')(\\-[_a-zA-Z0-9])?' );
					var match = className.match( re );

					if ( match ) {
						hasClass = true;

						if ( match[2] === brokenPoint[0] && match[3] === '-'+brokenPoint[1] ) {
							// Class name matches breakpoint name fully
							column( i, breakpoint.name, match[1], match[2]+match[3] );
						}
						else if ( match[2] === brokenPoint[0] && ! match[3] ) {
							// Class name matched primary breakpoint name with no qualifier
							column( i, breakpoint.name, match[1], match[2] );
						}
					}
				} );
			}

			// If there was no control class, then automatic sizing is used
			if ( ! hasClass ) {
				col.auto = true;
			}
		} );

		this.s.columns = columns;
	},


	/**
	 * Show the details for the child row
	 *
	 * @param  {DataTables.Api} row    API instance for the row
	 * @param  {boolean}        update Update flag
	 * @private
	 */
	_detailsDisplay: function ( row, update )
	{
		var that = this;
		var dt = this.s.dt;
		var details = this.c.details;

		if ( details && details.type !== false ) {
			var res = details.display( row, update, function () {
				return details.renderer(
					dt, row[0], that._detailsObj(row[0])
				);
			} );

			if ( res === true || res === false ) {
				$(dt.table().node()).triggerHandler( 'responsive-display.dt', [dt, row, res, update] );
			}
		}
	},


	/**
	 * Initialisation for the details handler
	 *
	 * @private
	 */
	_detailsInit: function ()
	{
		var that    = this;
		var dt      = this.s.dt;
		var details = this.c.details;

		// The inline type always uses the first child as the target
		if ( details.type === 'inline' ) {
			details.target = 'td:first-child, th:first-child';
		}

		// Keyboard accessibility
		dt.on( 'draw.dtr', function () {
			that._tabIndexes();
		} );
		that._tabIndexes(); // Initial draw has already happened

		$( dt.table().body() ).on( 'keyup.dtr', 'td, th', function (e) {
			if ( e.keyCode === 13 && $(this).data('dtr-keyboard') ) {
				$(this).click();
			}
		} );

		// type.target can be a string jQuery selector or a column index
		var target   = details.target;
		var selector = typeof target === 'string' ? target : 'td, th';

		// Click handler to show / hide the details rows when they are available
		$( dt.table().body() )
			.on( 'click.dtr mousedown.dtr mouseup.dtr', selector, function (e) {
				// If the table is not collapsed (i.e. there is no hidden columns)
				// then take no action
				if ( ! $(dt.table().node()).hasClass('collapsed' ) ) {
					return;
				}

				// Check that the row is actually a DataTable's controlled node
				if ( $.inArray( $(this).closest('tr').get(0), dt.rows().nodes().toArray() ) === -1 ) {
					return;
				}

				// For column index, we determine if we should act or not in the
				// handler - otherwise it is already okay
				if ( typeof target === 'number' ) {
					var targetIdx = target < 0 ?
						dt.columns().eq(0).length + target :
						target;

					if ( dt.cell( this ).index().column !== targetIdx ) {
						return;
					}
				}

				// $().closest() includes itself in its check
				var row = dt.row( $(this).closest('tr') );

				// Check event type to do an action
				if ( e.type === 'click' ) {
					// The renderer is given as a function so the caller can execute it
					// only when they need (i.e. if hiding there is no point is running
					// the renderer)
					that._detailsDisplay( row, false );
				}
				else if ( e.type === 'mousedown' ) {
					// For mouse users, prevent the focus ring from showing
					$(this).css('outline', 'none');
				}
				else if ( e.type === 'mouseup' ) {
					// And then re-allow at the end of the click
					$(this).blur().css('outline', '');
				}
			} );
	},


	/**
	 * Get the details to pass to a renderer for a row
	 * @param  {int} rowIdx Row index
	 * @private
	 */
	_detailsObj: function ( rowIdx )
	{
		var that = this;
		var dt = this.s.dt;

		return $.map( this.s.columns, function( col, i ) {
			// Never and control columns should not be passed to the renderer
			if ( col.never || col.control ) {
				return;
			}

			return {
				title:       dt.settings()[0].aoColumns[ i ].sTitle,
				data:        dt.cell( rowIdx, i ).render( that.c.orthogonal ),
				hidden:      dt.column( i ).visible() && !that.s.current[ i ],
				columnIndex: i,
				rowIndex:    rowIdx
			};
		} );
	},


	/**
	 * Find a breakpoint object from a name
	 *
	 * @param  {string} name Breakpoint name to find
	 * @return {object}      Breakpoint description object
	 * @private
	 */
	_find: function ( name )
	{
		var breakpoints = this.c.breakpoints;

		for ( var i=0, ien=breakpoints.length ; i<ien ; i++ ) {
			if ( breakpoints[i].name === name ) {
				return breakpoints[i];
			}
		}
	},


	/**
	 * Re-create the contents of the child rows as the display has changed in
	 * some way.
	 *
	 * @private
	 */
	_redrawChildren: function ()
	{
		var that = this;
		var dt = this.s.dt;

		dt.rows( {page: 'current'} ).iterator( 'row', function ( settings, idx ) {
			var row = dt.row( idx );

			that._detailsDisplay( dt.row( idx ), true );
		} );
	},


	/**
	 * Alter the table display for a resized viewport. This involves first
	 * determining what breakpoint the window currently is in, getting the
	 * column visibilities to apply and then setting them.
	 *
	 * @private
	 */
	_resize: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var width = $(window).width();
		var breakpoints = this.c.breakpoints;
		var breakpoint = breakpoints[0].name;
		var columns = this.s.columns;
		var i, ien;
		var oldVis = this.s.current.slice();

		// Determine what breakpoint we are currently at
		for ( i=breakpoints.length-1 ; i>=0 ; i-- ) {
			if ( width <= breakpoints[i].width ) {
				breakpoint = breakpoints[i].name;
				break;
			}
		}
		
		// Show the columns for that break point
		var columnsVis = this._columnsVisiblity( breakpoint );
		this.s.current = columnsVis;

		// Set the class before the column visibility is changed so event
		// listeners know what the state is. Need to determine if there are
		// any columns that are not visible but can be shown
		var collapsedClass = false;
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columnsVis[i] === false && ! columns[i].never && ! columns[i].control && ! dt.column(i).visible() === false ) {
				collapsedClass = true;
				break;
			}
		}

		$( dt.table().node() ).toggleClass( 'collapsed', collapsedClass );

		var changed = false;
		var visible = 0;

		dt.columns().eq(0).each( function ( colIdx, i ) {
			if ( columnsVis[i] === true ) {
				visible++;
			}

			if ( columnsVis[i] !== oldVis[i] ) {
				changed = true;
				that._setColumnVis( colIdx, columnsVis[i] );
			}
		} );

		if ( changed ) {
			this._redrawChildren();

			// Inform listeners of the change
			$(dt.table().node()).trigger( 'responsive-resize.dt', [dt, this.s.current] );

			// If no records, update the "No records" display element
			if ( dt.page.info().recordsDisplay === 0 ) {
				$('td', dt.table().body()).eq(0).attr('colspan', visible);
			}
		}
	},


	/**
	 * Determine the width of each column in the table so the auto column hiding
	 * has that information to work with. This method is never going to be 100%
	 * perfect since column widths can change slightly per page, but without
	 * seriously compromising performance this is quite effective.
	 *
	 * @private
	 */
	_resizeAuto: function ()
	{
		var dt = this.s.dt;
		var columns = this.s.columns;

		// Are we allowed to do auto sizing?
		if ( ! this.c.auto ) {
			return;
		}

		// Are there any columns that actually need auto-sizing, or do they all
		// have classes defined
		if ( $.inArray( true, $.map( columns, function (c) { return c.auto; } ) ) === -1 ) {
			return;
		}

		// Need to restore all children. They will be reinstated by a re-render
		if ( ! $.isEmptyObject( _childNodeStore ) ) {
			$.each( _childNodeStore, function ( key ) {
				var idx = key.split('-');

				_childNodesRestore( dt, idx[0]*1, idx[1]*1 );
			} );
		}

		// Clone the table with the current data in it
		var tableWidth   = dt.table().node().offsetWidth;
		var columnWidths = dt.columns;
		var clonedTable  = dt.table().node().cloneNode( false );
		var clonedHeader = $( dt.table().header().cloneNode( false ) ).appendTo( clonedTable );
		var clonedBody   = $( dt.table().body() ).clone( false, false ).empty().appendTo( clonedTable ); // use jQuery because of IE8

		// Header
		var headerCells = dt.columns()
			.header()
			.filter( function (idx) {
				return dt.column(idx).visible();
			} )
			.to$()
			.clone( false )
			.css( 'display', 'table-cell' )
			.css( 'min-width', 0 );

		// Body rows - we don't need to take account of DataTables' column
		// visibility since we implement our own here (hence the `display` set)
		$(clonedBody)
			.append( $(dt.rows( { page: 'current' } ).nodes()).clone( false ) )
			.find( 'th, td' ).css( 'display', '' );

		// Footer
		var footer = dt.table().footer();
		if ( footer ) {
			var clonedFooter = $( footer.cloneNode( false ) ).appendTo( clonedTable );
			var footerCells = dt.columns()
				.footer()
				.filter( function (idx) {
					return dt.column(idx).visible();
				} )
				.to$()
				.clone( false )
				.css( 'display', 'table-cell' );

			$('<tr/>')
				.append( footerCells )
				.appendTo( clonedFooter );
		}

		$('<tr/>')
			.append( headerCells )
			.appendTo( clonedHeader );

		// In the inline case extra padding is applied to the first column to
		// give space for the show / hide icon. We need to use this in the
		// calculation
		if ( this.c.details.type === 'inline' ) {
			$(clonedTable).addClass( 'dtr-inline collapsed' );
		}
		
		// It is unsafe to insert elements with the same name into the DOM
		// multiple times. For example, cloning and inserting a checked radio
		// clears the chcecked state of the original radio.
		$( clonedTable ).find( '[name]' ).removeAttr( 'name' );

		// A position absolute table would take the table out of the flow of
		// our container element, bypassing the height and width (Scroller)
		$( clonedTable ).css( 'position', 'relative' )
		
		var inserted = $('<div/>')
			.css( {
				width: 1,
				height: 1,
				overflow: 'hidden',
				clear: 'both'
			} )
			.append( clonedTable );

		inserted.insertBefore( dt.table().node() );

		// The cloned header now contains the smallest that each column can be
		headerCells.each( function (i) {
			var idx = dt.column.index( 'fromVisible', i );
			columns[ idx ].minWidth =  this.offsetWidth || 0;
		} );

		inserted.remove();
	},

	/**
	 * Set a column's visibility.
	 *
	 * We don't use DataTables' column visibility controls in order to ensure
	 * that column visibility can Responsive can no-exist. Since only IE8+ is
	 * supported (and all evergreen browsers of course) the control of the
	 * display attribute works well.
	 *
	 * @param {integer} col      Column index
	 * @param {boolean} showHide Show or hide (true or false)
	 * @private
	 */
	_setColumnVis: function ( col, showHide )
	{
		var dt = this.s.dt;
		var display = showHide ? '' : 'none'; // empty string will remove the attr

		$( dt.column( col ).header() ).css( 'display', display );
		$( dt.column( col ).footer() ).css( 'display', display );
		dt.column( col ).nodes().to$().css( 'display', display );

		// If the are child nodes stored, we might need to reinsert them
		if ( ! $.isEmptyObject( _childNodeStore ) ) {
			dt.cells( null, col ).indexes().each( function (idx) {
				_childNodesRestore( dt, idx.row, idx.column );
			} );
		}
	},


	/**
	 * Update the cell tab indexes for keyboard accessibility. This is called on
	 * every table draw - that is potentially inefficient, but also the least
	 * complex option given that column visibility can change on the fly. Its a
	 * shame user-focus was removed from CSS 3 UI, as it would have solved this
	 * issue with a single CSS statement.
	 *
	 * @private
	 */
	_tabIndexes: function ()
	{
		var dt = this.s.dt;
		var cells = dt.cells( { page: 'current' } ).nodes().to$();
		var ctx = dt.settings()[0];
		var target = this.c.details.target;

		cells.filter( '[data-dtr-keyboard]' ).removeData( '[data-dtr-keyboard]' );

		if ( typeof target === 'number' ) {
			dt.cells( null, target, { page: 'current' } ).nodes().to$()
				.attr( 'tabIndex', ctx.iTabIndex )
				.data( 'dtr-keyboard', 1 );
		}
		else {
			// This is a bit of a hack - we need to limit the selected nodes to just
			// those of this table
			if ( target === 'td:first-child, th:first-child' ) {
				target = '>td:first-child, >th:first-child';
			}

			$( target, dt.rows( { page: 'current' } ).nodes() )
				.attr( 'tabIndex', ctx.iTabIndex )
				.data( 'dtr-keyboard', 1 );
		}
	}
} );


/**
 * List of default breakpoints. Each item in the array is an object with two
 * properties:
 *
 * * `name` - the breakpoint name.
 * * `width` - the breakpoint width
 *
 * @name Responsive.breakpoints
 * @static
 */
Responsive.breakpoints = [
	{ name: 'desktop',  width: Infinity },
	{ name: 'tablet-l', width: 1024 },
	{ name: 'tablet-p', width: 768 },
	{ name: 'mobile-l', width: 480 },
	{ name: 'mobile-p', width: 320 }
];


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.display = {
	childRow: function ( row, update, render ) {
		if ( update ) {
			if ( $(row.node()).hasClass('parent') ) {
				row.child( render(), 'child' ).show();

				return true;
			}
		}
		else {
			if ( ! row.child.isShown()  ) {
				row.child( render(), 'child' ).show();
				$( row.node() ).addClass( 'parent' );

				return true;
			}
			else {
				row.child( false );
				$( row.node() ).removeClass( 'parent' );

				return false;
			}
		}
	},

	childRowImmediate: function ( row, update, render ) {
		if ( (! update && row.child.isShown()) || ! row.responsive.hasHidden() ) {
			// User interaction and the row is show, or nothing to show
			row.child( false );
			$( row.node() ).removeClass( 'parent' );

			return false;
		}
		else {
			// Display
			row.child( render(), 'child' ).show();
			$( row.node() ).addClass( 'parent' );

			return true;
		}
	},

	// This is a wrapper so the modal options for Bootstrap and jQuery UI can
	// have options passed into them. This specific one doesn't need to be a
	// function but it is for consistency in the `modal` name
	modal: function ( options ) {
		return function ( row, update, render ) {
			if ( ! update ) {
				// Show a modal
				var close = function () {
					modal.remove(); // will tidy events for us
					$(document).off( 'keypress.dtr' );
				};

				var modal = $('<div class="dtr-modal"/>')
					.append( $('<div class="dtr-modal-display"/>')
						.append( $('<div class="dtr-modal-content"/>')
							.append( render() )
						)
						.append( $('<div class="dtr-modal-close">&times;</div>' )
							.click( function () {
								close();
							} )
						)
					)
					.append( $('<div class="dtr-modal-background"/>')
						.click( function () {
							close();
						} )
					)
					.appendTo( 'body' );

				$(document).on( 'keyup.dtr', function (e) {
					if ( e.keyCode === 27 ) {
						e.stopPropagation();

						close();
					}
				} );
			}
			else {
				$('div.dtr-modal-content')
					.empty()
					.append( render() );
			}

			if ( options && options.header ) {
				$('div.dtr-modal-content').prepend(
					'<h2>'+options.header( row )+'</h2>'
				);
			}
		};
	}
};


var _childNodeStore = {};

function _childNodes( dt, row, col ) {
	var name = row+'-'+col;

	if ( _childNodeStore[ name ] ) {
		return _childNodeStore[ name ];
	}

	// https://jsperf.com/childnodes-array-slice-vs-loop
	var nodes = [];
	var children = dt.cell( row, col ).node().childNodes;
	for ( var i=0, ien=children.length ; i<ien ; i++ ) {
		nodes.push( children[i] );
	}

	_childNodeStore[ name ] = nodes;

	return nodes;
}

function _childNodesRestore( dt, row, col ) {
	var name = row+'-'+col;

	if ( ! _childNodeStore[ name ] ) {
		return;
	}

	var node = dt.cell( row, col ).node();
	var store = _childNodeStore[ name ];
	var parent = store[0].parentNode;
	var parentChildren = parent.childNodes;
	var a = [];

	for ( var i=0, ien=parentChildren.length ; i<ien ; i++ ) {
		a.push( parentChildren[i] );
	}

	for ( var j=0, jen=a.length ; j<jen ; j++ ) {
		node.appendChild( a[j] );
	}

	_childNodeStore[ name ] = undefined;
}


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.renderer = {
	listHiddenNodes: function () {
		return function ( api, rowIdx, columns ) {
			var ul = $('<ul data-dtr-index="'+rowIdx+'" class="dtr-details"/>');
			var found = false;

			var data = $.each( columns, function ( i, col ) {
				if ( col.hidden ) {
					$(
						'<li data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
							'<span class="dtr-title">'+
								col.title+
							'</span> '+
						'</li>'
					)
						.append( $('<span class="dtr-data"/>').append( _childNodes( api, col.rowIndex, col.columnIndex ) ) )// api.cell( col.rowIndex, col.columnIndex ).node().childNodes ) )
						.appendTo( ul );

					found = true;
				}
			} );

			return found ?
				ul :
				false;
		};
	},

	listHidden: function () {
		return function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col ) {
				return col.hidden ?
					'<li data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
						'<span class="dtr-title">'+
							col.title+
						'</span> '+
						'<span class="dtr-data">'+
							col.data+
						'</span>'+
					'</li>' :
					'';
			} ).join('');

			return data ?
				$('<ul data-dtr-index="'+rowIdx+'" class="dtr-details"/>').append( data ) :
				false;
		}
	},

	tableAll: function ( options ) {
		options = $.extend( {
			tableClass: ''
		}, options );

		return function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col ) {
				return '<tr data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
						'<td>'+col.title+':'+'</td> '+
						'<td>'+col.data+'</td>'+
					'</tr>';
			} ).join('');

			return $('<table class="'+options.tableClass+' dtr-details" width="100%"/>').append( data );
		}
	}
};

/**
 * Responsive default settings for initialisation
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.defaults = {
	/**
	 * List of breakpoints for the instance. Note that this means that each
	 * instance can have its own breakpoints. Additionally, the breakpoints
	 * cannot be changed once an instance has been creased.
	 *
	 * @type {Array}
	 * @default Takes the value of `Responsive.breakpoints`
	 */
	breakpoints: Responsive.breakpoints,

	/**
	 * Enable / disable auto hiding calculations. It can help to increase
	 * performance slightly if you disable this option, but all columns would
	 * need to have breakpoint classes assigned to them
	 *
	 * @type {Boolean}
	 * @default  `true`
	 */
	auto: true,

	/**
	 * Details control. If given as a string value, the `type` property of the
	 * default object is set to that value, and the defaults used for the rest
	 * of the object - this is for ease of implementation.
	 *
	 * The object consists of the following properties:
	 *
	 * * `display` - A function that is used to show and hide the hidden details
	 * * `renderer` - function that is called for display of the child row data.
	 *   The default function will show the data from the hidden columns
	 * * `target` - Used as the selector for what objects to attach the child
	 *   open / close to
	 * * `type` - `false` to disable the details display, `inline` or `column`
	 *   for the two control types
	 *
	 * @type {Object|string}
	 */
	details: {
		display: Responsive.display.childRow,

		renderer: Responsive.renderer.listHidden(),

		target: 0,

		type: 'inline'
	},

	/**
	 * Orthogonal data request option. This is used to define the data type
	 * requested when Responsive gets the data to show in the child row.
	 *
	 * @type {String}
	 */
	orthogonal: 'display'
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - work around for a bug in DT... Not documented
Api.register( 'responsive()', function () {
	return this;
} );

Api.register( 'responsive.index()', function ( li ) {
	li = $(li);

	return {
		column: li.data('dtr-index'),
		row:    li.parent().data('dtr-index')
	};
} );

Api.register( 'responsive.rebuild()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._classLogic();
		}
	} );
} );

Api.register( 'responsive.recalc()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._resizeAuto();
			ctx._responsive._resize();
		}
	} );
} );

Api.register( 'responsive.hasHidden()', function () {
	var ctx = this.context[0];

	return ctx._responsive ?
		$.inArray( false, ctx._responsive.s.current ) !== -1 :
		false;
} );

Api.registerPlural( 'columns().responsiveHidden()', 'column().responsiveHidden()', function () {
	return this.iterator( 'column', function ( settings, column ) {
		return settings._responsive ?
			settings._responsive.s.current[ column ] :
			false;
	}, 1 );
} );


/**
 * Version information
 *
 * @name Responsive.version
 * @static
 */
Responsive.version = '2.2.2';


$.fn.dataTable.Responsive = Responsive;
$.fn.DataTable.Responsive = Responsive;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtr', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	if ( $(settings.nTable).hasClass( 'responsive' ) ||
		 $(settings.nTable).hasClass( 'dt-responsive' ) ||
		 settings.oInit.responsive ||
		 DataTable.defaults.responsive
	) {
		var init = settings.oInit.responsive;

		if ( init !== false ) {
			new Responsive( settings, $.isPlainObject( init ) ? init : {}  );
		}
	}
} );


return Responsive;
}));


/*! Scroller 2.0.0
 * ©2011-2018 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Scroller
 * @description Virtual rendering for DataTables
 * @version     2.0.0
 * @file        dataTables.scroller.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2011-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * Scroller is a virtual rendering plug-in for DataTables which allows large
 * datasets to be drawn on screen every quickly. What the virtual rendering means
 * is that only the visible portion of the table (and a bit to either side to make
 * the scrolling smooth) is drawn, while the scrolling container gives the
 * visual impression that the whole table is visible. This is done by making use
 * of the pagination abilities of DataTables and moving the table around in the
 * scrolling container DataTables adds to the page. The scrolling container is
 * forced to the height it would be for the full table display using an extra
 * element.
 *
 * Note that rows in the table MUST all be the same height. Information in a cell
 * which expands on to multiple lines will cause some odd behaviour in the scrolling.
 *
 * Scroller is initialised by simply including the letter 'S' in the sDom for the
 * table you want to have this feature enabled on. Note that the 'S' must come
 * AFTER the 't' parameter in `dom`.
 *
 * Key features include:
 *   <ul class="limit_length">
 *     <li>Speed! The aim of Scroller for DataTables is to make rendering large data sets fast</li>
 *     <li>Full compatibility with deferred rendering in DataTables for maximum speed</li>
 *     <li>Display millions of rows</li>
 *     <li>Integration with state saving in DataTables (scrolling position is saved)</li>
 *     <li>Easy to use</li>
 *   </ul>
 *
 *  @class
 *  @constructor
 *  @global
 *  @param {object} dt DataTables settings object or API instance
 *  @param {object} [opts={}] Configuration object for FixedColumns. Options 
 *    are defined by {@link Scroller.defaults}
 *
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.0+
 *
 *  @example
 *    $(document).ready(function() {
 *        $('#example').DataTable( {
 *            "scrollY": "200px",
 *            "ajax": "media/dataset/large.txt",
 *            "scroller": true,
 *            "deferRender": true
 *        } );
 *    } );
 */
var Scroller = function ( dt, opts ) {
	/* Sanity check - you just know it will happen */
	if ( ! (this instanceof Scroller) ) {
		alert( "Scroller warning: Scroller must be initialised with the 'new' keyword." );
		return;
	}

	if ( opts === undefined ) {
		opts = {};
	}

	var dtApi = $.fn.dataTable.Api( dt );

	/**
	 * Settings object which contains customisable information for the Scroller instance
	 * @namespace
	 * @private
	 * @extends Scroller.defaults
	 */
	this.s = {
		/**
		 * DataTables settings object
		 *  @type     object
		 *  @default  Passed in as first parameter to constructor
		 */
		dt: dtApi.settings()[0],

		/**
		 * DataTables API instance
		 *  @type     DataTable.Api
		 */
		dtApi: dtApi,

		/**
		 * Pixel location of the top of the drawn table in the viewport
		 *  @type     int
		 *  @default  0
		 */
		tableTop: 0,

		/**
		 * Pixel location of the bottom of the drawn table in the viewport
		 *  @type     int
		 *  @default  0
		 */
		tableBottom: 0,

		/**
		 * Pixel location of the boundary for when the next data set should be loaded and drawn
		 * when scrolling up the way.
		 *  @type     int
		 *  @default  0
		 *  @private
		 */
		redrawTop: 0,

		/**
		 * Pixel location of the boundary for when the next data set should be loaded and drawn
		 * when scrolling down the way. Note that this is actually calculated as the offset from
		 * the top.
		 *  @type     int
		 *  @default  0
		 *  @private
		 */
		redrawBottom: 0,

		/**
		 * Auto row height or not indicator
		 *  @type     bool
		 *  @default  0
		 */
		autoHeight: true,

		/**
		 * Number of rows calculated as visible in the visible viewport
		 *  @type     int
		 *  @default  0
		 */
		viewportRows: 0,

		/**
		 * setTimeout reference for state saving, used when state saving is enabled in the DataTable
		 * and when the user scrolls the viewport in order to stop the cookie set taking too much
		 * CPU!
		 *  @type     int
		 *  @default  0
		 */
		stateTO: null,

		/**
		 * setTimeout reference for the redraw, used when server-side processing is enabled in the
		 * DataTables in order to prevent DoSing the server
		 *  @type     int
		 *  @default  null
		 */
		drawTO: null,

		heights: {
			jump: null,
			page: null,
			virtual: null,
			scroll: null,

			/**
			 * Height of rows in the table
			 *  @type     int
			 *  @default  0
			 */
			row: null,

			/**
			 * Pixel height of the viewport
			 *  @type     int
			 *  @default  0
			 */
			viewport: null,
			labelFactor: 1
		},

		topRowFloat: 0,
		scrollDrawDiff: null,
		loaderVisible: false,
		forceReposition: false,
		baseRowTop: 0,
		baseScrollTop: 0,
		mousedown: false,
		lastScrollTop: 0
	};

	// @todo The defaults should extend a `c` property and the internal settings
	// only held in the `s` property. At the moment they are mixed
	this.s = $.extend( this.s, Scroller.oDefaults, opts );

	// Workaround for row height being read from height object (see above comment)
	this.s.heights.row = this.s.rowHeight;

	/**
	 * DOM elements used by the class instance
	 * @private
	 * @namespace
	 *
	 */
	this.dom = {
		"force":    document.createElement('div'),
		"label":    $('<div class="dts_label">0</div>'),
		"scroller": null,
		"table":    null,
		"loader":   null
	};

	// Attach the instance to the DataTables instance so it can be accessed in
	// future. Don't initialise Scroller twice on the same table
	if ( this.s.dt.oScroller ) {
		return;
	}

	this.s.dt.oScroller = this;

	/* Let's do it */
	this.construct();
};



$.extend( Scroller.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods - to be exposed via the DataTables API
	 */

	/**
	 * Calculate and store information about how many rows are to be displayed
	 * in the scrolling viewport, based on current dimensions in the browser's
	 * rendering. This can be particularly useful if the table is initially
	 * drawn in a hidden element - for example in a tab.
	 *  @param {bool} [redraw=true] Redraw the table automatically after the recalculation, with
	 *    the new dimensions forming the basis for the draw.
	 *  @returns {void}
	 */
	measure: function ( redraw )
	{
		if ( this.s.autoHeight )
		{
			this._calcRowHeight();
		}

		var heights = this.s.heights;

		if ( heights.row ) {
			heights.viewport = $.contains(document, this.dom.scroller) ?
				this.dom.scroller.clientHeight :
				this._parseHeight($(this.dom.scroller).css('height'));

			// If collapsed (no height) use the max-height parameter
			if ( ! heights.viewport ) {
				heights.viewport = this._parseHeight($(this.dom.scroller).css('max-height'));
			}

			this.s.viewportRows = parseInt( heights.viewport / heights.row, 10 )+1;
			this.s.dt._iDisplayLength = this.s.viewportRows * this.s.displayBuffer;
		}

		var label = this.dom.label.outerHeight();
		heights.labelFactor = (heights.viewport-label) / heights.scroll;

		if ( redraw === undefined || redraw )
		{
			this.s.dt.oInstance.fnDraw( false );
		}
	},

	/**
	 * Get information about current displayed record range. This corresponds to
	 * the information usually displayed in the "Info" block of the table.
	 *
	 * @returns {object} info as an object:
	 *  {
	 *      start: {int}, // the 0-indexed record at the top of the viewport
	 *      end:   {int}, // the 0-indexed record at the bottom of the viewport
	 *  }
	*/
	pageInfo: function()
	{
		var 
			dt = this.s.dt,
			iScrollTop = this.dom.scroller.scrollTop,
			iTotal = dt.fnRecordsDisplay(),
			iPossibleEnd = Math.ceil(this.pixelsToRow(iScrollTop + this.s.heights.viewport, false, this.s.ani));

		return {
			start: Math.floor(this.pixelsToRow(iScrollTop, false, this.s.ani)),
			end: iTotal < iPossibleEnd ? iTotal-1 : iPossibleEnd-1
		};
	},

	/**
	 * Calculate the row number that will be found at the given pixel position
	 * (y-scroll).
	 *
	 * Please note that when the height of the full table exceeds 1 million
	 * pixels, Scroller switches into a non-linear mode for the scrollbar to fit
	 * all of the records into a finite area, but this function returns a linear
	 * value (relative to the last non-linear positioning).
	 *  @param {int} pixels Offset from top to calculate the row number of
	 *  @param {int} [intParse=true] If an integer value should be returned
	 *  @param {int} [virtual=false] Perform the calculations in the virtual domain
	 *  @returns {int} Row index
	 */
	pixelsToRow: function ( pixels, intParse, virtual )
	{
		var diff = pixels - this.s.baseScrollTop;
		var row = virtual ?
			(this._domain( 'physicalToVirtual', this.s.baseScrollTop ) + diff) / this.s.heights.row :
			( diff / this.s.heights.row ) + this.s.baseRowTop;

		return intParse || intParse === undefined ?
			parseInt( row, 10 ) :
			row;
	},

	/**
	 * Calculate the pixel position from the top of the scrolling container for
	 * a given row
	 *  @param {int} iRow Row number to calculate the position of
	 *  @returns {int} Pixels
	 */
	rowToPixels: function ( rowIdx, intParse, virtual )
	{
		var pixels;
		var diff = rowIdx - this.s.baseRowTop;

		if ( virtual ) {
			pixels = this._domain( 'virtualToPhysical', this.s.baseScrollTop );
			pixels += diff * this.s.heights.row;
		}
		else {
			pixels = this.s.baseScrollTop;
			pixels += diff * this.s.heights.row;
		}

		return intParse || intParse === undefined ?
			parseInt( pixels, 10 ) :
			pixels;
	},


	/**
	 * Calculate the row number that will be found at the given pixel position (y-scroll)
	 *  @param {int} row Row index to scroll to
	 *  @param {bool} [animate=true] Animate the transition or not
	 *  @returns {void}
	 */
	scrollToRow: function ( row, animate )
	{
		var that = this;
		var ani = false;
		var px = this.rowToPixels( row );

		// We need to know if the table will redraw or not before doing the
		// scroll. If it will not redraw, then we need to use the currently
		// displayed table, and scroll with the physical pixels. Otherwise, we
		// need to calculate the table's new position from the virtual
		// transform.
		var preRows = ((this.s.displayBuffer-1)/2) * this.s.viewportRows;
		var drawRow = row - preRows;
		if ( drawRow < 0 ) {
			drawRow = 0;
		}

		if ( (px > this.s.redrawBottom || px < this.s.redrawTop) && this.s.dt._iDisplayStart !== drawRow ) {
			ani = true;
			px = this._domain( 'virtualToPhysical', row * this.s.heights.row );

			// If we need records outside the current draw region, but the new
			// scrolling position is inside that (due to the non-linear nature
			// for larger numbers of records), we need to force position update.
			if ( this.s.redrawTop < px && px < this.s.redrawBottom ) {
				this.s.forceReposition = true;
				animate = false;
			}
		}

		if ( typeof animate == 'undefined' || animate )
		{
			this.s.ani = ani;
			$(this.dom.scroller).animate( {
				"scrollTop": px
			}, function () {
				// This needs to happen after the animation has completed and
				// the final scroll event fired
				setTimeout( function () {
					that.s.ani = false;
				}, 25 );
			} );
		}
		else
		{
			$(this.dom.scroller).scrollTop( px );
		}
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialisation for Scroller
	 *  @returns {void}
	 *  @private
	 */
	construct: function ()
	{
		var that = this;
		var dt = this.s.dtApi;

		/* Sanity check */
		if ( !this.s.dt.oFeatures.bPaginate ) {
			this.s.dt.oApi._fnLog( this.s.dt, 0, 'Pagination must be enabled for Scroller' );
			return;
		}

		/* Insert a div element that we can use to force the DT scrolling container to
		 * the height that would be required if the whole table was being displayed
		 */
		this.dom.force.style.position = "relative";
		this.dom.force.style.top = "0px";
		this.dom.force.style.left = "0px";
		this.dom.force.style.width = "1px";

		this.dom.scroller = $('div.'+this.s.dt.oClasses.sScrollBody, this.s.dt.nTableWrapper)[0];
		this.dom.scroller.appendChild( this.dom.force );
		this.dom.scroller.style.position = "relative";

		this.dom.table = $('>table', this.dom.scroller)[0];
		this.dom.table.style.position = "absolute";
		this.dom.table.style.top = "0px";
		this.dom.table.style.left = "0px";

		// Add class to 'announce' that we are a Scroller table
		$(dt.table().container()).addClass('dts DTS');

		// Add a 'loading' indicator
		if ( this.s.loadingIndicator )
		{
			this.dom.loader = $('<div class="dataTables_processing dts_loading">'+this.s.dt.oLanguage.sLoadingRecords+'</div>')
				.css('display', 'none');

			$(this.dom.scroller.parentNode)
				.css('position', 'relative')
				.append( this.dom.loader );
		}

		this.dom.label.appendTo(this.dom.scroller);

		/* Initial size calculations */
		if ( this.s.heights.row && this.s.heights.row != 'auto' )
		{
			this.s.autoHeight = false;
		}
		this.measure( false );

		// Scrolling callback to see if a page change is needed - use a throttled
		// function for the save save callback so we aren't hitting it on every
		// scroll
		this.s.ingnoreScroll = true;
		this.s.stateSaveThrottle = this.s.dt.oApi._fnThrottle( function () {
			that.s.dtApi.state.save();
		}, 500 );
		$(this.dom.scroller).on( 'scroll.dt-scroller', function (e) {
			that._scroll.call( that );
		} );

		// In iOS we catch the touchstart event in case the user tries to scroll
		// while the display is already scrolling
		$(this.dom.scroller).on('touchstart.dt-scroller', function () {
			that._scroll.call( that );
		} );

		$(this.dom.scroller)
			.on('mousedown.dt-scroller', function () {
				that.s.mousedown = true;
			})
			.on('mouseup.dt-scroller', function () {
				that.s.mouseup = false;
				that.dom.label.css('display', 'none');
			});

		// On resize, update the information element, since the number of rows shown might change
		$(window).on( 'resize.dt-scroller', function () {
			that.measure( false );
			that._info();
		} );

		// Add a state saving parameter to the DT state saving so we can restore the exact
		// position of the scrolling. Slightly surprisingly the scroll position isn't actually
		// stored, but rather tha base units which are needed to calculate it. This allows for
		// virtual scrolling as well.
		var initialStateSave = true;
		var loadedState = dt.state.loaded();

		dt.on( 'stateSaveParams.scroller', function ( e, settings, data ) {
			// Need to used the saved position on init
			data.scroller = {
				topRow: initialStateSave && loadedState && loadedState.scroller ?
					loadedState.scroller.topRow :
					that.s.topRowFloat,
				baseScrollTop: that.s.baseScrollTop,
				baseRowTop: that.s.baseRowTop
			};

			initialStateSave = false;
		} );

		if ( loadedState && loadedState.scroller ) {
			this.s.topRowFloat = loadedState.scroller.topRow;
			this.s.baseScrollTop = loadedState.scroller.baseScrollTop;
			this.s.baseRowTop = loadedState.scroller.baseRowTop;
		}

		dt.on( 'init.scroller', function () {
			that.measure( false );

			that._draw();

			// Update the scroller when the DataTable is redrawn
			dt.on( 'draw.scroller', function () {
				that._draw();
			});
		} );

		// Set height before the draw happens, allowing everything else to update
		// on draw complete without worry for roder.
		dt.on( 'preDraw.dt.scroller', function () {
			that._scrollForce();
		} );

		// Destructor
		dt.on( 'destroy.scroller', function () {
			$(window).off( 'resize.dt-scroller' );
			$(that.dom.scroller).off('.dt-scroller');
			$(that.s.dt.nTable).off( '.scroller' );

			$(that.s.dt.nTableWrapper).removeClass('DTS');
			$('div.DTS_Loading', that.dom.scroller.parentNode).remove();

			that.dom.table.style.position = "";
			that.dom.table.style.top = "";
			that.dom.table.style.left = "";
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Automatic calculation of table row height. This is just a little tricky here as using
	 * initialisation DataTables has tale the table out of the document, so we need to create
	 * a new table and insert it into the document, calculate the row height and then whip the
	 * table out.
	 *  @returns {void}
	 *  @private
	 */
	_calcRowHeight: function ()
	{
		var dt = this.s.dt;
		var origTable = dt.nTable;
		var nTable = origTable.cloneNode( false );
		var tbody = $('<tbody/>').appendTo( nTable );
		var container = $(
			'<div class="'+dt.oClasses.sWrapper+' DTS">'+
				'<div class="'+dt.oClasses.sScrollWrapper+'">'+
					'<div class="'+dt.oClasses.sScrollBody+'"></div>'+
				'</div>'+
			'</div>'
		);

		// Want 3 rows in the sizing table so :first-child and :last-child
		// CSS styles don't come into play - take the size of the middle row
		$('tbody tr:lt(4)', origTable).clone().appendTo( tbody );
        var rowsCount = $('tr', tbody).length;

        if ( rowsCount === 1 ) {
            tbody.prepend('<tr><td>&#160;</td></tr>');
            tbody.append('<tr><td>&#160;</td></tr>');
		}
		else {
            for (; rowsCount < 3; rowsCount++) {
                tbody.append('<tr><td>&#160;</td></tr>');
            }
		}
	
		$('div.'+dt.oClasses.sScrollBody, container).append( nTable );

		// If initialised using `dom`, use the holding element as the insert point
		var insertEl = this.s.dt.nHolding || origTable.parentNode;

		if ( ! $(insertEl).is(':visible') ) {
			insertEl = 'body';
		}

		container.appendTo( insertEl );
		this.s.heights.row = $('tr', tbody).eq(1).outerHeight();

		container.remove();
	},

	/**
	 * Draw callback function which is fired when the DataTable is redrawn. The main function of
	 * this method is to position the drawn table correctly the scrolling container for the rows
	 * that is displays as a result of the scrolling position.
	 *  @returns {void}
	 *  @private
	 */
	_draw: function ()
	{
		var
			that = this,
			heights = this.s.heights,
			iScrollTop = this.dom.scroller.scrollTop,
			iActualScrollTop = iScrollTop,
			iScrollBottom = iScrollTop + heights.viewport,
			iTableHeight = $(this.s.dt.nTable).height(),
			displayStart = this.s.dt._iDisplayStart,
			displayLen = this.s.dt._iDisplayLength,
			displayEnd = this.s.dt.fnRecordsDisplay();

		// Disable the scroll event listener while we are updating the DOM
		this.s.skip = true;

		// If paging is reset
		if ( (this.s.dt.bSorted || this.s.dt.bFiltered) && displayStart === 0 && !this.s.dt._drawHold ) {
			this.s.topRowFloat = 0;
		}

		iScrollTop = this.scrollType === 'jump' ?
			this._domain( 'physicalToVirtual', this.s.topRowFloat * heights.row ) :
			iScrollTop;

		// This doesn't work when scrolling with the mouse wheel
		$(that.dom.scroller).scrollTop(iScrollTop);

		// Store positional information so positional calculations can be based
		// upon the current table draw position
		this.s.baseScrollTop = iScrollTop;
		this.s.baseRowTop = this.s.topRowFloat;

		// Position the table in the virtual scroller
		var tableTop = iScrollTop - ((this.s.topRowFloat - displayStart) * heights.row);
		if ( displayStart === 0 ) {
			tableTop = 0;
		}
		else if ( displayStart + displayLen >= displayEnd ) {
			tableTop = heights.scroll - iTableHeight;
		}

		this.dom.table.style.top = tableTop+'px';

		/* Cache some information for the scroller */
		this.s.tableTop = tableTop;
		this.s.tableBottom = iTableHeight + this.s.tableTop;

		// Calculate the boundaries for where a redraw will be triggered by the
		// scroll event listener
		var boundaryPx = (iScrollTop - this.s.tableTop) * this.s.boundaryScale;
		this.s.redrawTop = iScrollTop - boundaryPx;
		this.s.redrawBottom = iScrollTop + boundaryPx > heights.scroll - heights.viewport - heights.row ?
			heights.scroll - heights.viewport - heights.row :
			iScrollTop + boundaryPx;

		this.s.skip = false;

		// Restore the scrolling position that was saved by DataTable's state
		// saving Note that this is done on the second draw when data is Ajax
		// sourced, and the first draw when DOM soured
		if ( this.s.dt.oFeatures.bStateSave && this.s.dt.oLoadedState !== null &&
			 typeof this.s.dt.oLoadedState.iScroller != 'undefined' )
		{
			// A quirk of DataTables is that the draw callback will occur on an
			// empty set if Ajax sourced, but not if server-side processing.
			var ajaxSourced = (this.s.dt.sAjaxSource || that.s.dt.ajax) && ! this.s.dt.oFeatures.bServerSide ?
				true :
				false;

			if ( ( ajaxSourced && this.s.dt.iDraw == 2) ||
			     (!ajaxSourced && this.s.dt.iDraw == 1) )
			{
				setTimeout( function () {
					$(that.dom.scroller).scrollTop( that.s.dt.oLoadedState.iScroller );
					that.s.redrawTop = that.s.dt.oLoadedState.iScroller - (heights.viewport/2);

					// In order to prevent layout thrashing we need another
					// small delay
					setTimeout( function () {
						that.s.ingnoreScroll = false;
					}, 0 );
				}, 0 );
			}
		}
		else {
			that.s.ingnoreScroll = false;
		}

		// Because of the order of the DT callbacks, the info update will
		// take precedence over the one we want here. So a 'thread' break is
		// needed.  Only add the thread break if bInfo is set
		if ( this.s.dt.oFeatures.bInfo ) {
			setTimeout( function () {
				that._info.call( that );
			}, 0 );
		}

		// Hide the loading indicator
		if ( this.dom.loader && this.s.loaderVisible ) {
			this.dom.loader.css( 'display', 'none' );
			this.s.loaderVisible = false;
		}
	},

	/**
	 * Convert from one domain to another. The physical domain is the actual
	 * pixel count on the screen, while the virtual is if we had browsers which
	 * had scrolling containers of infinite height (i.e. the absolute value)
	 *
	 *  @param {string} dir Domain transform direction, `virtualToPhysical` or
	 *    `physicalToVirtual` 
	 *  @returns {number} Calculated transform
	 *  @private
	 */
	_domain: function ( dir, val )
	{
		var heights = this.s.heights;
		var diff;
		var magic = 10000; // the point at which the non-linear calculations start to happen

		// If the virtual and physical height match, then we use a linear
		// transform between the two, allowing the scrollbar to be linear
		if ( heights.virtual === heights.scroll ) {
			return val;
		}

		// In the first 10k pixels and the last 10k pixels, we want the scrolling
		// to be linear. After that it can be non-linear. It would be unusual for
		// anyone to mouse wheel through that much.
		if ( val < magic ) {
			return val;
		}
		else if ( dir === 'virtualToPhysical' && val > heights.virtual - magic ) {
			diff = heights.virtual - val;
			return heights.scroll - diff;
		}
		else if ( dir === 'physicalToVirtual' && val > heights.scroll - magic ) {
			diff = heights.scroll - val;
			return heights.virtual - diff;
		}

		// Otherwise, we want a non-linear scrollbar to take account of the
		// redrawing regions at the start and end of the table, otherwise these
		// can stutter badly - on large tables 30px (for example) scroll might
		// be hundreds of rows, so the table would be redrawing every few px at
		// the start and end. Use a simple linear eq. to stop this, effectively
		// causing a kink in the scrolling ratio. It does mean the scrollbar is
		// non-linear, but with such massive data sets, the scrollbar is going
		// to be a best guess anyway
		var xMax = dir === 'virtualToPhysical' ?
			heights.virtual :
			heights.scroll;
		var yMax = dir === 'virtualToPhysical' ?
			heights.scroll :
			heights.virtual;

		var m = (yMax - magic) / (xMax - magic);
		var c = magic - (m*magic);

		return (m*val) + c;
	},

	/**
	 * Update any information elements that are controlled by the DataTable based on the scrolling
	 * viewport and what rows are visible in it. This function basically acts in the same way as
	 * _fnUpdateInfo in DataTables, and effectively replaces that function.
	 *  @returns {void}
	 *  @private
	 */
	_info: function ()
	{
		if ( !this.s.dt.oFeatures.bInfo )
		{
			return;
		}

		var
			dt = this.s.dt,
			language = dt.oLanguage,
			iScrollTop = this.dom.scroller.scrollTop,
			iStart = Math.floor( this.pixelsToRow(iScrollTop, false, this.s.ani)+1 ),
			iMax = dt.fnRecordsTotal(),
			iTotal = dt.fnRecordsDisplay(),
			iPossibleEnd = Math.ceil( this.pixelsToRow(iScrollTop+this.s.heights.viewport, false, this.s.ani) ),
			iEnd = iTotal < iPossibleEnd ? iTotal : iPossibleEnd,
			sStart = dt.fnFormatNumber( iStart ),
			sEnd = dt.fnFormatNumber( iEnd ),
			sMax = dt.fnFormatNumber( iMax ),
			sTotal = dt.fnFormatNumber( iTotal ),
			sOut;

		if ( dt.fnRecordsDisplay() === 0 &&
			   dt.fnRecordsDisplay() == dt.fnRecordsTotal() )
		{
			/* Empty record set */
			sOut = language.sInfoEmpty+ language.sInfoPostFix;
		}
		else if ( dt.fnRecordsDisplay() === 0 )
		{
			/* Empty record set after filtering */
			sOut = language.sInfoEmpty +' '+
				language.sInfoFiltered.replace('_MAX_', sMax)+
					language.sInfoPostFix;
		}
		else if ( dt.fnRecordsDisplay() == dt.fnRecordsTotal() )
		{
			/* Normal record set */
			sOut = language.sInfo.
					replace('_START_', sStart).
					replace('_END_',   sEnd).
					replace('_MAX_',   sMax).
					replace('_TOTAL_', sTotal)+
				language.sInfoPostFix;
		}
		else
		{
			/* Record set after filtering */
			sOut = language.sInfo.
					replace('_START_', sStart).
					replace('_END_',   sEnd).
					replace('_MAX_',   sMax).
					replace('_TOTAL_', sTotal) +' '+
				language.sInfoFiltered.replace(
					'_MAX_',
					dt.fnFormatNumber(dt.fnRecordsTotal())
				)+
				language.sInfoPostFix;
		}

		var callback = language.fnInfoCallback;
		if ( callback ) {
			sOut = callback.call( dt.oInstance,
				dt, iStart, iEnd, iMax, iTotal, sOut
			);
		}

		var n = dt.aanFeatures.i;
		if ( typeof n != 'undefined' )
		{
			for ( var i=0, iLen=n.length ; i<iLen ; i++ )
			{
				$(n[i]).html( sOut );
			}
		}

		// DT doesn't actually (yet) trigger this event, but it will in future
		$(dt.nTable).triggerHandler( 'info.dt' );
	},

	/**
	 * Parse CSS height property string as number
	 *
	 * An attempt is made to parse the string as a number. Currently supported units are 'px',
	 * 'vh', and 'rem'. 'em' is partially supported; it works as long as the parent element's
	 * font size matches the body element. Zero is returned for unrecognized strings.
	 *  @param {string} cssHeight CSS height property string
	 *  @returns {number} height
	 *  @private
	 */
	_parseHeight: function(cssHeight) {
		var height;
		var matches = /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(px|em|rem|vh)$/.exec(cssHeight);

		if (matches === null) {
			return 0;
		}

		var value = parseFloat(matches[1]);
		var unit = matches[2];

		if ( unit === 'px' ) {
			height = value;
		}
		else if ( unit === 'vh' ) {
			height = ( value / 100 ) * $(window).height();
		}
		else if ( unit === 'rem' ) {
			height = value * parseFloat($(':root').css('font-size'));
		}
		else if ( unit === 'em' ) {
			height = value * parseFloat($('body').css('font-size'));
		}

		return height ?
			height :
			0;
	},

	/**
	 * Scrolling function - fired whenever the scrolling position is changed.
	 * This method needs to use the stored values to see if the table should be
	 * redrawn as we are moving towards the end of the information that is
	 * currently drawn or not. If needed, then it will redraw the table based on
	 * the new position.
	 *  @returns {void}
	 *  @private
	 */
	_scroll: function ()
	{
		var
			that = this,
			heights = this.s.heights,
			iScrollTop = this.dom.scroller.scrollTop,
			iTopRow;

		if ( this.s.skip ) {
			return;
		}

		if ( this.s.ingnoreScroll ) {
			return;
		}

		if ( iScrollTop === this.s.lastScrollTop ) {
			return;
		}

		/* If the table has been sorted or filtered, then we use the redraw that
		 * DataTables as done, rather than performing our own
		 */
		if ( this.s.dt.bFiltered || this.s.dt.bSorted ) {
			this.s.lastScrollTop = 0;
			return;
		}

		/* Update the table's information display for what is now in the viewport */
		this._info();

		/* We don't want to state save on every scroll event - that's heavy
		 * handed, so use a timeout to update the state saving only when the
		 * scrolling has finished
		 */
		clearTimeout( this.s.stateTO );
		this.s.stateTO = setTimeout( function () {
			that.s.dtApi.state.save();
		}, 250 );

		this.s.scrollType = Math.abs(iScrollTop - this.s.lastScrollTop) > heights.viewport ?
			'jump' :
			'cont';

		this.s.topRowFloat = this.s.scrollType === 'cont' ?
			this.pixelsToRow( iScrollTop, false, false ) :
			this._domain( 'physicalToVirtual', iScrollTop ) / heights.row;

		if ( this.s.topRowFloat < 0 ) {
			this.s.topRowFloat = 0;
		}

		/* Check if the scroll point is outside the trigger boundary which would required
		 * a DataTables redraw
		 */
		if ( this.s.forceReposition || iScrollTop < this.s.redrawTop || iScrollTop > this.s.redrawBottom ) {
			var preRows = Math.ceil( ((this.s.displayBuffer-1)/2) * this.s.viewportRows );

			iTopRow = parseInt(this.s.topRowFloat, 10) - preRows;
			this.s.forceReposition = false;

			if ( iTopRow <= 0 ) {
				/* At the start of the table */
				iTopRow = 0;
			}
			else if ( iTopRow + this.s.dt._iDisplayLength > this.s.dt.fnRecordsDisplay() ) {
				/* At the end of the table */
				iTopRow = this.s.dt.fnRecordsDisplay() - this.s.dt._iDisplayLength;
				if ( iTopRow < 0 ) {
					iTopRow = 0;
				}
			}
			else if ( iTopRow % 2 !== 0 ) {
				// For the row-striping classes (odd/even) we want only to start
				// on evens otherwise the stripes will change between draws and
				// look rubbish
				iTopRow++;
			}


			if ( iTopRow != this.s.dt._iDisplayStart ) {
				/* Cache the new table position for quick lookups */
				this.s.tableTop = $(this.s.dt.nTable).offset().top;
				this.s.tableBottom = $(this.s.dt.nTable).height() + this.s.tableTop;

				var draw =  function () {
					if ( that.s.scrollDrawReq === null ) {
						that.s.scrollDrawReq = iScrollTop;
					}

					that.s.dt._iDisplayStart = iTopRow;
					that.s.dt.oApi._fnDraw( that.s.dt );
				};

				/* Do the DataTables redraw based on the calculated start point - note that when
				 * using server-side processing we introduce a small delay to not DoS the server...
				 */
				if ( this.s.dt.oFeatures.bServerSide ) {
					clearTimeout( this.s.drawTO );
					this.s.drawTO = setTimeout( draw, this.s.serverWait );
				}
				else {
					draw();
				}

				if ( this.dom.loader && ! this.s.loaderVisible ) {
					this.dom.loader.css( 'display', 'block' );
					this.s.loaderVisible = true;
				}
			}
		}
		else {
			this.s.topRowFloat = this.pixelsToRow( iScrollTop, false, true );
		}

		this.s.lastScrollTop = iScrollTop;
		this.s.stateSaveThrottle();

		if ( this.s.scrollType === 'jump' && this.s.mousedown ) {
			this.dom.label
				.html( this.s.dt.fnFormatNumber( parseInt( this.s.topRowFloat, 10 )+1 ) )
				.css( 'top', iScrollTop + (iScrollTop * heights.labelFactor ) )
				.css( 'display', 'block' );
		}
	},

	/**
	 * Force the scrolling container to have height beyond that of just the
	 * table that has been drawn so the user can scroll the whole data set.
	 *
	 * Note that if the calculated required scrolling height exceeds a maximum
	 * value (1 million pixels - hard-coded) the forcing element will be set
	 * only to that maximum value and virtual / physical domain transforms will
	 * be used to allow Scroller to display tables of any number of records.
	 *  @returns {void}
	 *  @private
	 */
	_scrollForce: function ()
	{
		var heights = this.s.heights;
		var max = 1000000;

		heights.virtual = heights.row * this.s.dt.fnRecordsDisplay();
		heights.scroll = heights.virtual;

		if ( heights.scroll > max ) {
			heights.scroll = max;
		}

		// Minimum height so there is always a row visible (the 'no rows found'
		// if reduced to zero filtering)
		this.dom.force.style.height = heights.scroll > this.s.heights.row ?
			heights.scroll+'px' :
			this.s.heights.row+'px';
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/**
 * Scroller default settings for initialisation
 *  @namespace
 *  @name Scroller.defaults
 *  @static
 */
Scroller.defaults = {
	/**
	 * Scroller uses the boundary scaling factor to decide when to redraw the table - which it
	 * typically does before you reach the end of the currently loaded data set (in order to
	 * allow the data to look continuous to a user scrolling through the data). If given as 0
	 * then the table will be redrawn whenever the viewport is scrolled, while 1 would not
	 * redraw the table until the currently loaded data has all been shown. You will want
	 * something in the middle - the default factor of 0.5 is usually suitable.
	 *  @type     float
	 *  @default  0.5
	 *  @static
	 */
	boundaryScale: 0.5,

	/**
	 * The display buffer is what Scroller uses to calculate how many rows it should pre-fetch
	 * for scrolling. Scroller automatically adjusts DataTables' display length to pre-fetch
	 * rows that will be shown in "near scrolling" (i.e. just beyond the current display area).
	 * The value is based upon the number of rows that can be displayed in the viewport (i.e.
	 * a value of 1), and will apply the display range to records before before and after the
	 * current viewport - i.e. a factor of 3 will allow Scroller to pre-fetch 1 viewport's worth
	 * of rows before the current viewport, the current viewport's rows and 1 viewport's worth
	 * of rows after the current viewport. Adjusting this value can be useful for ensuring
	 * smooth scrolling based on your data set.
	 *  @type     int
	 *  @default  7
	 *  @static
	 */
	displayBuffer: 9,

	/**
	 * Show (or not) the loading element in the background of the table. Note that you should
	 * include the dataTables.scroller.css file for this to be displayed correctly.
	 *  @type     boolean
	 *  @default  false
	 *  @static
	 */
	loadingIndicator: false,

	/**
	 * Scroller will attempt to automatically calculate the height of rows for it's internal
	 * calculations. However the height that is used can be overridden using this parameter.
	 *  @type     int|string
	 *  @default  auto
	 *  @static
	 */
	rowHeight: "auto",

	/**
	 * When using server-side processing, Scroller will wait a small amount of time to allow
	 * the scrolling to finish before requesting more data from the server. This prevents
	 * you from DoSing your own server! The wait time can be configured by this parameter.
	 *  @type     int
	 *  @default  200
	 *  @static
	 */
	serverWait: 200
};

Scroller.oDefaults = Scroller.defaults;



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Scroller version
 *  @type      String
 *  @default   See code
 *  @name      Scroller.version
 *  @static
 */
Scroller.version = "2.0.0";



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtscroller', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.scroller;
	var defaults = DataTable.defaults.scroller;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new Scroller( settings, opts  );
		}
	}
} );


// Attach Scroller to DataTables so it can be accessed as an 'extra'
$.fn.dataTable.Scroller = Scroller;
$.fn.DataTable.Scroller = Scroller;


// DataTables 1.10 API method aliases
var Api = $.fn.dataTable.Api;

Api.register( 'scroller()', function () {
	return this;
} );

// Undocumented and deprecated - is it actually useful at all?
Api.register( 'scroller().rowToPixels()', function ( rowIdx, intParse, virtual ) {
	var ctx = this.context;

	if ( ctx.length && ctx[0].oScroller ) {
		return ctx[0].oScroller.rowToPixels( rowIdx, intParse, virtual );
	}
	// undefined
} );

// Undocumented and deprecated - is it actually useful at all?
Api.register( 'scroller().pixelsToRow()', function ( pixels, intParse, virtual ) {
	var ctx = this.context;

	if ( ctx.length && ctx[0].oScroller ) {
		return ctx[0].oScroller.pixelsToRow( pixels, intParse, virtual );
	}
	// undefined
} );

// `scroller().scrollToRow()` is undocumented and deprecated. Use `scroller.toPosition()
Api.register( ['scroller().scrollToRow()', 'scroller.toPosition()'], function ( idx, ani ) {
	this.iterator( 'table', function ( ctx ) {
		if ( ctx.oScroller ) {
			ctx.oScroller.scrollToRow( idx, ani );
		}
	} );

	return this;
} );

Api.register( 'row().scrollTo()', function ( ani ) {
	var that = this;

	this.iterator( 'row', function ( ctx, rowIdx ) {
		if ( ctx.oScroller ) {
			var displayIdx = that
				.rows( { order: 'applied', search: 'applied' } )
				.indexes()
				.indexOf( rowIdx );

			ctx.oScroller.scrollToRow( displayIdx, ani );
		}
	} );

	return this;
} );

Api.register( 'scroller.measure()', function ( redraw ) {
	this.iterator( 'table', function ( ctx ) {
		if ( ctx.oScroller ) {
			ctx.oScroller.measure( redraw );
		}
	} );

	return this;
} );

Api.register( 'scroller.page()', function() {
	var ctx = this.context;

	if ( ctx.length && ctx[0].oScroller ) {
		return ctx[0].oScroller.pageInfo();
	}
	// undefined
} );

return Scroller;
}));


/*! Select for DataTables 1.3.0
 * 2015-2018 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     Select for DataTables
 * @description A collection of API methods, events and buttons for DataTables
 *   that provides selection options of the items in a DataTable
 * @version     1.3.0
 * @file        dataTables.select.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net/forums
 * @copyright   Copyright 2015-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net/extensions/select
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.select = {};

DataTable.select.version = '1.3.0';

DataTable.select.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.select;
	var defaults = DataTable.defaults.select;
	var opts = init === undefined ?
		defaults :
		init;

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var info = true;
	var selector = 'td, th';
	var className = 'selected';
	var setStyle = false;

	ctx._select = {};

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
		setStyle = true;
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
		setStyle = true;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
			setStyle = true;
		}
		else {
			style = 'os';
			setStyle = true;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.select.selector( selector );
	dt.select.items( items );
	dt.select.style( style );
	dt.select.blurable( blurable );
	dt.select.info( info );
	ctx._select.className = className;


	// Sort table based on selected rows. Requires Select Datatables extension
	$.fn.dataTable.ext.order['select-checkbox'] = function ( settings, col ) {
		return this.api().column( col, {order: 'index'} ).nodes().map( function ( td ) {
			if ( settings._select.items === 'row' ) {
				return $( td ).parent().hasClass( settings._select.className );
			} else if ( settings._select.items === 'cell' ) {
				return $( td ).hasClass( settings._select.className );
			}
			return false;
		});
	};

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( ! setStyle && $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.select.style( 'os' );
	}
};

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string     - Can be `rows`, `columns` or `cells`. Defines what item 
	                   will be selected if the user is allowed to activate row
	                   selection using the mouse.
	style:string     - Can be `none`, `single`, `multi` or `os`. Defines the
	                   interaction style when selecting items
	blurable:boolean - If row selection can be cleared by clicking outside of
	                   the table
	info:boolean     - If the selection summary should be shown in the table
	                   information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * @private
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}
		
		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	$( dt.table().container() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' + dt.table().node().id );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function enableMouseSelection ( dt )
{
	var container = $( dt.table().container() );
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;
	var matchSelection;

	container
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey || e.metaKey || e.ctrlKey ) {
				container
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}

			if ( window.getSelection ) {
				matchSelection = window.getSelection();
			}
		} )
		.on( 'mouseup.dtSelect', selector, function() {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			container.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.select.items();
			var idx;

			// If text was selected (click and drag), then we shouldn't change
			// the row's selected state
			if ( matchSelection ) {
				var selection = window.getSelection();

				// If the element that contains the selection is not in the table, we can ignore it
				// This can happen if the developer selects text from the click event
				if ( ! selection.anchorNode || $(selection.anchorNode).closest('table')[0] === dt.table().node() ) {
					if ( selection !== matchSelection ) {
						return;
					}
				}
			}

			var ctx = dt.settings()[0];
			var wrapperClass = $.trim(dt.settings()[0].oClasses.sWrapper).replace(/ +/g, '.');

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('div.'+wrapperClass)[0] != dt.table().container() ) {
				return;
			}

			var cell = dt.cell( $(e.target).closest('td, th') );

			// Check the cell actually belongs to the host DataTable (so child
			// rows, etc, are ignored)
			if ( ! cell.any() ) {
				return;
			}

			var event = $.Event('user-select.dt');
			eventTrigger( dt, event, [ items, cell, e ] );

			if ( event.isDefaultPrevented() ) {
				return;
			}

			var cellIndex = cell.index();
			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = cell.index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = cell.index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._select_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect' + dt.table().node().id, function ( e ) {
		if ( ctx._select.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Ignore elements which have been removed from the DOM (i.e. paging
			// buttons)
			if ( $(e.target).parents('html').length === 0 ) {
			 	return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * @private
 */
function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).trigger( type, args );
}

/**
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 * 
 * @param {DataTable.Api} api DataTable to update
 * @private
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._select.info || ! ctx.aanFeatures.i ) {
		return;
	}

	if ( api.select.style() === 'api' ) {
		return;
	}

	var rows    = api.rows( { selected: true } ).flatten().length;
	var columns = api.columns( { selected: true } ).flatten().length;
	var cells   = api.cells( { selected: true } ).flatten().length;

	var add = function ( el, name, num ) {
		el.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s selected', 0: '', 1: '1 '+name+' selected' },
			num
		) ) );
	};

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var output  = $('<span class="select-info"/>');
		add( output, 'row', rows );
		add( output, 'column', columns );
		add( output, 'cell', cells  );

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
}

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 * @private
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	// 
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._select_selected ) {
				$( row ).addClass( ctx._select.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._select.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function () {
		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).select();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).select();
				} );
			}
		} );
	} );

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
		info( api );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * @private
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * @private
 */
function clear( ctx, force )
{
	if ( force || ctx._select.style === 'single' ) {
		var api = new DataTable.Api( ctx );
		
		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * @private
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.select.style();
	var isSelected = dt[type]( idx, { selected: true } ).any();

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).select( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	} else if ( style == 'multi+shift' ) {
		if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			dt[ type ]( idx ).select( ! isSelected );
		}
	}
	else {
		dt[ type ]( idx ).select( ! isSelected );
	}
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected !== true && selected !== false ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._select_selected === true) ||
			     (selected === false && ! data._select_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
		     (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'select()', function () {
	return this.iterator( 'table', function ( ctx ) {
		DataTable.select.init( new DataTable.Api( ctx ) );
	} );
} );

apiRegister( 'select.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.blurable = flag;
	} );
} );

apiRegister( 'select.info()', function ( flag ) {
	if ( info === undefined ) {
		return this.context[0]._select.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.info = flag;
	} );
} );

apiRegister( 'select.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._select.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'select.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._select.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.style = style;

		if ( ! ctx._select_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );
		
		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'select.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._select.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._select.selector = selector;

		if ( ctx._select.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );



apiRegisterPlural( 'rows().select()', 'row().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'row', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoData[ idx ]._select_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().select()', 'column().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._select_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._select.className );
		$( column.footer() ).addClass( ctx._select.className );

		column.nodes().to$().addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().select()', 'cell().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'cell', api[i] ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._select_selected = false;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._select_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._select.className );
		$( column.footer() ).removeClass( ctx._select.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._select.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._select_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

// Common events with suitable namespaces
function namespacedEvents ( config ) {
	var unique = config._eventNamespace;

	return 'draw.dt.DT'+unique+' select.dt.DT'+unique+' deselect.dt.DT'+unique;
}

function enabled ( dt, config ) {
	if ( $.inArray( 'rows', config.limitTo ) !== -1 && dt.rows( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'columns', config.limitTo ) !== -1 && dt.columns( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'cells', config.limitTo ) !== -1 && dt.cells( { selected: true } ).any() ) {
		return true;
	}

	return false;
}

var _buttonNamespace = 0;

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		limitTo: [ 'rows', 'columns', 'cells' ],
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( namespacedEvents(config), function () {
				that.enable( enabled(dt, config) );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.select.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		},
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count > 0 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'select'+item+'s' ] = {
		text: i18n( 'select'+item+'s', 'Select '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'preInit.dt.dtSelect', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	DataTable.select.init( new DataTable.Api( ctx ) );
} );


return DataTable.select;
}));


