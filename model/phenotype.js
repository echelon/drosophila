
/**
 * Represents a Phenotype.
 * Only dominant alleles are represented. 
 */
function Phenotype(genotype)
{
	this.sex = '';
	this.genes = {};

	this.sex = genotype.sex;

	for(abbr in genotype.genes) {
		var tr = genotype.genes[abbr];
		var allele = null;

		if(tr[0].isDominant()) {
			allele = tr[0];
		}
		if(tr.length == 2 && tr[1].isDominant()) {
			allele = tr[1];
		}
		
		if(allele) {
			this.genes[abbr] = allele;
		}
	};

	/**
	 * Return textual representation of sex.
	 */
	this.getSexStr = function() {
		if(this.sex == 'f') {
			return 'female';
		}
		return 'male';
	};

	/**
	 * Returns the number of traits that the Phenotype has dominant,
	 * non-wildtype expression for.
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
	 * String representation of the Phenotype.
	 */
	this.toString = function()
	{
		var ret = '';

		if(this.numTraits() == 0) {
			return 'Phenotype: WT (' + this.getSexStr() + ')';
		};
		for(var abbr in this.genes) {
			ret += this.genes[abbr].code + ", ";
		};

		ret = ret.substr(0, ret.length - 2);
		ret += ' (' + this.getSexStr() + ')';
		return 'Phenotype: ' + ret; 
	};

	
	this.equals = function(pheno) {
		// TODO
	};

};
