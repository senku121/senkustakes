/*==================================================
        SENKU STAKES
        ADMIN USERS JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded", async()=>{


const token = localStorage.getItem("adminToken")


if(!token){

window.location.href="admin-login.html";

return;

}



const userTable =
document.getElementById("userTable");


let users=[];

let selectedUser=null;



/*================================
        LOAD USERS
================================*/


async function loadUsers(){


try{


const response = await fetch(

"https://senkustakes-api.onrender.com/api/admin/users",

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



users = await response.json();


renderUsers();


}


catch(err){

console.log(err);

showPopup({

type:"error",

title:"Error",

message:"Unable to load users"

});

}


}





function renderUsers(){


userTable.innerHTML="";



users.forEach(user=>{


userTable.innerHTML += `


<tr>


<td>
${user.id}
</td>


<td>
${user.username}
</td>


<td>
${user.email || "N/A"}
</td>


<td>
$${Number(user.balance).toLocaleString()}
</td>


<td>

<span class="${
user.status==="BLOCKED"
?
"blocked-status"
:
"active-status"
}">

${user.status}

</span>

</td>


<td>


<button

class="manage-btn"

data-id="${user.id}"

>

Manage

</button>


</td>



</tr>


`;


});


}




await loadUsers();





/*================================
        SEARCH
================================*/


const search =
document.getElementById("userSearch");



if(search){


search.addEventListener("input",()=>{


const value =
search.value.toLowerCase();



document.querySelectorAll("#userTable tr")
.forEach(row=>{


row.style.display =

row.innerText
.toLowerCase()
.includes(value)

?

""

:

"none";



});


});


}







/*================================
        MODAL ELEMENTS
================================*/


const modal =
document.getElementById("userManageModal");


const closeModal =
document.getElementById("closeUserModal");


const manageUsername =
document.getElementById("manageUsername");


const manageEmail =
document.getElementById("manageEmail");


const manageBalance =
document.getElementById("manageBalance");


const manageStatus =
document.getElementById("manageStatus");





document.addEventListener("click",(e)=>{


if(!e.target.classList.contains("manage-btn"))
return;



const id =
e.target.dataset.id;



selectedUser =
users.find(
u=>u.id===id
);



if(!selectedUser){

showPopup({

type:"error",

title:"Error",

message:"User not found"

});

return;

}



manageUsername.innerText =
selectedUser.username;


manageEmail.innerText =
selectedUser.email;


manageBalance.innerText =
"$"+selectedUser.balance;


manageStatus.innerText =
selectedUser.status;



modal.classList.add("active");



});







closeModal.onclick=()=>{

modal.classList.remove("active");

};




modal.onclick=(e)=>{


if(e.target===modal){

modal.classList.remove("active");

}


};









/*================================
        ADD BALANCE
================================*/


document.getElementById(
"addBalanceBtn"
)
.onclick=async()=>{


const amount =
prompt("Enter amount");



if(!amount)return;



await userAction(

`/${selectedUser.id}/add-balance`,

{amount}

);



};







/*================================
        DEDUCT BALANCE
================================*/


document.getElementById(
"deductBalanceBtn"
)
.onclick=async()=>{


const amount =
prompt("Enter amount");



if(!amount)return;



await userAction(

`/${selectedUser.id}/deduct-balance`,

{amount}

);



};







/*================================
        FREEZE
================================*/


document.getElementById(
"freezeUserBtn"
)
.onclick=async()=>{


await userStatus(
"FROZEN"
);


};







/*================================
        BLOCK
================================*/


document.getElementById(
"blockUserBtn"
)
.onclick=async()=>{


await userStatus(
"BLOCKED"
);


};







async function userStatus(status){



await userAction(

`/${selectedUser.id}/status`,

{status}

);



}








/*================================
        RESET PASSWORD
================================*/


document.getElementById(
"resetPasswordBtn"
)
.onclick=async()=>{


const password =
prompt(
"Enter new password"
);



if(!password)return;



await userAction(

`/${selectedUser.id}/reset-password`,

{
password
}

);


};







/*================================
        TRANSACTION HISTORY
================================*/


document.getElementById(
"transactionHistoryBtn"
)
.onclick=async()=>{


const response =
await fetch(

`https://senkustakes-api.onrender.com/api/admin/users/${selectedUser.id}/transactions`,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



const data =
await response.json();



alert(
JSON.stringify(
data,
null,
2
)
);



};







async function userAction(endpoint,body){


try{


const response =
await fetch(

"https://senkustakes-api.onrender.com/api/admin/users"+endpoint,

{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:`Bearer ${token}`

},


body:JSON.stringify(body)


}

);



const data =
await response.json();



if(response.ok){


showPopup({

type:"success",

title:"Success",

message:data.message

});



await loadUsers();


modal.classList.remove("active");

}


else{


showPopup({

type:"error",

title:"Failed",

message:data.message

});


}


}


catch(err){


console.log(err);


showPopup({

type:"error",

title:"Error",

message:"Server error"

});


}



}





/*================================
        LOGOUT
================================*/


const logoutBtn =
document.querySelector(".admin-logout");



if(logoutBtn){


logoutBtn.onclick=()=>{


logout();


window.location.href="admin-login.html";


};


}



});