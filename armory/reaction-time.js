if(document.querySelector('#root')){
  const observer = new MutationObserver((mutations, observer)=>{
    for(let mutation of mutations){
      if(mutation.type ==='childList'){
        console.log("Mutation detected...")
        if(document.querySelector('#root > div > div:nth-child(4) > div.view-go.e18o0sx0.css-saet2v.e19owgy77')){
          simClick(document.querySelector('#root > div > div:nth-child(4) > div.view-go.e18o0sx0.css-saet2v.e19owgy77'))
        }
      }
    }
  })

  observer.observe(document.querySelector('#root'), { childList: true, subtree: true });
}

// document.addEventListener('click', ()=>{
//   document.querySelector('.full-nav').click()
//   console.log("Clicked nav")
// })

function simClick(selector){
  var box = selector.getBoundingClientRect(),
  coordX = box.left + (box.right - box.left) / 2,
  coordY = box.top + (box.bottom - box.top) / 2;
  simulateMouseEvent (selector, "mousedown", coordX, coordY);
  simulateMouseEvent (selector, "mouseup", coordX, coordY);
  simulateMouseEvent (selector, "click", coordX, coordY);
}

function simulateMouseEvent(element, eventName, coordX, coordY) {
  element.dispatchEvent(new MouseEvent(eventName, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: coordX,
    clientY: coordY,
    button: 0
  }));
};