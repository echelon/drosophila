/**
 * The "Main GUI"
 * TODO
 */
function Overview()
{
	this.attached = false;

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

		// Func: Create a modal dialog window
		var createDialog = function(parent) {
			var dialog = $.tmpl('create', parent);
			var title = 'Create ' + parent.getSexStr() + ' parent';
			dialog.dialog({
					autoOpen: false,
					modal: true,
					title: title,
					width: 700,
					height: 400,
					draggable: false,
					resizable: false
				});
			return dialog;
		};

		var generations = Reg.getHistory().generations;

		var dom = $.tmpl('overview', {
			generations: generations,
			testfunc: function() { return 'asdf'; }
		});

		dom.appendTo('#main');

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
		//$('.accordion').accordion('option', 'active', (idOfLastBox));

		//
		// Tabs
		//

		$('.tabs').tabs();

		//
		// TODO
		//
		
		// TODO TODO TODO TODO:
		// This will involve porting all of the form controller logic.. ugh. 
		// var maleDialog = createDialog();
		
		var dialog = new Dialog(); //createDialog();

		// New individual callback.
		$('.new_male').bind('click', function() { 
			//dialog.dialog('open')
			dialog.open();
			return false; // Nofollow link
			//var form = new Form(false, 'm');
			//form.present();
		});
		$('.new_female').bind('click', function() { 
			var form = new Form(false, 'f');
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
		//main.append(this.overviewDom)		
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
	//this.hide = function() { this.overviewDom.hide(); };

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

