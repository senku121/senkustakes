/*==================================================
        SENKU STAKES
        RESET PASSWORD JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{


    const inputs=document.querySelectorAll(".password-box input");

    const toggles=document.querySelectorAll(".toggle-password");

    const form=document.querySelector("form");

    const button=document.querySelector(".reset-btn");

    const strengthBar=document.querySelector(".strength-bar");

    const strengthText=document.querySelector(".strength span");



    const password=inputs[0];

    const confirmPassword=inputs[1];



    /*================================
            SHOW / HIDE PASSWORD
    =================================*/


    toggles.forEach((toggle,index)=>{


        toggle.addEventListener("click",()=>{


            if(inputs[index].type==="password"){


                inputs[index].type="text";


                toggle.classList.remove("fa-eye");


                toggle.classList.add("fa-eye-slash");


            }

            else{


                inputs[index].type="password";


                toggle.classList.remove("fa-eye-slash");


                toggle.classList.add("fa-eye");


            }


        });


    });





    /*================================
            PASSWORD STRENGTH
    =================================*/


    password.addEventListener("input",()=>{


        const value=password.value;


        let strength=0;



        if(value.length>=8){

            strength++;

        }


        if(/[A-Z]/.test(value)){

            strength++;

        }


        if(/[0-9]/.test(value)){

            strength++;

        }


        if(/[^A-Za-z0-9]/.test(value)){

            strength++;

        }



        if(strength===0){


            strengthBar.style.width="0%";

            strengthText.textContent="Weak";

            strengthText.style.color="#ef4444";


        }


        else if(strength===1){


            strengthBar.style.width="25%";

            strengthText.textContent="Weak";

            strengthText.style.color="#ef4444";


        }


        else if(strength===2){


            strengthBar.style.width="50%";

            strengthText.textContent="Medium";

            strengthText.style.color="#f59e0b";


        }


        else if(strength===3){


            strengthBar.style.width="75%";

            strengthText.textContent="Good";

            strengthText.style.color="#3b82f6";


        }


        else{


            strengthBar.style.width="100%";

            strengthText.textContent="Strong";

            strengthText.style.color="#22c55e";


        }



    });





    /*================================
            FORM SUBMIT
    =================================*/


    form.addEventListener("submit",(e)=>{


        e.preventDefault();



        if(password.value.length<8){


            alert("Password must contain at least 8 characters.");


            password.focus();


            return;


        }



        if(password.value!==confirmPassword.value){


            alert("Passwords do not match.");


            confirmPassword.focus();


            return;


        }



        button.disabled=true;



        button.innerHTML=

        `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Updating Password...

        `;




        setTimeout(()=>{


            button.innerHTML=

            `

            <i class="fa-solid fa-circle-check"></i>

            Password Updated

            `;



            button.style.background=

            "linear-gradient(135deg,#16a34a,#22c55e)";



            showSuccess();



            setTimeout(()=>{


                window.location.href="login.html";


            },2500);



        },2000);



    });





    /*================================
            SUCCESS BOX
    =================================*/


    function showSuccess(){


        const box=document.createElement("div");


        box.className="success-message";


        box.innerHTML=

        `

        <i class="fa-solid fa-shield-check"></i>


        <div>


        <strong>Password Changed</strong>


        <p>

        Your password has been updated successfully.
        Redirecting to login...

        </p>


        </div>


        `;



        document.querySelector(".reset-card")

        .appendChild(box);



    }




});