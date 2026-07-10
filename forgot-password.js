/*==================================================
        SENKU STAKES
        FORGOT PASSWORD JS
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{


    const form=document.querySelector("form");

    const email=document.querySelector('input[type="email"]');

    const button=document.querySelector(".reset-btn");


    /*================================
            INPUT ANIMATION
    =================================*/

    email.addEventListener("focus",()=>{

        email.style.transform="translateY(-2px)";

    });


    email.addEventListener("blur",()=>{

        email.style.transform="translateY(0)";

    });



    /*================================
            ENTER KEY SUBMIT
    =================================*/

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Enter"){

            form.requestSubmit();

        }

    });



    /*================================
            EMAIL VALIDATION
    =================================*/

    function validEmail(value){

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    }



    /*================================
            FORM SUBMIT
    =================================*/

    form.addEventListener("submit",(e)=>{


        e.preventDefault();



        if(email.value.trim()===""){


            email.style.borderColor="#ff5a5a";


            alert("Please enter your email address.");


            email.focus();


            return;


        }



        if(!validEmail(email.value)){


            email.style.borderColor="#ff5a5a";


            alert("Please enter a valid email address.");


            email.focus();


            return;


        }



        email.style.borderColor="rgba(255,255,255,.08)";



        button.disabled=true;



        button.innerHTML=`

            <i class="fa-solid fa-spinner fa-spin"></i>

            Sending Link...

        `;



        /* Simulated API request */

        setTimeout(()=>{


    button.innerHTML=`

        <i class="fa-solid fa-circle-check"></i>

        Code Sent

    `;


    button.style.background=

    "linear-gradient(135deg,#16a34a,#22c55e)";


    showSuccess();



    // Move user to OTP verification page

    setTimeout(()=>{

        window.location.href="verify.html";

    },1500);



},2000);



    });



    /*================================
            SUCCESS MESSAGE
    =================================*/

    function showSuccess(){


        const message=document.createElement("div");


        message.className="success-message";


        message.innerHTML=`

            <i class="fa-solid fa-envelope-circle-check"></i>

            <div>

                <strong>Check your email</strong>

                <p>

                A verification code has been sent to your email.
                Enter the code on the next page to continue.

                </p>

            </div>

        `;



        document.querySelector(".forgot-card")

        .appendChild(message);



    }



    /*================================
            CARD LOAD ANIMATION
    =================================*/

    const card=document.querySelector(".forgot-card");


    card.animate(

        [

            {

                opacity:0,

                transform:"translateY(40px) scale(.96)"

            },


            {

                opacity:1,

                transform:"translateY(0) scale(1)"

            }

        ],

        {

            duration:800,

            easing:"ease-out"

        }

    );


});