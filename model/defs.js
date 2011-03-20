
/**
 * Builds our Alleles and Traits and stores them in the 
 * registry.
 */
function __build()
{
	// Pseudo-constants, make the list look cleaner.
	var Dominant = true;
	var Lethal = true;
	var X = 'x';

	/*********** TRAITS ************/
	var br = new Trait('Bristle', 'BR');
	var bc = new Trait('Body Color', 'BC');
	var an = new Trait('Antennae', 'AN');
	var ec = new Trait('Eye Color', 'EC');
	var es = new Trait('Eye Shape', 'ES');
	var sz = new Trait('Wing Size', 'SZ');
	var sh = new Trait('Wing Shape', 'SH');
	var vn = new Trait('Wing Vein', 'VN');
	var ag = new Trait('Wing Angle', 'AG');

	Reg([br, bc, an, ec, es, sz, sh, vn, ag]);

	/*********** ALLELES ***********/

	// Bristle
	Reg(new Allele('Forked', 'F', br, X, 56.3));
	Reg(new Allele('Shaven', 'SV', br, 4, 3.0));
	Reg(new Allele('Singed', 'SN', br, X, 21.0));
	Reg(new Allele('Spineless', 'SS', br, 3, 58.5));
	Reg(new Allele('Stubble', 'SB', br, 3, 58.2, Dominant, Lethal));

	// Body Color
	Reg(new Allele('Black', 'BL', bc, 2, 48.5));
	Reg(new Allele('Ebony', 'E', bc, 3, 70.7));
	Reg(new Allele('Sable', 'S', bc, X, 43.0));
	Reg(new Allele('Tan', 'T', bc, X, 27.7));
	Reg(new Allele('Yellow', 'Y', bc, X, 0.0));

	// Antennae
	Reg(new Allele('Aristapedia', 'AR', an, 3, 47.7, Dominant));

	// Eye Color
	Reg(new Allele('Brown', 'BW', ec, 2, 104.5));
	Reg(new Allele('Purple', 'PR', ec, 2, 54.5));
	Reg(new Allele('Sepia', 'SE', ec, 3, 26.0));
	Reg(new Allele('White', 'W', ec, X, 1.5));

	// Eye Shape
	Reg(new Allele('Bar', 'B', es, X, 57.0, Dominant));
	Reg(new Allele('Eyeless', 'EY', es, 4, 2.0));
	Reg(new Allele('Lobe', 'L',	es, 2, 72.0, Dominant));
	Reg(new Allele('Star', 'ST', es, 2, 1.3, Dominant, Lethal));

	// Wing Size
	Reg(new Allele('Apterous', 'AP', sz, 2, 55.4));
	Reg(new Allele('Miniature', 'M', sz, X, 36.1));
	Reg(new Allele('Vestigial', 'VG', sz, 2, 67.0));

	// Wing Shape
	Reg(new Allele('Curly', 'CY', sh, 2, 6.1, Dominant, Lethal));
	Reg(new Allele('Curved', 'C', sh, 2, 75.5));
	Reg(new Allele('Dumpy', 'DP', sh, 2, 13.0));
	Reg(new Allele('Scalloped', 'SD', sh, X, 51.5));

	// Wing Vein
	Reg(new Allele('Crossveinless', 'CV', vn, X, 13.7));
	Reg(new Allele('Radius Incomplete', 'RI', vn, 3, 48.4));

	// Wing Angle
	Reg(new Allele('Dichaete', 'D', ag, 3, 41.0, Dominant, Lethal));
};

__build();

