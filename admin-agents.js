/*==================================================
        SENKU STAKES
        ADMIN AGENTS JAVASCRIPT
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



/*================================
        LOAD REAL AGENTS
================================*/


const agentTable=document.getElementById(
"agentTable"
);


let agents=getAgents();



function loadAgents(){


    if(!agentTable) return;


    agentTable.innerHTML="";



    if(agents.length===0){


        agentTable.innerHTML=`

        <tr>

        <td colspan="5" style="text-align:center;padding:30px;">

        No Agents Created

        </td>

        </tr>

        `;


        return;

    }




    agents.forEach((agent,index)=>{


        agentTable.innerHTML += `


        <tr>


        <td>

        ${agent.id}

        </td>


        <td>

        ${agent.name}

        </td>


        <td>

        ${agent.role}

        </td>


        <td>


        <span class="active-status">

        Active

        </span>


        </td>



        <td>


        <button class="manage-agent" data-id="${agent.id}">

        Manage

        </button>


        </td>


        </tr>


        `;


    });


}


loadAgents();



/*================================
        SEARCH AGENTS
================================*/


const search=document.querySelector(

"#agentSearch"

);



const rows=document.querySelectorAll(

"#agentTable tr"

);





if(search){



search.addEventListener("input",()=>{



    let value=

    search.value.toLowerCase();




    rows.forEach(row=>{



        let text=

        row.innerText.toLowerCase();




        if(text.includes(value)){



            row.style.display="";


        }

        else{


            row.style.display="none";


        }



    });



});



}







/*================================
        MANAGE AGENT
================================*/


const manageButtons=document.querySelectorAll(

".manage-agent"

);



manageButtons.forEach(button=>{



button.addEventListener("click",()=>{



    let action=

prompt(

`Agent Management

1. View Activity

2. Change Role

3. Disable Agent

4. Reset Password


Enter option:`

);






switch(action){



case "1":



alert(

"Showing agent activity logs..."

);



break;





case "2":



let role=

prompt(

"Enter new role:"

);



if(role){


alert(

"Agent role changed to "+role

);


}



break;





case "3":



alert(

"Agent disabled successfully."

);



break;





case "4":



alert(

"Password reset request created."

);



break;





default:



alert(

"Invalid option."

);



}



});



});







/*================================
        CREATE REAL AGENT
================================*/

const createAgentBtn = document.querySelector(
".create-agent"
);


if(createAgentBtn){


createAgentBtn.addEventListener("click",()=>{


let name = prompt(
"Enter agent name:"
);


if(!name) return;



let username = prompt(
"Enter agent username:"
);


if(!username) return;



let email = prompt(
"Enter agent email:"
);



let password = prompt(
"Create agent password:"
);



if(!password){

alert("Password required.");

return;

}



let roleOption = prompt(

`Select Agent Role:

1. Support Agent

2. Finance Agent

3. Manager Agent`

);

if(!roleOption){
    return;
}

let role = "AGENT";

switch(roleOption){

    case "1":
        role = "SUPPORT_AGENT";
        break;

    case "2":
        role = "FINANCE_AGENT";
        break;

    case "3":
        role = "AGENT";
        break;

    default:
        alert("Invalid Role.");
        return;
}




let agent=createAgent({

name:name,

username:username,

email:email,

password:password,

role:role

});





alert(

`Agent Created Successfully!


Name:
${agent.name}


Username:
${agent.username}


Agent ID:
${agent.id}`

);



});

}







/*================================
        PAGE ANIMATION
================================*/


const items=document.querySelectorAll(

".agent-box,.agent-card"

);



items.forEach((item,index)=>{



item.style.opacity="0";


item.style.transform=

"translateY(25px)";



setTimeout(()=>{



item.style.transition=".6s ease";


item.style.opacity="1";


item.style.transform=

"translateY(0)";



},300+(index*150));



});
});