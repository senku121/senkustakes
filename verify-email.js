/*==================================================
        SENKU STAKES
        EMAIL VERIFICATION
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const inputs = document.querySelectorAll(".otp-container input");
const form = document.querySelector("form");
const verifyBtn = document.querySelector(".verify-btn");

const resendBtn =
document.getElementById("resend-btn");

const timer =
document.getElementById("timer");

const email = localStorage.getItem("verifyEmail");

    if (!email) {

        alert("Verification session expired.");

        window.location.href = "register.html";

        return;

    }

    /*==============================
            OTP INPUT
    ==============================*/

    inputs.forEach((input, index) => {

        input.addEventListener("input", () => {

            input.value = input.value.replace(/\D/g, "");

            if (input.value && index < inputs.length - 1) {

                inputs[index + 1].focus();

            }

        });

        input.addEventListener("keydown", (e) => {

            if (e.key === "Backspace" && !input.value && index > 0) {

                inputs[index - 1].focus();

            }

        });

    });

    /*==============================
            PASTE OTP
    ==============================*/

    document.querySelector(".otp-container")
    .addEventListener("paste", (e) => {

        e.preventDefault();

        const paste = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0,6);

        paste.split("").forEach((digit,index)=>{

            if(inputs[index]){

                inputs[index].value = digit;

            }

        });

    });

    /*==============================
            VERIFY EMAIL
    ==============================*/

    form.addEventListener("submit", async (e)=>{

        e.preventDefault();

        let otp = "";

        inputs.forEach(input=>{

            otp += input.value;

        });

        if(otp.length !== 6){

            alert("Please enter the complete 6-digit code.");

            return;

        }

        verifyBtn.disabled = true;

        verifyBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Verifying...
        `;

        try{

            const response = await fetch(

                "https://senkustakes-api.onrender.com/api/auth/verify-email",

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

                verifyBtn.disabled = false;

                verifyBtn.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Verify Code
                `;

                return;

            }

            verifyBtn.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            Verified
            `;

            verifyBtn.style.background =
            "linear-gradient(135deg,#16a34a,#22c55e)";

            localStorage.removeItem("verifyEmail");

            setTimeout(()=>{

                window.location.href="login.html";

            },1500);

        }

        catch(err){

            console.log(err);

            alert("Server connection failed.");

            verifyBtn.disabled = false;

            verifyBtn.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Verify Code
            `;

        }

    });


    /*==============================
        TIMER
==============================*/

let seconds = 120;

function startTimer(){

    resendBtn.disabled = true;

    const countdown = setInterval(()=>{

        let min = Math.floor(seconds/60);

        let sec = seconds%60;

        timer.innerText =
        `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

        seconds--;

        if(seconds < 0){

            clearInterval(countdown);

            timer.innerText = "Expired";

            resendBtn.disabled = false;

        }

    },1000);

}

startTimer();

/*==============================
        RESEND OTP
==============================*/

resendBtn.addEventListener("click",async()=>{

    resendBtn.disabled = true;

    resendBtn.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i>
    Sending...
    `;

    try{

        const response = await fetch(

            "https://senkustakes-api.onrender.com/api/auth/resend-otp",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    email

                })

            }

        );

        const data = await response.json();

        if(!response.ok){

            alert(data.message);

            resendBtn.disabled = false;

            resendBtn.innerHTML = "Resend OTP";

            return;

        }

        alert("New verification code sent.");

        resendBtn.innerHTML = "Resend OTP";

        seconds = 120;

        startTimer();

    }

    catch(err){

        console.log(err);

        alert("Unable to resend OTP.");

        resendBtn.disabled = false;

        resendBtn.innerHTML = "Resend OTP";

    }

});

    inputs[0].focus();

});