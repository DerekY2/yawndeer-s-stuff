const changeIconBtn = document.querySelector('.change-logo-btn')
const logo = document.querySelector('.logo-image')
const favicon = document.getElementById("favicon");

changeIconBtn.addEventListener('click',()=>{
  toggleIcon()
})

logo.addEventListener('click',()=>{
  toggleIcon()
})

function toggleIcon(){
  console.log('before:',logo.src)
  if(logo.src.includes('images/Sparkle_Doll.png')){
    logo.src='images/pull-shark.png'
    favicon.setAttribute('href','images/pull-shark.png')
    changeIconBtn.classList.add('bx-color')
    changeIconBtn.classList.remove('bxs-color')
    setLocal('popup-icon-src',['images/pull-shark.png','images/pull-shark128.png'])
  }else{
    logo.src='images/Sparkle_Doll.png'
    favicon.setAttribute('href','images/Sparkle_Doll.png')
    changeIconBtn.classList.add('bxs-color')
    changeIconBtn.classList.remove('bx-color')
    chrome.action.setIcon({path:'images/Sparkle_Doll128.png'})
    setLocal('popup-icon-src',['images/Sparkle_Doll.png','images/Sparkle_Doll128.png'])
  }
  console.log('after:',logo.src)
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
      chrome.storage.local.set({ [key]: val }, function() {
        if (chrome.runtime.lastError) {
          console.error("Error saving value:", key, chrome.runtime.lastError);
        }
        else{
          console.log("Value saved successfully for", key, ":", val);
        }
      });
    }
  });
}

function init(){
  chrome.storage.local.get(['popup-icon-src'],(result)=>{
    const r=result['popup-icon-src']
    if(r){
      logo.src=(r[0])
      chrome.action.setIcon({path:r[1]})
    }
    else{
      logo.src=chrome.runtime.getURL('images/pull-shark.png')
      chrome.action.setIcon({path:'images/pull-shark128.png'})
    }
    refreshLogo()
  })
}
init()