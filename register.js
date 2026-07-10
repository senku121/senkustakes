/*==================================================
        SENKU STAKES
        REGISTER PAGE
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{


/*================================
        FORM
================================*/

const form=document.querySelector("form");


const firstName=document.querySelectorAll("input")[0];

const lastName=document.querySelectorAll("input")[1];

const email=document.querySelectorAll("input")[2];

const username=document.querySelectorAll("input")[3];

const password=document.querySelectorAll("input")[4];

const confirmPassword=document.querySelectorAll("input")[5];

const country=document.querySelector("select");

const referral=document.querySelectorAll("input")[6];

const terms=document.querySelector("#terms");

const registerBtn=document.querySelector(".register-btn");




/*================================
        PASSWORD TOGGLE
================================*/

const passwordInputs=[

password,

confirmPassword

];


passwordInputs.forEach(input=>{

const wrapper=input.parentElement;

const eye=document.createElement("i");

eye.className="fa-solid fa-eye";

eye.style.position="absolute";
eye.style.right="18px";
eye.style.top="50%";
eye.style.transform="translateY(-50%)";
eye.style.cursor="pointer";
eye.style.color="#8f98b5";

wrapper.style.position="relative";

wrapper.appendChild(eye);

eye.addEventListener("click",()=>{

if(input.type==="password"){

input.type="text";

eye.className="fa-solid fa-eye-slash";

}

else{

input.type="password";

eye.className="fa-solid fa-eye";

}

});

});




/*================================
        INPUT ANIMATION
================================*/

document.querySelectorAll("input,select").forEach(input=>{

input.addEventListener("focus",()=>{

input.parentElement.style.transform="translateY(-2px)";

input.parentElement.style.transition=".3s";

});

input.addEventListener("blur",()=>{

input.parentElement.style.transform="translateY(0)";

});

});
/*================================
        REGISTER VALIDATION
================================*/

form.addEventListener("submit",(e)=>{

e.preventDefault();



if(firstName.value.trim()===""){

alert("Please enter your first name.");

firstName.focus();

return;

}



if(lastName.value.trim()===""){

alert("Please enter your last name.");

lastName.focus();

return;

}



if(email.value.trim()===""){

alert("Please enter your email.");

email.focus();

return;

}



if(username.value.trim()===""){

alert("Please enter a username.");

username.focus();

return;

}



if(password.value.trim()===""){

alert("Please enter a password.");

password.focus();

return;

}



if(confirmPassword.value.trim()===""){

alert("Please confirm your password.");

confirmPassword.focus();

return;

}



if(password.value!==confirmPassword.value){

alert("Passwords do not match.");

confirmPassword.focus();

return;

}



if(!terms.checked){

alert("Please accept the Terms and Privacy Policy.");

return;

}



/*================================
        DUPLICATE CHECK
================================*/

const users=getUsers();



const usernameExists=users.find(user=>

user.username.toLowerCase()===

username.value.trim().toLowerCase()

);



if(usernameExists){

alert("Username already exists.");

return;

}



const emailExists=users.find(user=>

(user.email||"").toLowerCase()===

email.value.trim().toLowerCase()

);



if(emailExists){

alert("Email already exists.");

return;

}



/*================================
        BUTTON LOADING
================================*/

registerBtn.disabled=true;

registerBtn.innerHTML=`

<i class="fa-solid fa-spinner fa-spin"></i>

Creating Account...

`;



setTimeout(()=>{
/*================================
        CREATE USER
================================*/

const newUser=createUser({

username:username.value.trim(),

password:password.value,

email:email.value.trim()

});


/*================================
        EXTRA USER DATA
================================*/

let db=getDB();

let savedUser=db.users.find(

u=>u.id===newUser.id

);


if(savedUser){

savedUser.firstName=firstName.value.trim();

savedUser.lastName=lastName.value.trim();

savedUser.country=country.value;

savedUser.referral=referral.value.trim();

saveDB(db);

}


/*================================
        SUCCESS
================================*/

registerBtn.innerHTML=`

<i class="fa-solid fa-circle-check"></i>

Account Created

`;



registerBtn.style.background=

"linear-gradient(135deg,#16a34a,#22c55e)";



setTimeout(()=>{

window.location.href="login.html";

},1500);

},1500);

});

});