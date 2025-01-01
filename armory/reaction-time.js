chrome.storage.local.get(['reaction-time'],(result)=>{
  const time = (result['reaction-time']&&result['reaction-time'][0])?result['reaction-time'][0]:20
  const range = (result['reaction-time']&&result['reaction-time'][1])?result['reaction-time'][1]:1
  const mi = time-range
  const ma = time+range
  const fast = result['reaction-time-bool']
  var count = 0
  if(time<=1 && range <=3){
    if(document.querySelector('#root')){
      const observer = new MutationObserver((mutations, observer)=>{
        for(let mutation of mutations){
          if(mutation.type ==='childList'){
            console.log("Mutation detected... time:",time,'range:',range)
            var target = document.querySelector('#root > div > div:nth-child(4) > div.view-go.e18o0sx0.css-saet2v.e19owgy77')
            if(target){
              simClick(target)
            }
          }
        }
      })
      observer.observe(document.querySelector('#root'), { childList: true, subtree: true });
    }
  }
  else{
    if(document.querySelector('#root')){
      const observer = new MutationObserver((mutations, observer)=>{
        for(let mutation of mutations){
          if(mutation.type ==='childList'){
            console.log("Mutation detected... time:",time,'range:',range)
            var target = document.querySelector('#root > div > div:nth-child(4) > div.view-go.e18o0sx0.css-saet2v.e19owgy77')
            if(target && count==0){
              var num = getRandomNumber()
              console.log('waiting: ',num)
              count=1
              delay(num).then(() => {
                simClick(target)
              })
            }
          }
        }
      })
      observer.observe(document.querySelector('#root'), { childList: true, subtree: true });
    }
  }

  // document.addEventListener('click', ()=>{
  //   document.querySelector('.full-nav').click()
  //   console.log("Clicked nav")
  // })

  async function simClick(selector){
    try{
      var box = selector.getBoundingClientRect(),
      coordX = box.left + (box.right - box.left) / 2,
      coordY = box.top + (box.bottom - box.top) / 2;
      simulateMouseEvent (selector, "mousedown", coordX, coordY);
      simulateMouseEvent (selector, "mouseup", coordX, coordY);
      simulateMouseEvent (selector, "click", coordX, coordY);
      count=0
    }
    catch{
      console.log('not found/duplicate execution; count:',count)
    }
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
    console.log("CLICK",count)
  };

  function getRandomNumber() {
    
    n=Math.floor(Math.random() * (ma - mi + 1) + mi)-1;
    console.log('calculated randint:',n,'from',mi,ma)
    return n<0?0:n;
  }

  function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
  }
})