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
      chrome.tabs.create({ url: login }, (newTab)=>{
        chrome.storage.session.set({['timetable-requested']:[true,'carleton', file]}, ()=>{
        chrome.runtime.sendMessage({ action: 'newCarletonTempTab', tab: newTab, type:'timetable'});
          injectScript(newTab.id, file);
        })
        // Keep track of this tab
        // chrome.runtime.sendMessage({ action: 'newCarletonTempTab', tab: newTab, type:'login'});
      });
      // chrome.tabs.create({ url: timetables }, newTab=>{
      //   injectScript(newTab.id, file);
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