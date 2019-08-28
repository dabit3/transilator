import "../css/popup.css";
import { state } from './content'

window.addEventListener('DOMContentLoaded', (event) => {
  document.addEventListener('click', function(identifier, sender) {
    const language = identifier.toElement.dataset.id
    if (!language) return
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {language}, function(response) {
        console.log('response: ', response)
      });
    });
  })

  var buttons = document.getElementsByClassName("lang-button");

  const language = state.getLanguage()
  Array.from(buttons).forEach(function(button) {
    button.addEventListener('click', function(item) {
      Array.from(buttons).forEach(item => item.classList.remove("button-selected"))
      item.target.classList.add("button-selected")
    });
  });
});

