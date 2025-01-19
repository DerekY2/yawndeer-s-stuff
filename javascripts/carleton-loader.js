function loader(node){
  inject2(node.dataset.injection, node.dataset.url, node.dataset.timetables)
}

// background script
// 

function inject2(file, login, timetables){
  chrome.tabs.query({ active: true, url: timetables },tab=>{
    if(tab.length>0){
      chrome.storage.session.set({['timetable-requested']:[true,'carleton', file]}, ()=>{
        injectScript(tab[0].id, file);
      })
    }
    else{ // if auto-navigate
      chrome.storage.session.set({['timetable-requested']:[true,'carleton', file]}, ()=>{
        chrome.runtime.sendMessage({ action: 'newCarletonTempTab', login:login, type:'timetable'});
      });
    }
  })
}

function injectScript(tabId, file) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [file]
  });
}

export { loader }