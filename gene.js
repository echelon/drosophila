/**
 * NOTES:
 * 	Unlike Python ver, no actual individuals. Everything is 
 * 	simply a number/statistic.
 */

/**
 * Represents an Allele.
 */
function Allele(name, code, trait, chromo, position, dominant, lethal)
{
	this.name = name;
	this.code = code;
	this.trait = trait;
	this.chromo = chromo;
	this.position = position;
	this.dominant = false;
	this.lethal = false;

	switch(chromo) {
		case 'x':
		case 'X':
			this.chromo = 'X';
			break;
		default:
			this.chromo = chromo;
	};

	if(typeof dominant == 'boolean') {
		this.dominant = dominant;
	};

	if(typeof lethal == 'boolean') {
		this.lethal = lethal;
	};

	// Add this allele to the trait! 
	trait.alleles[code.toUpperCase()] = this;

	this.getCode = function() { return this.code; };
	this.getName = function() { return this.name; };
	this.getTrait = function() { return this.trait; };

	this.isLethal = function() { return this.lethal; };
	
	this.isAutosomal = function() { 
		return !(this.chromo in {'X': 1, 'x': 1}); 
	};

	/**
	 * String encoding for debugging. 
	 */
	this.toString = function () {
		var str = 'Allele: [' + this.code + "/" + this.name + " @ " 
			+ this.chromo + ":" 
			+ this.position;
		if(this.dominant) {
			str += ", dominant";
			if(this.lethal) {
				str += "/lethal";
			}
		}
		else if(this.lethal) {
			str += ", lethal";
		}
		str += ']';
		return str;
	};
};

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

