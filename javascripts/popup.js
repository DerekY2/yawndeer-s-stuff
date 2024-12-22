

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
console.log(staticNodes)
staticNodes.forEach(node => {
  node.addEventListener("click", (e)=>{
    chrome.runtime.openOptionsPage()
  })
})

// click listener - selectors
let nodeSelectors = document.querySelectorAll(".selector");
// console.log(nodeSelectors)
nodeSelectors.forEach(selector =>{
  selector.addEventListener("click", (e)=>{
    e.preventDefault
    console.log(selector.classList[1],"clicked")
    inject(selector.dataset.injection, selector.dataset.url)
    console.log("Injected",selector.dataset.url,"with",selector.dataset.injection)
  })
})

// listener - open updates.html when clicked
let showUpdates = document.querySelector('.show-version-details')
showUpdates.addEventListener('click',(e)=>{
  open('updates.html')
  window.close()
  console.log('opened updates.html')
})

function inject(file, request_url){
  if(file){
  var targetTab
    chrome.tabs.query({}, tabs => {
      var tabList = []
      tabs.forEach(tab =>{
        if(tab.url===request_url){
          tabList.push(tab)
          console.log("Found ",request_url,"activated:",tab)
        }
      })
      if(tabList.length>0){
        chrome.tabs.update(tabList[tabList.length-1].id, {active: true})
        targetTab = tabList[tabList.length-1].id
        chrome.scripting.executeScript({
          target: {tabId: targetTab},
          files: [file]
        })
      }
      else{
        console.log("No matching tabs found - ",tabList)
        chrome.tabs.create({url: request_url}, tab =>{
          console.log("new tab created")
          targetTab = tab.id
          chrome.scripting.executeScript({
            target: {tabId: targetTab},
            files: [file]
          }).catch(error=>{
            console.error("Error executing script:", error)
          })
          // sendRequest(targetTab)
        })
      }
    })
  }
}

function open(request_url){
  if(request_url){
    chrome.tabs.query({}, tabs => {
      var tabList = []
      tabs.forEach(tab =>{
        if(tab.url.includes(request_url) || tab.url===chrome.runtime.getURL(request_url)){
          tabList.push(tab)
        }else{
        }
      })
      if(tabList.length>0){
        chrome.tabs.update(tabList[tabList.length-1].id, {active: true})
      }
      else{
        chrome.tabs.create({url: request_url})
      }
    })
  }
}