if(document.querySelector('#root')){
  const observer = new MutationObserver((mutations, observer)=>{
    for(let mutation of mutations){
      if(mutation.type ==='childList'){
        console.log("Mutation detected...")
        if(document.querySelector('.full-nav')){
          button = document.querySelector('.full-nav')
          console.log("About to click...",button)
          button.click()
          console.log("Sent click request")
        }
      }
    }
  })

  observer.observe(document.querySelector('#root'), { childList: true, subtree: true });
}
