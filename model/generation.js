
/**
 * Container data structure for a "generation" of offspring produced in
 * a cross. Does not maintain all individuals, but rather a single copy
 * of each observed genotype--and the number of times that genotype
 * appears.
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
	}
	// TODO: Methods
};

