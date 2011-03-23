
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

		// Rules for displaying phenotype from genotype.
		if(tr[0].isDominant() || tr[0].isLethal()) {
			allele = tr[0]; // Dom or lethal
		};
		if(!tr[0].isAutosomal() && this.sex == 'm') {
			allele = tr[0]; // Male X-linked
		};
		if(tr.length == 2) {
			if(!tr[1].isAutosomal() && this.sex == 'm') {
				allele = tr[1]; // Male X-linked
			};
			if(tr[1].isDominant() || tr[1].isLethal()) {
				allele = tr[1]; // Dom or lethal
			}
			else if(tr[0].code == tr[1].code) {
				allele = tr[0]; // Two copies.
			};
		};
			
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

	/**
	 * Nicely formatted output string.
	 * Used in HTML output. 
	 */
	this.phenotypeString = function()
	{
		var ret = '';

		if(this.numTraits() == 0) {
			return 'WT (' + this.getSexStr() + ')';
		};
		for(var abbr in this.genes) {
			ret += this.genes[abbr].code + ", ";
		};

		ret = ret.substr(0, ret.length - 2);
		ret += ' (' + this.getSexStr() + ')';
		return ret; 

	};

	/**
	 * Determine if a phenotype matches another one.
	 */
	this.equals = function(pheno) 
	{
		if(this.sex != pheno.sex) {
			return false;
		};

		if(this.numTraits() != pheno.numTraits()) {
			return false;
		};

		for(var abbr in this.genes) {
			if(!pheno[abbr]) {
				return false;
			};
		};
		return true;
	};
};

