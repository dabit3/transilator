import Amplify, { Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import config from '../aws-exports.js'

const state = {
  language: 'en',
  getLanguage: function() {
    return this.language
  },
  setLanguage: function(language) {
    this.language = language
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender) {
    if (!sender) return
    state.setLanguage(request.language)
    return true
})

const voices = {
  ar: "Zeina",
  zh: "Zhiyu",
  da: "Naja",
  nl: "Lotte",
  en: "Salli",
  fr: "Chantal",
  hi: "Aditi",
  it: "Carla",
  ja: "Mizuki",
  ko: "Seoyeon",
  no: "Liv",
  pl: "Ewa",
  pt: "Vitoria",
  ru: "Tatyana",
  es: "Penelope",
  sv: "Astrid",
  tr: "Filiz"
}

Amplify.configure(config);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

let source = null

console.log('loaded...');

function interpretFromPredictions(textToInterpret) {
  Predictions.interpret({
    text: {
      source: {
        text: textToInterpret,
      },
      type: "ALL"
    }
  }).then(result => {
    const language = result.textInterpretation.language
    const translationLangugage = state.getLanguage()
    translate(textToInterpret, language, translationLangugage)
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
    generateTextToSpeech(targetLanguage, result.text)
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
  if (text === '') return
  interpretFromPredictions(text)
})

export { state }