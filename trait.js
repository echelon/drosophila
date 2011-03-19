/**
 * Represents a Trait.
 */
function Trait(name, abbr)
{
	this.name = name;
	this.abbr = abbr;
	this.alleles = {};

	this.getAbbr = function() { return abbr; };
	this.getName = function() { return name; };

	/**
	 * Return an Array of Alleles.
	 */
	this.getAlleles = function() {
		var alleles = [];
		for(var i in this.alleles) {
			alleles.push(this.alleles[i]);
		};
		return alleles;
	};

	this.hasAllele = function(abbr) {
		return abbr.toUpperCase() in this.alleles;
	};

	this.toString = function() {
		return 'Trait: [' + this.abbr + '/' + this.name + ']';			
	};
};

