/*==================================================
        SENKU STAKES
        ADMIN USERS JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{


/*================================
        ADMIN SECURITY CHECK
================================*/


const currentUser = getCurrentUser();


if(
    !currentUser ||
    currentUser.role !== "SUPER_ADMIN"
){

    window.location.href="admin-login.html";

    return;

}




/*================================
        LOAD USERS
================================*/


const userTable = document.getElementById(
"userTable"
);


let users = getUsers();



function loadUsers(){


    userTable.innerHTML="";


    if(users.length===0){


        userTable.innerHTML=`

        <tr>

        <td colspan="6">

        No users found

        </td>

        </tr>

        `;


        return;

    }





    users.forEach((user,index)=>{



        userTable.innerHTML += `


        <tr>


        <td>

        #${index+1001}

        </td>



        <td>

        ${user.username}

        </td>



        <td>

        ${user.email || "N/A"}

        </td>



        <td>

        $${Number(user.balance || 0).toLocaleString()}

        </td>



        <td>


        <span class="${user.status==="Blocked" ? "blocked-status":"active-status"}">

        ${user.status || "Active"}

        </span>


        </td>



        <td>


        <button class="manage-btn" data-id="${user.id}">

        Manage

        </button>


        </td>


        </tr>


        `;


    });


}


loadUsers();






/*================================
        SEARCH USERS
================================*/


const search=document.getElementById(
"userSearch"
);



if(search){


search.addEventListener("input",()=>{


let value=search.value.toLowerCase();



document.querySelectorAll("#userTable tr")
.forEach(row=>{


    if(
        row.innerText.toLowerCase()
        .includes(value)
    ){

        row.style.display="";

    }

    else{

        row.style.display="none";

    }


});


});


}







/*================================
        MANAGE USER
================================*/


document.addEventListener("click",(e)=>{


if(e.target.classList.contains("manage-btn")){


    let id=e.target.dataset.id;



    let user=users.find(
        u=>u.id===id
    );



    if(!user) return;




    let action=prompt(

`Manage User

Username:
${user.username}

1. Add Balance
2. Remove Balance
3. Block User
4. Unblock User

Enter option:`

    );




    if(action==="1"){


        let amount=Number(
            prompt("Amount to add:")
        );


        user.balance += amount;


    }



    if(action==="2"){


        let amount=Number(
            prompt("Amount to remove:")
        );


        user.balance -= amount;


        if(user.balance<0)
            user.balance=0;


    }




    if(action==="3"){


        user.status="Blocked";


    }



    if(action==="4"){


        user.status="Active";


    }



    let db = getDB();

db.users = users;

saveDB(db);


    loadUsers();


}



});







/*================================
        CREATE REAL USER
================================*/


const createUserBtn = document.querySelector(
"#createUserBtn"
);



if(createUserBtn){


createUserBtn.addEventListener("click",()=>{


let username = prompt(
"Enter username:"
);



if(!username){

return;

}



let email = prompt(
"Enter email:"
);



let password = prompt(
"Enter password:"
);



if(!password){

alert("Password required.");

return;

}




let user = createUser({

username:username,

email:email,

password:password

});





users = getUsers();

loadUsers();


alert(

`User Created Successfully!


Username:
${user.username}


User ID:
${user.id}`

);




});



}






/*================================
        LOGOUT
================================*/


const logoutBtn=document.querySelector(
".admin-logout"
);



if(logoutBtn){


logoutBtn.addEventListener("click",()=>{


if(confirm("Logout from Admin Panel?")){


logout();


window.location.href="admin-login.html";


}


});


}




});