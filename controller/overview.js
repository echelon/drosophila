
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
	 * Setup.
	 * First initialization, before Attachment or Show().
	 */
	this.setup = function()
	{
		if(this.isSetup) {
			return;
		}
		this.isSetup = true;

		var generations = Reg.getHistory().generations;

		var dom = $.tmpl('overview', {
				generations: generations,
				testfunc: function() { return 'asdf'; }
		});

		var prevGens = $.tmpl('overview_prev_generations')
		
		dom.appendTo('#main');
		prevGens.appendTo('.overview_main .accordion');

		//
		// Accordion Layout
		//

		// Activate accordion after show to get correct height.
		$('.accordion').accordion();
		$('.accordion').accordion('option', 'animated', 'slide');
		$('.accordion').accordion('option', 'collapsible', true);

		// More options to help height...
		$('.accordion').accordion('option', 'clearStyle', true);
		//this.overviewDom.find('.accordion').accordion('option', 'active', false);
		$('.accordion').accordion('option', 'active', (this.numSections-1));

		//
		// Tabs
		//

		$('.tabs').tabs();

		// Older generations
		/*for(var i = 0; i < generations.length; i++)
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
			var phenMap = children.phenotypeMap();
			var out = "<ul>\n";
			for(var hash in phenMap) {
				out += "<li>";
				out += phenMap[hash].phenotype.phenotypeString();
				out += " &mdash; ";
				out += phenMap[hash].count;
				out += "</li>\n";
			};
			out += "</ul>\n";

			phenMap = children.phenotypeWithoutSexMap();
			out += "<ul>\n";
			for(var hash in phenMap) {
				out += "<li>";
				out += phenMap[hash].phenotype.phenotypeWithoutSexString();
				out += " &mdash; ";
				out += phenMap[hash].count;
				out += "</li>\n";
			};
			out += "</ul>";


			dom.find('.overview_children_placeholder').html(out);

			html += dom.html();
			this.numSections++;
		};*/

		// New generation.
		/*dom = DomReg.overviewParentsNew();
		dom.find('h3 a').html('Next Cross (#' + (this.numSections+1) + ")");
		html += dom.html();
		this.numSections++;

		this.overviewDom.find('.accordion').html(html);*/

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
	 * Show DOM 
	 * Happens after 'Setup' and 'Attach'.
	 */
	this.show = function() 
	{ 
	};

	/**
	 * Hide DOM
	 */
	this.hide = function() { this.overviewDom.hide(); };

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

