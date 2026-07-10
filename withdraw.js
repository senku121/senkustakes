/*==================================================
        SENKU STAKES
        WITHDRAW JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{
    if(!checkAccountStatus()){

    window.location.href="login.html";

    return;

}

const userData = getUserData();



const withdrawBalance=document.getElementById(
"withdrawBalance"
);



if(withdrawBalance){

    withdrawBalance.innerText =
    formatMoney(userData.balance);

}

/*================================
        LOAD WITHDRAW HISTORY
================================*/

const history=document.getElementById(
"withdrawHistory"
);

if(history){

    const withdrawals=userData.transactions.filter(
        tx=>tx.type==="Withdrawal"
    );

    if(withdrawals.length>0){

        history.innerHTML="";

        withdrawals.forEach(tx=>{

            history.innerHTML+=`

            <div class="history-row">

                <div>

                    <i class="fa-solid fa-arrow-up"></i>

                    <div>

                        <h4>Withdrawal</h4>

                        <p>${tx.date}</p>

                    </div>

                </div>

                <strong>

                    -${formatMoney(Math.abs(tx.amount))}

                </strong>

            </div>

            `;

        });

    }

}

/*================================
        PAYMENT METHOD SWITCH
================================*/

const methodSelect =
document.getElementById("withdrawMethod");

const paymentFields =
document.getElementById("paymentFields");

function updatePaymentFields(){

    const method =
    methodSelect.value;

    if(method==="cashapp"){

        paymentFields.innerHTML=`

        <input
        id="accountInput"
        type="text"
        placeholder="CashApp Cashtag">

        <input
        id="emailInput"
        type="email"
        placeholder="CashApp Email">

        <input
        id="noteInput"
        type="text"
        placeholder="Optional Note">

        `;

    }

    else if(method==="chime"){

        paymentFields.innerHTML=`

        <input
        id="accountInput"
        type="text"
        placeholder="Chime Username">

        <input
        id="emailInput"
        type="text"
        placeholder="Chime Email / Phone">

        <input
        id="noteInput"
        type="text"
        placeholder="Optional Note">

        `;

    }

    else if(method==="applepay"){

        paymentFields.innerHTML=`

        <input
        id="accountInput"
        type="text"
        placeholder="Apple ID">

        <input
        id="emailInput"
        type="email"
        placeholder="Apple Pay Email">

        <input
        id="noteInput"
        type="text"
        placeholder="Optional Note">

        `;

    }

    else if(method==="paypal"){

        paymentFields.innerHTML=`

        <input
        id="accountInput"
        type="email"
        placeholder="PayPal Email">

        <input
        id="noteInput"
        type="text"
        placeholder="Optional Note">

        `;

    }

    else{

        paymentFields.innerHTML=`

        <div class="comingSoon">

            <i class="fa-solid fa-credit-card"></i><br><br>

            Card Withdrawals are coming soon.

        </div>

        `;

    }

}

methodSelect.addEventListener(

"change",

updatePaymentFields

);

updatePaymentFields();






/*================================
        CONFIRM WITHDRAW
================================*/


const withdrawBtn=document.querySelector(

".confirm-withdraw"

);



const amountInput=document.querySelector(

".amount-input input"

);








if(withdrawBtn){


withdrawBtn.addEventListener("click",()=>{



   if(amountInput.value.trim()===""){

    alert("Please enter withdrawal amount.");

    amountInput.focus();

    return;

}

const amount = Number(amountInput.value);

if(amount < 30){

    showPopup({

        type:"error",

        title:"Minimum Withdrawal",

        message:"Minimum withdrawal amount is $30."

    });

    amountInput.focus();

    return;

}

const accountInput =
document.getElementById("accountInput");

if(accountInput && accountInput.value.trim()===""){

    alert("Please enter payment details.");

    accountInput.focus();

    return;

}

const method =
methodSelect.value;

const account =
document.getElementById("accountInput")?.value || "";

const email =
document.getElementById("emailInput")?.value || "";

const note =
document.getElementById("noteInput")?.value || "";

const success = createWithdrawRequest({

    amount,

    method,

    account,

    email,

    note

});



if(!success){

    alert(
        "Insufficient balance or invalid request."
    );

    return;

}



withdrawBtn.disabled=true;


withdrawBtn.innerHTML=`

<i class="fa-solid fa-spinner fa-spin"></i>

Processing...

`;



setTimeout(()=>{





    if(!success){


        alert("Insufficient balance");


        withdrawBtn.disabled=false;


        withdrawBtn.innerHTML=`

        <i class="fa-solid fa-arrow-up"></i>

        Confirm Withdrawal

        `;


        return;


    }



    withdrawBtn.innerHTML=`

    <i class="fa-solid fa-circle-check"></i>

    Withdraw Request Sent

`;
withdrawBalance.innerText =
formatMoney(getUserData().balance);

amountInput.value="";

["accountInput","emailInput","noteInput"].forEach(id=>{

    const input=document.getElementById(id);

    if(input) input.value="";

});



        withdrawBtn.style.background=

        "linear-gradient(135deg,#16a34a,#22c55e)";





        setTimeout(()=>{

    alert(
"Your withdrawal request has been sent to the administrator.\n\nStatus: Pending Approval"
);

window.location.href="dashboard.html";

},1500);




    },1500);



});


}








/*================================
        INPUT PROTECTION
================================*/


if(amountInput){


amountInput.addEventListener("input",()=>{


    if(amountInput.value<0){


        amountInput.value=0;


    }


});


}








/*================================
        PAGE ENTRANCE
================================*/


const sections=document.querySelectorAll(

".withdraw-form-card,.withdraw-method-card,.account-card,.withdraw-history,.confirm-withdraw"

);



sections.forEach((section,index)=>{


    section.style.opacity="0";


    section.style.transform=

    "translateY(25px)";



    setTimeout(()=>{


        section.style.transition=".6s ease";


        section.style.opacity="1";


        section.style.transform=

        "translateY(0)";



    },300+(index*150));



});






});