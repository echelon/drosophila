
/**
 * Registry to maintain Trait and Allele maps.
 *  A static class.
 */
function Reg(obj)
{
	if(typeof Reg._alleles == 'undefined') {
		Reg._alleles = {};
		Reg._traits = {};
		Reg._history = new History();
	};

	if(obj instanceof Allele) {
		// TODO: Protect against overwrite.
		Reg._alleles[obj.getCode().toUpperCase()] = obj;
	}
	else if(obj instanceof Trait) {
		// TODO: Protect against overwrite.   
		Reg._traits[obj.getAbbr().toUpperCase()] = obj;
	}
	else if(obj instanceof Array) {
		for(var i in obj) {
			Reg(obj[i]);
		};
	};

	/**
	 * Lookup Allele by its code.
	 * 	- Returns Allele or null
	 */
	Reg.getAllele = function(code)
	{
		assert(typeof(code) == 'string', 'findAllele(string)');

		code = code.toUpperCase();
		if(code in Reg._alleles) {
			return Reg._alleles[code];
		};
		return null;
	};

	/**
	 * Returns the list of all Alleles.
	 */
	Reg.getAlleles = function() {
		var alleles = [];
		for(var k in Reg._alleles) {
			alleles.push(Reg._alleles[k]);
		};
		return alleles;
	};

	/**
	 * Get Trait by its code.
	 *  - Returns Trait or null
	 */
	Reg.getTrait = function(abbr)
	{
		assert(typeof(abbr) == 'string', 'getTrait(string)');

		abbr = abbr.toUpperCase();
		if(abbr in Reg._traits) {
			return Reg._traits[abbr];
		};
		return null;
	};

	/**
	 * Returns the list of all Traits.
	 */
	Reg.getTraits = function() {
		var traits = [];
		for(var k in Reg._traits) {
			traits.push(Reg._traits[k]);
		};
		return traits;
	};
};


