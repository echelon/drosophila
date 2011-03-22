
/**
 * The "Main GUI"
 * TODO
 */
function Overview()
{
	this.overviewDom = DomReg.overview();
	this.attached = false;
	
	// Keep count of accordion sections
	this.numSections = 0;

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
		this.overviewDom.find('.accordion').accordion('option', 'animated', 'slide');
		this.overviewDom.find('.accordion').accordion('option', 'collapsible', true);

		// More options to help height...
		this.overviewDom.find('.accordion').accordion('option', 'clearStyle', true);
		//this.overviewDom.find('.accordion').accordion('option', 'active', false);
		this.overviewDom.find('.accordion').accordion('option', 'active', (this.numSections-1));
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
		var dom = null;

		// Older generations
		for(var i = 0; i < generations.length; i++)
		{
			var gen = generations[i];
			var children = generations[i].children;

			dom = DomReg.overviewParentsOld();

			// Handle parents, title
			dom.find('h3 a').html('Cross #' + (i+1));
			dom.find('.overview_parents_male').find('.status') 
						.html(gen.parents.m.getPhenotype().phenotypeString());
			dom.find('.overview_parents_female').find('.status')
						.html(gen.parents.f.getPhenotype().phenotypeString());

			// Handle children --  TODO: Poor interface.
			var out = "<ul>\n";
			for(var hash in children.indivs) {
				var bin = children.indivs[hash];
				out += "<li>";
				out += bin.genotype.getPhenotype().phenotypeString();
				out += " &mdash; ";
				out += bin.count;
				out += "</li>\n";
			};
			out += "</ul>";

			dom.find('.overview_children_placeholder').html(out);

			html += dom.html();
			this.numSections++;
		};

		// New generation.
		dom = DomReg.overviewParentsNew();
		dom.find('h3 a').html('Next Cross (#' + (this.numSections+1) + ")");
		html += dom.html();
		this.numSections++;

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

