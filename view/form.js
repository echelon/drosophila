
function Form(genotype, sex)
{
	this.genotype = genotype || null;
	this.sex = sex || null;
	this.isNew = (genotype)? false : true;

	/**
	 * DOM of the form.
	 */
	this.formDom = DomReg.getForm();
	this.attached = false;
	this.isSetup = false;

	/**
	 * The currently selected trait and allele
	 */
	this.selectedTrait = null;
	this.selectedAllele = null;

	/**
	 * The alleles we've added.
	 */
	this.alleles = [];

	/**
	 * Simple present.
	 */
	this.present = function() { DomReg.present(this); };

	/**
	 * Show / Hide controls.
	 */
	this.show = function() { this.formDom.show(); };
	this.hide = function() { this.formDom.hide(); };

	/**
	 * Setup.
	 */
	this.setup = function()
	{
		var that = this;

		if(this.isSetup) {
			return;
		}
		this.isSetup = true;

		if(!this.genotype) {
			this.genotype = new Genotype();
			this.genotype.setSex(this.sex);
		};

		// "Return to Overview" callback.
		this.formDom.find('.overview').bind('click', function() { 
				var overview = new Overview();
				overview.present();
		});

		// Form callbacks.
		this.formDom.find('.trait').bind('change', function() { 
				that.traitSelected(); 
		});
		this.formDom.find('.allele').bind('change', function() { 
				that.alleleSelected(); 
		});
		this.formDom.find('.designer_form_add_allele').bind('submit', function() {
				that.onAlleleSubmit();
				return false; // Prevents submit
		});
		this.formDom.find('.designer_form_complete').bind('submit', function() {
				that.onCompleteSubmit();
				return false; // Prevents submit
		});

		// Set title.
		if(this.isNew) {
			var val = 'Build new ';
			val += (this.genotype.getSex() == 'm')? 'male' : 'female';
			this.formDom.find('.location').html(val);
		}
		else {
			// TODO
		};

		this.buildTraitSelect();
		this.setImage();
		this.updateSubtitle();
	};

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

		var select = this.formDom.find('.trait');
		
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

		var select = this.formDom.find('.allele')
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
		var select = this.formDom.find('.allele')
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
		var abbr = this.formDom.find('.trait option:selected').attr('value');
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
		var abbr = this.formDom.find('.allele option:selected').attr('value');
		var allele = Reg.getAllele(abbr);
		
		this.selectedAllele = allele;
		this.enableSubmit();
	};

	/**
	 * CALLBACK
	 * When the form is submitted.
	 */
	this.onAlleleSubmit = function()
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
		this.updateGenotype();
		this.resetForm();
		this.updateFeed();
		this.updateSubtitle();
	};

	/**
	 * CALLBACK
	 * We're done creating. Make the genotype and exit.
	 */
	this.onCompleteSubmit = function()
	{
		var history = Reg.getHistory();
		var overview = new Overview();

		this.updateGenotype();
		history.parents[this.genotype.getSex()] = this.genotype;

		overview.present(); // XXX: This object is now distructed.
	};
	

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
	 * Update the "feed" of added alleles.
	 */
	this.updateFeed = function()
	{
		var text = "<ul>\n";
		for(var i = this.alleles.length - 1; i >= 0; i--) {
			var allele = this.alleles[i];
			text += "<li>" + allele.trait.name + " &gt; <em>";
			text += allele.name + "</em></li>\n";
		};

		text += "<li>All other traits are WT by default.</li>\n</ul>\n";
		this.formDom.find('.designer_history_feed').html(text);
	}

	/**
	 * Update the genotype
	 */
	this.updateGenotype = function()
	{
		for(var i = 0; i < this.alleles.length; i++) {
			this.genotype.setHomozygousFor(this.alleles[i]);
		};
	};

	/**
	 * Enable submit button.
	 */
	this.enableSubmit = function()
	{
		this.formDom.find('#designer_form_add_allele_submit').attr('disabled', '');
	};

	/**
	 * Disable submit button.
	 */
	this.disableSubmit = function()
	{
		this.formDom.find('#designer_form_add_allele_submit').attr('disabled', 'disabled');
	};

	/**
	 * Set the image.
	 */
	this.setImage = function()
	{
		var imgDiv = this.formDom.find('.designer_img');
		if(this.genotype.getSex() == 'm') {
			imgDiv.html("<img src=\"./img/blue-grad.png\" />");
		}
		else {
			imgDiv.html("<img src=\"./img/red-grad.png\" />");
		};
	}
	
	/**
	 * Update the image subtitle.
	 */
	this.updateSubtitle = function()
	{
		var subtitle = this.formDom.find('.designer_img_subtitle');
		var phenotype = this.genotype.getPhenotype();
		subtitle.text(phenotype.phenotypeString());
	};

	/**
	 * Attach to main.
	 */
	this.attach = function()
	{
		var main = DomReg.getMain();
		if(this.attached) {
			return;
		};
		main.append(this.formDom)		
		this.attached = true;
	};

	/**
	 * Detach from main.
	 */
	this.detach = function()
	{
		var main = DomReg.getMain();
		if(!this.attached) {
			return;
		};
		main.empty();
		this.attached = false;
	};

	// TODO: DELETE.

};

