document.querySelector('.css-de05nr.e19owgy710').addEventListener('click',()=>{
  runTest()
  console.log("Clicked start")
})

async function runTest(){
  console.log("STARTING TEST")
  onElementAppear('#root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div > div > div:nth-child(1)', async (element) => {
    console.log("Element appeared:", element);
    const max = 40;
    var total = 4;
    for (total; total <= max; total++) {
      var i = 1;
      var cells = [...Array(max + 1).keys()].map(i => `[data-cellnumber="${i}"]`);
      for (i = 1; i <= total; i++) {
        simClick(document.querySelector(cells[i]));
        console.log("Clicked", cells[i]);
        await delay(15);
      }
      if (document.querySelector('.e19owgy710') && total < max) {
        simClick(document.querySelector('.e19owgy710'));
        console.log("Continuing Test.");
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
}

function delay(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}