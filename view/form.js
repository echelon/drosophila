
function Form(genotype)
{
	this.genotype = genotype || null;
	this.isNew = (genotype)? false : true;
	this.formDom = DomReg.getForm();
	this.attached = false;
	this.isSetup = false;

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
		if(this.isSetup) {
			return;
		}
		this.isSetup = true;

		// New individual callback.
		this.formDom.find('.overview').bind('click', function() { 
				var overview = new Overview();
				overview.present();
		});
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
		if(!this.attached) {
			return;
		};
		// TODO
		this.attached = false;
	};

	// TODO: DELETE.

};

