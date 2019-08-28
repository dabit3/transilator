// import Amplify, { Storage, Predictions } from 'aws-amplify';
// import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';

const Amplify = require('aws-amplify')
console.log('Amplify: ', Amplify)

let audio = null

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
  console.log('text: ', text)
  // audio = new Audio('https://s3.amazonaws.com/audio-experiments/examples/elon_mono.wav');
  // audio.play();

  // audio.addEventListener("ended", function(){
  //   audio.pause();
  //   audio.currentTime = 0;
  //   audio = null
  // });

  console.log('audio played...')
})