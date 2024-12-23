// click listener & menu toggle - nodes
let nodes = document.querySelectorAll(".node");
nodes.forEach(node => {
  node.addEventListener("click", (e)=>{
    let nodeParent = e.target.closest("li");
    //clog(selectionParent)
    nodeParent.classList.toggle("showMenu")
  })
})

// click listener & open options page
let staticNodes = document.querySelectorAll(".node.static.config");
staticNodes.forEach(node => {
  node.addEventListener("click", (e)=>{
    chrome.runtime.openOptionsPage()
  })
})

// click listener - selectors
let nodeSelectors = document.querySelectorAll(".selector");
nodeSelectors.forEach(selector =>{
  selector.addEventListener("click", (e)=>{
    e.preventDefault
    inject(selector.dataset.injection, selector.dataset.url)
  })
})

// listener - open updates.html when clicked
let showUpdates = document.querySelector('.show-version-details')
showUpdates.addEventListener('click',(e)=>{
  open(showUpdates.dataset.url)
  window.close()
})

function inject(file, request_url){
  if(file){
  var targetTab
    chrome.tabs.query({'url':request_url}, tabs => {
      if(tabs && tabs.length>0){
        chrome.tabs.update(tabs[tabs.length-1].id, {active: true})
        targetTab = tabs[tabs.length-1].id
        chrome.scripting.executeScript({
          target: {tabId: targetTab},
          files: [file]
        })
      }
      else{
        chrome.tabs.create({url: request_url}, tab =>{
          targetTab = tab.id
          chrome.scripting.executeScript({
            target: {tabId: targetTab},
            files: [file]
          })
        })
      }
    })
  }
}

function open(request_url){
  if(request_url){
    chrome.tabs.query({'url':request_url}, tabs => {
      if(tabs.length>0){
        chrome.tabs.update(tabs[tabs.length-1].id, {active: true})
      }
      else{
        chrome.tabs.create({url: request_url})
      }
    })
  }
}