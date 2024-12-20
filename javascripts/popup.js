let selection = document.querySelectorAll(".node");
let tycoon = document.querySelectorAll(".pls-donate-ahh")

console.log(selection);
for(var i=0; i<selection.length; i++){
  selection[i].addEventListener("click", (e)=>{
    let selectionParent = e.target.closest("li");
    console.log(selectionParent);
    selectionParent.classList.toggle("showMenu")
  })

  let panel = document.querySelector(".panel");
  console.log(panel)
}
