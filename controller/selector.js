/**
 * TODO DOC
 */

/**
 * Builder Constructor.
 */
function Selector(sex)
{
	Dialog.call(this, sex);
	
	var that = this;

	// jQuery UI dialog 
	this.dialog = $.tmpl('dialog', {id:this.id});
	this.dialog.dialog({
		autoOpen: false,
		modal: true,
		title: 'Select previous offspring as parent',
		width: 700,
		height: 400,
		draggable: false,
		resizable: false,
		close: function(event, ui) { that.onClose(); },
		buttons: { 
			Cancel: function() { that.close(); }
		}
	});

	// TODO: Callbacks

	/* ====================== JQUERY UI API =========================== */

	/**
	 * PROTECTED
	 * Called Automatically prior to opening.
	 * Loads the proper state (create or edit) for the current action. 
	 */
	this._beforeOpen = function()
	{
		// Initialize the UI (TODO)
		this.initView();
	};

	this.initView = function()
	{
		var that = this;
		var dialog, template;

		template = $.tmpl('selector', {
			generations: Reg.getHistory().generations,
			sex: this.sex
		});

		dialog = '#dialog' + this.id;

		$(dialog).empty();
		template.appendTo(dialog);

		// Accordion setup & layout options
		$(this._select('.selector_accordion')).accordion({
			animated: 'slide',
			collapsible: true,
			clearStyle: true,
			active: false
		});

		// XXX: Callbacks
		$(this._select('.selector_link')).bind('click', function(ev) { 
			that.useChild(ev);
			return false; // Nofollow link
		});
	};

	/**
	 * TODO: Doc
	 */
	this.useChild= function(ev)
	{
		var node, generations, genId, pheno, geno;

		node = $(ev.target);
		generations = Reg.getHistory().generations;

		genId = node.attr('generation');
		pheno = node.attr('phenotype');

		geno = generations[genId].getChildMatchingPhenotype(pheno);
		geno = geno.copy();

		if(this.sex == 'f') {
			Reg.getHistory().curGeneration.mother = geno;
		}
		else {
			Reg.getHistory().curGeneration.father = geno;
		};

		// XXX: Signal main UI of closure.
		$('#main').trigger('rebuildGen');

		this.close();
	};

	/**
	 * CALLBACK
	 * When the entire modal dialog is closed.
	 */
	this.onClose = function()
	{
	};

};

// XXX/TODO: I really don't get Prototype inheritance... 
// Keeping the following line seems to introduce a bug (as documented
// in the git logs). And why didn't mixed inheritance work?
//Builder.prototype = new Dialog();
Selector.prototype.constructor = Selector;


