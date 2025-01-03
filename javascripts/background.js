// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'startListener' && message.url && message.file) {
//     console.log('Received background request');
//     const iurl='https://central.carleton.ca/prod/bwskfshd.P_CrseSchd'
//     // Define a function to handle the onCompleted event
//     const handleNavigationCompleted = (details) => {
//       // Check if the URL matches your criteria
//       if (details.frameId === 0 && details.url.includes(iurl)) {
//         chrome.scripting.executeScript({
//           target: { tabId: details.tabId },
//           files: [message.file]
//         });
//         console.log('Injected script into tab:', details.tabId);
//       }
//     };

//     // Add the listener for the onCompleted event
//     chrome.webNavigation.onCompleted.addListener(handleNavigationCompleted);

//     // Optionally, you can remove the listener after a certain condition is met
//     // For example, after a certain number of injections or after a timeout
//     // Here, we remove the listener after 5 minutes (300000 milliseconds)
//     setTimeout(() => {
//       chrome.webNavigation.onCompleted.removeListener(handleNavigationCompleted);
//       console.log('Removed navigation completed listener after timeout');
//     }, 300000); // 5 minutes
//   }
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'navigateLeft') {
//     chrome.tabs.query({ currentWindow: true }, (tabs) => {
//       chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
//         if (activeTabs.length > 0) {
//           const currentTab = activeTabs[0];
//           const currentIndex = currentTab.index;

//           // Find the index of the tab to the left
//           const leftTabIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;

//           // Activate the tab to the left
//           chrome.tabs.update(tabs[leftTabIndex].id, { active: true });
//         }
//       });
//     });
//   } else if (message.action === 'alertRight' && message.message) {
//     chrome.tabs.query({ currentWindow: true }, (tabs) => {
//       chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
//         if (activeTabs.length > 0) {
//           const currentTab = activeTabs[0];
//           const currentIndex = currentTab.index;

//           // Find the index of the tab to the right
//           const rightTabIndex = (currentIndex + 1) % tabs.length;

//           // Activate the tab to the right
//           chrome.tabs.update(tabs[rightTabIndex].id, { active: true }, () => {
//             // Inject a script to show an alert in the right tab
//             chrome.scripting.executeScript({
//               target: { tabId: tabs[rightTabIndex].id },
//               func: (msg) => alert(msg),
//               args: [message.message]
//             });
//           });
//         }
//       });
//     });
//   }
// });



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);

  if (message.action === 'closeTab' && sender.tab) {
    chrome.tabs.remove(sender.tab.id, () => {
      console.log('Tab closed:', sender.tab.id);
    });
  } 
  
  else if (message.action === 'closeRightTab' && sender.tab) {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const currentTabIndex = sender.tab.index;
      const rightTabIndex = (currentTabIndex + 1) % tabs.length;

      if (tabs[rightTabIndex]) {
        chrome.tabs.remove(tabs[rightTabIndex].id, () => {
          console.log('Closed tab to the right:', tabs[rightTabIndex].id);
        });
      } else {
        console.log('No tab to the right found.');
      }
    });
  } 
  
  else if (message.action === 'closeLeftTab' && sender.tab) {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const currentTabIndex = sender.tab.index;
      const leftTabIndex = currentTabIndex > 0 ? currentTabIndex - 1 : -1;

      if (leftTabIndex >= 0 && tabs[leftTabIndex].url === 'https://central.carleton.ca/prod/bwskfshd.P_CrseSchd') {
        chrome.tabs.remove(tabs[leftTabIndex].id, () => {
          console.log('Closed tab to the left with the specified URL:', tabs[leftTabIndex].id);
        });
      } else {
        console.log('No tab to the left with the specified URL found.');
      }
    });
  } 
 
  else if (message.action === 'closeMostRecentTab') {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        tabs.sort((a, b) => b.id - a.id);
        const mostRecentTab = tabs[0];
        console.log('about to close:',mostRecentTab)
        chrome.tabs.remove(tabs[1].id, () => {
          console.log('Closed tab:', tabs[1].id);
        });
      } else {
        console.log('No tabs found.');
      }
    })
  }

  else if(message.action==='newCarletonTempTab'){
    if(message.type=='login'){
      var key='tempLoginCU'
    }else{
      key = 'tempTimetableCU'
    }
    chrome.storage.session.get(key,(result)=>{
      var temp = result[key]?result[key]:[];
      newTempTab = message.tab
      temp.push(newTempTab)
      chrome.storage.session.set({[key]: temp},()=>{
        console.log('Tracking new,',key,'tab:',newTempTab,'.\nTotal:',temp)
      })
    })
  }

  else if(message.action==='closeTempTabs'){
    if(message.type=='tempLoginCU'){
      var key='tempLoginCU'
    }else{
      key = 'tempTimetableCU'
    }
    chrome.storage.session.get(key,(result)=>{
      var tabs=result[key]
      console.log('About to close temp:',tabs)
      if(tabs&&tabs.length>0)
        tabs.forEach(tab=>{
          try{
            chrome.tabs.remove(tab.id,()=>{
              console.log('removed',key,'tab:',tab)
            })
          }
          catch(err){
            console.error(err)
          }
        })
        tabs=[]
        chrome.storage.session.set({[key]:tabs},()=>{
          console.log('Updated', key,'.\nRemaining tabs:', tabs);
        })
    })
  }
});


function store(key, val){
  chrome.storage.local.get(key, (result)=> {
    if (chrome.runtime.lastError) {
        console.error("Error retrieving key:", key, chrome.runtime.lastError);
        return;
    }
    const original = result[key]; // Retrieve the current value
    if(Array.isArray(original)&&Array.isArray(val)){
      var  eq=arraysEqual(original,val)
    }else{
      var eq=original===val
    }
    if (!eq) { // Only update if the value is different
      console.log("About to save - ", original, " ==> ", val);
      chrome.storage.storage.set({ [key]: val }, function() {
        if (chrome.runtime.lastError) {
          console.error("Error saving value:", key, chrome.runtime.lastError);
        }
        else{
          console.log("Value saved successfully for", key, ":", val);
        }
        refresh[key](key)
      });
    } else {
      console.log("No change detected. Value not updated for key:", key);
    }
  });
}