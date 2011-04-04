/**
 * Generation
 *
 * Container data structure for a 'generation' of offspring produced in
 * a cross. Retains the parent genotypes, but does not maintain all of
 * the children created. Rather, a single copy of each unique genotype
 * is preserved along with a count of all such genotypes observed in 
 * the cross.
 *
 * TODO: Even further revision of the 'offspring' dictionary is 
 * possible such to prevent wasteful calculation by phenotypeMap() and
 * associated. Do agglomeration on all dimensions upfront and store the
 * results as amortized values to be recalled later. 
 */
function Generation(parent1, parent2, children)
{
	/**
	 * The parents of this generation.
	 */
	this.mother = null;
	this.father = null;

	/**
	 * Offspring.
	 * Instead of keeping all children produced, we maintain a tally
	 * of each kind of genotype that was created. For each unique 
	 * genotype, a single object along with a count of all such 
	 * individuals is kept. The offspring dictionary is keyed with hash
	 * strings corresponding to each genotype.
	 *
	 * offspring[hashstr] => 'genotype': x, 'count': y.
	 */
	this._offspring = {};

	if(parent1 && parent2 && children) 
	{
		// XXX: Does not confirm validity of sexes. 
		if(parent1.getSex() == 'f') {
			this.mother = parent1;
			this.father = parent2;
		}
		else {
			this.mother = parent2;
			this.father = parent1;
		};
	};

	/**
	 * Tally the children for the generation. Resets the previous 
	 * record. 
	 */
	this.tallyChildren = function(children)
	{
		var child, hash, i;

		this._offspring = {}; // Reset. A good policy?

		for(i in children)
		{
			child = children[i];
			hash = child.hash();

			if(this._offspring[hash]) {
				this._offspring[hash].count++;
				continue;
			}

			this._offspring[hash] = {
				genotype : child,
				count : 1
			};
		};
	};

	// TODO: Is there any way to use a "traditional constructor" in 
	// TODO: Javascript? Why can't we call a method during construction? 
	// TODO: Why don't these names get bound? Seriously, Javascript?
	this.tallyChildren(children);

	/**
	 * Determine whether the generation has any offspring.
	 */
	this.hasOffspring = function()
	{
		var k;
		for(k in this._offspring) {
			return true;
		};
		return false;
	}

	/**
	 * Get a child matching the phenotype (or hash thereof). 
	 * XXX: A random genotype that matches the phenotype is not
	 * selected due to the way I have elected to store this 
	 * information. A more probabilisitic approach is advisable...
	 * TODO: Amortize this
	 */
	this.getChildMatchingPhenotype = function(phenotype)
	{
		var h, geno;

		if(phenotype instanceof Phenotype) {
			phenotype = phenotype.hash();
		};

		for(h in this._offspring)
		{
			geno = this._offspring[h].genotype;
			if(phenotype == geno.getPhenotype().hash()) {
				return geno;
			};
		};
		return null;
	};

	/**
	 * Generate and return the 'phenotype -> count' map. 
	 * TODO: Amortize this. 
	 */
	this.phenotypeMap = function()
	{
		var phenMap, h, hash, geno, pheno;

		phenMap = {};

		for(h in this._offspring)
		{
			geno = this._offspring[h];
			pheno = geno.genotype.getPhenotype();
			hash = pheno.hash();

			if(!phenMap[hash]) {
				phenMap[hash] = {phenotype: pheno, count: geno.count };
			}
			else {
				phenMap[hash].count += geno.count;
			};
		};

		return phenMap;
	};

	/**
	 * Generate and return the 'phenotype -> count' map, but aggregate
	 * on sex.
	 * TODO: Rename method? Really hard to remember its name. 
	 * TODO: Amoritize this.
	 */
	this.phenotypeWithoutSexMap = function()
	{
		var phenMap, h, geno, pheno, hash;

		phenMap = {};

		for(h in this._offspring) 
		{
			geno = this._offspring[h];
			pheno = geno.genotype.getPhenotype();
			hash = pheno.hashWithoutSex();

			if(!phenMap[hash]) {
				phenMap[hash] = {phenotype: pheno, count: geno.count };
			}
			else {
				phenMap[hash].count += geno.count;
			};
		};

		return phenMap;
	};

	/**
	 * String representation of the generation.
	 * Useful for debugging. 
	 */
	this.toString = function()
	{
		var ret, hash, child;

		ret = "";

		for(hash in this._offspring) {
			child = this._offspring[hash];
			ret += child.genotype.toString();
			ret += ': ' + child.count + ', ';
		};

		return ret;
	};
};

