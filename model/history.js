
/**
 * TODO: Should build a cache of alleles and traits used so that 
 * expensive lookup is not necessary.
 */
function History()
{
	/**
	 * The current generation that is being built.
	 */
	this.curGeneration = 0;

	/**
	 * The parents of the current (upcoming) generation.
	 * mGen and fGen are pointers to the generation of the parent. If
	 * negative, they are P generation.
	 */
	this.curParents = {
		m: 0, 
		f: 0,
		mGen: -1, // TODO
		fGen: -1  // TODO
	};

	/**
	 * All created (historal) generations, for reference.
	 * - parents: m, f, mGen, fGen
	 * - children: <Generation>
	 */
	this.generations = [];

	/**
	 * Push a new generation on the list.
	 */
	this.saveGeneration = function(gen) 
	{
		if(!gen) {
			return;
		};

		var parents = {
			m: this.curParents['m'],
			f: this.curParents['f'],
			mGen: this.curParents['mGen'], // TODO
			fGen: this.curParents['fGen']  // TODO
		}
		
		this.generations.push({parents:parents, children:gen});

		this.curGeneration++;
		this.curParents = {
				m: 0,
				f: 0,
				mGen: -1,
				fGen: -1
		};
	};

	/**
	 * Returns an array of the Traits that are 'in use' throughout all
	 * generations.
	 * TODO: BAD CODE THAT RELIES ON MORE BAD CODE (FIXME)
	 */
	this.usedTraits = function()
	{
		var traitsMap = {};
		var traits = [];

		for(var i = 0; i < this.all.length; i++) {
			var indivs = this.all[i].indivs;
			for(var indiv in indivs) {
				var genes = indivs[indiv].genotype.genes
				for(var abbr in genes) {
					traitsMap[abbr] = 1;
				};
			}
		};
		for(abbr in traitsMap) {
			traits.push(Reg.getTrait(abbr));
		}
		return traits;
	};

	/**
	 * Returns the single Allele used for a Trait, or null.
	 */
	this.usedTraitAllele = function(trait)
	{
		var usedAlleles = [];

		// TODO: Bad
		if(!(trait instanceof Trait)) {
			trait = Reg.getTrait(trait);
		}
	
		usedAlleles = this.usedAlleles();
		for(var i = 0; i < usedAlleles.length; i++) {
			var allele = usedAlleles[i];
			if(allele.trait.abbr == trait.abbr) {
				return allele;
			};
		};
		return null;
	};

	/**
	 * Returns an array of the Alleles that are 'in use' throughout all
	 * generations. 
	 * XXX: This follows flylab -- only one allele may be used for any
	 * given trait.
	 * TODO: BAD CODE THAT RELIES ON MORE BAD CODE. THE WORST CODE IN 
	 * THIS CLASS!! TERRIBLE. FIXME.
	 */
	this.usedAlleles = function()
	{
		var traitsMap = {};
		var alleles = [];

		for(var i = 0; i < this.all.length; i++) {
			var indivs = this.all[i].indivs;
			for(var indiv in indivs) {
				var genes = indivs[indiv].genotype.genes
				for(var abbr in genes) {
					var g = genes[abbr];
					if(g[0]) {
						traitsMap[abbr] = g[0];
					}
					else if(g[1]) {
						traitsMap[abbr] = g[1];
					};
				};
			}
		};

		for(abbr in traitsMap) {
			alleles.push(traitsMap[abbr]);
		}
		return alleles;
	};

	/**
	 * Get a list of unused traits.
	 */
	this.unusedTraits = function()
	{
		var allTraits = Reg.getTraits();
		var usedTraits = this.usedTraits();
		var unusedTraits = [];

		for(var i = 0; i < allTraits.length; i++) {
			var trait = allTraits[i];
			var used = false;
			for(var j = 0; j < usedTraits.length; j++) {
				if(allTraits[i].abbr == usedTraits[j].abbr) {
					used = true;
					break;
				};
			};
			if(!used) {
				unusedTraits.push(allTraits[i]);
			};
		};
		return unusedTraits;
	};
};

