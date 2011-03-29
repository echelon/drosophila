
/**
 * Registry of common DOM tree motifs to reuse.
 */
function DomReg()
{
	if(typeof DomReg._elements == 'undefined') {
		DomReg._elements = $("#hidden_cloneable").detach();
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

