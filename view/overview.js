
/**
 * The "Main GUI"
 * TODO
 */
function Overview()
{
	this.overviewDom = DomReg.overview();
	this.attached = false;

	/**
	 * Simple present.
	 */
	this.present = function() 
	{ 
		DomReg.present(this); 
	};

	/**
	 * Show DOM 
	 */
	this.show = function() 
	{ 
		this.overviewDom.show(); 

		// Activate accordion after show to get correct height.
		this.overviewDom.find('.accordion').accordion();
		this.overviewDom.find('.accordion').accordion("option", "animated", "slide");
		this.overviewDom.find('.accordion').accordion("option", "collapsible", true);
		//$("#accordion").accordion({ icons: { 'header': 'ui-icon-plus', 
		//			'headerSelected': 'ui-icon-minus' } });
	};

	/**
	 * Hide DOM
	 */
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

		var generations = Reg.getHistory().generations;
		var html = '';

		for(var i = 0; i < generations.length; i++)
		{
			var gen = generations[i];
			var dom = DomReg.overviewParentsOld();
			var maleDom = dom.find('.overview_parents_male');
			var femaleDom = dom.find('.overview_parents_female');

			dom.find('h3 a').html('Cross #' + (i+1));
			maleDom.find('.status').html(gen.parents.m.getPhenotype().phenotypeString());
			femaleDom.find('.status').html(gen.parents.f.getPhenotype().phenotypeString());

			html += dom.html();
		};

		this.overviewDom.find('.accordion').html(html);

		/*// New individual callback.
		this.overviewDom.find('.new_male').bind('click', function() { 
				var form = new Form(false, 'm');
				form.present();
		});
		this.overviewDom.find('.new_female').bind('click', function() { 
				var form = new Form(false, 'f');
				form.present();
		});

		// Update
		this.updateParents();*/
	};

	/**
	 * Update the parents in each section.
	 * Image, text, etc.
	 */
	this.updateParents = function()
	{
		var parents = Reg.getHistory().parents;
		var maleDom = this.overviewDom.find('.overview_parents_male');
		var femaleDom = this.overviewDom.find('.overview_parents_female');

		if(parents['m']) {
			maleDom.find('.status').html(parents['m'].getPhenotype().phenotypeString());
			maleDom.find('.new_link').hide();
		}
		else {
			maleDom.find('.status').html('');
			maleDom.find('.edit_link').hide();
		};

		if(parents['f']) {
			femaleDom.find('.status').html(parents['f'].getPhenotype().phenotypeString());
			femaleDom.find('.new_link').hide();
		}
		else {
			femaleDom.find('.status').html('');
			femaleDom.find('.edit_link').hide();
		};
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
		var main = DomReg.getMain();
		if(!this.attached) {
			return;
		};
		main.empty();
		this.attached = false;
	};

	// TODO: DELETE, etc.

};

