
/**
 * Registry of common DOM tree motifs to reuse.
 * XXX: Also starts the GUI when all templates are loaded. 
 */
function DomReg()
{
	// Invoke a template load operation, and save it to the name
	var loadTemplate = function(name, url) {
		$.ajax({
			url: url, 
			success: function(data) { onTemplateLoaded(name, data); },
			dataType: 'html' 
		});
	};

	// Template load handler. Saves to name.
	// When all templates are loaded, intitialize the Gui. 
	var onTemplateLoaded = function(name, data) {
		$.template(name, data);
		DomReg._numLoaded++;
		if(DomReg._numLoaded == DomReg._numToLoad) {
			// TODO TODO TODO: Initialization of gui completes here.
			// TODO -- Not a perfect initialization
			overview = new Overview();
			overview.present();
		};
	};

	if(typeof DomReg._elements == 'undefined') {
		// Keep track of template loading.
		DomReg._numLoaded = 0;
		DomReg._numToLoad = 2;

		loadTemplate('test', './view/test.html');
		loadTemplate('overview', './view/overview.html');
	};

	/**
	 * Present a view object.
	 */
	DomReg.present = function(obj)
	{
		if(DomReg._currentEl) {
			DomReg._currentEl.hide();
			DomReg._currentEl.detach();
			delete DomReg._currentEl;
		};
		DomReg._currentEl = obj;
		obj.setup();
		//obj.attach(); // XXX XXX TEMP COMMENT OUT
		obj.show();	// XXX XXX TEMP COMMENT OUT
	};

	/**
	 * Access the main div
	 */
	DomReg.getMain = function() { return DomReg._main; };

	/**
	 * Clone the named DOM section.
	 */
	DomReg._clone = function(name)
	{
		return null;
	};
};

