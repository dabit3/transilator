let changeColor = document.getElementById('changeColor');

let color = 'red'

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.body.style.backgroundColor = "' + color + '";'});
  });
};

console.log('about to attach listener...')

const log = chrome.extension.getBackgroundPage().console.log;
log('something')


document.addEventListener('DOMContentLoaded', function () {
  console.log('listener attached...')
});

// function myAlert(){
//   alert('hello world');
// }

// document.addEventListener('DOMContentLoaded', function () {
//   document.getElementById('alertButton').addEventListener('click', myAlert);
// });