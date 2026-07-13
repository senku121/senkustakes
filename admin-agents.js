/*==================================================
        SENKU STAKES
        ADMIN AGENTS JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded", async () => {

const token = localStorage.getItem("adminToken")

if(!token){

    window.location.href="admin-login.html";

    return;

}

const agentTable =
document.getElementById("agentTable");
const totalAgents =
document.getElementById("totalAgents");

const activeAgents =
document.getElementById("activeAgents");

const disabledAgents =
document.getElementById("disabledAgents");


let agents = [];

function renderAgents(){

    agentTable.innerHTML = "";

    if(agents.length===0){

        agentTable.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;padding:25px;">
                No agents found
            </td>
        </tr>
        `;

        return;

    }

    agents.forEach(agent=>{

        agentTable.innerHTML += `

        <tr>

            <td>${agent.id}</td>

            <td>${agent.name}</td>

            <td>${agent.role || "AGENT"}</td>

            <td>
                <span class="${agent.status==="ACTIVE"?"active-status":"disabled-status"}">
                    ${agent.status}
                </span>
            </td>

            <td>

                <button
                    class="manage-agent"
                    data-id="${agent.id}">
                    Manage
                </button>

            </td>

        </tr>

        `;

    });

}

async function loadAgents(){

    try{

        const response = await fetch(

            "https://senkustakes-api.onrender.com/api/admin/agents",

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        agents = await response.json();

updateAgentStats();

renderAgents();

    }

    catch(err){

        console.log(err);

        alert("Unable to load agents.");

    }

}

function updateAgentStats(){

    totalAgents.innerText =
    agents.length;


    const active =
    agents.filter(
        agent=>agent.status==="ACTIVE"
    );


    const disabled =
    agents.filter(
        agent=>agent.status!=="ACTIVE"
    );


    activeAgents.innerText =
    active.length;


    disabledAgents.innerText =
    disabled.length;

}



await loadAgents();



/*================================
        SEARCH AGENTS
================================*/


const search=document.querySelector(

"#agentSearch"

);









if(search){



search.addEventListener("input",()=>{


const rows=document.querySelectorAll("#agentTable tr");
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



const manageModal =
document.getElementById("manageAgentModal");

const closeManageModal =
document.getElementById("closeManageModal");

const closeManageButton =
document.getElementById("closeManageButton");

const manageAgentName =
document.getElementById("manageAgentName");

const manageAgentUsername =
document.getElementById("manageAgentUsername");

const manageAgentStatus =
document.getElementById("manageAgentStatus");

const toggleAgentStatusButton =
document.getElementById("toggleAgentStatus");

const resetAgentPasswordButton =
document.getElementById("resetAgentPassword");

let selectedAgent = null;



/*================================
        MANAGE AGENT
================================*/

document.addEventListener("click",(e)=>{

if(!e.target.classList.contains("manage-agent")) return;

const id = e.target.dataset.id;

selectedAgent = agents.find(a=>a.id===id);

if(!selectedAgent) return;

manageAgentName.innerText =
selectedAgent.name;

manageAgentUsername.innerText =
selectedAgent.username;

manageAgentStatus.innerText =
selectedAgent.status;

toggleAgentStatusButton.innerText =

selectedAgent.status==="ACTIVE"

?

"Disable Agent"

:

"Enable Agent";

manageModal.classList.add("active");

});

closeManageModal.addEventListener("click",()=>{

manageModal.classList.remove("active");

});

closeManageButton.addEventListener("click",()=>{

manageModal.classList.remove("active");

});

toggleAgentStatusButton.addEventListener(

"click",

async()=>{


if(!selectedAgent) return;


try{


const response = await fetch(

`https://senkustakes-api.onrender.com/api/admin/agents/${selectedAgent.id}/toggle`,

{

method:"POST",

headers:{

Authorization:`Bearer ${token}`

}

}

);



const data = await response.json();



if(response.ok){


showPopup({

type:"success",

title:"Agent Updated",

message:data.message

});


manageModal.classList.remove("active");


await loadAgents();


}

else{


showPopup({

type:"error",

title:"Update Failed",

message:data.message

});


}


}

catch(err){


console.log(err);


showPopup({

type:"error",

title:"Server Error",

message:"Unable to update agent status."

});


}


});

manageModal.addEventListener("click",(e)=>{

if(e.target===manageModal){

manageModal.classList.remove("active");

}

});


/*================================
        CREATE REAL AGENT
================================*/

const createAgentBtn =
document.querySelector(".create-agent");

const agentModal =
document.getElementById("createAgentModal");

const closeAgentModal =
document.getElementById("closeAgentModal");

const cancelAgent =
document.getElementById("cancelAgent");

const createAgentForm =
document.getElementById("createAgentForm");



if(createAgentBtn){

createAgentBtn.addEventListener("click",()=>{

    agentModal.classList.add("active");

});

}

closeAgentModal.addEventListener("click",()=>{

    agentModal.classList.remove("active");

});

cancelAgent.addEventListener("click",()=>{

    agentModal.classList.remove("active");

});

agentModal.addEventListener("click",(e)=>{

    if(e.target===agentModal){

        agentModal.classList.remove("active");

    }

});

createAgentForm.addEventListener(

"submit",

async(e)=>{

e.preventDefault();

const name =
document.getElementById("agentName").value.trim();

const username =
document.getElementById("agentUsername").value.trim();

const password =
document.getElementById("agentPassword").value;

const role =
document.getElementById("agentRole").value;

try{

const response = await fetch(

"https://senkustakes-api.onrender.com/api/admin/agents/create",

{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:`Bearer ${token}`

},

body:JSON.stringify({

name,
username,
password,
role

})

}

);

const data = await response.json();

if(response.ok){

showPopup({

type:"success",

title:"Agent Created",

message:"The new agent account has been created successfully."

});

createAgentForm.reset();

agentModal.classList.remove("active");

await loadAgents();

}
else{

showPopup({

type:"error",

title:"Creation Failed",

message:data.message

});

}

}

catch(err){

console.log(err);

showPopup({

type:"error",

title:"Creation Failed",

message:"Unable to create the agent. Please try again."

});

}

});




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