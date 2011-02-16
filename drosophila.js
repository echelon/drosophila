alert('drosophila.js loaded');

/**
 * NOTES:
 * 	Unlike Python ver, no actual individuals. Everything is 
 * 	simply a number/statistic.
 */

/**
 * Builds our Alleles and stores them in the registry.
 */
function __createAlleles()
{
	// Pseudo-constants, make the list look cleaner.
	var Dominant = true;
	var Lethal = true;
	var X = 'x';

	// Bristle
	AlleleReg(new Allele('Forked', 'F', X, 56.3));
	AlleleReg(new Allele('Shaven', 'SV', 4, 3.0));
	AlleleReg(new Allele('Singed', 'SN', X, 21.0));
	AlleleReg(new Allele('Spineless', 'SS', 3, 58.5));
	AlleleReg(new Allele('Stubble', 'SB', 3, 58.2, Dominant, Lethal));

	// Body Color
	AlleleReg(new Allele('Black', 'BL', 2, 48.5));
	AlleleReg(new Allele('Ebony', 'E', 3, 70.7));
	AlleleReg(new Allele('Sable', 'S', X, 43.0));
	AlleleReg(new Allele('Tan', 'T', X, 27.7));
	AlleleReg(new Allele('Yellow', 'Y', X, 0.0));

	// Antennae
	AlleleReg(new Allele('Aristapedia', 'AR', 3, 47.7, Dominant));

	// Eye Color
	AlleleReg(new Allele('Brown', 'BW', 2, 104.5));
	AlleleReg(new Allele('Purple', 'PR', 2, 54.5));
	AlleleReg(new Allele('Sepia', 'SE', 3, 26.0));
	AlleleReg(new Allele('White', 'W', X, 1.5));

	// Eye Shape
	AlleleReg(new Allele('Bar', 'B', X, 57.0, Dominant));
	AlleleReg(new Allele('Eyeless', 'EY', 4, 2.0));
	AlleleReg(new Allele('Lobe', 'L',	2, 72.0, Dominant));
	AlleleReg(new Allele('Star', 'ST', 2, 1.3, Dominant, Lethal));

	// Wing Size
	AlleleReg(new Allele('Apterous', 'AP', 2, 55.4));
	AlleleReg(new Allele('Miniature', 'M', X, 36.1));
	AlleleReg(new Allele('Vestigial', 'VG', 2, 67.0));

	// Wing Shape
	AlleleReg(new Allele('Curly', 'CY', 2, 6.1, Dominant, Lethal));
	AlleleReg(new Allele('Curved', 'C', 2, 75.5));
	AlleleReg(new Allele('Dumpy', 'DP', 2, 13.0));
	AlleleReg(new Allele('Scalloped', 'SD', X, 51.5));

	// Wing Vein
	AlleleReg(new Allele('Crossveinless', 'CV', X, 13.7));
	AlleleReg(new Allele('Radius Incomplete', 'RI', 3, 48.4));

	// Wing Angle
	AlleleReg(new Allele('Dichaete', 'D', 3, 41.0, Dominant, Lethal));
};

__createAlleles();

/**
 * Maintain an Allele list.
 *  A static class.
 */
function AlleleReg(allele)
{
	if(typeof AlleleReg._registry == 'undefined') {
		AlleleReg._registry = [];
	};

	AlleleReg._registry.push(allele); // TODO: Maintain uniqueness.

	AlleleReg.getAlleles = function() {
		return AlleleReg._registry;
	};

	// Lookup allele by its code
	AlleleReg.findAllele = function(code)
	{
		assert(typeof(code) == 'string', 'findAllele(string)');

		code = code.toUpperCase();
		for(var i = 0; i < AlleleReg._registry.length; i++) {
			var a = AlleleReg._registry[i];
			if(a.code == code) 
				return a;
		};
		return null;
	};
};

/**
 * Represents an Allele.
 */
function Allele(name, code, chromo, position, dominant, lethal)
{
	this.name = name;
	this.code = code;

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

	// String encoding for debugging. 
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
 * Represents a Genotype.
 *  Anything encoded in the genome is present here. 
 *
 *  Note: This does not represent an individual, rather 
 *  a 'class' of such individuals.
 */
function Genotype()
{
	// Genes 'held' AND number of copies. 
	// WT genes are not encoded at all. 
	this.genes = {}; 
	this.sex = 'f'; // TODO: Remove redundancy!!

	/**
	 * Set as homozygous for a particular allele unless
	 * it is X-linked or Letal.
	 */
	this.setAs = function(allele)
	{
		assert(typeof(allele) in ['string', 'Allele'],
				'Allele not correct type');

		if(typeof(allele) == 'string') {
		};
		
	};


	this.getPhenotype = function() {
		return null;
	};

	this.getSex = function() {
		return this.sex;
	};

	this.getSexTextual = function() {
		if(this.sex == 'f') {
			return 'female';
		}
		return 'male';
	};
};

/**
 * Random integer generation.
 * 		- rand() returns 0 or 1
 * 		- rand(n) returns 0 through n-1
 */
function rand(n)
{
	if(typeof n == 'undefined' || n <= 1) {
		return Math.round(Math.random()); // XXX: Is this correct?
	}
	return Math.floor(Math.random()*n);
};

/**
 * Assert function.
 * 	XXX: Is this correct?
 */
function assert(stmt, msg)
{
	if(!stmt) {
		if(typeof(msg) == 'undefined') {
			msg = 'Undocumented Assert Failed.';
		};
		alert(msg);
		throw new Error(msg);
	};
};
