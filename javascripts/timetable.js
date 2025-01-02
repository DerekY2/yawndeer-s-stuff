import { setLocal, hideOverlays } from './popup.js'
import { TimetableTool, Overlays } from './constants.js';

function show(btn){
  TimetableTool.schoolSelect.value = btn.dataset.school;
  refresh(TimetableTool.schoolSelect.value)
  TimetableTool.overlay.classList.remove('hidden')
  Overlays.darkScreen.classList.remove("hidden");
  console.log('timetable clicked:',btn.dataset.node,'via',btn.dataset.school,'-',btn)
}

function save(school=TimetableTool.schoolSelect.value, semester=TimetableTool.semesterSelect.value, year=TimetableTool.yearSelect.value){
  setLocal(school, [semester, year])
  hideOverlays()
  console.log('save request processed')
}

function refresh(key){
  chrome.storage.local.get([key], (result) => {
    const termData = result[key];
    console.log('Getting:', key, ':', termData);
    if (termData) {
      console.log('Found -', key, ':', 'semester:', termData[0], 'year:', termData[1]);
      TimetableTool.semesterSelect.value = termData[0];
      TimetableTool.yearSelect.value = termData[1];
      setState(key, [TimetableTool.semesterSelect.value, TimetableTool.yearSelect.value])
      console.log('Set term/year to:', TimetableTool.semesterSelect.value, '/', TimetableTool.yearSelect.value);
    } else {
      setState(key, reset());
      save()
    }
  });
}

function setState(school, term) {
  let sem;
  switch (term[0]) {
    case '30':
      sem = 'Fall';
      break;
    case '20':
      sem = 'Summer';
      break;
    case '10':
      sem = 'Winter';
      break;
    default:
      console.error('Invalid semester code:', term[0]);
      return;
  }

  const targetState = document.querySelector(`.node-state[data-school="${school}"]`);

  if (targetState) {
    targetState.textContent = `${sem} ${term[1]}`;
  } else {
    console.error('Node state label not found for school:', school);
  }
}

function reset(){
  const defaultTerm = getDefaultTerm();
  console.log('Using default term:', defaultTerm);
  TimetableTool.semesterSelect.value = defaultTerm[0];
  TimetableTool.yearSelect.value = defaultTerm[1];
  console.log('New term:', [TimetableTool.semesterSelect.value, TimetableTool.yearSelect.value]);
  return defaultTerm
}

function getDefaultTerm() {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  let year = String(currentDate.getFullYear());
  let term;

  if (month >= 1 && month <= 4) {
    term = '10';
  } else if (month >= 5 && month <= 8) {
    term = '20';
  } else if (month >= 9 && month <= 11) {
    term = '30';
  } else if (month === 12) {
    term = '10';
    year = String(Number(year) + 1);
  } else {
    term = '10';
    console.error("ERROR: month not found. Default term is set to:", term, year);
  }

  console.log("Default term is set to:", [term, year]);
  return [term, year];
}

function close(){
  TimetableTool.overlay.classList.add('hidden')
  Overlays.darkScreen.classList.add('hidden')
}

function init(){
  refresh('carleton')
  refresh('ottawa')
  refresh('waterloo')
}

export { save, refresh, reset, close, show, init }