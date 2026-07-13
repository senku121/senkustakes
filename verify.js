/*==================================================
        SENKU STAKES
        OTP VERIFY JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{


    const inputs = document.querySelectorAll(".otp-container input");

    const form = document.querySelector("form");

    const verifyBtn = document.querySelector(".verify-btn");

    const resendBtn = document.getElementById("resend-btn");

    const timerElement = document.getElementById("timer");



    /*================================
            OTP AUTO MOVE
    =================================*/


    inputs.forEach((input,index)=>{


        input.addEventListener("input",()=>{


            input.value=input.value.replace(/[^0-9]/g,"");


            if(input.value && index < inputs.length-1){

                inputs[index+1].focus();

            }


        });



        input.addEventListener("keydown",(e)=>{


            if(e.key==="Backspace" && !input.value && index>0){

                inputs[index-1].focus();

            }


        });


    });




    /*================================
            PASTE OTP
    =================================*/


    document.querySelector(".otp-container")
    .addEventListener("paste",(e)=>{


        e.preventDefault();


        const pasteData =
        e.clipboardData
        .getData("text")
        .replace(/\D/g,"")
        .slice(0,6);



        pasteData.split("")
        .forEach((digit,index)=>{


            if(inputs[index]){

                inputs[index].value=digit;

            }


        });



        if(inputs[pasteData.length]){

            inputs[pasteData.length].focus();

        }



    });





    /*================================
            COUNTDOWN TIMER
    =================================*/


    let time = 120;


    function startTimer(){


        const countdown=setInterval(()=>{


            let minutes=Math.floor(time/60);

            let seconds=time%60;



            timerElement.textContent=

            `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;



            time--;



            if(time<0){


                clearInterval(countdown);


                timerElement.textContent="Expired";


                resendBtn.disabled=false;


            }



        },1000);


    }


    resendBtn.disabled=true;


    startTimer();




    /*================================
            RESEND OTP
    =================================*/


    resendBtn.addEventListener("click",()=>{


        time=120;


        resendBtn.disabled=true;


        startTimer();



        resendBtn.innerHTML=

        `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Sending...

        `;



        setTimeout(()=>{


            resendBtn.innerHTML=

            "Resend OTP";


        },1500);



    });





    /*================================
            VERIFY OTP
    =================================*/


    form.addEventListener("submit", async (e)=>{


        e.preventDefault();



        let otp="";


        inputs.forEach(input=>{


            otp+=input.value;


        });



        if(otp.length!==6){


            alert("Please enter the complete 6-digit code.");


            inputs[0].focus();


            return;


        }



        verifyBtn.disabled=true;



        verifyBtn.innerHTML=

        `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Verifying...

        `;




        try{

const email = localStorage.getItem("resetEmail");

const response = await fetch(

"https://senkustakes-api.onrender.com/api/auth/verify-reset-otp",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

otp

})

}

);

const data = await response.json();

if(!response.ok){

alert(data.message);

verifyBtn.disabled=false;

verifyBtn.innerHTML=`

<i class="fa-solid fa-check"></i>

Verify Code

`;

return;

}

verifyBtn.innerHTML=`

<i class="fa-solid fa-circle-check"></i>

Verified

`;

verifyBtn.style.background=

"linear-gradient(135deg,#16a34a,#22c55e)";

setTimeout(()=>{

window.location.href="reset-password.html";

},1500);

}

catch(err){

console.log(err);

alert("Server connection failed.");

verifyBtn.disabled=false;

verifyBtn.innerHTML=`

<i class="fa-solid fa-check"></i>

Verify Code

`;

}



    });




    /*================================
            FIRST INPUT FOCUS
    =================================*/


    inputs[0].focus();



});