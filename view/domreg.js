
/**
 * Registry of common DOM tree motifs to reuse.
 */
function DomReg()
{
	if(typeof DomReg._elements == 'undefined') {
		DomReg._elements = $("#ui_proto").detach();
		DomReg._main = $("#main");
		DomReg._currentEl = null;
	};

	/**
	 * Present a view object.
	 */
	DomReg.present = function(obj)
	{
		// TODO: Verify
	
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
	DomReg.getMain = function()
	{
		return DomReg._main;
	};

	/**
	 * Get an overview DOM tree.
	 */
	DomReg.getOverview = function()
	{
		var overview = DomReg._elements.find("#overview").clone();
		return overview;
	};

	/**
	 * Get a form DOM tree.
	 */
	DomReg.getForm = function()
	{
		var form = DomReg._elements.find("#designer").clone();
		return form;
	};
};

