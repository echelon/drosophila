
/**
 * The "Main GUI"
 * TODO
 */
function Overview()
{
	this.overviewDom = DomReg.getOverview();
	this.attached = false;

	/**
	 * Simple present.
	 */
	this.present = function() 
	{ 
		DomReg.present(this); 
	};

	/**
	 * Show / Hide controls.
	 */
	this.show = function() { this.overviewDom.show(); };
	this.hide = function() { this.overviewDom.hide(); };

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
		this.overviewDom.find('.new').bind('click', function() { 
				var form = new Form();
				form.present();
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
		main.append(this.overviewDom)		
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

	// TODO: DELETE, etc.

};

