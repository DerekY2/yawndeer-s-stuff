const nodes = document.querySelectorAll(".node");
const staticNodes = document.querySelectorAll(".node.static.config");
const nodeSelectors = document.querySelectorAll(".selector");
const configBtns = document.querySelectorAll(".config-btn")
const infoBtns = document.querySelectorAll('.info-btn')
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
const reactionInput = document.getElementById("reaction-time-input")
const reactionRangeInput = document.getElementById("reaction-range-input")
const reactionOverlay = document.querySelector(".reaction-time.config-overlay");
const reactionCloseBtn = document.querySelector(".reaction-time.close-btn");
const reactionFastBtn = document.querySelector('.reaction-admin-btn')
const reactionSaveBtn = document.querySelector('.reaction-save-btn')
const reactionResetBtn = document.querySelector('.reaction-reset-btn')
const chimpIntervalSlider = document.getElementById("chimp-test-goal")
const chimpScoreSlider = document.getElementById('chimp-test-score')
const chimpIntervalInput = document.getElementById("chimp-test-input")
const chimpScoreInput = document.getElementById('chimp-test-score-input')
const chimpOverlay = document.querySelector(".chimp-test.config-overlay");
const chimpCloseBtn = document.querySelector(".chimp-test.close-btn");
const chimpSaveBtn = document.querySelector('.chimp-save-btn')
const chimpResetBtn = document.querySelector('.chimp-reset-btn')
const chimpAutoSwitch = document.querySelector('#wait-for-first-click')
const bannerOverlay = document.querySelector('.banner-overlay')
const bannerHeader = document.querySelector('.banner-header')
const bannerContent = document.querySelector('.banner-content')
const bannerOkBtn = document.querySelector('.banner-ok-btn')
const bannerCloseBtn = document.querySelector('.banner.close-btn')
const bannerScreen = document.querySelector(".banner-screen");
const popupLogo = document.getElementById("popup-logo-img1")
const changePopupBtn = document.querySelector('.change-logo-btn')

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
    if(!selector.classList.contains('require-opened')){
      inject(selector.dataset.injection, selector.dataset.url)
    }else{inject(selector.dataset.injection, selector.dataset.url,true)}
  })
})

popupLogo.addEventListener('click',()=>{
  changeLogo()
  refreshLogo()
})

changePopupBtn.addEventListener('click',()=>{
  changeLogo()
  refreshLogo()
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

infoBtns.forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.preventDefault()
    e.stopPropagation()
    console.log(e,'pressed')
    notify(btn.dataset.info)
  })
})

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
  var err=false
  console.log('Reaction save button click');
  if(reactionInput.value<=0){
    reactionInput.value=1
    notify('.timetravel-warning')
    err=true
  }else if(reactionInput.value>=1000000000000){
    reactionInput.value=999999999999
    notify('.large-input-warning')
    err=true
  }
  else if(reactionRangeInput.value>=1000000000000){
    reactionRangeInput.value=999999999999
    notify('.large-input-warning')
    err=true
  }
  else if(reactionInput.value>50 && reactionRangeInput.value<10){
    reactionRangeInput.value=10
    notify('.chaos-ping-warning')
    err=true
  }
  else if(reactionRangeInput.value<=0){
    reactionRangeInput.value=1
    notify('.small-ping-warning')
    err=true
  }
  if(!err){
    setLocal('reaction-time',[parseInt(reactionInput.value,10),parseInt(reactionRangeInput.value)])
    reactionOverlay.classList.add("hidden");
    darkScreen.classList.add("hidden");
  }
})

chimpSaveBtn.addEventListener('click',()=>{
  var err=false;
  console.log('Chimp save button click');
  if(chimpIntervalInput.value<0){
    chimpIntervalInput.value=0
    notify('.timetravel-zero-warning')
    err=true;
  }else if(chimpIntervalInput.value>=1000000000000){
    chimpIntervalInput.value=999999999999
    notify('.large-input-warning')
    err=true;
  }
  if(chimpScoreInput.value<5){
    chimpScoreInput.value=5
    notify('.chimp-range-warning')
    err=true;
  }else if(chimpScoreInput.value>41){
    chimpScoreInput.value=41
    notify('.chimp-range-warning')
    err=true;
  }
  if(!err){
    setLocal('chimp-test',[parseInt(chimpIntervalInput.value), parseInt(chimpScoreInput.value), chimpAutoSwitch.checked])
    chimpOverlay.classList.add("hidden");
    darkScreen.classList.add("hidden");
  }
})

bannerOkBtn.addEventListener('click',()=>{
  console.log('Banner ok button click');
  bannerOverlay.classList.add("hidden");
  bannerScreen.classList.add("hidden");
  bannerContent.querySelector('.banner-placeholder').classList.remove('hidden')
  const helem=bannerHeader.querySelector('.notif-header')
  const pelem = bannerContent.querySelector('.notif-content')
  helem?helem.remove():console.log('no banner title found')
  pelem?pelem.remove():console.log('no banner content found')
})

reactionFastBtn.addEventListener('click',()=>{
  refreshReactionTime('Fast mode',false,true)
})

termResetBtn.addEventListener('click',()=>{
  refreshTerm("The government",true)
})

reactionResetBtn.addEventListener('click',()=>{
  refreshReactionTime("The government again",false)
})

chimpResetBtn.addEventListener('click',()=>{
  refreshChimpTest("The government again and again and again",true)
})

// Close the overlay when clicking outside of it
darkScreen.addEventListener("click", () => {
  allOverlays.forEach((e)=>{
    e.classList.add("hidden");
  })
  darkScreen.classList.add("hidden");
});

bannerScreen.addEventListener("click", (e) => {
  e.preventDefault()
  e.stopPropagation()
  console.log('you shall not pass')
});

reactionSlider.addEventListener('mousemove',()=>{
  let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+reactionSlider.value/5+'%, rgb(99, 99, 99)'+reactionSlider.value/5+'%')
  reactionSlider.style.background = color
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

chimpIntervalSlider.addEventListener('mousemove',()=>{
  let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+chimpIntervalSlider.value*2+'%, rgb(99, 99, 99)'+chimpIntervalSlider.value*2+'%')
  chimpIntervalSlider.style.background = color
})

chimpIntervalSlider.addEventListener('change', ()=>{
  chimpIntervalInput.value = chimpIntervalSlider.value;
})

chimpScoreSlider.addEventListener('mousemove',()=>{
  let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+mapValue(chimpScoreSlider.value,5,41)+'%, rgb(99, 99, 99)'+mapValue(chimpScoreSlider.value,5,41)+'%')
  chimpScoreSlider.style.background = color
})

chimpScoreSlider.addEventListener('change', ()=>{
  chimpScoreInput.value = chimpScoreSlider.value;
})

function mapValue(value, inMin, inMax, outMin=0, outMax=100) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

chimpIntervalInput.addEventListener('input',(e)=>{
  let input = e.target;
  input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  chimpIntervalSlider.value = chimpIntervalInput.value;
  let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+chimpIntervalSlider.value*2+'%, rgb(99, 99, 99)'+chimpIntervalSlider.value*2+'%')
  chimpIntervalSlider.style.background = color
  console.log('updated chimpIntervalSlider')
})

chimpScoreInput.addEventListener('input',(e)=>{
  let input = e.target;
  input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  chimpScoreSlider.value = chimpScoreInput.value;
  let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+mapValue(chimpScoreSlider.value,5,41)+'%, rgb(99, 99, 99)'+mapValue(chimpScoreSlider.value,5,41)+'%')
  chimpScoreSlider.style.background = color
  console.log('updated chimpIntervalSlider')
})

// listener - open updates.html when clicked
showUpdates.addEventListener('click',(e)=>{
  open(showUpdates.dataset.url)
  window.close()
})

function inject(file, request_url, checkOpen=false){
  if(file){
    var targetTab
    if(checkOpen){
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
    }else if(!checkOpen){
      chrome.tabs.create({url: request_url}, tab =>{
        targetTab = tab.id
        chrome.scripting.executeScript({
          target: {tabId: targetTab},
          files: [file]
        })
      })
    }
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
      if(result){
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

function refreshReactionTime(key, useDefault=false,fast=false){
  if(!useDefault&&!fast){
    chrome.storage.local.get([key], (r)=>{
      let result = r[key]
      console.log('getting:',key+':',result)
      if(result){
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
    console.log('Fast mode requested:',defaultTimes)
    reactionInput.value = defaultTimes[0]
    reactionSlider.value = reactionInput.value
    reactionRangeInput.value = defaultTimes[1]
    console.log('new term: ',[reactionSlider.value, reactionRangeInput.value])
    let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+reactionSlider.value/5+'%, rgb(99, 99, 99)'+reactionSlider.value/5+'%')
    reactionSlider.style.background = color
    console.log('updated reactionSlider - ',reactionSlider.value/5)
    return
  }else if(fast){
    let fastTimes = [1,1]
    console.log('Fast mode requested:',fastTimes)
    reactionInput.value = fastTimes[0]
    reactionSlider.value = reactionInput.value
    reactionRangeInput.value = fastTimes[1]
    console.log('new term: ',[reactionSlider.value, reactionRangeInput.value])
    let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+reactionSlider.value/5+'%, rgb(99, 99, 99)'+reactionSlider.value/5+'%')
    reactionSlider.style.background = color
    console.log('updated reactionSlider - ',reactionSlider.value/5)
  }
}

function refreshChimpTest(key, useDefault=false){
  if(!useDefault){
    chrome.storage.local.get([key], (r)=>{
      let result = r[key]
      console.log('getting:',key+':',result)
      if(result){
        console.log('found - ',key+':','semester:',result,'year:',result)
        chimpIntervalInput.value = result[0]
        chimpScoreInput.value = result[1]
        chimpAutoSwitch.checked=result[2]
        chimpIntervalSlider.value = chimpIntervalInput.value
        chimpScoreSlider.value = chimpScoreInput.value
        console.log('set chimp interval to: ',chimpIntervalInput.value)
        console.log('set chimp score to: ',chimpScoreInput.value)
      }
      else{
        let defaultTimes = [15,41,true]
        console.log('key not found, using default:',defaultTimes)
        chimpIntervalInput.value = defaultTimes[0]
        chimpScoreInput.value = defaultTimes[1]
        chimpAutoSwitch.checked=defaultTimes[2]
        chimpIntervalSlider.value = chimpIntervalInput.value
        chimpScoreSlider.value = chimpScoreInput.value
        console.log('set chimp interval to: ',chimpIntervalInput.value)
        console.log('set chimp score to: ',chimpScoreInput.value)
      }
      let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+chimpIntervalSlider.value*2+'%, rgb(99, 99, 99)'+chimpIntervalSlider.value*2+'%')
      chimpIntervalSlider.style.background = color
      console.log('updated chimpIntervalSlider')
      let color2 = ('linear-gradient(90deg, rgb(105, 67, 255)'+mapValue(chimpScoreSlider.value,5,41)+'%, rgb(99, 99, 99)'+mapValue(chimpScoreSlider.value,5,41)+'%')
      chimpScoreSlider.style.background = color2
      console.log('updated chimpIntervalSlider')
    })
  }else if(useDefault){
    let defaultTimes = [15,41,true]
    console.log('key not found, using default:',defaultTimes)
    chimpIntervalInput.value = defaultTimes[0]
    chimpScoreInput.value = defaultTimes[1]
    chimpAutoSwitch.checked=defaultTimes[2]
    chimpIntervalSlider.value = chimpIntervalInput.value
    chimpScoreSlider.value = chimpScoreInput.value
    console.log('new chimp key: ',[chimpIntervalInput.value,chimpScoreInput.value])
    let color = ('linear-gradient(90deg, rgb(105, 67, 255)'+chimpIntervalSlider.value*2+'%, rgb(99, 99, 99)'+chimpIntervalSlider.value*2+'%')
    chimpIntervalSlider.style.background = color
    console.log('updated chimpIntervalSlider')
    let color2 = ('linear-gradient(90deg, rgb(105, 67, 255)'+mapValue(chimpScoreSlider.value,5,41)+'%, rgb(99, 99, 99)'+mapValue(chimpScoreSlider.value,5,41)+'%')
    chimpScoreSlider.style.background = color2
    console.log('updated chimpIntervalSlider')
  }
}

function refreshLogo(){
  if(popupLogo.src==chrome.runtime.getURL('images/Sparkle_Doll.png')){
    changePopupBtn.classList.add('bx-color')
    changePopupBtn.classList.remove('bxs-color')
  }else{
    changePopupBtn.classList.add('bxs-color')
    changePopupBtn.classList.remove('bx-color')
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

function notify(warning){
  bannerOverlay.querySelectorAll('.banner-title, .banner-msg').forEach((elem)=>{
    elem.classList.add('hidden')
    console.log('added hidden class to - ',elem)
  })
  bannerOverlay.querySelectorAll(warning).forEach((elem)=>{
    elem.classList.remove('hidden')
    console.log('remove hidden from - ',elem)
  })
  bannerScreen.classList.remove('hidden')
  bannerOverlay.classList.remove('hidden')
  console.log('sent notification - ',warning)
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

function changeLogo(){
  if(popupLogo.src==chrome.runtime.getURL('images/pull-shark.png')){
    popupLogo.src=chrome.runtime.getURL('images/Sparkle_Doll.png')
    setLocal('popup-icon-src',['images/Sparkle_Doll.png','images/Sparkle_Doll128.png'])
    chrome.action.setIcon({path:'images/Sparkle_Doll128.png'})
    refreshLogo()
    console.log('changed icon to pull shark')
  }else{
    popupLogo.src=chrome.runtime.getURL('images/pull-shark.png')
    setLocal('popup-icon-src',['images/pull-shark.png','images/pull-shark128.png'])
    chrome.action.setIcon({path:'images/pull-shark128.png'})
    refreshLogo()
  }
  
}

function init(){
  chrome.storage.local.get(['popup-icon-src'],(result)=>{
    const r=result['popup-icon-src']
    if(r){
      popupLogo.src=chrome.runtime.getURL(r[0])
      chrome.action.setIcon({path:r[1]})
    }
    else{
      popupLogo.src=chrome.runtime.getURL('images/pull-shark.png')
      chrome.action.setIcon({path:'images/pull-shark128.png'})
    }
    refreshLogo()
  })
}
init()