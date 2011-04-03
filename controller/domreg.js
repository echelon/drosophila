
/**
 * Registry of common DOM tree motifs to reuse.
 * XXX: Also starts the GUI when all templates are loaded. 
 * TODO: As a class, this is all deprecated. New design:
 *
 * 		TemplateLoader
 * 			.load('name', 'foo/template.html')
 * 			.load('other', 'foo/other.html')
 * 			.onComplete(function() {})
 * 			.start()
 */
function DomReg()
{
	/**
	 * Invoke a template load operation, and save it to the name when
	 * the load completes. 
	 */
	var loadTemplate = function(name, url) {
		$.ajax({
			url: url, 
			success: function(data) { onTemplateLoaded(name, data); },
			dataType: 'html' 
		});
	};

	/**
	 * CALLBACK.
	 * Template onLoad handler. Saves the template to the name.
	 * When all templates are finally loaded, initializes the GUI.
	 */
	var onTemplateLoaded = function(name, data) {
		$.template(name, data);
		DomReg._numLoaded++;
		if(DomReg._numLoaded == DomReg._numToLoad) {
			// XXX: Initialization of GUI begins here... 
			overview = new Overview();
			overview.show();
		};
	};

	if(typeof DomReg._numLoaded == 'undefined') {
		// Keep track of template loading.
		DomReg._numLoaded = 0;
		DomReg._numToLoad = 2;

		loadTemplate('overview', './view/overview.html');
		loadTemplate('create', './view/create.html');
	};
};

