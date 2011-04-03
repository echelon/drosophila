/**
 * Dialog
 * Wraps jQuery UI's dialog functionality and adapts it to our purposes
 * in creating new parentals.
 */
function Dialog(sex)
{
	var that = this;

	/**
	 * Type of dialog.
	 */
	this.sex = 'f';
	
	this.curAction = null; // 'create' or 'edit'.

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
	this.dialog = $.tmpl('create'); // TODO: Bind variables. 
	this.dialog.dialog({
		autoOpen: false,
		modal: true,
		title: 'UNTITLED MODAL DIALOG',
		width: 700,
		height: 400,
		draggable: false,
		resizable: false,
		close: function(event, ui) { that.onClose(); },
		buttons: { 
			'Save': function() { that.save(); },
			Cancel: function() { that.cancel(); }
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
	$('.trait').bind('change', function() { that.traitSelected(); });
	$('.allele').bind('change', function() { that.alleleSelected(); });
	$('.designer_form_add_allele').bind('submit', function() {
			that.alleleSubmitted();
			return false; // Prevents submit
	});

	/* ====================== JQUERY UI API =========================== */

	/**
	 * Called to open the dialog. 
	 * Loads the proper state (create or edit) for the current action. 
	 */
	this.open = function()
	{
		var genoSrc, setStateFor;
		var that = this;

		// Function: Set the dialog edit state for the source genotype.
		setStateFor = function(src)
		{
			var tMap, alleles, abbr;

			if(!src) {
				that.action = 'create';
				that.tempGenotype = new Genotype();
				that.tempGenotype.sex = that.sex;
				that.selectedTrait = null;
				that.selectedAllele = null;
				that.alleles = [];
				that.setTitle('Create ' + that.tempGenotype.getSexStr(true));
				return;
			};

			that.action = 'edit';
			that.tempGenotype = src.copy();
			that.selectedTrait = null;
			that.selectedAllele = null;
			that.setTitle('Edit ' + that.tempGenotype.getSexStr(true));

			// Load the alleles
			tMap = src.traitAlleleMap();
			alleles = [];
			for(abbr in tMap) {
				alleles.push(tMap[abbr]);
			};
			that.alleles = alleles;
		};

		if(this.sex == 'f') {
			setStateFor(Reg.getHistory().curGeneration.mother);
		}
		else {
			setStateFor(Reg.getHistory().curGeneration.father);
		};

		// Set title

		// Initialize the UI
		alert('Initialize UI'); // XXX XXX TEMP
		this.buildTraitSelect();
		this.updateGenotype();
		this.updateImage();
		this.updateImageSubtitle();
		this.updateFeed();

		this.dialog.dialog('open');
	};


	this.close = function() 
	{ 
		this.dialog.dialog('close');
	};

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


	/* ====================== MANAGE STATE & CLOSE ==================== */

	// TODO: Incomplete
	this.save = function()
	{
		this.close();
	};

	/**
	 * Cancels the 'create' or 'edit' action. 
	 * Makes no change to the current generation state.
	 */
	this.cancel = function()
	{
		// TODO: Incomplete
		this.alleles = [];	
		this.selectedTrait = null;
		this.selectedAllele = null;
		//this.tempGenotype = null;

		this.close();
	};

	/* ====================== BUILD & ENABLE ========================== */

	/**
	 * Build the Trait <select> input dropdown.
	 */
	this.buildTraitSelect= function()
	{
		var traits = Reg.getTraits();
		var options = "<option disabled=\"true\" selected=\"true\">TRAIT</option>"; 

		// Function to make <option> tag. 
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

		// Function to make <option> tag. 
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
	 * Enable submit button.
	 */
	this.enableSubmit = function()
	{
		$('.trait_allele_submit').attr('disabled', '');
	};

	/* ====================== DISABLE PARTS OF FORM =================== */

	/**
	 * Disable Allele selection. 
	 */
	this.disableAlleleSelect= function()
	{
		var opts = '<option disabled="true" selected="true">Allele</option>';
		var select = $('.allele')
		select.empty()
		select.html(opts);
		select.attr('disabled', 'disabled'); // disable
	};

	/**
	 * Disable submit button.
	 */
	this.disableSubmit = function()
	{
		$('.trait_allele_submit').attr('disabled', 'disabled');
	};

	/* ====================== CALLBACK ================================ */

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

	/**
	 * CALLBACK
	 * When the form is submitted.
	 */
	this.alleleSubmitted = function()
	{
		// Add allele
		if(this.selectedAllele) {
			var replaced = false;
			for(var i = 0; i < this.alleles.length; i++) {
				if(this.alleles[i].trait.abbr == this.selectedAllele.trait.abbr) {
					this.alleles[i] = this.selectedAllele;
					replaced = true;
					break;
				};
			};
			if(!replaced) {
				this.alleles.push(this.selectedAllele);
			}
		}
		alert('allele submitted'); // XXX XXX TEMP
		this.updateGenotype();
		this.resetForm();
		this.updateFeed();
		this.updateImageSubtitle();
	};

	this.onClose = function()
	{
		// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO 
		// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO 
		// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO 
		// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO 
		// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO 
		// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO 
	};

	/* ====================== DIALOG STATE ============================ */

	/**
	 * Reset the form to its default state.
	 */
	this.resetForm = function()
	{
		this.buildTraitSelect();
		this.disableAlleleSelect();
		this.disableSubmit();

		this.selectedTrait = null;
		this.selectedAllele = null;
	};

	/**
	 * Update the genotype
	 * TODO TODO TODO: Remove?
	 */
	this.updateGenotype = function()
	{
		alert(this.tempGenotype) // XXX: Why is this failing? TODO
		assert((this.tempGenotype), 'Dialog.updateGenotype -- no genotype!');

		for(var i = 0; i < this.alleles.length; i++) {
			this.tempGenotype.setHomozygousFor(this.alleles[i]);
		};
	};

	/**
	 * Set the image.
	 */
	this.updateImage = function()
	{
		var imgDiv = $('.designer_img');
		var img = '<img width="150" height="125" ';

		if(this.tempGenotype.getSex() == 'm') {
			img += 'src="./img/blue-grad.png" />';
		}
		else {
			img += 'src="./img/red-grad.png" />';
		};

		imgDiv.html(img);
	}
	
	/**
	 * Update the image subtitle.
	 */
	this.updateImageSubtitle = function()
	{
		var subtitle = $('.designer_img_subtitle');
		var phenotype = this.tempGenotype.getPhenotype();
		subtitle.text(phenotype.phenotypeString());
	};

	/**
	 * Update the "feed" of added alleles.
	 */
	this.updateFeed = function()
	{
		var text = "<ul>\n";

		// Traverse list backwards.
		for(var i = this.alleles.length - 1; i >= 0; i--) {
			var allele = this.alleles[i];
			text += "<li>" + allele.trait.name + " &gt; <em>";
			text += allele.name + "</em></li>\n";
		};

		if(!this.alleles.length) {
			text += "<li>All traits are WT by default.</li>\n</ul>\n";
		}
		else {
			text += "<li>All other traits are WT by default.</li>\n</ul>\n";
		};

		$('.designer_history_feed').html(text);
	};

	// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO     
	// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO     
	// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO     
	// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO     
	
	/**
	 * CALLBACK
	 * We're done creating. Make the genotype and exit.
	 */
	this.onCompleteSubmit = function()
	{
		var history = Reg.getHistory();

		//this.updateGenotype();

		// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO

	};
};

