/**
 * Dialog
 * Wraps jQuery UI's dialog functionality and adapts it to our purposes
 * in creating new parentals.
 */

/**
 * Dialog Constructor.
 */
function Dialog(sex)
{
	var that = this;

	// Intialize unique id counter.
	if(!Dialog.id) { Dialog.id = 1; };

	// Unique ID for the dialog
	this.id = Dialog.id++;

	// Sex we're working with.
	this.sex = 'f';

	// The jQuery dialog object.
	this.dialog = $.tmpl('create', {id:this.id});
	this.dialog.dialog({
		autoOpen: false,
		modal: true,
		title: 'Untitled',
		width: 700,
		height: 400,
		draggable: false,
		resizable: false,
		close: function(event, ui) { that.onClose(); },
		buttons: { 
			/*'Save': function() { that.saveAndClose(); },*/
			Cancel: function() { that.close(); }
		}
	});

	var parseSex = function(s) {
		switch(s.toLowerCase()) {
			case 'f':
				return 'f';
			case 'm': 
				return 'm';
		};
		return 'f';
	};

	this.sex = parseSex(sex);

	/**
	 * Called to open the dialog. 
	 * Loads the proper state (create or edit) for the current action. 
	 */
	this.open = function()
	{
		this._beforeOpen();
		this.dialog.dialog('open');
	};

	/**
	 * PROTECTED
	 * Setup to do before opening. 
	 */
	this._beforeOpen = function() {};

	/**
	 * Close the Dialog.
	 * Fires the onClose() callback.
	 */
	this.close = function() { this.dialog.dialog('close'); };

	/**
	 * CALLBACK
	 * When the modal dialog is closed.
	 */
	this.onClose = function() {};

	/**
	 * Misc jQuery UI controls.
	 */
	this.getTitle = function() { return this.dialog.dialog('option', 'title'); };
	this.setTitle = function(t) { this.dialog.dialog('option', 'title', t); };
	this.isOpen = function() { return this.dialog.dialog('isOpen'); };

	/**
	 * PROTECTED
	 * Helper function: adds #dialogId to a css selector.
	 */
	this._select = function(s) { return '#dialog' + this.id + ' ' + s; };
};

