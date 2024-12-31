const nodes = document.querySelectorAll(".node");
const staticNodes = document.querySelectorAll(".node.static.config");
const nodeSelectors = document.querySelectorAll(".selector");
const configBtns = document.querySelectorAll(".config-btn")
const allOverlays = document.querySelectorAll('.config-overlay')
const darkScreen = document.querySelector(".dark-screen");
const reactionOverlay = document.querySelector(".reaction-time.config-overlay");
const reactionCloseBtn = document.querySelector(".reaction-time.close-btn");
const reactionSaveBtn = document.querySelector('.reaction-save-btn')
const reactionResetBtn = document.querySelector('.reaction-reset-btn')
const timetableOverlay = document.querySelector(".timetable.config-overlay");
const timetableCloseBtn = document.querySelector(".timetable.close-btn");
const termSaveBtn = document.querySelector('.term-save-btn')
const termResetBtn = document.querySelector('.term-reset-btn')
const showUpdates = document.querySelector('.show-version-details')
const schoolSelect = document.getElementById("school-select");
const semesterSelect = document.getElementById("semester-select");
const yearSelect = document.getElementById("year-select");
const reactionSlider = document.getElementById("reaction-time-goal")
const reactionInput = document.getElementById("reaction-time-input")
const reactionRangeInput = document.getElementById("reaction-range-input")

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
    let configNode = btn.dataset.node
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

termResetBtn.addEventListener('click',()=>{
  refreshTerm("The government",true)
})

reactionResetBtn.addEventListener('click',()=>{
  refreshReactionTime("The government again",true)
})

// Close the overlay when clicking outside of it
darkScreen.addEventListener("click", () => {
  allOverlays.forEach((e)=>{
    e.classList.add("hidden");
  })
  darkScreen.classList.add("hidden");
});

reactionSlider.oninput = function(){
  reactionInput.value = reactionSlider.value;
}

reactionSlider.addEventListener('mousemove',()=>{
  var color = ('linear-gradient(90deg, rgb(105, 67, 255)'+reactionSlider.value/5+'%, rgb(99, 99, 99)'+reactionSlider.value/5+'%')
  reactionSlider.style.background = color
})



reactionInput.addEventListener('input',(e)=>{
  let input = e.target;
  input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  reactionSlider.value = reactionInput.value;
  updateSlider()
})

reactionRangeInput.addEventListener('input',(e)=>{  
  let input = e.target;
  input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
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

function updateSlider(){
  var color = ('linear-gradient(90deg, rgb(105, 67, 255)'+reactionSlider.value/5+'%, rgb(99, 99, 99)'+reactionSlider.value/5+'%')
  reactionSlider.style.background = color
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
        console.log('found - ',key+':','semester:',result[0],'year:',result[1])
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
    })
  }else if(useDefault){
    let defaultTimes = [20,1]
    console.log('key not found, using default:',defaultTimes)
      reactionInput.value = defaultTimes[0]
      reactionSlider.value = reactionInput.value
      reactionRangeInput.value = defaultTimes[1]
    console.log('new term: ',[reactionSlider.value, reactionRangeInput.value])
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
    case 'human-benchmark':
      refreshReactionTime(btn.dataset.sub)
      reactionOverlay.classList.remove('hidden')
      darkScreen.classList.remove("hidden");
      console.log('benchmark licked:',node,'via',btn.dataset.sub,'-',btn)
      break
    default:
      console.log('no corresponding node ID found for: ',node);
  }
}