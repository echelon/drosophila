/**
 * Dialog
 * Wraps jQuery UI's dialog functionality and adapts it to our purposes
 * in creating new parentals.
 */
function Dialog(sex)
{
	var that = this;

	// Intialize unique id counter.
	if(!Dialog.id) { Dialog.id = 1; };

	/**
	 * ID of the dialog.
	 */
	this.id = Dialog.id++;

	/**
	 * Add #dialog{ID} to a css selector.
	 */
	this.select = function(s) { return '#dialog' + this.id + ' ' + s; };

	/**
	 * Type of dialog.
	 */
	this.sex = 'f';
	this.action = null; // 'create' or 'edit'.

	/**
	 * The tempory genotype that we work with.
	 * Acts as a buffer for the actual History.curGeneration.mother/etc
	 */
	this.tempGenotype = null;

	/**
	 * The currently selected trait and allele in the allele builder.
	 */
	this.selectedTrait = null;
	this.selectedAllele = null;

	/**
	 * All of the alleles thus far added.
	 */
	this.alleles = [];

	/**
	 * The jQuery dialog object.
	 */
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
			'Save': function() { that.saveAndClose(); },
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
	 * Form and Event Callbacks.
	 */
	$(this.select('.trait')).bind('change', function() { that.traitSelected(); });
	$(this.select('.allele')).bind('change', function() { that.alleleSelected(); });
	$(this.select('.designer_form_add_allele')).bind('submit', function() {
			that.alleleSubmitted();
			return false; // Prevents submit
	});

};

