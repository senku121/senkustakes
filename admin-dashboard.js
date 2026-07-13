/*==================================================
        SENKU STAKES
        ADMIN DASHBOARD JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded", async ()=>{

const token = localStorage.getItem("adminToken");
let dashboardUsers = [];
let selectedUserId = null;

if(!token){

    window.location.href="admin-login.html";

    return;

}
const userModal =
document.getElementById("userModal");

const closeUserModal =
document.getElementById("closeUserModal");

/*================================
        ADMIN SESSION CHECK
================================*/

try{

const response = await fetch(

"https://senkustakes-api.onrender.com/api/admin/dashboard",

{

headers:{

Authorization:`Bearer ${token}`

}

}

);

if(!response.ok){

window.location.href="admin-login.html";

return;

}

}

catch{

window.location.href="admin-login.html";

return;

}






/*================================
        LOGOUT SYSTEM
================================*/


const logoutBtn=document.querySelector(

".admin-logout"

);



if(logoutBtn){



logoutBtn.addEventListener("click",()=>{



    let confirmLogout=

    showPopup({

type:"warning",

title:"Logout",

message:"Logout from the Admin Panel?",

confirm:true,

onConfirm:()=>{

localStorage.removeItem("adminToken");
localStorage.removeItem("currentUser");

window.location.href="admin-login.html";

}

});





    



});



}







/*================================
        USER MANAGEMENT MODAL
================================*/


document.addEventListener(
"click",
(e)=>{


    const button = e.target.closest(".manage-btn");


if(button){


        const id =
button.dataset.id;



        const user = dashboardUsers.find(
    u=>u.id===id
);



        if(!user){

            alert("User not found");

            return;

        }



        selectedUserId=user.id;



        document.getElementById(
            "modalUsername"
        ).innerText=user.username;



        document.getElementById(
            "modalEmail"
        ).innerText=user.email;



        document.getElementById(
            "modalBalance"
        ).innerText=
        formatMoney(user.balance);



        document.getElementById(
            "modalStatus"
        ).innerText=
        user.status;

const freezeBtn = document.querySelector(".freeze-user");
const blockBtn = document.querySelector(".block-user");

if(user.status === "ACTIVE"){

    freezeBtn.innerHTML = `
        <i class="fa-solid fa-snowflake"></i>
        Freeze User
    `;

    blockBtn.innerHTML = `
        <i class="fa-solid fa-ban"></i>
        Block User
    `;

}

else if(user.status === "FROZEN"){

    freezeBtn.innerHTML = `
        <i class="fa-solid fa-fire"></i>
        Unfreeze User
    `;

    blockBtn.innerHTML = `
        <i class="fa-solid fa-ban"></i>
        Block User
    `;

}

else if(user.status === "BLOCKED"){

    freezeBtn.innerHTML = `
        <i class="fa-solid fa-snowflake"></i>
        Freeze User
    `;

    blockBtn.innerHTML = `
        <i class="fa-solid fa-unlock"></i>
        Unblock User
    `;

}

        document.getElementById(
            "userModal"
        ).classList.add("active");


    }


});





/* CLOSE MODAL */


if(closeUserModal){


closeUserModal.addEventListener(
"click",
()=>{


    userModal.classList.remove(
        "active"
    );


});


}


/*================================
        USER ACTIONS
================================*/


const addBalanceBtn=document.querySelector(
".add-balance"
);


const deductBalanceBtn=document.querySelector(
".deduct-balance"
);


const freezeBtn=document.querySelector(
".freeze-user"
);


const blockBtn=document.querySelector(
".block-user"
);


const resetPasswordBtn=document.querySelector(
".reset-password"
);








if(addBalanceBtn){

addBalanceBtn.onclick = async()=>{

const amount = Number(prompt("Enter amount"));

if(!amount || amount<=0) return;

try{

const response = await fetch(

`https://senkustakes-api.onrender.com/api/admin/users/${selectedUserId}/add-balance`,

{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
amount
})

}

);

const data = await response.json();

showPopup({

type: response.ok ? "success" : "error",

title: response.ok ? "Balance Added" : "Failed",

message: data.message

});

userModal.classList.remove("active");

await loadUsers();
await loadDashboard();

}

catch(err){

console.log(err);

showPopup({

type:"error",

title:"Failed",

message:"Unable to add balance."

});

}

};

}




if(deductBalanceBtn){

deductBalanceBtn.onclick = async ()=>{

const amount = Number(
prompt("Enter amount to deduct")
);

if(!amount || amount<=0) return;

try{

const response = await fetch(

`https://senkustakes-api.onrender.com/api/admin/users/${selectedUserId}/deduct-balance`,

{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
amount
})

}

);

const data = await response.json();

showPopup({

type:response.ok?"success":"error",

title:response.ok?"Balance Updated":"Error",

message:data.message

});

if(response.ok){

userModal.classList.remove("active");

await loadUsers();
await loadDashboard();
}

}

catch(err){

console.log(err);

showPopup({

type:"error",

title:"Server Error",

message:"Unable to deduct balance."

});

}

};

}







if(freezeBtn){

freezeBtn.onclick = async ()=>{

let newStatus =
document.getElementById("modalStatus").innerText==="FROZEN"
? "ACTIVE"
: "FROZEN";

try{

const response = await fetch(

`https://senkustakes-api.onrender.com/api/admin/users/${selectedUserId}/status`,

{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
status:newStatus
})

}

);

const data = await response.json();

showPopup({

type:response.ok?"success":"error",

title:response.ok?"Status Updated":"Error",

message:data.message

});

if(response.ok){

userModal.classList.remove("active");

await loadUsers();
await loadDashboard();
}

}

catch(err){

console.log(err);

showPopup({

type:"error",

title:"Server Error",

message:"Unable to update user status."

});

}

};

}





if(blockBtn){

blockBtn.onclick = async()=>{

const currentStatus =
document.getElementById("modalStatus").innerText;

const newStatus =

currentStatus==="BLOCKED"

?

"ACTIVE"

:

"BLOCKED";

try{

const response = await fetch(

`https://senkustakes-api.onrender.com/api/admin/users/${selectedUserId}/status`,

{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:`Bearer ${token}`

},

body:JSON.stringify({

status:newStatus

})

}

);

const data = await response.json();

showPopup({

type:response.ok?"success":"error",

title:response.ok?"Status Updated":"Failed",

message:data.message

});

if(response.ok){

userModal.classList.remove("active");

await loadUsers();

await loadDashboard();

}

}

catch(err){

console.log(err);

showPopup({

type:"error",

title:"Server Error",

message:"Unable to update status."

});

}

};

}







if(resetPasswordBtn){

resetPasswordBtn.onclick = async()=>{

const password = prompt("Enter new password");

if(!password) return;

try{

const response = await fetch(

`https://senkustakes-api.onrender.com/api/admin/users/${selectedUserId}/reset-password`,

{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({

password

})

}

);

const data = await response.json();

showPopup({

type:response.ok?"success":"error",

title:response.ok?"Success":"Failed",

message:data.message

});

}

catch(err){

console.log(err);

showPopup({

type:"error",

title:"Server Error",

message:"Unable to reset password."

});

}

};

}


/* CLOSE BY CLICKING OUTSIDE */


if(userModal){


userModal.addEventListener(
"click",
(e)=>{


    if(e.target===userModal){


        userModal.classList.remove(
            "active"
        );


    }


});


}





/*================================
        ADD USER BUTTON
================================*/


const addUser=document.querySelector(".add-user");

if(addUser){

addUser.addEventListener("click",()=>{

window.location.href="admin-users.html";

});

}






/*================================
        LOAD LIVE DASHBOARD
================================*/

async function loadDashboard(){

    try{

        const response =
        await fetch(

            "https://senkustakes-api.onrender.com/api/admin/dashboard",

            {

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );

        const data =
        await response.json();

        

        if(!response.ok){

            alert(data.message);

            return;

        }

        document.getElementById("totalUsers").innerText =
        data.totalUsers;

        document.getElementById("totalBalance").innerText =
        formatMoney(data.totalBalance);

        document.getElementById("todayDeposits").innerText =
        formatMoney(data.todayDeposits);

        document.getElementById("pendingWithdraw").innerText =
        formatMoney(data.pendingWithdraw);

    }

    catch(err){

        console.log(err);

    }

}

loadDashboard();

/*================================
        LOAD USERS TABLE
================================*/


const usersTable =
document.getElementById("usersTable");



async function loadUsers(){


    if(!usersTable){

        return;

    }


    try{


        const response =
        await fetch(

            "https://senkustakes-api.onrender.com/api/admin/users",

            {

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );


        const users =
await response.json();
if(!response.ok){
console.log(users);
return;
}

dashboardUsers = users;



        usersTable.innerHTML="";



        users.forEach(user=>{


            usersTable.innerHTML += `


            <tr>


                <td>
                    ${user.username}
                </td>


                <td>
                    ${user.email || "No Email"}
                </td>


                <td>
                    ${formatMoney(user.balance)}
                </td>


                <td>

                    <span class="status ${user.status.toLowerCase()}-status">

                    ${user.status}

                    </span>

                </td>


                <td>

                    <button
                    class="manage-btn"
                    data-id="${user.id}">

                    Manage

                    </button>

                </td>


            </tr>


            `;


        });



    }

    catch(err){

        console.log(err);

    }


}


loadUsers();



/*================================
        SIDEBAR ACTIVE CHANGE
================================*/


const links=document.querySelectorAll(

".admin-sidebar nav a"

);



links.forEach(link=>{



link.addEventListener("click",()=>{



    links.forEach(item=>{


        item.classList.remove("active");


    });



    link.classList.add("active");



});



});







/*================================
        DASHBOARD ENTRANCE
================================*/


const items=document.querySelectorAll(

".stat-card,.admin-card"

);



items.forEach((item,index)=>{



    item.style.opacity="0";


    item.style.transform=

    "translateY(30px)";



    setTimeout(()=>{


        item.style.transition=".6s ease";


        item.style.opacity="1";


        item.style.transform=

        "translateY(0)";



    },300+(index*150));



});







});