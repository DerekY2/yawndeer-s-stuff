const nodes = document.querySelectorAll(".node");
const staticNodes = document.querySelectorAll(".node.static.config");
const nodeSelectors = document.querySelectorAll(".selector");
const configBtns = document.querySelectorAll(".config-btn")
const allOverlays = document.querySelectorAll('.config-overlay')
const darkScreen = document.querySelector(".dark-screen");
const timetableOverlay = document.querySelector(".timetable.config-overlay");
const timetableCloseBtn = document.querySelector(".timetable.close-btn");
const termSaveBtn = document.querySelector('.term-save-btn')
const termResetBtn = document.querySelector('.term-reset-btn')
const showUpdates = document.querySelector('.show-version-details')
const schoolSelect = document.getElementById("school-select");
const semesterSelect = document.getElementById("semester-select");
const yearSelect = document.getElementById("year-select");
const reactionSlider = document.getElementById("reaction-time-goal")
const reactionBoolSlider = document.getElementById('reaction-time-bool')
const reactionInput = document.getElementById("reaction-time-input")
const reactionRangeInput = document.getElementById("reaction-range-input")
const reactionOverlay = document.querySelector(".reaction-time.config-overlay");
const reactionBoolOverlay = document.querySelector(".reaction-time.bool.config-overlay");
const reactionBoolCloseBtn = document.querySelector(".reaction-time-bool.close-btn");
const reactionCloseBtn = document.querySelector(".reaction-time.close-btn");
const reactionBoolSaveBtn = document.querySelector('.reaction-bool-save-btn')
const reactionSaveBtn = document.querySelector('.reaction-save-btn')
const reactionBoolResetBtn = document.querySelector('.reaction-bool-reset-btn')
const reactionResetBtn = document.querySelector('.reaction-reset-btn')
const chimpSlider = document.getElementById("chimp-test-goal")
const chimpInput = document.getElementById("chimp-test-input")
const chimpOverlay = document.querySelector(".chimp-test.config-overlay");
const chimpCloseBtn = document.querySelector(".chimp-test.close-btn");
const chimpSaveBtn = document.querySelector('.chimp-save-btn')
const chimpResetBtn = document.querySelector('.chimp-reset-btn')

// click listener & menu toggle - nodes
nodes.forEach(node => {
  node.addEventListener("click", (e)=>{
    const nodeParent = e.target.closest("li");
    //clog(selectionParent)
    nodeParent.classList.toggle("showMenu")
  })
})

// click listener & open options page
staticNodes.forEach(node => {
  node.addEventListener("click", (e)=>{
    chrome.runtime.openOptionsPage()
  })
})

// click listener - selectors
nodeSelectors.forEach(selector =>{
  selector.addEventListener("click", (e)=>{
    // Check if the click event originated from a config-btn
    if (e.target.closest(".config-btn")) {
      // If so, stop the event from propagating to the parent
      e.stopPropagation();
      return;
    }
    e.preventDefault
    inject(selector.dataset.injection, selector.dataset.url)
  })
})

configBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e)
    let configNode = btn.dataset.sub
    console.log('about to open -',configNode,'via',btn)
    openOverlay(configNode, btn)
  });
});

// Add event listeners for dropdown changes
schoolSelect.addEventListener("change", (e) => {
  console.log("School changed to:", e.target.value);
  refreshTerm(e.target.value)
});

timetableCloseBtn.addEventListener('click',()=>{
  timetableOverlay.classList.add('hidden')
  darkScreen.classList.add("hidden");
})

reactionCloseBtn.addEventListener('click',()=>{
  reactionOverlay.classList.add('hidden')
  darkScreen.classList.add("hidden");
})

reactionBoolCloseBtn.addEventListener('click',()=>{
  reactionBoolOverlay.classList.add('hidden')
  darkScreen.classList.add("hidden");
})

chimpCloseBtn.addEventListener('click',()=>{
  chimpOverlay.classList.add('hidden')
  darkScreen.classList.add("hidden");
})

termSaveBtn.addEventListener("click", () => {
  // Handle save functionality here
  console.log("Term save button clicked");
  setLocal(schoolSelect.value, [semesterSelect.value, yearSelect.value])
  timetableOverlay.classList.add("hidden");
  darkScreen.classList.add("hidden");
});

reactionSaveBtn.addEventListener('click',()=>{
  console.log('Reaction save button click');
  if(reactionInput.value<=0){
    reactionInput.value=1
  }else if(reactionInput.value>=1000000000000){
    reactionInput.value=999999999999
  }
  if(reactionRangeInput.value<=0){
    reactionRangeInput.value=1
  }else if(reactionRangeInput.value>=1000000000000){
    reactionRangeInput.value=999999999999
  }
  setLocal('reaction-time',[reactionInput.value,reactionRangeInput.value])
  reactionOverlay.classList.add("hidden");
  darkScreen.classList.add("hidden");
})

reactionBoolSaveBtn.addEventListener('click',()=>{
  console.log('Reaction bool save button click');
  setLocal('reaction-time-bool',reactionBoolSlider.value)
  reactionBoolOverlay.classList.add("hidden");
  darkScreen.classList.add("hidden");
})

chimpSaveBtn.addEventListener('click',()=>{
  console.log('Chimp save button click');
  if(chimpInput.value<=0){
    chimpInput.value=1
  }else if(chimpInput.value>=1000000000000){
    chimpInput.value=999999999999
  }
  setLocal('chimp-test',chimpInput.value)
  chimpOverlay.classList.add("hidden");
  darkScreen.classList.add("hidden");
})

termResetBtn.addEventListener('click',()=>{
  refreshTerm("The government",true)
})

reactionResetBtn.addEventListener('click',()=>{
  refreshReactionTime("The government again",true)
})

reactionBoolResetBtn.addEventListener('click',()=>{
  refreshReactionBool("The government again",true)
})

chimpResetBtn.addEventListener('click',()=>{
  refreshChimpTest("The government again and again",true)
})

// Close the overlay when clicking outside of it
darkScreen.addEventListener("click", () => {
  allOverlays.forEach((e)=>{
    e.classList.add("hidden");
  })
  darkScreen.classList.add("hidden");
});

reactionSlider.addEventListener('mousemove',()=>{
  let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+reactionSlider.value/5+'%, rgb(99, 99, 99)'+reactionSlider.value/5+'%')
  reactionSlider.style.background = color
})

reactionBoolSlider.addEventListener('change',()=>{
  if(reactionBoolSlider.value>=50) {
    reactionBoolSlider.value=100
    let color = 'rgb(105, 67, 255)'
    reactionBoolSlider.style.background = color
  }
  else if(reactionBoolSlider.value<50){
    reactionBoolSlider.value=1
    let color = 'rgb(99, 99, 99)'
    reactionBoolSlider.style.background = color
  }
  console.log('reacitonBoolSlider:',reactionBoolSlider.value)
})

reactionSlider.addEventListener('change',()=>{
  reactionInput.value = reactionSlider.value;
})

reactionInput.addEventListener('input',(e)=>{
  let input = e.target;
  input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  reactionSlider.value = reactionInput.value;
  let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+reactionSlider.value/5+'%, rgb(99, 99, 99)'+reactionSlider.value/5+'%')
  reactionSlider.style.background = color
  console.log('updated reactionSlider')
})

reactionRangeInput.addEventListener('input',(e)=>{  
  let input = e.target;
  input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
})

chimpSlider.addEventListener('mousemove',()=>{
  let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+chimpSlider.value/5+'%, rgb(99, 99, 99)'+chimpSlider.value/5+'%')
  chimpSlider.style.background = color
})

chimpSlider.addEventListener('change', ()=>{
  chimpInput.value = chimpSlider.value;
})

chimpInput.addEventListener('input',(e)=>{
  let input = e.target;
  input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  chimpSlider.value = chimpInput.value;
  let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+chimpSlider.value/5+'%, rgb(99, 99, 99)'+chimpSlider.value/5+'%')
  chimpSlider.style.background = color
  console.log('updated chimpSlider')
})

// listener - open updates.html when clicked
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

function getDefaultTerm(){
  const currentDate = new Date()
  const month = currentDate.getMonth()+1
  var year = String(currentDate.getFullYear());
  console.log('month:',month,'year:',year)
  let term;
  switch(true){
    case (month >= 1 && month <= 4):
      term = '10';
      console.log("default term is set to:",[term,year])
      break;
    case (month >= 5 && month <= 8):
      term = '20';
      console.log("default term is set to:",[term,year])
      break;
    case (month >= 9 && month <= 11):
      term = '30';
      console.log("default term is set to:",[term,year])
      break;
    case (month >= 12):
      term = '10';
      year++
      console.log("default term is set to:",[term,year])
      break;
    default:
      term = '10';
      console.log("ERROR: month not found. default term is set to:",(term,year))
  }
  console.log("default term is set to:",[term,year])
  return [term, year]
}

function refreshTerm(key,useDefault=false){
  if(!useDefault){
    chrome.storage.local.get([key], (r)=>{
      let result = r[key]
      console.log('getting:',key+':',result)
      if(result && (result[0]&&result[1])){
        console.log('found - ',key+':','semester:',result[0],'year:',result[1])
        semesterSelect.value = result[0]
        yearSelect.value = result[1]
        console.log('set term/year to: ',semesterSelect.value,'/',yearSelect.value)
      }
      else{
        let defaultTerm = getDefaultTerm()
        console.log('key not found, using default:',defaultTerm)
        semesterSelect.value = defaultTerm[0]
        yearSelect.value = defaultTerm[1]
        console.log('new term: ',[semesterSelect.value, yearSelect.value])
      }
    })
  }else if(useDefault){
    let defaultTerm = getDefaultTerm()
    console.log('key not found, using default:',defaultTerm)
    semesterSelect.value = defaultTerm[0]
    yearSelect.value = defaultTerm[1]
    console.log('new term: ',[semesterSelect.value, yearSelect.value])
  }
}

function refreshReactionTime(key, useDefault=false){
  if(!useDefault){
    chrome.storage.local.get([key], (r)=>{
      let result = r[key]
      console.log('getting:',key+':',result)
      if(result && (result[0]&&result[1])){
        console.log('found - ',key+':','reaction time:',result[0],'range:',result[1])
        reactionInput.value = result[0]
        reactionSlider.value = reactionInput.value
        reactionRangeInput.value = result[1]
        console.log('set reaction/range to: ',reactionInput.value,'/',reactionRangeInput.value)
      }
      else{
        let defaultTimes = [20,1]
        console.log('key not found, using default:',defaultTimes)
        reactionInput.value = defaultTimes[0]
        reactionSlider.value = reactionInput.value
        reactionRangeInput.value = defaultTimes[1]
        console.log('new term: ',[reactionSlider.value, reactionRangeInput.value])
      }
      let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+reactionSlider.value/5+'%, rgb(99, 99, 99)'+reactionSlider.value/5+'%')
      reactionSlider.style.background = color
      console.log('updated reactionSlider - ',reactionSlider.value/5)
    })
  }else if(useDefault){
    let defaultTimes = [20,1]
    console.log('key not found, using default:',defaultTimes)
    reactionInput.value = defaultTimes[0]
    reactionSlider.value = reactionInput.value
    reactionRangeInput.value = defaultTimes[1]
    console.log('new term: ',[reactionSlider.value, reactionRangeInput.value])
    let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+reactionSlider.value/5+'%, rgb(99, 99, 99)'+reactionSlider.value/5+'%')
    reactionSlider.style.background = color
    console.log('updated reactionSlider - ',reactionSlider.value/5)
  }
}

function refreshReactionBool(key, useDefault=false){
  if(!useDefault){
    chrome.storage.local.get([key], (r)=>{
      let result = r[key]
      console.log('getting:',key+':',result)
      if(result){
        console.log('found - ',key+':','reaction bool speed:',result)
        reactionBoolSlider.value = result
        console.log('set reaction bool interval to: ',reactionBoolSlider.value)
      }
      else{
        let defaultTimes = 1
        console.log('key not found, using default:',defaultTimes)
        reactionBoolSlider.value = defaultTimes
        console.log('new term: ',[reactionBoolSlider.value])
      }
      if(reactionBoolSlider.value==1){
        let color ='rgb(99, 99, 99)'
        reactionBoolSlider.style.background = color
        console.log('updated reactionBoolSlider')
      }
      else if(reactionBoolSlider.value==100){
        let color = 'rgb(105, 67, 255)'
        reactionBoolSlider.style.background = color
        console.log('updated reactionBoolSlider')
      }
    })
  }else if(useDefault){
    let defaultTimes = 1
    console.log('key not found, using default:',defaultTimes)
    reactionBoolSlider.value = defaultTimes
    console.log('new term: ',[reactionBoolSlider.value])
    if(reactionBoolSlider.value==1){
      let color ='rgb(99, 99, 99)'
      reactionBoolSlider.style.background = color
      console.log('updated reactionBoolSlider')
    }
    else if(reactionBoolSlider.value==100){
      let color = 'rgb(105, 67, 255)'
      reactionBoolSlider.style.background = color
      console.log('updated reactionBoolSlider')
    }
    
  }
}

function refreshChimpTest(key, useDefault=false){
  if(!useDefault){
    chrome.storage.local.get([key], (r)=>{
      let result = r[key]
      console.log('getting:',key+':',result)
      if(result){
        console.log('found - ',key+':','semester:',result,'year:',result)
        chimpInput.value = result
        chimpSlider.value = chimpInput.value
        console.log('set chimp interval to: ',chimpInput.value)
      }
      else{
        let defaultTimes = [15]
        console.log('key not found, using default:',defaultTimes)
        chimpInput.value = defaultTimes
        chimpSlider.value = chimpInput.value
        console.log('new term: ',[chimpInput.value])
      }
      let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+chimpSlider.value/5+'%, rgb(99, 99, 99)'+chimpSlider.value/5+'%')
      chimpSlider.style.background = color
      console.log('updated chimpSlider')
    })
  }else if(useDefault){
    let defaultTimes = [15]
    console.log('key not found, using default:',defaultTimes)
    chimpInput.value = defaultTimes
    chimpSlider.value = chimpInput.value
    console.log('new term: ',[chimpInput.value])
    let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+chimpSlider.value/5+'%, rgb(99, 99, 99)'+chimpSlider.value/5+'%')
    chimpSlider.style.background = color
    console.log('updated chimpSlider')
  }
}

function setLocal(key, val){
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
      chrome.storage.local.set({ [key]: val }, function() {
        if (chrome.runtime.lastError) {
          console.error("Error saving value:", key, chrome.runtime.lastError);
        }
        else{
          console.log("Value saved successfully for", key, ":", val);
        }
      });
    } else {
      console.log("No change detected. Value not updated for key:", key);
    }
  });
}

function setSync(key, val){
  chrome.storage.sync.get(key, function(result) {
    if (chrome.runtime.lastError) {
        console.error("Error retrieving key:", key, chrome.runtime.lastError);
        return;
    }
    const original = result[key]; // Retrieve the current value
    if (original !== val) { // Only update if the value is different
      console.log("About to save - ", original, " ==> ", val);
      chrome.storage.sync.set({ [key]: val }, function() {
        if (chrome.runtime.lastError) {
          console.error("Error saving value:", key, chrome.runtime.lastError);
        }
        else{
          console.log("Value saved successfully for", key, ":", val);
        }
      });
    } else {
      console.log("No change detected. Value not updated for key:", key);
    }
  });
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function openOverlay(node, btn){
  switch(node){
    case 'timetable-tool':
      schoolSelect.value = btn.dataset.school;
      refreshTerm(schoolSelect.value)
      timetableOverlay.classList.remove('hidden')
      darkScreen.classList.remove("hidden");
      console.log('timetable clicked:',node,'via',btn.dataset.school,'-',btn)
      break
    case 'reaction-time':
      refreshReactionTime(btn.dataset.sub)
      reactionOverlay.classList.remove('hidden')
      darkScreen.classList.remove("hidden");
      console.log('reaction time clicked:',node,'via',btn.dataset.sub,'-',btn)
      break
    case 'reaction-time-bool':
      refreshReactionBool(btn.dataset.sub)
      reactionBoolOverlay.classList.remove('hidden')
      darkScreen.classList.remove("hidden");
      console.log('reaction time bool clicked:',node,'via',btn.dataset.sub,'-',btn)
      break
    case 'chimp-test':
      refreshChimpTest(btn.dataset.sub)
      chimpOverlay.classList.remove('hidden')
      darkScreen.classList.remove("hidden");
      console.log('chimp test clicked:',node,'via',btn.dataset.sub,'-',btn)
      break
    default:
      console.log('no corresponding node ID found for: ',node);
  }
}