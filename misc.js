/**
 * Random integer generation.
 * 		- rand() returns 0 or 1
 * 		- rand(n) returns 0 through n-1
 */
function rand(n)
{
	if(typeof n == 'undefined' || n <= 1) {
		return Math.round(Math.random()); // XXX: Is this correct?
	}
	return Math.floor(Math.random()*n);
};

/**
 * Assert function.
 * 	XXX: Is this correct?
 */
function assert(stmt, msg)
{
	if(!stmt) {
		if(typeof(msg) == 'undefined') {
			msg = 'Undocumented Assert Failed.';
		};
		alert(msg);
		throw new Error(msg);
	};
};

