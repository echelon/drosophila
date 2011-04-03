/**
 * Genotype.
 * Anything encoded in the genome is present here. (TODO: Better doc)
 *
 * Note: This does not represent an individual, rather 
 * a 'class' of such individuals.
 */
function Genotype()
{
	// The genes dict is indexed by Trait abbreviation. Where
	// non-WT Alleles exist, there is a list that contains one
	// or two Alleles. (WT traits are not encoded at all.)
	// TODO: This is probably not an optimal way to encode this.
	this.genes = {}; 

	this.sex = 'f'; // TODO: Read straight from genome? 


	/**
	 * Get the sex (m or f).
	 */
	this.getSex = function() { return this.sex; };

	/**
	 * Return textual representation of sex.
	 * TODO: Capitalization feature is terrible.
	 */
	this.getSexStr = function(caps) {
		if(this.sex == 'f') {
			if(caps) {
				return 'Female';
			};
			return 'female';
		};
		if(caps) {
			return 'Male';
		};
		return 'male';
	};

	/**
	 * Set the sex.
	 */
	this.setSex = function(sex)
	{
		sex = sex.toLowerCase();
		switch(sex) {
			case 'm':
			case 'male':
				this.sex = 'm';
				return;
			case 'f':
			case 'female':
				this.sex = 'f';
				return;
		};
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
	 * For any trait a non-WT allele is selected, return it in a map of
	 * {traitAbbr:allele}.
	 */
	this.traitAlleleMap = function()
	{
		var map = {};

		for(var abbr in this.genes) {
			var tr = this.genes[abbr];
			if(tr.length >= 1) {
				map[abbr] = tr[0];
			};
		};
		return map;
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
	 * Make a copy of the current genotype.
	 */
	this.copy = function()
	{
		var geno = new Genotype();
		
		geno.sex = this.sex;
		for(var k in this.genes) {
			geno.genes[k] = this.genes[k];
		};

		return geno;
	};

	/**
	 * A hash map function for the Genotype.
	 * In the format 'sex/allele/allele/allele...' where the alleles
	 * are sorted alphabetically and the allele copy numbers is 
	 * represented. 
	 */
	this.hash = function()
	{
		var str = '';
		var keys = [];

		str += this.sex + '/';

		for(var abbr in this.genes) {
			keys.push(abbr);	
		};
		keys.sort();
		
		for(var i in keys) {
			var tr = this.genes[keys[i]];
			var abbrs = [];
			if(tr.length == 1) {
				abbrs.push(tr[0].code);
			}
			else if(tr.length == 2) {
				abbrs.push(tr[0].code);
				abbrs.push(tr[1].code);
			};
			abbrs.sort();
			for(var j in abbrs) {
				str += abbrs[j] + '/';
			};
		};
		return str;
	}

	/**
	 * Determine if two Genotypes are the same.
	 */
	this.equals = function(genotype)
	{
		if(this.sex != genotype.sex) {
			return false;
		};

		if(this.numTraits() != genotype.numTraits()) {
			return false;
		};
		
		for(abbr in this.genes) {
			if(!genotype.genes[abbr]) {
				return false;
			};
			if(this.genes[abbr].length != genotype.genes[abbr].length) {
				return false;
			};

			// Compare the alleles of the Trait to each other.
			if(this.genes[abbr].length == 1 && 
					this.genes[abbr][0] != genotype.genes[abbr][0]) {
				return false;
			}
			else {
				var a = this.genes[abbr][0];
				var b = this.genes[abbr][1];
				var c = genotype.genes[abbr][0];
				var d = genotype.genes[abbr][1];
				if((a != c || b != d) && (a != d || b != c)) {
					return false;
				}
			}
		};
		return true;
	};

	/**
	 * Whether the Genotype is a valid one.  
	 * eg. Lethal X-linked males are invalid.
	 */
	this.valid = function()
	{
		for(abbr in this.genes)
		{
			var tr = this.genes[abbr];
			if(tr.length == 1) {
				if(tr[0].isLethal() && !tr[0].isAutosomal() 
						&& this.sex == 'm') {
					return false; // Lethal X-linked male
				}
			}
			else if(tr.length == 2) {
				if(tr[0].isLethal() && tr[1].isLethal()) {
					return false; // Two lethal alleles!
				};
				if(!tr[0].isAutosomal() && !tr[1].isAutosomal() 
						&& this.sex == 'm') {
					// Can't have a male with two X-linked alleles in
					// the same trait.
					return false; 
				};
				if((tr[0].isLethal() && !tr[0].isAutosomal() 
						&& this.sex == 'm') || (tr[1].isLethal() 
						&& !tr[1].isAutosomal() && this.sex == 'm'))  {
					return false; // Lethal X-linked allele in a male (bizarre)
				};
			}
			else {
				return false; // Too many alleles! Can only have two. 
			};
		};
		return true;
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

	/**
	 * Set heterozygous for two alleles. Used by recombine().
	 * TODO: I don't like this. 
	 * XXX: Does not check for improper configurations, such as double 
	 * lethals and double X-linked males.
	 */
	this._setAlleles = function(a1, a2)
	{
		var loc = '';
		
		if(a1) {
			loc = a1.trait.abbr.toUpperCase();
		}
		else if(a2) {
			loc = a2.trait.abbr.toUpperCase();
		}
		else {
			return; // XXX: Alert/warning
		}
		this.genes[loc] = [];

		if(a1) {
			this.genes[loc].push(a1);
		};
		if(a2) {
			this.genes[loc].push(a2);
		};
	};

	/**
	 * Recombine two genomes, return new Generation object.
	 * TODO TODO TODO -- THIS IS NOT IDEAL
	 * I need to write a combinatoric function, because this is insanely
	 * lazy and makes a huge performance hit. Very unsophisticated. 
	 */
	this.recombine = function(genotype, number)
	{
		var mother, father;

		// Func: Get a union of all traits
		var traitUnion = function(genoA, genoB) {
			dict = {};
			for(var abbr in genoA.genes) {
				dict[abbr] = 1;
			};
			for(var abbr in genoB.genes) {
				dict[abbr] = 1;
			}
			return dict;
		};

		if(this.sex == 'm') {
			father = this;
			mother = genotype;
		}
		else {
			father = genotype;
			mother = this;
		};

		var offspring = [];
		var vary = rand(20); // TODO: Poor randomization
		var traits = traitUnion(this, genotype);	

		if(typeof number == 'undefined') {
			number = 1000 // TODO: Poor default choice
		};

		//number += vary;
		
		for(var i = 0; i < number; i++) {
			var indiv = new Genotype();
			var newSex;

			if(rand()) {
				newSex = 'm';
			}
			else {
				newSex = 'f';
			};

			indiv.setSex(newSex);

			for(abbr in traits) {
				var a1 = null;
				var a2 = null;
				var idx = 0;
				if(abbr in mother.genes) {
					idx = rand();
					if(idx in mother.genes[abbr]) {
						a1 = mother.genes[abbr][idx];
					};
				};
				if(abbr in father.genes) {
					idx = rand();
					if(idx in father.genes[abbr] && 
							!(newSex == 'm' && 
								!father.genes[abbr][idx].isAutosomal())) {
						a2 = father.genes[abbr][idx];
					};
				};
				indiv._setAlleles(a1, a2);
			};

			if(!indiv.valid()) {
				continue;
			}
			offspring.push(indiv);
		};

		return new Generation(this, genotype, offspring);
	};
};

