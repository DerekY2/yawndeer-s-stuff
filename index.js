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
  if(logo.src.includes('images/sky-icon.png')){
    logo.src='images/pull-shark.png'
    favicon.setAttribute('href','images/pull-shark.png')
    changeIconBtn.classList.add('bx-color')
    changeIconBtn.classList.remove('bxs-color')
    changeIconBtn.classList.remove('bxs-moon')
  }else if(logo.src.includes('images/pull-shark.png')){
    logo.src='images/Sparkle_Doll.png'
    favicon.setAttribute('href','images/Sparkle_Doll.png')
    changeIconBtn.classList.add('bxs-color')
    changeIconBtn.classList.remove('bx-color')
    changeIconBtn.classList.remove('bxs-moon')
  }else if(logo.src.includes('images/Sparkle_Doll.png')){
    logo.src='images/sky-icon.png'
    favicon.setAttribute('href','images/sky-icon.png')
    changeIconBtn.classList.add('bxs-moon')
    changeIconBtn.classList.remove('bx-color')
    changeIconBtn.classList.remove('bxs-color')
  }
  console.log('after:',logo.src)
}