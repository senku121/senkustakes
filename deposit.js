document.addEventListener("DOMContentLoaded", async()=>{


const token = localStorage.getItem("token");


if(!token){

    window.location.href="login.html";

    return;

}



const balanceElement =
document.getElementById("depositBalance");


const amountInput =
document.getElementById("depositAmount");


const confirmBtn =
document.getElementById("confirmDeposit");


const errorBox =
document.getElementById("depositError");



let selectedMethod="card";



/* LOAD WALLET BALANCE */

async function loadBalance(){


try{


const response = await fetch(

"https://senkustakes-api.onrender.com/api/wallet",

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



const data = await response.json();



balanceElement.innerText =
"$"+Number(data.balance).toFixed(2);



}
catch(error){

console.log(error);

}



}

/*================================
        LOAD BALANCE
================================*/

loadBalance();

/* PAYMENT METHOD SELECT */


document.querySelectorAll(".payment-option")
.forEach(option=>{


option.addEventListener("click",()=>{


document.querySelectorAll(".payment-option")
.forEach(o=>o.classList.remove("active"));



option.classList.add("active");



selectedMethod =
option.dataset.method;



});


});





/* CREATE DEPOSIT */


confirmBtn.addEventListener("click",async()=>{


const amount =
Number(amountInput.value);



if(!amount || amount<=0){


errorBox.style.display="flex";


return;


}


errorBox.style.display="none";



confirmBtn.disabled=true;


confirmBtn.innerHTML=

`
<i class="fa-solid fa-spinner fa-spin"></i>
Creating Deposit...
`;



try{


const response = await fetch(

"https://senkustakes-api.onrender.com/api/deposit/create",

{

method:"POST",

headers:{


"Content-Type":"application/json",


Authorization:
`Bearer ${token}`


},


body:JSON.stringify({

amount,

method:selectedMethod

})


}

);



const data = await response.json();



if(!response.ok){


alert(data.message);


return;


}



alert(
"Deposit request created successfully"
);



loadDeposits();



amountInput.value="";



}
catch(error){


console.log(error);

alert(
"Server connection failed"
);


}
finally{


confirmBtn.disabled=false;


confirmBtn.innerHTML=

`
<i class="fa-solid fa-check"></i>
Confirm Deposit
`;


}



});





/* LOAD DEPOSIT HISTORY */


async function loadDeposits(){


const container =
document.querySelector(".deposit-history");


try{


const response = await fetch(

"https://senkustakes-api.onrender.com/api/deposit",

{

headers:{

Authorization:
`Bearer ${token}`

}

}

);



const deposits =
await response.json();



container.innerHTML =

`
<h2>
Recent Deposits
</h2>
`;



if(!deposits.length){


container.innerHTML +=

`

<div class="empty-deposit">


<i class="fa-solid fa-clock-rotate-left"></i>


<h3>
No Deposit History
</h3>


<p>
Your deposit records will appear here after payment.
</p>


</div>

`;

return;


}




deposits
.slice(0,5)
.forEach(dep=>{


let statusClass="pending";

let statusText="Pending";


if(dep.status==="SUCCESS"){

    statusClass="success";

    statusText="Completed";

}


if(dep.status==="FAILED"){

    statusClass="failed";

    statusText="Failed";

}



container.innerHTML +=


`

<div class="deposit-item">


<div class="deposit-left">


<div class="deposit-icon">

<i class="fa-solid fa-wallet"></i>

</div>



<div>

<h3>
$${Number(dep.amount).toFixed(2)}
</h3>


<p>
${dep.method}
</p>


<small>
${new Date(dep.createdAt).toLocaleString()}
</small>


</div>


</div>



<div class="deposit-status ${statusClass}">

${statusText}

</div>



</div>

`;



});



}
catch(error){

console.log(error);

}



}

loadDeposits();
});