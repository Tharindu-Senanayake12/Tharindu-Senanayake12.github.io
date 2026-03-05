// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
anchor.addEventListener("click",function(e){
e.preventDefault();
document.querySelector(this.getAttribute("href")).scrollIntoView({
behavior:"smooth"
});
});
});

// Project Modal
const cards=document.querySelectorAll(".card");
const modal=document.getElementById("modal");
const title=document.getElementById("modal-title");
const desc=document.getElementById("modal-desc");

cards.forEach(card=>{
card.addEventListener("click",()=>{
title.innerText=card.querySelector("h3").innerText;
desc.innerText=card.querySelector("p").innerText;
modal.style.display="flex";
});
});

document.querySelector(".close").onclick=function(){
modal.style.display="none";
};

// Project Filter
function filterProjects(category){
let projects=document.querySelectorAll(".card");
projects.forEach(card=>{
if(category==="all"){ card.style.display="block"; }
else{ card.classList.contains(category)?card.style.display="block":card.style.display="none"; }
});
}