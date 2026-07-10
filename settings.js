/*==================================================
        SENKU STAKES
        SETTINGS JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{
if(!checkAccountStatus()){

    window.location.href="login.html";

    return;

}
checkAccountStatus();

setInterval(checkAccountStatus,3000);

/*================================
        LOGIN CHECK
================================*/

const currentUser=getCurrentUser();

if(!currentUser || currentUser.role!=="USER"){

    window.location.href="login.html";

    return;

}

const db=getDB();

const user=db.users.find(

    u=>u.id===currentUser.id

);

if(!user){

    window.location.href="login.html";

    return;

}


/*================================
        LOAD USER PROFILE
================================*/

const usernameInput=document.querySelector(
"#settingsUsername"
);

const emailInput=document.querySelector(
"#settingsEmail"
);

const phoneInput=document.querySelector(
"#settingsPhone"
);

usernameInput.value=user.username || "";

emailInput.value=user.email || "";

phoneInput.value=user.phone || "";

/*================================
        SAVE PROFILE
================================*/

usernameInput.addEventListener("change",()=>{

    user.username=usernameInput.value.trim();

    saveDB(db);

});

emailInput.addEventListener("change",()=>{

    user.email=emailInput.value.trim();

    saveDB(db);

});

phoneInput.addEventListener("change",()=>{

    user.phone=phoneInput.value.trim();

    saveDB(db);

});



/*================================
        TOGGLE SWITCHES
================================*/


const switches=document.querySelectorAll(

".switch input"

);



switches.forEach((toggle,index)=>{


    let saved=

    localStorage.getItem(

        "toggle_"+index

    );



    if(saved==="true"){


        toggle.checked=true;


    }





    toggle.addEventListener("change",()=>{


        localStorage.setItem(

            "toggle_"+index,

            toggle.checked

        );


    });



});








/*================================
        CHANGE PASSWORD
================================*/

const passwordBtn=document.querySelector(
".change-password"
);

passwordBtn.addEventListener("click",()=>{

    const oldPassword=prompt(
        "Enter current password"
    );

    if(oldPassword!==user.password){

        alert("Current password is incorrect.");

        return;

    }

    const newPassword=prompt(
        "Enter new password"
    );

    if(!newPassword){

        return;

    }

    if(newPassword.length<6){

        alert("Password must be at least 6 characters.");

        return;

    }

    user.password=newPassword;

    saveDB(db);

    alert("Password changed successfully.");

});





/*================================
        LOGOUT SYSTEM
================================*/


const logoutBtn=document.querySelector(

".logout-btn"

);



if(logoutBtn){


logoutBtn.addEventListener("click",()=>{



    let confirmLogout=

    confirm(

    "Are you sure you want to logout?"

    );





    if(confirmLogout){



       logout();



        window.location.href="login.html";



    }



});


}








/*================================
        BUTTON CLICK EFFECT
================================*/


document.querySelectorAll(

"button"

).forEach(button=>{


    button.addEventListener("click",()=>{


        button.style.transform="scale(.96)";



        setTimeout(()=>{


            button.style.transform="";


        },150);



    });


});








/*================================
        PAGE ENTRANCE
================================*/


const cards=document.querySelectorAll(

".settings-card,.logout-btn"

);



cards.forEach((card,index)=>{


    card.style.opacity="0";


    card.style.transform=

    "translateY(25px)";



    setTimeout(()=>{


        card.style.transition=".6s ease";


        card.style.opacity="1";


        card.style.transform=

        "translateY(0)";



    },300+(index*150));



});





});