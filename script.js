function filterProjects(category){

let projects=document.querySelectorAll(".card")

projects.forEach(card=>{

if(category==="all"){

card.style.display="block"

}

else{

if(card.classList.contains(category)){

card.style.display="block"

}

else{

card.style.display="none"

}

}

})

}



document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault()

document.querySelector(this.getAttribute("href")).scrollIntoView({

behavior:"smooth"

})

})

})