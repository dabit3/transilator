import Amplify, { Storage, Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';

const config = {

};

const voices = {
  arb: "Zeina",
  cmn: "Zhiyu",
  da: "Naja",
  nl: "Lotte",
  en: "Joanna",
  fr: "Chantal",
  hi: "Aditi",
  is: "Dora",
  it: "Carla",
  ja: "Mizuki",
  ko: "Seoyeon",
  nb: "Liv",
  pl: "Ewa",
  pt: "Vitoria",
  ro: "Carmen",
  ru: "Tatyana",
  es: "Penelope",
  sv: "Astrid",
  tr: "Filiz",
  cy: "Gwyneth"
}

Amplify.configure(config);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

let audio = null
let source = null

console.log('loaded...');

function interpretFromPredictions(textToInterpret) {
  console.log('textToInterpret: ', textToInterpret)
  Predictions.interpret({
    text: {
      source: {
        text: textToInterpret,
      },
      type: "ALL"
    }
  }).then(result => {
    const language = result.textInterpretation.language
    console.log('language: ', language)
    translate(textToInterpret, language, 'en')
  })
    .catch(err => {
      console.log('error: ', err)
    })
}

function translate(textToTranslate, language, targetLanguage) {
  Predictions.convert({
    translateText: {
      source: {
        text: textToTranslate,
        language
      },
      targetLanguage
    }
  }).then(result => {
    console.log('successfully translated: ', result)
    generateTextToSpeech(language, result.text)
  })
    .catch(err => {
      console.log('error translating: ', err)
    })
}

function generateTextToSpeech(language, textToGenerateSpeech) {
  const voice = voices[language]
  Predictions.convert({
    textToSpeech: {
      source: {
        text: textToGenerateSpeech,
      },
      voiceId: voice // default configured on aws-exports.js 
      // list of different options are here https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
    }
  }).then(result => {
    console.log('result: ', result)
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    console.log({ AudioContext });
    const audioCtx = new AudioContext();
    if (source) {
      source.disconnect()
    }
    source = audioCtx.createBufferSource();
    audioCtx.decodeAudioData(result.audioStream, (buffer) => {
      source.buffer = buffer;
      source.playbackRate.value = 1
      source.connect(audioCtx.destination);
      source.start(0);
    }, (err) => console.log({err}));
    
    // setResponse(`Generation completed, press play`);
  })
    .catch(err => {
      console.log('error synthesizing speech: ', err)
    })
}

// https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes

document.addEventListener('mouseup', function translator() {
  let text = ""
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
  }
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  interpretFromPredictions(text)
  // audio = new Audio('https://s3.amazonaws.com/audio-experiments/examples/elon_mono.wav');
  // audio.play();

  // audio.addEventListener("ended", function(){
  //   audio.pause();
  //   audio.currentTime = 0;
  //   audio = null
  // });
})