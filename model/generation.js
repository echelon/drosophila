
/**
 * Container data structure for a "generation" of offspring produced in
 * a cross. Does not maintain all individuals, but rather a single copy
 * of each observed genotype--and the number of times that genotype
 * appears.
 * TODO: This class is 'meh'.
 */
function Generation(indivs)
{
	this.indivs = {};

	for(var i in indivs) {
		var indiv = indivs[i];
		var hash = indiv.hash();

		if(this.indivs[hash]) {
			this.indivs[hash].count++;
		}
		else {
			this.indivs[hash] = {
				'genotype' : indiv,
				'count' : 1
			};
		};
	};

	/**
	 * String representation of the generation.
	 */
	this.toString = function()
	{
		var ret = "";

		for(hash in this.indivs) {
			var indiv = this.indivs[hash];
			ret += indiv.genotype.toString();
			ret += ': ' + indiv.count + ', ';
		};

		return ret;
	};

	/**
	 * Get phenotype -> count map. 
	 */
	this.phenotypeMap = function()
	{
		var phenMap = {};
		var phenMap2 = {};

		for(var h in this.indivs) {
			var geno = this.indivs[h];
			var pheno = geno.genotype.getPhenotype();
			var hash = pheno.hash();
			if(!phenMap[hash]) {
				phenMap[hash] = {phenotype: pheno, count: geno.count };
			}
			else {
				phenMap[hash].count += geno.count;
			};
		};

		// Strictly phenotype -> count.
		for(var h in phenMap) {
			phenMap2[phenMap[h].phenotype] = phenMap[h].count;
		}
		return phenMap2;
	};

	/**
	 * Get phenotype -> count map, but aggregate on sex.
	 * XXX: phenotype object still has a sex!!
	 */
	this.phenotypeWithoutSexMap = function()
	{
		var phenMap = {};
		var phenMap2 = {};

		for(var h in this.indivs) {
			var geno = this.indivs[h];
			var pheno = geno.genotype.getPhenotype();
			var hash = pheno.hashWithoutSex();
			if(!phenMap[hash]) {
				phenMap[hash] = {phenotype: pheno, count: geno.count };
			}
			else {
				phenMap[hash].count += geno.count;
			};
		};

		// Strictly phenotype -> count.
		for(var h in phenMap) {
			phenMap2[phenMap[h].phenotype] = phenMap[h].count;
		}
		return phenMap2;
	};
};

