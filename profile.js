/*==================================================
        SENKU STAKES
        PROFILE JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{



/*================================
        SAVE BUTTON
================================*/


const saveBtn=document.querySelector(".save-btn");



if(saveBtn){


saveBtn.addEventListener("click",()=>{


    saveBtn.disabled=true;


    saveBtn.innerHTML=`

        <i class="fa-solid fa-spinner fa-spin"></i>

        Saving...

    `;



    setTimeout(()=>{


        saveBtn.innerHTML=`

            <i class="fa-solid fa-circle-check"></i>

            Saved Successfully

        `;



        saveBtn.style.background=

        "linear-gradient(135deg,#16a34a,#22c55e)";



        setTimeout(()=>{


            saveBtn.innerHTML=`

                <i class="fa-solid fa-check"></i>

                Save Changes

            `;


            saveBtn.style.background="";


            saveBtn.disabled=false;



        },2500);



    },1500);



});


}





/*================================
        CHANGE PASSWORD
================================*/


const securityButtons=document.querySelectorAll(

".security-item button"

);



securityButtons.forEach((button,index)=>{


    button.addEventListener("click",()=>{


        if(index===0){


            alert(

            "Redirecting to password change page."

            );


            window.location.href="forgot-password.html";


        }



        else{


            if(button.innerText==="Enable"){


                button.innerText="Enabled";


                button.style.background=

                "linear-gradient(135deg,#16a34a,#22c55e)";


            }


            else{


                button.innerText="Enable";


                button.style.background="";


            }


        }



    });



});





/*================================
        INPUT CHANGE EFFECT
================================*/


const inputs=document.querySelectorAll(

".input-box input"

);



inputs.forEach(input=>{


    input.addEventListener("input",()=>{


        input.style.borderColor=

        "rgba(123,44,255,.8)";



        setTimeout(()=>{


            input.style.borderColor="";


        },700);



    });


});





/*================================
        PAGE ENTRANCE
================================*/


const sections=document.querySelectorAll(

".info-card,.security-card,.save-btn"

);



sections.forEach((section,index)=>{


    section.style.opacity="0";


    section.style.transform="translateY(30px)";



    setTimeout(()=>{


        section.style.transition=".6s ease";


        section.style.opacity="1";


        section.style.transform="translateY(0)";


    },300+(index*150));



});





});