// chrome.runtime.onMessage.addListener(request=>{
//   if(request.action[0]==="clickGreen"){
//     chrome.tabs.query
//       chrome.scripting.executeScript({
//         target: { tabId: request.action[1] },
//         func: ()=>{
//           document.querySelector('.full-nav').click()
//           console.log("clicked dashbaord")
//           if(document.querySelector('#root')){
//             const observer = new MutationObserver((mutations, observer)=>{
//               for(let mutation of mutations){
//                 if(mutation.type ==='childList'){
//                   console.log("Mutation detected...")
//                   if(document.querySelector('.view-go')){
//                     button = document.querySelector('.view-go')
//                     console.log("About to click...",button)
//                     chrome.runtime.sendMessage({ action: "clickGreen"});
//                     console.log("Sent click request")
//                   }
//                 }
//               }
//             })
//             // Start observing the target node for configured mutations
//             observer.observe(document.querySelector('#root'), { childList: true, subtree: true });
//           }
//         }
//       })
//   }
// })