/*==================================================
        SENKU STAKES
        ADMIN LOGIN
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

const form=document.getElementById("adminLoginForm");

const adminUsername=document.getElementById("adminUsername");

const password=document.getElementById("adminPassword");

const loginBtn=document.querySelector(".admin-login-btn");

const toggle=document.querySelector(".toggle-password");
/*================================
        PASSWORD SHOW / HIDE
================================*/

if(toggle){

    toggle.addEventListener("click",()=>{

        if(password.type==="password"){

            password.type="text";

            toggle.className=
            "fa-solid fa-eye-slash toggle-password";

        }

        else{

            password.type="password";

            toggle.className=
            "fa-solid fa-eye toggle-password";

        }

    });

}
/*================================
        ADMIN LOGIN
================================*/

form.addEventListener("submit",(e)=>{

    e.preventDefault();



    if(adminUsername.value.trim()===""){

        alert("Enter username.");

        adminUsername.focus();

        return;

    }



    if(password.value.trim()===""){

        alert("Enter password.");

        password.focus();

        return;

    }



    loginBtn.disabled=true;

    loginBtn.innerHTML=`

        <i class="fa-solid fa-spinner fa-spin"></i>

        Verifying...

    `;



    setTimeout(()=>{

        const admin=getAdmin();



        if(

            adminUsername.value.trim()===admin.username &&

            password.value===admin.password

        ){

            loginBtn.innerHTML=`

                <i class="fa-solid fa-circle-check"></i>

                Access Granted

            `;

            loginBtn.style.background=

            "linear-gradient(135deg,#16a34a,#22c55e)";



            setCurrentUser({

                id:admin.id,

                role:admin.role,

                username:admin.username,

                name:admin.name

            });



            setTimeout(()=>{

    console.log("Redirecting...");

    window.location.href="admin-dashboard.html";

},1200);

        }

        else{

            loginBtn.innerHTML=`

                <i class="fa-solid fa-xmark"></i>

                Invalid Username or Password

            `;

            loginBtn.style.background=

            "linear-gradient(135deg,#ef4444,#dc2626)";



            setTimeout(()=>{

                loginBtn.innerHTML=`

                    <i class="fa-solid fa-right-to-bracket"></i>

                    Login Dashboard

                `;

                loginBtn.style.background="";

                loginBtn.disabled=false;

            },2000);

        }

    },1200);

});
});