/**
 * The "Main GUI"
 * TODO
 */
function Overview()
{
	var that = this;

	this.dialogA = new Builder('m');
	this.dialogB = new Builder('f');

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
		var rebuildParent = function(parent, dialog, selector) 
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
				dialog.open();
				return false; // Nofollow link
			});
			$(selector + ' .edit_link').bind('click', function() { 
				dialog.open();
				return false; // Nofollow link
			});
			$(selector + ' .img_link').bind('click', function() { 
				dialog.open();
				return false; // Nofollow link
			});
		};

		rebuildParent(Reg.getHistory().curGeneration.father, this.dialogA, '#new_father');
		rebuildParent(Reg.getHistory().curGeneration.mother, this.dialogB, '#new_mother');
	};

	/**
	 * Rebuild the entire layout.
	 * Typically called when new generations have been added.
	 */
	this.rebuildLayout = function()
	{
		var tmpl;

		tmpl = $.tmpl('overview', { 
			generations: Reg.getHistory().generations 
		});

		$('#main').html('');
		tmpl.appendTo('#main');

		// Accordion setup & layout options
		$('.accordion').accordion({
			animated: 'slide',
			collapsible: true,
			clearStyle: true
		});

		// Stats tabs for prev generations
		$('.tabs').tabs();

		// Callbacks
		$('#cross_form').bind('submit', function() { that.onCross(); });

		this.rebuildCurrentGen();
	};
};

