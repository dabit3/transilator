'use strict';

const script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.extension.getURL('main.js'));
const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.lastChild);

// let audio = null

// document.addEventListener('mouseup', function translator() {
//   let text = ""
//   if (window.getSelection) {
//       text = window.getSelection().toString();
//   } else if (document.selection && document.selection.type != "Control") {
//       text = document.selection.createRange().text;
//   }
//   if (audio) {
//     audio.pause();
//     audio.currentTime = 0;
//   }
//   console.log('text: ', text)
//   // audio = new Audio('https://s3.amazonaws.com/audio-experiments/examples/elon_mono.wav');
//   // audio.play();

//   // audio.addEventListener("ended", function(){
//   //   audio.pause();
//   //   audio.currentTime = 0;
//   //   audio = null
//   // });

//   console.log('audio played...')
// })