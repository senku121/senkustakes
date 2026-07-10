/*==================================================
        SENKU STAKES
        AGENT REQUESTS
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{


/*================================
        LOGIN PROTECTION
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

const logout=document.querySelector(".admin-logout");

if(logout){

logout.addEventListener("click",()=>{

if(confirm("Logout from Admin Panel?")){

localStorage.removeItem("currentUser");

window.location.href="admin-login.html";

}

});

}



/*================================
        LOAD REQUESTS
================================*/

let requests=

JSON.parse(

localStorage.getItem("agentRequests")

)||[];



/*================================
        TABLE
================================*/

const table=

document.querySelector("#requestTable");



const pendingCount=

document.querySelector("#pendingCount");



const approvedCount=

document.querySelector("#approvedCount");



const rejectedCount=

document.querySelector("#rejectedCount");



const requestAmount=

document.querySelector("#requestAmount");




/*================================
        RENDER
================================*/

function renderRequests(data){

table.innerHTML="";



let pending=0;

let approved=0;

let rejected=0;

let totalAmount=0;



if(data.length===0){

table.innerHTML=`

<tr>

<td colspan="8"

style="text-align:center;padding:40px;">

No Agent Requests Found

</td>

</tr>

`;

}

data.forEach((request,index)=>{

totalAmount+=Number(request.amount)||0;

if(request.status==="Pending") pending++;

if(request.status==="Approved") approved++;

if(request.status==="Rejected") rejected++;

table.innerHTML+=`

<tr data-index="${index}">

<td>${request.requestId}</td>

<td>${request.agentId}</td>

<td>${request.agentName}</td>

<td>${request.type}</td>

<td>$${request.amount}</td>

<td>${request.date}</td>

<td>

<span class="status ${request.status.toLowerCase()}">

${request.status}

</span>

</td>

<td>

<button

class="view-request"

data-index="${index}">

View

</button>

${request.status==="Pending" ? `

<button

class="approve-request"

data-index="${index}">

Approve

</button>

<button

class="reject-request"

data-index="${index}">

Reject

</button>

` : ""}

</td>

</tr>

`;

});



pendingCount.innerText=pending;

approvedCount.innerText=approved;

rejectedCount.innerText=rejected;

requestAmount.innerText="$"+totalAmount;

}



/*================================
        FIRST LOAD
================================*/

renderRequests(requests);
/*================================
        SEARCH
================================*/

const requestSearch=
document.querySelector("#requestSearch");

if(requestSearch){

requestSearch.addEventListener("input",()=>{

let value=
requestSearch.value.toLowerCase();

let filtered=

requests.filter(request=>{

return(

request.requestId.toLowerCase().includes(value)||

request.agentId.toLowerCase().includes(value)||

request.agentName.toLowerCase().includes(value)

);

});

renderRequests(filtered);

});

}




/*================================
        STATUS FILTER
================================*/

const statusFilter=
document.querySelector("#statusFilter");

if(statusFilter){

statusFilter.addEventListener("change",()=>{

let value=statusFilter.value;

if(value==="all"){

renderRequests(requests);

return;

}

let filtered=

requests.filter(request=>

request.status.toLowerCase()===value

);

renderRequests(filtered);

});

}




/*================================
        REFRESH
================================*/

const refreshBtn=
document.querySelector("#refreshRequests");

if(refreshBtn){

refreshBtn.addEventListener("click",()=>{

requests=

JSON.parse(

localStorage.getItem("agentRequests")

)||[];

renderRequests(requests);

});

}




/*================================
        REQUEST MODAL
================================*/

const modal=
document.querySelector("#requestModal");

const closeModal=
document.querySelector("#closeModal");

const closeDetails=
document.querySelector("#closeDetailsBtn");



function hideModal(){

modal.classList.remove("show");

}



if(closeModal){

closeModal.addEventListener("click",hideModal);

}



if(closeDetails){

closeDetails.addEventListener("click",hideModal);

}



/*================================
        VIEW REQUEST
================================*/

document.addEventListener("click",(e)=>{

if(!e.target.classList.contains("view-request")){

return;

}

let index=

Number(

e.target.dataset.index

);



let request=

requests[index];



if(!request){

return;

}



document.querySelector("#detailRequestId").innerText=request.requestId;

document.querySelector("#detailAgentId").innerText=request.agentId;

document.querySelector("#detailAgentName").innerText=request.agentName;

document.querySelector("#detailType").innerText=request.type;

document.querySelector("#detailAmount").innerText="$"+request.amount;

document.querySelector("#detailStatus").innerText=request.status;

document.querySelector("#detailDate").innerText=request.date;



modal.classList.add("show");

});
/*================================
        APPROVE REQUEST
================================*/

document.addEventListener("click",(e)=>{

if(!e.target.classList.contains("approve-request")){

return;

}

const index=Number(e.target.dataset.index);

if(!requests[index]) return;

if(confirm("Approve this request?")){

requests[index].status="Approved";

localStorage.setItem(

"agentRequests",

JSON.stringify(requests)

);

renderRequests(requests);

hideModal();

}

});



/*================================
        REJECT REQUEST
================================*/

document.addEventListener("click",(e)=>{

if(!e.target.classList.contains("reject-request")){

return;

}

const index=Number(e.target.dataset.index);

if(!requests[index]) return;

if(confirm("Reject this request?")){

requests[index].status="Rejected";

localStorage.setItem(

"agentRequests",

JSON.stringify(requests)

);

renderRequests(requests);

hideModal();

}

});



/*================================
        CLOSE MODAL
================================*/

window.addEventListener("click",(e)=>{

if(e.target===modal){

hideModal();

}

});



/*================================
        ESC KEY CLOSE
================================*/

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

hideModal();

}

});



});