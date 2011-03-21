
function Form(genotype, sex)
{
	this.genotype = genotype || null;
	this.sex = sex || null;
	this.isNew = (genotype)? false : true;
	this.formDom = DomReg.getForm();
	this.attached = false;
	this.isSetup = false;

	/**
	 * The currently selected trait and allele
	 */
	this.selectedTrait = null;
	this.selectedAllele = null;

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
	 * Enable submit button.
	 */
	this.enableSubmit = function()
	{
		this.formDom.find('.submit').attr('disabled', '');
	};

	/**
	 * Disable submit button.
	 */
	this.disableSubmit = function()
	{
		this.formDom.find('.submit').attr('disabled', 'disabled');
	};

	/**
	 * Set the image.
	 */
	this.setImage = function()
	{
		var imgDiv = this.formDom.find('.img');
		if(this.genotype.getSex() == 'm') {
			imgDiv.html("<img src=\"./img/blue-grad.png\" />");
		}
		else {
			imgDiv.html("<img src=\"./img/red-grad.png\" />");
		};
	}

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

