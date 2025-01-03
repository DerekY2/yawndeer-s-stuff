import { hideOverlays, setLocal, notify } from "./popup.js";
import { ReactionTime, Overlays } from "./constants.js";

function save(){
  var err=false
  //console.log('Reaction save button click');
  if(ReactionTime.input.value<=0){
    ReactionTime.input.value=1
    notify('.timetravel-warning')
    err=true
  }else if(ReactionTime.input.value>=1000000000000){
    ReactionTime.input.value=999999999999
    notify('.large-input-warning')
    err=true
  }
  else if(ReactionTime.rangeInput.value>=1000000000000){
    ReactionTime.rangeInput.value=999999999999
    notify('.large-input-warning')
    err=true
  }
  else if(ReactionTime.input.value>50 && ReactionTime.rangeInput.value<10){
    ReactionTime.rangeInput.value=10
    notify('.chaos-ping-warning')
    err=true
  }
  else if(ReactionTime.rangeInput.value<=0){
    ReactionTime.rangeInput.value=1
    notify('.small-ping-warning')
    err=true
  }
  if(!err){
    setLocal('reaction-time',[parseInt(ReactionTime.input.value),parseInt(ReactionTime.rangeInput.value)])
    hideOverlays()
    //console.log('saved request processed')
  }
}

function refresh(key='reaction-time') {
  chrome.storage.local.get([key], (r) => {
    const result = r[key];
    //console.log('Getting:', key, ':', result);
    if (result) {
      //console.log('Found -', key, ':', 'reaction time:', result[0], 'range:', result[1]);
      setReactionTime(result[0], result[1]);
      setState(result[0])
    } else {
      const defaultTimes = [20, 1];
      //console.log('Key not found, using default:', defaultTimes);
      setReactionTime(defaultTimes[0], defaultTimes[1]);
      setState(defaultTimes[0])
      save()
    }
  });
}

function reset(){
  const defaultTimes = [20, 1];
  //console.log('Using default times:', defaultTimes);
  setReactionTime(defaultTimes[0], defaultTimes[1]);
}

function setFast(){
  const fastTimes = [1, 1];
  //console.log('Fast mode requested:', fastTimes);
  setReactionTime(fastTimes[0], fastTimes[1]);
}

function setReactionTime(reactionTime, range) {
  //console.log('setting reaction time: ',reactionTime,'and',range)
  ReactionTime.input.value = reactionTime;
  ReactionTime.slider.value = reactionTime;
  ReactionTime.rangeInput.value = range;
  ReactionTime.slider.style.background = ('linear-gradient(90deg, rgb(105, 67, 255)'+ReactionTime.slider.value/3+'%, rgb(99, 99, 99)'+ReactionTime.slider.value/3+'%');
  
  //console.log('Set reaction/range to:', reactionTime, '/', range);
  //console.log('Updated ReactionTime.slider -', ReactionTime.slider.value / 5);
}

function close(){
  ReactionTime.overlay.classList.add('hidden')
  Overlays.darkScreen.classList.add("hidden");
}

function syncSlider(){
  ReactionTime.slider.style.background = ('linear-gradient(90deg, rgb(105, 67, 255)'+ReactionTime.slider.value/3+'%, rgb(99, 99, 99)'+ReactionTime.slider.value/3+'%')
  ReactionTime.input.value = ReactionTime.slider.value;
}

function syncInput(){
  ReactionTime.input.value = ReactionTime.input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  ReactionTime.slider.value = ReactionTime.input.value;
  ReactionTime.slider.style.background = ('linear-gradient(90deg, rgb(105, 67, 255)'+ReactionTime.slider.value/3+'%, rgb(99, 99, 99)'+ReactionTime.slider.value/3+'%')
  ReactionTime.rangeInput.value = ReactionTime.rangeInput.value.replace(/[^0-9]/g, '');
}

function mapValue(value, inMin, inMax, outMin=0, outMax=100) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function show(e){
  refresh()
  ReactionTime.overlay.classList.remove('hidden')
  Overlays.darkScreen.classList.remove("hidden");
}

function setState(millis) {
  const targetState = document.querySelector(`.node-state[data-node="reaction-time"]`);
  if (targetState) {
    if(millis>999){
      millis='>999'
    }
    targetState.textContent = `${millis}ms`;
  }
}

function init(){
  refresh()
}

export { save, refresh, reset, setFast, close, syncSlider, syncInput, show, init }