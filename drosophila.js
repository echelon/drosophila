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

	this.getCode = function() { return this.code; };
	this.getName = function() { return this.name; };
	this.getTrait = function() { return this.trait; };

	this.isLethal = function() { return this.lethal; };
	
	this.isAutosomal = function() { 
		return (this.chromo.toUpperCase() != 'X'); 
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

	this.getAbbr = function() { return abbr; };
	this.getName = function() { return name; };

	this.getAlleles = function() {
		// TODO;
		return false;
	};

	this.toString = function() {
		return 'Trait: [' + this.abbr + '/' + this.name + ']';			
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
		// FIXME: DOES NOT WORK. typeof() is not what you think!
		assert(typeof(allele) in {'string':1, 'Allele':1},
				'Allele not correct type');

		var sex = '';

		if(typeof(allele) == 'string') {
			allele = Reg.getAllele(allele); 
			if(!allele) 
				return;
		};

		// Handle autosomal genes
		if(allele.isAutosomal()) {
			this.genes[allele.code] = addGene(allele, 1);
			if(allele.isLethal()) {
				this.genes[allele.code] = addGene(allele, 2);
			};
			return;
		};

		// Handle X-linked genes.
		sex = this.getSex();

		// Cannot create X-linked lethal males
		if(sex == 'm' && allele.isLethal()) {
			return;
		}

		this.genes[allele.code] = addGene(allele, 1);

		if(sex == 'f' && !allele.isLethal()) {
			this.genes[allele.code] = addGene(allele, 2);
		}
	};

	this.getPhenotype = function() {
		return null;
	};

	this.getSex = function() {
		return this.sex; // TODO: Read direct from genome
	};

	this.getSexTextual = function() {
		if(this.sex == 'f') {
			return 'female';
		}
		return 'male';
	};

	this.numGenes = function() {
		var cnt = 0;
		for(var o in this.genes) {
			cnt++;
		}
		return cnt;
	};

	this.toString = function() {
		if(this.numGenes() == 0) {
			return 'Genome: WT';
		};
		var ret = '';
		for(var gene in this.genes) {
			ret += gene.allele.code + 'x' + gene.copies + ', ';
		}
		return ret;
	};
};

// ============================================================== //

// Format
function addGene(allele, numCopies)
{
	return {'allele':allele, 'copies':numCopies};
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
