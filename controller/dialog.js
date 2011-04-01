
/**
 * The type of dialog we're opening.
 */
var DialogType = {
	NEW_MALE : 1,
	NEW_FEMALE: 2,
	EDIT : 3
	// TODO: Select previous generation.
};

/**
 * Dialog
 * Wraps jQuery UI's dialog functionality and adapts it to our purposes
 * in creating new parentals.
 */
function Dialog(dialogType, genotype)
{
	var that = this;

	/**
	 * Type of dialog.
	 */
	this.dialogType = dialogType;

	/**
	 * Current genotype pointer.
	 */
	this.genotype = null;

	/**
	 * The currently selected trait and allele in the allele builder.
	 */
	this.selectedTrait = null;
	this.selectedAllele = null

	/**
	 * The jQuery dialog object.
	 */
	this.dialog = $.tmpl('create'); // TODO: Bind variables. 
	this.dialog.dialog({
		autoOpen: false,
		modal: true,
		title: 'Untitled',
		width: 700,
		height: 400,
		draggable: false,
		resizable: false,
		buttons: { 
			'Use as parent': function() { $(this).dialog("close"); }, // TODO: Not general enough
			Cancel: function() { that.close(); }
		}
	});

	//
	// XXX CONSTRUCT XXX
	//
	
	// Set genotype pointer
	switch(dialogType) {
		case DialogType.NEW_MALE:
			this.genotype = new Genotype();
			this.genotype.setSex('m');
			break;
		case DialogType.NEW_FEMALE:
			this.genotype = new Genotype();
			this.genotype.setSex('f');
			break;
		case DialogType.EDIT:
			this.genotype = genotype;
	};
	
	// Form callbacks.
	$('.trait').bind('change', function() { that.traitSelected(); });
	$('.allele').bind('change', function() { that.alleleSelected(); });
	$('.designer_form_add_allele').bind('submit', function() {
			that.onAlleleSubmit();
			return false; // Prevents submit
	});
	$('.designer_form_complete').bind('submit', function() {
			that.onCompleteSubmit();
			return false; // Prevents submit
	});


	//
	// XXX METHODS XXX
	//

	/**
	 * Build the Trait <select> input dropdown.
	 */
	this.buildTraitSelect= function()
	{
		var traits = Reg.getTraits();
		var options = "<option disabled=\"true\" selected=\"true\">TRAIT</option>"; 

		// Make <option> tag. 
		var makeOption = function(text, val) {
			return "<option value=\"" + val + "\">" + text + "</option>\n";
		}

		for(var i = 0; i < traits.length; i++) {
			var trait = traits[i];
			var opt = makeOption(trait.name, trait.abbr);
			options += opt;
		}

		var select = $('.trait');
		
		select.empty();
		select.html(options);
		select.attr('disabled', ''); // enable
	};

	/**
	 * Build the Allele <select> input dropdown.
	 */
	this.buildAlleleSelect = function()
	{
		if(!this.selectedTrait) {
			return false;
		}

		var alleles = this.selectedTrait.getAlleles();
		var options = "<option disabled=\"true\" selected=\"true\">Allele</option>"; 

		// Make <option> tag. 
		var makeOption = function(text, val) {
			return "<option value=\"" + val + "\">" + text + "</option>\n";
		}

		for(var i = 0; i < alleles.length; i++) {
			var allele = alleles[i];
			var opt = makeOption(allele.name, allele.code);
			options += opt;
		}

		var select = $('.allele')
		select.empty()
		select.html(options);
		select.attr('disabled', ''); // enable
	};

	/**
	 * Disable Allele selection. 
	 */
	this.disableAlleleSelect= function()
	{
		var options = "<option disabled=\"true\" selected=\"true\">Allele</option>"; 
		var select = $('.allele')
		select.empty()
		select.html(options);
		select.attr('disabled', 'disabled'); // disable
	};

	/**
	 * CALLBACK
	 * When a trait is selected, record it. Also enable allele 
	 * selection.
	 */
	this.traitSelected = function()
	{
		var abbr = $('.trait option:selected').attr('value');
		var trait = Reg.getTrait(abbr);
		var prevTrait = this.selectedTrait;

		this.selectedTrait = trait;

		// Do we have to regenerate alleles? 
		if(!prevTrait || prevTrait.abbr != trait.abbr) {
			this.selectedAllele = null;
			this.buildAlleleSelect();
			this.disableSubmit();
		};
	};

	/**
	 * CALLBACK
	 * When an allele is selected, record it. Also enable the submit 
	 * button.
	 */
	this.alleleSelected = function()
	{
		var abbr = $('.allele option:selected').attr('value');
		var allele = Reg.getAllele(abbr);
		
		this.selectedAllele = allele;
		this.enableSubmit();
	};


	// XXX XXX XXX 
	//
	//





	/**
	 * Manage the dialog window. 
	 */
	this.open = function()
	{
		this.buildTraitSelect();
		this.dialog.dialog('open');
	};

	this.close = function() { this.dialog.dialog('close'); };

	/**
	 * Additional management of dialog window.
	 */
	this.enable = function() { this.dialog.dialog('enable'); };
	this.disable = function() { this.dialog.dialog('disable'); };
	this.destroy = function() { this.dialog.dialog('destroy'); };

	/**
	 * Manage the dialog options.
	 */
	this.getTitle = function() { return this.dialog.dialog('option', 'title'); };
	this.setTitle = function(t) { this.dialog.dialog('option', 'title', t); };

	/**
	 * If the dialog is open.
	 */
	this.isOpen = function() { return this.dialog.dialog('isOpen'); };

};

