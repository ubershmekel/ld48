import * as Tone from 'tone'
import { Piano } from '@tonejs/piano'

// const synth = new Tone.Synth().toDestination();
const reverb = new Tone.Reverb({
  "wet": 1,
  "decay": 5,
  "preDelay": 0.01
}).toDestination();
const piano = new Piano({ velocities: 1 }).connect(reverb).toDestination();

piano.load().then(() => {
  console.log('loaded!')
})

// A1, B1, ..., G1, A2, ...
const chords = [
  'C2B3E3G3',
  'D2C3F3A4',
  'E2D3G3B4',
  'F2E3A3C4',
  'G2F3B3D4',
  'C3E3G3C4',
  // 'G1C3E3',
  // 'A1C3F3',
  // 'A2C4E4',
  // 'C3F4G4',
];

const noteDurationSeconds = 0.8;

function chordStrSplit(text: string) {
  // 'abcdefg' -> ['ab', 'cd', 'ef']
  return text.match(/.{2}/g) || [];
}

function sleep(ms: number) {
  // https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function playNotes(notesStr: string, durationSeconds: number) {
  const notesArray = chordStrSplit(notesStr);
  for (const note of notesArray) {
    // synth.triggerAttackRelease(note, durationSeconds);
    piano.keyDown({ note, velocity: 0.5 });
  };

  await sleep(durationSeconds * 1000);

  for (const note of notesArray) {
    // synth.triggerAttackRelease(note, durationSeconds);
    piano.keyUp({ note });
    await sleep(Math.random() * 0.3);
  };

  return sleep(durationSeconds * 1000 + 100);
}

export async function playDistance(distance: number) {
  // `distance` is 0.0 is closest
  // 1.0 or greater is farther
  if (distance > 0.99) {
    // avoid out of bounds array index
    distance = 0.99;
  }
  if (distance < 0.0) {
    distance = 0.0;
  }
  // Math.floor(chords.length * distance) === [0, chords.length - 1]
  // chordIndex === [0, chords.length - 1], but the larger the distance, the lower the index
  const chordIndex = chords.length - Math.floor(chords.length * distance) - 1;

  return playNotes(chords[chordIndex], noteDurationSeconds);
}

export async function welcomeSound() {
  //play a middle 'C' for the duration of an 8th note
  // synth.triggerAttackRelease(["C4", "C3"], "8n");

  // const notes = ["C4", ["E4", "D4", "E4"], "G4", ["A4", "G4"]];
  // const seq = new Tone.Sequence((time, note) => {
  //   synth.triggerAttackRelease(note, 0.1, time);
  //   // subdivisions are given as subarrays
  // }, notes).start(0);
  // seq.loop = false;
  // Tone.Transport.start();

  playNotes(chords[0], noteDurationSeconds);

  // for (const chord of chords) {
  //   await playNotes(chord, noteDurationSeconds);
  // }
  // synth.triggerAttackRelease('C4', "8n");
  // synth.triggerAttackRelease('E4', "8n");

  // seq.start();
  // Tone.Transport.loop = false;
}

document.addEventListener("visibilitychange", _event => {
  // Mute when the user changes tabs
  // https://stackoverflow.com/questions/10338704/javascript-to-detect-if-user-changes-tab
  if (document.visibilityState == "visible") {
    Tone.getDestination().mute = false;
  } else {
    Tone.getDestination().mute = true;
  }
})
