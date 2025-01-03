import { notify, setLocal, hideOverlays } from './popup.js'
import { ChimpTest, Overlays } from './constants.js';

function save(interval=ChimpTest.intervalInput.value, target=ChimpTest.scoreInput.value, auto=true){
  var err=false;
  console.log('Chimp save button click');
  if(interval<0){
    interval=0
    notify('.timetravel-zero-warning')
    err=true;
  }else if(interval>=1000000000000){
    interval=999999999999
    notify('.large-input-warning')
    err=true;
  }
  if(target<5){
    target=5
    notify('.chimp-range-warning')
    err=true;
  }else if(target>41){
    target=41
    notify('.chimp-range-warning')
    err=true;
  }
  if(!err){
    setLocal('chimp-test',[parseInt(interval), parseInt(target), auto])
    hideOverlays()
    console.log('saved request processed')
  }
}

function refresh(key='chimp-test') {
  chrome.storage.local.get([key], (r) => {
    const result = r[key];
    console.log('Getting:', key, ':', result);
    if (result) {
      console.log('Found -', key, ':', 'interval:', result[0], 'score:', result[1], 'autoSwitch:', result[2]);
      setValues(result[0], result[1], result[2]);
      setState(result[0])
    } else {
      const defaultTimes = [15, 41, true];
      console.log('Key not found, using default:', defaultTimes);
      setValues(defaultTimes[0], defaultTimes[1], defaultTimes[2]);
      setState(defaultTimes[0])
      save()
    }
  });
}

function reset(){
  const defaultTimes = [15, 41, true];
  console.log('Using default:', defaultTimes);
  setValues(defaultTimes[0], defaultTimes[1], defaultTimes[2]);
}

function setValues(interval, score, autoSwitch) {
  ChimpTest.intervalInput.value = interval;
  ChimpTest.scoreInput.value = score;
  ChimpTest.autoSwitch.checked = autoSwitch;
  ChimpTest.intervalSlider.value = interval;
  ChimpTest.scoreSlider.value = score;

  const intervalColor = `linear-gradient(90deg, rgb(105, 67, 255) ${interval}%, rgb(99, 99, 99) ${interval}%)`;
  ChimpTest.intervalSlider.style.background = intervalColor;
  console.log('Updated ChimpTest.intervalSlider');

  const scoreColor = `linear-gradient(90deg, rgb(105, 67, 255) ${mapValue(score, 5, 41)}%, rgb(99, 99, 99) ${mapValue(score, 5, 41)}%)`;
  ChimpTest.scoreSlider.style.background = scoreColor;
  console.log('Updated ChimpTest.scoreSlider');
}

function close(){
  ChimpTest.overlay.classList.add('hidden')
  Overlays.darkScreen.classList.add("hidden");
}

function syncSlider(){
  ChimpTest.intervalSlider.style.background = ('linear-gradient(90deg, rgb(105, 67, 255)'+ChimpTest.intervalSlider.value+'%, rgb(99, 99, 99)'+ChimpTest.intervalSlider.value+'%')
  ChimpTest.intervalInput.value = ChimpTest.intervalSlider.value;

  ChimpTest.scoreSlider.style.background = ('linear-gradient(90deg, rgb(105, 67, 255)'+mapValue(ChimpTest.scoreSlider.value,5,41)+'%, rgb(99, 99, 99)'+mapValue(ChimpTest.scoreSlider.value,5,41)+'%')
  ChimpTest.scoreInput.value = ChimpTest.scoreSlider.value;
}

function syncInput(){
  ChimpTest.intervalInput.value = ChimpTest.intervalInput.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  ChimpTest.intervalSlider.value = ChimpTest.intervalInput.value;
  ChimpTest.intervalSlider.style.background = ('linear-gradient(90deg, rgb(105, 67, 255)'+ChimpTest.intervalSlider.value+'%, rgb(99, 99, 99)'+ChimpTest.intervalSlider.value+'%')
  
  ChimpTest.scoreInput.value = ChimpTest.scoreInput.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  ChimpTest.scoreSlider.value = ChimpTest.scoreInput.value;
  ChimpTest.scoreSlider.style.background = ('linear-gradient(90deg, rgb(105, 67, 255)'+mapValue(ChimpTest.scoreSlider.value,5,41)+'%, rgb(99, 99, 99)'+mapValue(ChimpTest.scoreSlider.value,5,41)+'%')
}

function mapValue(value, inMin, inMax, outMin=0, outMax=100) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function show(e){
  refresh()
  ChimpTest.overlay.classList.remove('hidden')
  Overlays.darkScreen.classList.remove("hidden");
}

function setState(millis) {
  const targetState = document.querySelector(`.node-state[data-node="chimp-test"]`);
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

export { save, refresh, reset, close, syncSlider, syncInput, show, init }