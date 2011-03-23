
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
	 * Returns the number of traits (non-WT) present in the phenotype.
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
	 * Used in debugging.
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
	 * Phenotype String
	 * Nicely formatted output string used in HTML output. 
	 */
	this.phenotypeWithoutSexString = function()
	{
		var ret = '';

		if(this.numTraits() == 0) {
			return 'WT';
		};

		for(var abbr in this.genes) {
			ret += this.genes[abbr].code + ", ";
		};
		return ret.substr(0, ret.length - 2);
	};

	/**
	 * Phenotype & Sex String.
	 * Nicely formatted output string used in HTML output. 
	 */
	this.phenotypeString = function()
	{
		return this.phenotypeWithoutSexString() + ' ('+ this.getSexStr() + ')';
	};

	/**
	 * A hash map function for the Phenotype.
	 * In the format 'sex/allele/allele/allele...' where the alleles
	 * are sorted alphabetically. 
	 */
	this.hash = function()
	{
		return this.sex + '/' + this.hashWithoutSex();
	};

	/**
	 * A hash map function for the Phenotype.
	 * In the format 'allele/allele/allele...' where the alleles
	 * are sorted alphabetically. 
	 */

	this.hashWithoutSex = function()
	{
		var alleleAbbrs = [];
		var str = '';

		for(var abbr in this.genes) {
			var al = this.genes[abbr];
			alleleAbbrs.push(al.code);	
		};

		for(var i = 0; i < alleleAbbrs.length; i++) {
			str+= alleleAbbrs[i] + '/';
		};
		return str;
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

