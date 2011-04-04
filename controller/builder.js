/**
 * TODO DOC
 */

/**
 * Builder Constructor.
 */
function Builder(sex)
{
	Dialog.call(this, sex);
	
	var that = this;

	// Action we're performing: 'create' or 'edit'
	this.action = null;

	// The temporary genome that we work with.
	// Acts as a buffer for the actual History.curGeneration.[parent]
	this.tempGenotype = null;

	// The currently selected trait and allele in the allele builder.
	this.selectedTrait = null;
	this.selectedAllele = null;

	// All of the alleles thus far added.
	this.alleles = [];

	// jQuery UI dialog buttons
	this.dialog.dialog('option', 'buttons', [
		{
			text: 'Save',
			click: function() { that.saveAndClose(); }
		},
		{
			text: 'Cancel',
			click: function() { that.close(); }
		}
	]);

	// Form Event Callbacks
	$(this._select('.trait')).bind('change', function() { that.traitSelected(); });
	$(this._select('.allele')).bind('change', function() { that.alleleSelected(); });
	$(this._select('.designer_form_add_allele')).bind('submit', function() {
			that.alleleSubmitted();
			return false; // Prevents submit
	});

	/* ====================== JQUERY UI API =========================== */

	/**
	 * PROTECTED
	 * Called Automatically prior to opening.
	 * Loads the proper state (create or edit) for the current action. 
	 */
	this._beforeOpen = function()
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

		// Initialize the UI
		this.buildTraitSelect();
		this.updateTempGenotype();
		this.updateImage();
		this.updateImageSubtitle();
		this.updateFeed();
	};

	/* ====================== MANAGE STATE & CLOSE ==================== */

	/**
	 * Save the individual to the current generation model and then
	 * close the dialog.
	 */
	this.saveAndClose = function()
	{
		if(this.sex == 'f') {
			Reg.getHistory().curGeneration.mother = this.tempGenotype.copy();
		}
		else {
			Reg.getHistory().curGeneration.father = this.tempGenotype.copy();
		};

		// XXX: Signal main UI of closure.
		$('#main').trigger('rebuildGen');

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

		var select = $(this._select('.trait'));
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

		var select = $(this._select('.allele'))
		select.empty()
		select.html(options);
		select.attr('disabled', ''); // enable
	};

	/**
	 * Enable submit button.
	 */
	this.enableSubmit = function()
	{
		$(this._select('.trait_allele_submit')).attr('disabled', '');
	};

	/* ====================== DISABLE PARTS OF FORM =================== */

	/**
	 * Disable Allele selection. 
	 */
	this.disableAlleleSelect= function()
	{
		var opts = '<option disabled="true" selected="true">Allele</option>';
		var select = $(this._select('.allele'))
		select.empty()
		select.html(opts);
		select.attr('disabled', 'disabled'); // disable
	};

	/**
	 * Disable submit button.
	 */
	this.disableSubmit = function()
	{
		$(this._select('.trait_allele_submit')).attr('disabled', 'disabled');
	};

	/* ====================== CALLBACK ================================ */

	/**
	 * CALLBACK
	 * When a trait is selected, record it. Also enable allele 
	 * selection.
	 */
	this.traitSelected = function()
	{
		var abbr = $(this._select('.trait option:selected')).attr('value');
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
		var abbr = $(this._select('.allele option:selected')).attr('value');
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
		this.updateTempGenotype();
		this.resetForm();
		this.updateFeed();
		this.updateImageSubtitle();
	};

	/**
	 * CALLBACK
	 * When the entire modal dialog is closed.
	 */
	this.onClose = function()
	{
		this.alleles = [];
		this.selectedTrait = null;
		this.selectedAllele = null;
		this.tempGenotype = null;
		this.action = '';
		this.setTitle('Untitled');
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
	 * Update the temporary genotype
	 */
	this.updateTempGenotype = function()
	{
		assert((this.tempGenotype), 
				'Builder.updateTempGenotype(): no genotype!');

		for(var i = 0; i < this.alleles.length; i++) {
			this.tempGenotype.setHomozygousFor(this.alleles[i]);
		};
	};

	/**
	 * Set the image.
	 */
	this.updateImage = function()
	{
		var imgDiv = $(this._select('.designer_img'));
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
		var subtitle = $(this._select('.designer_img_subtitle'));
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

		$(this._select('.designer_history_feed')).html(text);
	};
};

// XXX/TODO: I really don't get Prototype inheritance... 
// Keeping the following line seems to introduce a bug (as documented
// in the git logs). And why didn't mixed inheritance work?
//Builder.prototype = new Dialog();
Builder.prototype.constructor = Builder;


