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
  openLocal('updates.html')
  window.close()
  console.log('opened updates.html')
})

function inject(file, request_url){
  if(file){
  var targetTab
    chrome.tabs.query({'url':request_url}, tabs => {
      if(tabs.length>0){
        chrome.tabs.update(tabs[tabs.length-1].id, {active: true})
        targetTab = tabs[tabs.length-1].id
        chrome.scripting.executeScript({
          target: {tabId: targetTab},
          files: [file]
        })
      }
      else{
        console.log("No matching tabs found - ",tabs)
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
    chrome.tabs.query({'url': request_url}, tabs => {
      if(tabs && tabs.length>0){
        chrome.tabs.update(tabs[tabs.length-1].id, {active: true})
      }
      else{
        chrome.tabs.create({url: request_url})
      }
    })
  }
}

// function openLocal(request_url){
//   if(request_url){
//     var longWang = chrome.runtime.getURL(request_url)
//     chrome.tabs.query({'url': longWang}, tabs => {   
//       if(tabs && tabs.length>0){
//         chrome.tabs.update(tabs[tabs.length-1].id, {active: true})
//       }
//       else{
//         chrome.tabs.create({url: request_url})
//       }
//     })
//   }
// }