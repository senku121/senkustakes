/*==================================================
        SENKU STAKES
        ADMIN DASHBOARD JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{




/*================================
        ADMIN SESSION CHECK
================================*/

const currentUser = getCurrentUser();
let selectedUserId=null;
const userModal = document.getElementById(
    "userModal"
);


const closeUserModal = document.getElementById(
    "closeUserModal"
);
if(
    !currentUser ||
    currentUser.role !== "SUPER_ADMIN"
){

    window.location.href = "admin-login.html";

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

logout();

window.location.href="admin-login.html";

}

});





    if(confirmLogout){

    logout();

    window.location.href = "admin-login.html";

}



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



        const db=getDB();



        const user=db.users.find(
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



function refreshDB(){

    const db=getDB();

    return db;

}





if(addBalanceBtn){


addBalanceBtn.onclick=()=>{


    let amount=Number(
        prompt("Enter amount to add")
    );


    if(!amount || amount<=0){

        return;

    }


    let db=refreshDB();


    let user=db.users.find(
        u=>u.id===selectedUserId
    );


    if(db.admin.balance < amount){

    alert("Insufficient Platform Balance");

    return;

}

db.admin.balance -= amount;

user.balance += amount;


    addTransaction(db,{

    userId:user.id,

    type:"Admin Added Balance",

    amount:amount,

    status:"Completed"

});

saveDB(db);


    alert("Balance added");


    location.reload();


};


}





if(deductBalanceBtn){


deductBalanceBtn.onclick=()=>{


    let amount=Number(
        prompt("Enter amount to deduct")
    );


    if(!amount || amount<=0){

        return;

    }



    let db=refreshDB();


    let user=db.users.find(
        u=>u.id===selectedUserId
    );


    if(user.balance < amount){

        alert("Insufficient balance");

        return;

    }



    user.balance -= amount;

/* Add deducted money to admin balance */

if(!db.admin){

    db.admin = {
        balance: 0
    };

}

db.admin.balance += amount;

addTransaction(db,{

    userId:user.id,

    type:"Admin Deducted Balance",

    amount:-amount,

    status:"Completed"

});

saveDB(db);

alert("Balance deducted");

location.reload();


};


}







if(freezeBtn){


freezeBtn.onclick = ()=>{

    let db = getDB();

    let user = db.users.find(
        u=>u.id===selectedUserId
    );

    if(user.status==="FROZEN"){

        user.status="ACTIVE";

    }

    else{

        user.status="FROZEN";

    }

    saveDB(db);

    location.reload();

};


}






if(blockBtn){


blockBtn.onclick = ()=>{

    let db = getDB();

    let user = db.users.find(
        u=>u.id===selectedUserId
    );

    if(user.status==="BLOCKED"){

        user.status="ACTIVE";

    }

    else{

        user.status="BLOCKED";

    }

    saveDB(db);

    location.reload();

};


}







if(resetPasswordBtn){


resetPasswordBtn.onclick=()=>{


    let newPass=prompt(
        "Enter new password"
    );


    if(!newPass){

        return;

    }



    let db=refreshDB();


    let user=db.users.find(
        u=>u.id===selectedUserId
    );



    user.password=newPass;


    saveDB(db);



    alert(
    "Password reset successful"
    );


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


const addUser=document.querySelector(

".add-user"

);



if(addUser){



addUser.addEventListener("click",()=>{



    let username=

    prompt(

    "Enter new username"

    );




    if(username){



        alert(

        username+

        " account created."

        );



    }



});



}







/*================================
        LOAD LIVE DASHBOARD
================================*/

const db = getDB();

const totalUsers = db.users.length;

const totalAgents = db.agents.length;

const totalUserBalance = db.users.reduce(
    (sum,u)=>sum + (u.balance || 0),
    0
);

const totalAgentBalance = db.agents.reduce(
    (sum,a)=>sum + (a.balance || 0),
    0
);

const totalBalance =
    totalUserBalance +
    totalAgentBalance +
    (db.admin.balance || 0);

const today = new Date().toLocaleDateString();

const depositsToday = db.transactions
.filter(t=>

    t.type==="Deposit" &&

    new Date(t.date).toLocaleDateString()===today

)
.reduce((sum,t)=>sum+t.amount,0);

const pendingWithdraw = db.withdrawals
.filter(w=>w.status==="Pending")
.reduce((sum,w)=>sum+w.amount,0);

document.getElementById("totalUsers").innerText =
totalUsers;

document.getElementById("totalAgents").innerText =
totalAgents;

document.getElementById("totalBalance").innerText =
formatMoney(totalBalance);

const adminBalance =
document.getElementById("adminBalance");

if(adminBalance){

    adminBalance.innerText =
    formatMoney(db.admin.balance || 0);

}

const availableBalance =
document.getElementById("availableBalance");

if(availableBalance){

    availableBalance.innerText =
    formatMoney(db.admin.balance || 0);

}

document.getElementById("todayDeposits").innerText =
formatMoney(depositsToday);

document.getElementById("pendingWithdraw").innerText =
formatMoney(pendingWithdraw);



/*================================
        LOAD USERS TABLE
================================*/


const usersTable = document.getElementById(
    "usersTable"
);


if(usersTable){


    usersTable.innerHTML="";


    db.users.forEach(user=>{


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