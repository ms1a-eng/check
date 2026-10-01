const swiper = new Swiper(".swiper", {
    slidesPerView: "auto",
    enabled:false,
    spaceBetween: 8, 
    breakpoints: {
        768:{
            spaceBetween: 14,
            enabled:true,
        },
        1024:
        {
            spaceBetween:21,
            enabled:true,
        }
    },
    slideToClickedSlide: true, 
    centeredSlides: false,
}
);



const cards = document.querySelectorAll(".card");
const swiperEl = document.querySelector(".swiper");

cards.forEach(card => {

    card.addEventListener("click",function(){
        const isAlreadyActive = card.classList.contains("is-active");
        card.classList.remove("is-active");

        cards.forEach(cd => cd.classList.remove("is-active"));

        if(isAlreadyActive){

            swiperEl.classList.remove("is-magazine");
        
        }else{

            card.classList.add("is-active");
            swiperEl.classList.add("is-magazine");
        }
    });
});



const toggle = document.querySelector(".nav-switch-toggle");
const navEl = document.querySelector(".nav-menu");

toggle.addEventListener("click", function()
{
    navEl.classList.toggle("is-open");
    toggle.classList.toggle("is-open");
});

const textEl = document.querySelector(".before-launch");
const boxEl= document.querySelector(".proof-box"); 

textEl.addEventListener("mousemove", function(e){
     boxEl.style.left = e.clientX + 15 + "px";
     boxEl.style.top = e.clientY - 15 + "px"; 
}
);
