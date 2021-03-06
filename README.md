# Sharp11
Music theorization and improvisation engine

## Introduction
Sharp11 is an npm module for performing music theory operations, ranging from simple things like transposing a note to complicated things like generating an ordered list of scales that can be played over a given chord.  I also built an [interactive web front-end](http://julianrosenblum.com/sharp11-client) to showcase the features of Sharp11, which I encourage you to play around with.

## So what can Sharp11 do?
That's a good question.  Sharp11 can do a lot of really cool things.  It can perform music theory operations on notes.  It can produce and traverse scales.  It can tell you the notes in a chord given a chord symbol.  It can give you a reasonable chord symbol for a group of notes.  It can generate a jazz improvisation given chord changes and produce MIDI output.  The current version of sharp11 is just an API.  With the exception of the MIDI output option, all of these operations work within the world of Sharp11 objects ([note](https://github.com/jsrmath/sharp11/blob/master/docs/note.md), [scale](https://github.com/jsrmath/sharp11/blob/master/docs/scale.md), [chord](https://github.com/jsrmath/sharp11/blob/master/docs/chord.md), etc.).  The way I see it, these are the core modules of Sharp11 with which some cool programs can be built.  I consider the improv engine and the web front-end to be examples of projects that can be built with the core Sharp11 API.

## Help me figure out what else Sharp11 can do
I embarked on Sharp11 with a clear sense of the functionality I wanted to implement but a much less clear sense of what I wanted it to be for the end-user.  And so I call upon you, the open source community.  Build cool things with Sharp11.  Extend the API.  Write applications on top of it.  Help me turn Sharp11 into a computer music ecosystem.

## Mutability
Methods in Sharp11 do not mutate objects, but instead return new ones.  I feel that in music, a C4 should be a C4, not a reference to an object that might become a D4 at some point.  The same goes for chords, scales, and every other use case I've come across.  There's nothing stopping you from mutating objects in Sharp11, but if you plan to extend any Sharp11 APIs or build anything on top of Sharp11, please try to abide by this rule.

## Install
`npm install sharp11`

## API Documentation
Read the full Sharp11 API documentation [here](https://github.com/jsrmath/sharp11/blob/master/docs).

## Example Music Theory Operations
`var s11 = require('sharp11');`

Transposing a note:

```
s11.note.create('Ab').transpose('P4'); // Db
s11.note.create('Ab').transposeDown('P4'); // Eb
s11.note.create('Ab3').transpose('P4'); // Db4
```

Finding the interval between two notes:

```
s11.note.create('C').getInterval('F#'); // aug4
s11.note.create('F').getInterval('Abb'); // dim3
```

Parsing a chord symbol:
```
s11.chord.create('G'); // G B D
s11.chord.create('Am7b5'); // A C Eb G
s11.chord.create('Cmaj7/B'); // B C E G
s11.chord.create('F/G'); // G F A C
s11.chord.create('CmM9#11'); // C Eb G B D F#
```

Identifying a chord:
```
s11.chord.identify('C', 'Eb', 'G', 'A'); // Cm6
s11.chord.identify('A', 'C', 'Eb', 'F'); // F7/A
s11.chord.identify('G', 'B', 'D#', 'F', 'A#'); // G7#5#9
s11.chord.identify('F#', 'C', 'Eb', 'G', 'B', 'D'); // CmM9#11/F#
```

Working with scales
```
s11.scale.create('C', 'major'); // C D E F G A B
s11.scale.create('G', 'altered'); // G Ab Bb Cb Db Eb F
s11.scale.create('F', 'melodic minor').descending(); // [F, Eb, Db, C, Bb, Ab, G]
s11.scale.create('C', 'major').transpose('m3'); // Eb F G Ab Bb C D
s11.scale.create('C', 'major').contains('F'); // true
```
