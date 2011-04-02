
/**
 * History
 * Maintains a record of alleles used, parents crossed, and generations
 * made. Centralized history management. 
 */
function History()
{
	/**
	 * The current generation that is being built.
	 * A Generation object contains the parents, and after cross, the
	 * statistics on the offspring. 
	 */
	this.curGeneration = new Generation();

	/**
	 * All created (historal) generations, for reference. This does
	 * not include the current one.
	 */
	this.generations = [];

	/**
	 * Map of historical data for the user's choice in allele for any
	 * trait that has been selected. Maintaining this list makes 
	 * emulating classical Flylab easier, as the user is only able to
	 * choose ONE ALLELE PER TRAIT for an ENTIRE simulation. 
	 * Takes the form of {traitAbbr: allele}.
	 * TODO: Verify this still works after refactor!!
	 */
	this.traitAlleleMap = {};

	/**
	 * Reset the history! 
	 * Allows for a future simulation to be run: TODO
	 * TODO: Verify traitAlleleMap works after refactor.
	 */
	this.reset = function()
	{
		this.curGeneration = new Generation();
		this.generations = [];
		this.traitAlleleMap = {};
	};

	/**
	 * Push a new generation on the list.
	 * This is critical to save history state info. 
	 */
	this.startNextGeneration = function() 
	{
		var that, addToMap, tMap;

		// Must have parents and children
		if(!this.curGeneration.mother || !this.curGeneration.father || 
				!this.curGeneration.hasOffspring()) {
			return;
		}

		that = this;

		// Function that adds selected alleles to the global history of
		// such choices made.
		addToMap = function(parent) {
			tMap = parent.traitAlleleMap();
			for(abbr in tMap) {
				if(that.traitAlleleMap[abbr]) {
					continue;
				};
				that.traitAlleleMap[abbr] = tMap[abbr];
			};
		};

		addToMap(this.curGeneration.mother);
		addToMap(this.curGeneration.father);

		// Advance to next generation...
		this.generations.push(this.curGeneration);
		this.curGeneration = new Generation();
	};

	/**
	 * Get the generation, by number.
	 */
	this.getGeneration = function(genNumber) {
		if(genNumber >= this.generations.length) {
			return null;
		};
		return this.generations[genNumber];
	};

	/**
	 * Get the mother of a generation directly.
	 */
	this.getMotherOfGeneration = function(genNumber) { 
		return this.getGeneration(genNumber).mother || null;
	};

	/**
	 * Get the father of a generation directly.
	 */
	this.getFatherOfGeneration = function(genNumber) { 
		return this.getGeneration(genNumber).father || null;
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

