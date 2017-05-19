// chart.js

var note = require('./note');
var chord = require('./chord');
var duration = require('./duration');
var _ = require('underscore');

var formatChartContent = function (content) {
  if (!content) return {};

  return _.mapObject(content, function (section) {
    return _.map(section, function (obj) {
      var entry = obj;

      // If we're given an array like [Cm7, 4], convert it to { chord: Cm7, duration: 4 }
      if (obj.length > 1) {
        entry = { chord: obj[0], duration: obj[1] };
      }

      // Ensure chord and duration are of proper types
      entry.chord = chord.create(entry.chord);
      entry.duration = duration.asDuration(entry.duration);

      return entry;
    });
  });
};

var Chart = function (sections, content, info) {
  this.sections = sections || [];
  this.content = formatChartContent(content);
  this.info = info || {};

  // Ensure each section has been defined
  _.each(this.sections, function (section) {
    if (!content[section]) {
      throw new Error('Must define content for section ' + section);
    }
  });
};

// Concatenates all the sections in order specified by this.sections
Chart.prototype.chart = function () {
  var content = this.content;

  return _.reduce(this.sections, function (arr, section) {
    return arr.concat(content[section]);
  }, []);
};

// The full chart with the first chord appended to the end
Chart.prototype.chartWithWrapAround = function () {
  return this.chart().length ? this.chart().concat(this.chart()[0]) : [];
};

// The full chart with only chords, no durations
Chart.prototype.chordList = function () {
  return _.pluck(this.chart(), 'chord');
};

// The chord list with the first chord appended to the end
Chart.prototype.chordListWithWrapAround = function () {
  return _.pluck(this.chartWithWrapAround(), 'chord');
};

// A map of each section to a list of chords
Chart.prototype.sectionChordLists = function () {
  return _.mapObject(this.content, function (obj) {
    return _.pluck(obj, 'chord');
  });
};

// Section chord lists with the first chord of the next section appended at the end of each one
Chart.prototype.sectionChordListsWithWrapAround = function () {
  var sections = this.sections;

  return _.mapObject(this.sectionChordLists(), function (chordList, sectionName, allSections) {
    var nextSection = sections[(_.indexOf(sections, sectionName) + 1) % sections.length];
    
    if (allSections[nextSection].length) {
      chordList.push(allSections[nextSection][0]);
    }

    return chordList;
  });
};

// Return the key of the song, or C if not specified
Chart.prototype.key = function () {
  if (!this.info.key) return note.create('C');
  return note.create(this.info.key);
};

// Return the title of the song, or "Untitled" if not specified
Chart.prototype.title = function () {
  return this.info.title || 'Untitled';
};

module.exports.Chart = Chart;

module.exports.create = function (sections, content, info) {
  return new Chart(sections, content, info);
};

module.exports.createSingleton = function (content, info) {
  return new Chart(['A'], { A: content }, info);
};

module.exports.isChart = function (obj) {
  return obj instanceof Chart;
};