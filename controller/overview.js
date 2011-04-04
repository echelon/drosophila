/**
 * The "Main GUI"
 * TODO
 */
function Overview()
{
	var that = this;

	this.dialogA = new Builder('m');
	this.dialogB = new Builder('f');
	this.selectorA = new Selector('m');
	this.selectorB = new Selector('f');

	$('#main').bind('rebuildLayout', function() { that.rebuildLayout(); });
	$('#main').bind('rebuildGen', function() { that.rebuildCurrentGen(); });

	/**
	 * TODO DOC
	 */
	this.show = function() 
	{ 
		this.rebuildLayout();
	};

	/**
	 * CALLBACK
	 * On Cross submit, perform the cross and rebuild the layout.
	 */
	this.onCross = function()
	{
		var hist, male, female, gen;

		hist = Reg.getHistory();
		female = hist.curGeneration.mother;
		male = hist.curGeneration.father;

		if(!male || !female) {
			return;
		};

		hist.curGeneration = female.recombine(male);
		hist.startNextGeneration();

		this.rebuildLayout();
	};

	/**
	 * Rebuild the current generation.
	 * Called when manipulating the parents.
	 */
	this.rebuildCurrentGen = function()
	{
		var that = this;

		// Rebuild the parent components of the cross
		var rebuildParent = function(parent, buildDia, selectDia, selector) 
		{
			if(parent) {
				$(selector + ' .new_link_p').hide();
				$(selector + ' .old_link_p').hide();
				$(selector + ' .edit_link_p').show();
				$(selector + ' .status').html(parent.getPhenotype()
						.phenotypeString());
			}
			else {
				$(selector + ' .new_link_p').show();
				$(selector + ' .edit_link_p').hide();
				$(selector + ' .status').html('');
				if(Reg.getHistory().generations.length > 0) {
					$(selector + ' .old_link_p').show();
				}
				else {
					$(selector + ' .old_link_p').hide();
				};
			};

			// Setup callbacks.
			$(selector + ' .new_link').bind('click', function() { 
				buildDia.open();
				return false; // Nofollow link
			});
			$(selector + ' .edit_link').bind('click', function() { 
				buildDia.open();
				return false; // Nofollow link
			});
			$(selector + ' .img_link').bind('click', function() { 
				buildDia.open();
				return false; // Nofollow link
			});
			$(selector + ' .old_link').bind('click', function() { 
				selectDia.open();
				return false; // Nofollow link
			});
		};

		rebuildParent(Reg.getHistory().curGeneration.father, this.dialogA, this.selectorA, '#new_father');
		rebuildParent(Reg.getHistory().curGeneration.mother, this.dialogB, this.selectorB, '#new_mother');
	};

	/**
	 * Rebuild the entire layout.
	 * Typically called when new generations have been added.
	 */
	this.rebuildLayout = function()
	{
		var tmpl, active;

		tmpl = $.tmpl('overview', { 
			generations: Reg.getHistory().generations 
		});

		$('#main').html('');
		tmpl.appendTo('#main');

		// Child that is open by default. Show the cross results by
		// default, and show "new cross" only on the first go.
		active = Reg.getHistory().generations.length;
		if(active > 0) {
			active -= 1;
		};

		// Accordion setup & layout options
		$('.accordion').accordion({
			animated: 'slide',
			collapsible: true,
			clearStyle: true,
			active: active 
		});

		// Stats tabs for prev generations
		$('.tabs').tabs();

		// Callbacks
		$('#cross_form').bind('submit', function() { that.onCross(); });

		this.rebuildCurrentGen();
	};
};

