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
	this.sex = 'f'; // TODO: Read straight from genome? 

	/*******************************************/

	this.getSex = function() { return this.sex; };

	this.setSex = function(sex) {
		assert(this.sex in {'m': 1, 'M': 1, 'f': 1, 'F': 1}, 'Wrong sex.');
		this.sex = sex.toLowerCase();
	};

	this.getSexTextual = function() {
		if(this.sex == 'f') {
			return 'female';
		}
		return 'male';
	};

	/**
	 * Set as homozygous for a particular allele unless
	 * it is X-linked or Letal.
	 */
	this.setAs = function(allele)
	{
		assert(typeof(allele) == 'string' || allele instanceof Allele,
				'Allele not correct type.');

		if(typeof(allele) == 'string') {
			allele = Reg.getAllele(allele); 
			if(!allele) {
				alert('Allele does not exist in registry!');
				return;
			}
		};

		// Handle autosomal genes
		// Always set as homozygous if allele is nonlethal. 
		if(allele.isAutosomal()) 
		{
			if(allele.isLethal()) {
				this.__doSetAs(allele, 1);
			}
			else {
				this.__doSetAs(allele, 2);
			};
			return;
		};

		// Handle X-linked genes.
		var sex = this.getSex();

		if(sex == 'f' && !allele.isLethal()) {
			// Only females can carry two copies of X-linked, 
			this.__doSetAs(allele, 2);
		}
		else if(sex == 'm' && allele.isLethal()) {
			// Cannot create X-linked lethal males. 
			return; 
		}
		else {
			// Everybody else gets one copy
			this.__doSetAs(allele, 1);
		};
	};

	/**
	 * Does the behind-the-scenes work.
	 */
	this.__doSetAs = function(allele, numCopies) 
	{
		this.genes[allele.trait.abbr.toUpperCase()] = {
					'allele': allele,
					'copies': numCopies
		};
	};

	this.getPhenotype = function() {
		return null;
	};

	this.numTraits = function() {
		var cnt = 0;
		for(var o in this.genes) {
			cnt++;
		}
		return cnt;
	};

	this.toString = function()
	{
		if(this.numTraits() == 0) {
			return 'Genome: WT';
		};

		var ret = '';
		for(var abbr in this.genes) {
			var t = this.genes[abbr];
			ret += t.allele.code + 'x' + t.copies + ', ';
		};

		return 'Genome: ' + ret;
	};
};


// ============================================================== //

// Format
// FIXME: This is awkward. 
function addGene(allele, numCopies)
{
	return {'allele':allele, 'copies':numCopies};
};

