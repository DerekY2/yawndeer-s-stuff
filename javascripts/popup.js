

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

// async function sendRequest(targetTab) {
//   return new Promise((resolve) => {
//     chrome.runtime.sendMessage({ action: ["clickGreen", targetTab]}, resolve);
//   });
// }