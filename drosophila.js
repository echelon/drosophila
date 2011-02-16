alert('drosophila.js loaded');

/**
 * NOTES:
 * 	Unlike Python ver, no actual individuals. Everything is 
 * 	simply a number/statistic.
 */


// Global containing chromosomes.
//GENES = 'asdf';

function getAlleles()
{
	alert('getAlleles()');
	ASDF = new Allele('Test', 'T', 'X', 4.4, true);
	return ASDF;
};

/**
 * Contains the information for an allele.
 */
function Allele(name, code, chromo, position, dominant, lethal)
{
	this.name = name;
	this.code = code;

	this.chromo = chromo;
	this.position = position;

	this.dominant = false;
	this.lethal = false;

	if(typeof dominant == 'boolean') {
		this.dominant = dominant;
	};

	if(typeof lethal == 'boolean') {
		this.lethal = lethal;
	};

	// String encoding for debugging. 
	this.toString = function () {
		var str = 'Allele: [' + this.code + "/" + this.name + " @ " 
			+ this.chromo + "_" 
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
	this.sex = 'f';

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
 * Random number generation.
 * 		- rand() returns 0 or 1
 * 		- rand(11) returns 0 through 11
 */
function rand(n)
{
	if(typeof n == 'undefined' || n <= 1) {
		return Math.round(Math.random()); // XXX: Is this correct?
	}
	return Math.floor(Math.random()*(n+1));
};


