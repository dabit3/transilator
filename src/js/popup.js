import "../css/popup.css";

window.addEventListener('DOMContentLoaded', (event) => {
  document.addEventListener('click', function(identifier) {
    const language = identifier.toElement.dataset.id
    if (!language) return
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {language}, function(response) {
        return true
      });
    });
  })
});

