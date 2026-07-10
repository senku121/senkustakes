/* ==========================================
        SENKU STAKES
            LOGIN PAGE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const password = document.querySelector('input[type="password"]');
    const email = document.querySelector('input[type="text"]');
    const loginBtn = document.querySelector(".login-btn");
    const remember = document.querySelector(
    '.remember input'
);

    /* ===================================
        PASSWORD TOGGLE
    =================================== */

    const wrapper = document.createElement("div");

    wrapper.style.position = "relative";

    password.parentNode.insertBefore(wrapper, password);

    wrapper.appendChild(password);

    const eye = document.createElement("i");

    eye.className = "fa-solid fa-eye";

    eye.style.position = "absolute";

    eye.style.right = "18px";

    eye.style.top = "50%";

    eye.style.transform = "translateY(-50%)";

    eye.style.cursor = "pointer";

    eye.style.color = "#8f98b5";

    wrapper.appendChild(eye);

    eye.addEventListener("click", () => {

        if(password.type==="password"){

            password.type="text";

            eye.className="fa-solid fa-eye-slash";

        }

        else{

            password.type="password";

            eye.className="fa-solid fa-eye";

        }

    });

    /* ===================================
        INPUT ANIMATION
    =================================== */

    document.querySelectorAll("input").forEach(input=>{

        input.addEventListener("focus",()=>{

            input.parentElement.style.transform="translateY(-2px)";

            input.parentElement.style.transition=".3s";

        });

        input.addEventListener("blur",()=>{

            input.parentElement.style.transform="translateY(0)";

        });

    });

    /* ===================================
        ENTER KEY LOGIN
    =================================== */

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Enter"){

            form.requestSubmit();

        }

    });

    /* ===================================
        LOGIN VALIDATION
    =================================== */

    form.addEventListener("submit",(e)=>{

    e.preventDefault();


    if(email.value.trim()===""){

        showPopup({

    type:"error",

    title:"Email Required",

    message:"Please enter your email."

});

        email.focus();

        return;

    }


    if(password.value.trim()===""){

        showPopup({

    type:"error",

    title:"Password Required",

    message:"Please enter your password."

});

        password.focus();

        return;

    }



    loginBtn.disabled=true;


    loginBtn.innerHTML=`

        <i class="fa-solid fa-spinner fa-spin"></i>

        Signing In...

    `;



    setTimeout(()=>{

    const db = getDB();

    const user = db.users.find(u=>

        (u.email === email.value.trim() ||
         u.username === email.value.trim()) &&

        u.password === password.value

    );

    if(!user){

        loginBtn.disabled = false;

        loginBtn.innerHTML = "Login";

        loginBtn.style.background = "";

        showPopup({

    type:"error",

    title:"Login Failed",

    message:"Invalid email/username or password."

});

        return;

    }

    

    if(
    user.status==="BLOCKED" ||
    user.status==="FROZEN"
){

    localStorage.setItem(
        "accountMessage",
        user.status
    );


    showPopup({

    type:"warning",

    title:user.status,

    message:
    "Your account has been "+user.status.toLowerCase()+
    ". Please contact the administrator at admin@senkustakes.com."

});


    return;

}



setCurrentUser(user);


window.location.href="dashboard.html";

       },1000);

});


/* ===================================
    REMEMBER ME
=================================== */

if(remember){ 


    if(localStorage.getItem("rememberLogin")==="true"){

        remember.checked=true;

    }


    remember.addEventListener("change",()=>{

        localStorage.setItem(
            "rememberLogin",
            remember.checked
        );

    });


}

    /* ===================================
        CARD ANIMATION
    =================================== */

    const card=document.querySelector(".login-card");

    card.animate(

        [

            {

                opacity:0,

                transform:"translateY(40px)"

            },

            {

                opacity:1,

                transform:"translateY(0)"

            }

        ],

        {

            duration:700,

            easing:"ease-out"

        }

    );

});