
/**
 * Registry of common DOM tree motifs to reuse.
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
		DomReg._elements = $("#hidden_cloneable").detach();
		DomReg._main = $("#main");
		DomReg._currentEl = null;

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
		obj.attach();
		obj.show();
	};

	/**
	 * Access the main div
	 */
	DomReg.getMain = function() { return DomReg._main; };

	/**
	 * Get the appropriate part of the DOM tree.
	 */
	DomReg.overview = function() { return DomReg._clone(".overview"); };
	DomReg.overviewParentsNew = function() { return DomReg._clone(".overview_parents_new"); };
	DomReg.overviewParentsOld = function() { return DomReg._clone(".overview_parents_old"); };
	DomReg.getDesigner = function() { return DomReg._clone(".designer"); };

	/**
	 * Clone the named DOM section.
	 */
	DomReg._clone = function(name)
	{
		return DomReg._elements.find( name ).clone();
	};
};

