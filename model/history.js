
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
	 * Map of historical data for the user's choice in allele for any
	 * trait that has been selected. Maintaining this list makes 
	 * emulating classical Flylab easier, as the user is only able to
	 * choose ONE ALLELE PER TRAIT for an ENTIRE simulation. 
	 * Takes the form of {traitAbbr: allele}.
	 */
	this.traitAlleleMap = {};

	/**
	 * Reset the history! 
	 * Allows for a future simulation to be run: TODO
	 */
	this.reset = function()
	{
		this.curGeneration = 0;
		this.curParents = { m: 0, f: 0, mGen: -1, fGen: -1 };
		this.generations = [];
		this.traitAlleleMap = {};
	};

	/**
	 * Push a new generation on the list.
	 * This is critical to save history state info. 
	 */
	this.saveGeneration = function(gen) 
	{
		var traitMap = {};

		if(!gen || !this.curParents.m || !this.curParents.f) {
			return;
		};

		var parents = {
			m: this.curParents['m'],
			f: this.curParents['f'],
			mGen: this.curParents['mGen'], // TODO
			fGen: this.curParents['fGen']  // TODO
		}
		
		this.generations.push({parents:parents, children:gen});

		// Save the alleles and traits selected
		traitMap = this.curParents.m.traitAlleleMap();
		for(var abbr in traitMap) {
			if(this.traitAlleleMap[abbr]) {
				continue;
			};
			this.traitAlleleMap[abbr] = traitMap[abbr];
		};

		traitMap = this.curParents.f.traitAlleleMap();
		for(var abbr in traitMap) {
			if(this.traitAlleleMap[abbr]) {
				continue;
			};
			this.traitAlleleMap[abbr] = traitMap[abbr];
		};
		
		// Clear 'current' state.
		this.curGeneration++;
		this.curParents = {
				m: 0,
				f: 0,
				mGen: -1,
				fGen: -1
		};
	};

	/**
	 * Get the parents of a generation, by id.
	 */
	this.getParentsOfGeneration = function(genNumber)
	{
		if(genNumber >= this.generations.length) {
			return null;
		};

		return this.generations[genNumber].parents;
	};

	/**
	 * Get the father of a generation directly.
	 */
	this.getFatherOfGeneration = function(genNumber) { 
		return this.getParentsOfGeneration().m || null;
	};

	/**
	 * Get the mother of a generation directly.
	 */
	this.getMotherOfGeneration = function(genNumber) { 
		return this.getParentsOfGeneration().f || null;
	};

	/**
	 * Returns an array of the Traits that are 'in use' throughout all
	 * generations. Essential for FlyLab emulation.
	 */
	this.usedTraits = function()
	{
		var traits = [];
		for(var abbr in this.traitAlleleMap) {
			traits.push(Reg.getTrait(abbr));
		};
		return traits;
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

	/**
	 * Returns the single Allele used for a Trait, or null.
	 */
	this.usedTraitAllele = function(trait)
	{
		if(trait instanceof Trait) {
			trait = trait.abbr;
		};

		if(this.traitAlleleMap[trait]) {
			return this.traitAlleleMap[trait];
		};
		return null;
	};

	/**
	 * Returns an array of the Alleles that are 'in use' throughout all
	 * generations. 
	 */
	this.usedAlleles = function()
	{
		var alleles = [];

		for(var abbr in this.traitAlleleMap) {
			alleles.push(this.traitAlleleMap[abbr]);
		};
		return alleles;
	};
};

