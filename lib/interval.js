// interval.js

// Number to name map for interval
// 0 is not a valid interval number
var numberName = [null, 'Unison', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth',
  'Seventh', 'Octave', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth'];

// Quality to name map for interval
var qualityName = { 'M': 'Major', 'm': 'Minor', 'P': 'Perfect', 'dim': 'Diminished', 'aug': 'Augmented' };

// Maps quality of interval to quality of inverted interval
var invertedQualities = { 'P': 'P', 'M': 'm', 'm': 'M', 'dim': 'aug', 'aug': 'dim' }

var isPerfect = function (n) {
  return [1, 4, 5, 8, 11, 12].indexOf(n) > -1;
};

var rejectInvalidIntervals = function (number, quality) {
  var badPerfect = isPerfect(number) && ['M', 'm'].indexOf(quality) > -1;
  var badMajor = !isPerfect(number) && quality === 'P';

  if (badPerfect || badMajor || number > 14) {
    throw new Error('Invalid interval: ' + quality + number);
  }
};

var handleAliases = function (quality) {
  return quality.replace(/^A$/, 'aug')
                .replace(/^d$/, 'dim')
                .replace(/^maj$/, 'M')
                .replace(/^min$/, 'm')
                .replace(/^perf$/, 'P');
};

// Parse a string and return an interval object
var parse = function (interval) {
  var quality;
  var number;

  if (interval instanceof Interval) return interval;

  quality = interval.replace(/\d/g, ''); // Remove digits
  number = parseInt(interval.replace(/\D/g, ''), 10); // Remove non-digits

  if (!quality) { // No quality given, assume major or perfect
    quality = isPerfect(number) ? 'P' : 'M';
  }

  return new Interval(number, quality);
};

var Interval = function (number, quality) {
  quality = handleAliases(quality);
  rejectInvalidIntervals(number, quality);

  this.number = number;
  this.quality = quality;

  // Abbreviated interval name
  // Example: M6
  this.name = quality + number;

  // Full interval name
  // Example : Major Sixth
  this.fullName = qualityName[quality] + ' ' + numberName[number];

  this.toString = function () {
    return this.name;    
  };
};

// Return the equivalent interval in the opposite direction, e.g. m3 -> M6
Interval.prototype.invert = function () {
  var quality = invertedQualities[this.quality];
  var number;

  if (this.number === 1 || this.number === 8) number = this.number;
  if (this.number < 8) number = 9 - this.number;
  else number = 23 - this.number 

  return new Interval(number, quality);
};

module.exports.parse = parse;
module.exports.isPerfect = isPerfect;

module.exports.create = function (number, quality) {
  return new Interval(number, quality);
};