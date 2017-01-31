var jazz = require('../lib/jazz');
var jza = require('../lib/jza');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var samples = _.reject(fs.readdirSync(path.join(__dirname, '..', 'corpus')), function (filename) {
  return filename[0] === '.';
});

var parsedSamples = _.map(samples, function (filename) {
  return jazz.parseFile(path.join(__dirname, '..', 'corpus', filename));
});

var songs = _.compact(_.map(parsedSamples, function (j) {
  try {
    return _.compact(_.map(j.sectionChordLists(), function (chordList) {
      if (!chordList.length) return null;

      return _.map(chordList, function (chord) {
        return jza.symbolFromChord(j.getMainKey(), chord);
      });
    }));
  } catch (err) {
    return null;
  }
}));

var totalSongs = 0;
var passedSongs = 0;
var totalSections = 0;
var passedSections = 0;
var totalSectionsSize = 0;

_.each(songs, function (song, i) {
  var sections = 0;

  console.log(samples[i]);

  totalSongs += 1;
  totalSections += song.length;

  _.each(song, function (section) {
    if (jza.jza().validate(section)) sections++;
    totalSectionsSize += section.length;
  });

  passedSections += sections;
  if (song.length === sections) passedSongs++;
});

console.log('Songs: ' + passedSongs / totalSongs);
console.log('Sections: ' + passedSections / totalSections);
console.log('Average Section Size: ' + totalSectionsSize / totalSections);
