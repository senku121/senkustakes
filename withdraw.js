/*==================================================
        SENKU STAKES
        WITHDRAW PAGE
==================================================*/

document.addEventListener("DOMContentLoaded", async () => {

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

    return;

}

const balanceElement =
document.getElementById("withdrawBalance");

const amountInput =
document.querySelector(".amount-input input");

const methodSelect =
document.getElementById("withdrawMethod");

const paymentFields =
document.getElementById("paymentFields");

const historyContainer =
document.getElementById("withdrawHistory");

const withdrawBtn =
document.querySelector(".confirm-withdraw");

let currentBalance = 0;

/*================================
        LOAD WALLET
================================*/

async function loadWallet(){

    try{

        const response = await fetch(

            "https://senkustakes-api.onrender.com/api/wallet",

            {

                headers:{
                    Authorization:`Bearer ${token}`
                }

            }

        );

        const wallet = await response.json();

        currentBalance = Number(wallet.balance);

        balanceElement.innerText =
        "$" + currentBalance.toFixed(2);

    }

    catch(err){

        console.log(err);

    }

}
/*================================
        PAYMENT FIELDS
================================*/

function updatePaymentFields(){

    const method = methodSelect.value;

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

    else if(method==="chime"){

        paymentFields.innerHTML=`

        <input
        id="accountInput"
        type="text"
        placeholder="Chime Username">

        <input
        id="emailInput"
        type="text"
        placeholder="Phone or Email">

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
        type="email"
        placeholder="Apple ID">

        <input
        id="noteInput"
        type="text"
        placeholder="Optional Note">

        `;

    }

    else if(method==="bank"){

        paymentFields.innerHTML=`

        <input
        id="accountInput"
        type="text"
        placeholder="Bank Account Number">

        <input
        id="emailInput"
        type="text"
        placeholder="Bank Name">

        <input
        id="noteInput"
        type="text"
        placeholder="Account Holder Name">

        `;

    }

    else{

        paymentFields.innerHTML=`

        <input
        id="accountInput"
        type="text"
        placeholder="Crypto Wallet Address">

        <input
        id="noteInput"
        type="text"
        placeholder="Network (BTC, ETH, TRC20...)">

        `;

    }

}

methodSelect.addEventListener(

"change",

updatePaymentFields

);

updatePaymentFields();
/*================================
        CREATE WITHDRAW
================================*/

withdrawBtn.addEventListener("click", async()=>{

    const amount = Number(amountInput.value);

    if(!amount || amount <= 0){

        alert("Enter a valid withdrawal amount.");

        return;

    }

    if(amount > currentBalance){

        alert("Insufficient balance.");

        return;

    }

    const accountInput =
    document.getElementById("accountInput");

    if(accountInput && accountInput.value.trim()===""){

        alert("Please enter payment details.");

        return;

    }

    withdrawBtn.disabled = true;

    withdrawBtn.innerHTML = `

    <i class="fa-solid fa-spinner fa-spin"></i>

    Processing...

    `;

    try{

        const response = await fetch(

            "https://senkustakes-api.onrender.com/api/withdraw/create",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:`Bearer ${token}`

                },

                body:JSON.stringify({

                    amount,

                    method:methodSelect.value,

                    account:accountInput
                        ? accountInput.value
                        : ""

                })

            }

        );

        const data = await response.json();

        if(!response.ok){

            alert(data.message);

            return;

        }

        alert(data.message);

        amountInput.value="";

        await loadWallet();

        await loadWithdrawHistory();

    }

    catch(err){

        console.log(err);

        alert("Server connection failed.");

    }

    finally{

        withdrawBtn.disabled = false;

        withdrawBtn.innerHTML = `

        <i class="fa-solid fa-arrow-up"></i>

        Confirm Withdrawal

        `;

    }

});
/*================================
        LOAD WITHDRAW HISTORY
================================*/

async function loadWithdrawHistory(){

    try{

        const response = await fetch(

            "https://senkustakes-api.onrender.com/api/withdraw",

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const withdrawals = await response.json();

        if(!historyContainer){

            return;

        }

        historyContainer.innerHTML="";

        if(withdrawals.length===0){

            historyContainer.innerHTML=`

            <div class="empty-history">

                <i class="fa-solid fa-clock-rotate-left"></i>

                <h3>No Withdrawals Yet</h3>

                <p>Your withdrawal history will appear here.</p>

            </div>

            `;

            return;

        }

        withdrawals.forEach(tx=>{

            historyContainer.innerHTML += `

            <div class="history-row">

                <div>

                    <i class="fa-solid fa-arrow-up"></i>

                    <div>

                        <h4>$${Number(tx.amount).toFixed(2)}</h4>

                        <p>

                            ${tx.method}

                            •

                            ${tx.status}

                        </p>

                    </div>

                </div>

                <strong>

                    ${new Date(tx.createdAt).toLocaleDateString()}

                </strong>

            </div>

            `;

        });

    }

    catch(err){

        console.log(err);

    }

}

/*================================
        INITIAL LOAD
================================*/

await loadWallet();

await loadWithdrawHistory();

});