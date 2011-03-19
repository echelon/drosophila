
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


