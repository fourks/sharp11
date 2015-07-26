var chord = require('../lib/chord');

var assert = require('assert');

describe('Chord', function () {
  describe('#create', function () {
    it('should create a chord', function () {
      var c = chord.create('C7');
      assert.equal(c.root.name, 'C');
      assert(!c.bass);
      assert.equal(c.symbol, '7');
      assert.equal(c.toString(), 'C E G Bb');

      c = chord.create('C 7');
      assert.equal(c.toString(), 'C E G Bb');
    });

    it('should default to a major triad', function () {
      var c = chord.create('C');
      assert.equal(c.toString(), 'C E G');
    });

    it('should handle chord symbol aliases', function () {
      assert.equal(chord.create('Cmin').symbol, 'm');
      assert.equal(chord.create('Cmin').name, 'Cmin');
      assert.equal(chord.create('Cmin').toString(), 'C Eb G');
      assert.equal(chord.create('Cdom7').toString(), 'C E G Bb');
      assert.equal(chord.create('CminMaj9#11').toString(), 'C Eb G B D F#');
    });

    it('should handle slash chords', function () {
      var c = chord.create('C7/E');
      assert.equal(c.symbol, '7');
      assert.equal(c.bass.name, 'E');
      assert.equal(c.name, 'C7/E');
      assert.equal(c.toString(), 'E G Bb C');

      c = chord.create('Fmaj7/G');
      assert.equal(c.toString(), 'G F A C E');
    });
  });

  describe('#transpose', function () {
    it('should transpose a chord', function () {
      var c = chord.create('F7').transpose('m3');
      assert.equal(c.name, 'Ab7');
      assert.equal(c.toString(), 'Ab C Eb Gb');

      c = chord.create('F7/A').transpose('m3');
      assert.equal(c.name, 'Ab7/C');
      assert.equal(c.toString(), 'C Eb Gb Ab');
    });
  });

  describe('#clean', function () {
    it('should clean a chord', function () {
      var c = chord.create('C#+').clean();
      assert.equal(c.toString(), 'C# F A');

      c = chord.create('C#+/G##').clean();
      assert.equal(c.toString(), 'A C# F');

      c = chord.create('Cb').clean();
      assert.equal(c.root.name, 'B');
      assert.equal(c.toString(), 'B D# F#');

    });
  });

  describe('#identify', function () {
    it('should identify a chord', function () {
      assert.equal(chord.identify('C', 'E', 'G'), 'C');
      assert.equal(chord.identify('C', 'Eb', 'G', 'B'), 'CmM7');
      assert.equal(chord.identify('B', 'D', 'F#', 'G#'), 'Bm6');
      assert.equal(chord.identify('D', 'A'), 'D5');
      assert.equal(chord.identify('D', 'G', 'A'), 'Dsus4');
      assert.equal(chord.identify('Eb', 'Bb'), 'Eb5');
      assert.equal(chord.identify('Eb', 'Bb', 'Db'), 'Ebn7');
    });

    it('should identify the proper inversion', function () {
      assert.equal(chord.identify('E', 'G', 'C'), 'C/E');
      assert.equal(chord.identify('E', 'G', 'Bb', 'C'), 'C7/E');
      assert.equal(chord.identify('F#', 'C', 'Eb', 'G', 'B', 'D'), 'CmM9#11/F#');
    });
  });
});