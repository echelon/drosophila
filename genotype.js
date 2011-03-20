/**
 * Represents a Genotype.
 * Anything encoded in the genome is present here. 
 *
 * Note: This does not represent an individual, rather 
 * a 'class' of such individuals.
 */
function Genotype()
{
	// Genes 'held' AND number of copies. 
	// WT genes are not encoded at all. 
	this.genes = {}; // TODO: THIS WILL NOT WORK!!
	this.sex = 'f'; // TODO: Read straight from genome? 

	/*******************************************/

	this.getSex = function() { return this.sex; };

	/**
	 * Return textual representation of sex.
	 */
	this.getSexStr = function() {
		if(this.sex == 'f') {
			return 'female';
		}
		return 'male';
	};

	this.setSex = function(sex) {
		assert(this.sex in {'m': 1, 'M': 1, 'f': 1, 'F': 1}, 'Wrong sex.');
		this.sex = sex.toLowerCase();
	};

	/**
	 * Return a Phenotype object representing the Genotype.
	 */
	this.getPhenotype = function() {
		return new Phenotype(this);
	};

	/**
	 * Returns the number of traits that the Genome has non-wildtype
	 * alleles for (regardless of copy number).
	 */
	this.numTraits = function() 
	{
		var cnt = 0;
		for(var o in this.genes) {
			cnt++;
		};
		return cnt;
	};

	/**
	 * String representation of the Genotype.
	 */
	this.toString = function()
	{
		var ret = '';

		if(this.numTraits() == 0) {
			return 'Genotype: WT (' + this.getSexStr() + ')';
		};

		for(var abbr in this.genes) {
			var tr = this.genes[abbr];
			if(tr.length == 1) {
				ret += tr[0].code + "/WT, ";	
			}
			else {
				ret += tr[0].code + "/" + tr[1].code + ", ";
			};
		};

		ret = ret.substr(0, ret.length - 2);
		ret += ' (' + this.getSexStr() + ')'; 
		return 'Genotype: ' + ret; 
	};

	/**
	 * Set as homozygous for a particular allele. There are two 
	 * circumstances where this is not possible:
	 *   - The gene is X-linked and the individual is Male
	 *   - The gene is Lethal
	 *
	 * In these cases, the genotype will be set as heterozygous.
	 */
	this.setHomozygousFor = function(allele)
	{
		assert(typeof(allele) == 'string' || allele instanceof Allele,
				'Allele not correct type.');

		var that = this;

		// Helper func -- sets the allele.
		var setAllele = function(allele, numCopies)
		{
			var loc = allele.trait.abbr.toUpperCase();

			that.genes[loc] = [];
			that.genes[loc].push(allele);

			if(numCopies == 2) {
				that.genes[loc].push(allele);
			};
		};

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
				setAllele(allele, 1);
			}
			else {
				setAllele(allele, 2);
			};
			return;
		};

		// Handle X-linked genes.
		var sex = this.getSex();

		if(sex == 'f' && !allele.isLethal()) {
			// Only females can carry two copies of X-linked, 
			setAllele(allele, 2);
		}
		else if(sex == 'm' && allele.isLethal()) {
			// Cannot create X-linked lethal males. 
			// XXX: This does not occur in FlyLab's alleles. 
			return; 
		}
		else {
			// Everybody else gets one copy
			setAllele(allele, 1);
		};
	};
};

