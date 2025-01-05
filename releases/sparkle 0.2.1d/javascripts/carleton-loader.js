
import { notify } from "./popup.js"

function loader(node){
  inject2(node.dataset.injection, node.dataset.url, node.dataset.calendar, node.dataset.timetables)
}

function inject2(file, login, calendar, timetables){
  chrome.storage.local.get(['carleton'],(results)=>{
    chrome.tabs.query({ active: true, url: timetables },tab=>{
      if(tab.length>0){
        injectScript(tab[0].id, file)
      }
      else if(results['carleton'][2]){
        chrome.tabs.create({ url: login }, newTab=>{
          injectScript(newTab.id, file);
          // Keep track of this tab
          chrome.runtime.sendMessage({ action: 'newCarletonTempTab', tab: newTab, type:'login'});
        });
        chrome.tabs.create({ url: timetables }, newTab=>{
          injectScript(newTab.id, file);
          chrome.runtime.sendMessage({ action: 'newCarletonTempTab', tab: newTab, type:'timetable'});
        });
      }
      else{
        chrome.tabs.query({ active: true, url: calendar },tab=>{
          if(tab.length>0){
            injectScript(tab[0].id, 'armory/notification.js')
          }
          else{
            notify('.no-timetable-found')
          }
        })
      }
    })
  })
}

function injectScript(tabId, file) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [file]
  });
}


export { loader }