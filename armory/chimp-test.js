chrome.storage.local.get(['chimp-test'],(i)=>{
  document.querySelector('.css-de05nr.e19owgy710').addEventListener('click',()=>{
      r=i['chimp-test']
      if(r){
        if(true){
          runTest(r[0],r[1])
          console.log("Clicked start")
        }
        // else{
        //   runTestManual(r[0],r[1])
        //   console.log('clicked start - manual')
        // }
      }else{
        runTest(15,41)
        console.log("Clicked start - default")
      }
  })

  async function runTest(interval,target){
    console.log("STARTING TEST")
    onElementAppear('#root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div > div > div:nth-child(1)', async (element) => {
      console.log("Element appeared:", element);
      const max = target-1;
      var total = 4;
      for (total; total <= max; total++) {
        var i = 1;
        var cells = [...Array(max + 1).keys()].map(i => `[data-cellnumber="${i}"]`);
        console.log(cells)
        for (i = 1; i <= total; i++) {
          simClick(document.querySelector(cells[i]));
          // console.log("Clicked", cells[i]);
          await delay(interval)
        }
        if (document.querySelector('.e19owgy710') && total < max) {
          simClick(document.querySelector('.e19owgy710'));
          console.log("Continuing Test. intv:",interval);
        }
        console.log("Finished pass");
      }
      console.log("TEST ENDED")
      onElementAppear('#root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div:nth-child(2) > button',(element =>{
        document.querySelector('#root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div:nth-child(2) > button').addEventListener('click',()=>{
          runTest(interval,target)
          console.log("Clicked start")
        })
      }))
    })
  }
  var waitOne=true;
  async function runTestManual(interval,target){
    console.log("STARTING MANUAL TEST")
    onElementAppear('#root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div > div > div:nth-child(1)', async (element) => {
      console.log("Element appeared:", element);
      const max = target-1;
      var total = 4;
      for (total; total <= max; total++) {
        waitOne=true
        var i = 1;
        var cells = [...Array(max + 1).keys()].map(i => `[data-cellnumber="${i}"]`);
        console.log(cells)
        for (var i = 1; i <= total; i++) {
          console.log('starting i=',i,cells[i])
          if(waitOne){
            await waitForClick(cells[i])
          }else if(!waitOne){
            console.log('about to send request for i=',i,cells[i], 'next up is: ',document.querySelector(cells[i+1]),'then',document.querySelector(cells[i+2]))
            console.log(document.querySelector(`[data-cellnumber="${i}"]`))
            simClick(document.querySelector(`[data-cellnumber="${i}"]`));
            // console.log("Clicked", cells[i]);
            await delay(interval)
          }
        }
        if (document.querySelector('.e19owgy710') && total < max) {
          simClick(document.querySelector('.e19owgy710'));
          console.log("Continuing Test. intv:",interval);
        }
        console.log("Finished pass");
      }
      console.log("TEST ENDED")
      onElementAppear('#root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div:nth-child(2) > button',(element =>{
        document.querySelector('#root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div:nth-child(2) > button').addEventListener('click',()=>{
          runTest()
          console.log("Clicked start")
        })
      }))
    })
  }

  // Function to observe when a specific element appears
  function onElementAppear(selector, callback) {
    const observer = new MutationObserver((mutations, observer) => {
      console.log("observing element",selector)
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          const test = document.querySelector(selector);
          if (test) {
            callback(test);
            observer.disconnect(); // Stop observing once the element is found
            break;
          }
        }
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Function to simulate a click on the button when it appears
  function simClick(selector) {
    console.log('simulating click at selector:',selector)
    var box = selector.getBoundingClientRect(),
    coordX = box.left + (box.right - box.left) / 2,
    coordY = box.top + (box.bottom - box.top) / 2;
    simulateMouseEvent(selector, "mousedown", coordX, coordY);
    simulateMouseEvent(selector, "mouseup", coordX, coordY);
    simulateMouseEvent(selector, "click", coordX, coordY);
    
  }

  function simulateMouseEvent(element, eventName, coordX, coordY) {
    element.dispatchEvent(new MouseEvent(eventName, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: coordX,
      clientY: coordY,
      buttons: 1
    }));
    console.log('clicked square at',element)
  }

  function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function waitForClick(selector) {
    return new Promise(resolve => {
      const element = document.querySelector(selector);
      if (element) {
        console.log('waiting for click')
        element.addEventListener('click', function handler() {
          element.removeEventListener('click', handler); // Remove the event listener after the click
          waitOne=false
          console.log('manually CLICKED! waitOne=',waitOne)
          resolve();
        });
      } else {
        console.error('Element not found:', selector);
      }
    });
  }
})