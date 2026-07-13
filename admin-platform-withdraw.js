/*==================================================
        SENKU STAKES
        ADMIN PLATFORM WITHDRAW
==================================================*/
console.log(
    "ADMIN PLATFORM WITHDRAW JS LOADED"
);

document.addEventListener("DOMContentLoaded",()=>{

/*================================
        SAFE POPUP FUNCTION
================================*/


function safePopup(options){

    if(typeof showPopup === "function"){

        showPopup(options);

    }
    else{

        console.warn(
            "Popup system not loaded"
        );

    }

}
/*================================
        ADMIN CHECK
================================*/


const token = localStorage.getItem("adminToken")

let platformData = {};


if(!token){

    window.location.href="admin-login.html";

    return;

}


/*================================
        ELEMENTS
================================*/


const balanceElement = document.getElementById(
"platformBalance"
);


const todayWithdrawElement = document.getElementById(
"todayWithdraw"
);


const totalWithdrawElement = document.getElementById(
"totalWithdraw"
);


const amountInput = document.getElementById(
"withdrawAmount"
);


const methodSelect = document.getElementById(
"withdrawMethod"
);


const accountLabel = document.getElementById(
"accountLabel"
);


const accountInput = document.getElementById(
"accountInput"
);


const holderName = document.getElementById(
"holderName"
);


const noteInput = document.getElementById(
"withdrawNote"
);


const withdrawBtn = document.getElementById(
"platformWithdrawBtn"
);


const historyTable = document.getElementById(
"withdrawHistory"
);


const searchInput = document.getElementById(
"historySearch"
);
if(!withdrawBtn){

    console.error(
        "Platform withdraw button not found"
    );

    return;

}

/*================================
        LOAD PLATFORM DATA
================================*/


async function loadPlatformData(){

    try{

        const response = await fetch(

            "https://senkustakes-api.onrender.com/api/admin/platform-withdraw",

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        platformData = await response.json();

        if(!response.ok){

            safePopup({

                type:"error",

                title:"Error",

                message:platformData.message

            });

            return;

        }

        balanceElement.innerText =
        formatMoney(platformData.balance);

        todayWithdrawElement.innerText =
        formatMoney(platformData.todayWithdraw);

        totalWithdrawElement.innerText =
        formatMoney(platformData.totalWithdraw);

        loadWithdrawHistory();

    }

    catch(err){

        console.log(err);

    }

}



loadPlatformData();
loadWithdrawHistory();

/*================================
        LOAD WITHDRAW HISTORY
================================*/

function loadWithdrawHistory(){

    const withdrawals =
platformData.history || [];

    historyTable.innerHTML = "";

    if(withdrawals.length === 0){

        historyTable.innerHTML = `

        <tr>

            <td colspan="6">

                <div class="empty-history">

                    <i class="fa-solid fa-wallet"></i>

                    <h3>No Withdrawals Yet</h3>

                    <p>Completed platform withdrawals will appear here.</p>

                </div>

            </td>

        </tr>

        `;

        return;

    }

    withdrawals.forEach(item=>{

        historyTable.innerHTML += `

        <tr>

            <td>${item.id}</td>

            <td>${formatMoney(item.amount)}</td>

            <td>${item.method}</td>

            <td>${item.destination}</td>

            <td>

                <span class="status completed">

                    Completed

                </span>

            </td>

            <td>

                ${new Date(item.createdAt).toLocaleString()}

            </td>

        </tr>

        `;

    });

}


/*================================
        PAYMENT METHOD SWITCH
================================*/


const paymentBox = document.getElementById(
    "paymentDetailsBox"
);


const cardButton = document.getElementById(
    "addCardBtn"
);



function updatePaymentFields(){


    const method = methodSelect.value;


    console.log(
        "Payment method:",
        method
    );



    cardButton.style.display = "none";



    if(method === "cashapp"){


        paymentBox.innerHTML = `

        <label>
        CashApp Username / Cashtag
        </label>

        <input
        type="text"
        id="accountInput"
        placeholder="$Cashtag">

        `;


    }


    else if(method === "paypal"){


        paymentBox.innerHTML = `

        <label>
        PayPal Email
        </label>

        <input
        type="email"
        id="accountInput"
        placeholder="PayPal email">

        `;


    }


    else if(method === "chime"){


        paymentBox.innerHTML = `

        <label>
        Chime Username
        </label>

        <input
        type="text"
        id="accountInput"
        placeholder="Chime username">


        <label>
        Chime Email / Phone
        </label>

        <input
        type="text"
        id="chimeContact"
        placeholder="Chime email or phone">

        `;


    }


    else if(method === "applepay"){


        paymentBox.innerHTML = `

        <label>
        Apple Pay Email / Username
        </label>

        <input
        type="text"
        id="accountInput"
        placeholder="Apple Pay details">

        `;


    }


    else if(method === "card"){


        paymentBox.innerHTML = `

        <label>
        Card Withdrawal
        </label>

        `;


        cardButton.style.display = "flex";


    }


}




methodSelect.addEventListener(
    "change",
    updatePaymentFields
);



updatePaymentFields();

/*================================
        PROCESS PLATFORM WITHDRAW
================================*/


withdrawBtn.addEventListener(
    "click",
    processPlatformWithdraw
);



function processPlatformWithdraw(){


    const amount = Number(
        amountInput.value
    );


    const method = methodSelect.value;



    const currentAccountInput =
    document.getElementById(
        "accountInput"
    );


    const destination =
    currentAccountInput
    ?
    currentAccountInput.value.trim()
    :
    "";



    const holder =
    holderName.value.trim();



    const note =
    noteInput.value.trim();




    /*===========================
        VALIDATION
    ===========================*/


    if(!amount || amount <= 0){


        safePopup({

            type:"error",

            title:"Invalid Amount",

            message:
            "Please enter a valid withdrawal amount."

        });


        return;

    }





    if(amount > Number(platformData.balance || 0)){


        safePopup({

            type:"error",

            title:"Insufficient Balance",

            message:
            "Withdrawal amount exceeds platform balance."

        });


        return;

    }




    if(method !== "card" && !destination){


        safePopup({

            type:"error",

            title:"Payment Details Missing",

            message:
            "Please enter withdrawal destination."

        });


        return;

    }




    if(!holder){


        safePopup({

            type:"error",

            title:"Account Holder Missing",

            message:
            "Please enter account holder name."

        });


        return;

    }





    /*===========================
        CONFIRMATION
    ===========================*/


    safePopup({

        type:"confirm",

        title:"Confirm Withdrawal",

        message:

        `
        Amount:
        ${formatMoney(amount)}
        
        Method:
        ${method.toUpperCase()}
        
        Destination:
        ${destination || "Card Gateway"}

        `,

        confirmText:"Withdraw",

        cancelText:"Cancel",

        onConfirm(){

            createWithdrawal(
                amount,
                method,
                destination,
                holder,
                note
            );

        }


    });



}

/*================================
        CREATE WITHDRAWAL
================================*/


async function createWithdrawal(
    amount,
    method,
    destination,
    holder,
    note
){

    try{

        const response = await fetch(

            "https://senkustakes-api.onrender.com/api/admin/platform-withdraw",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:`Bearer ${token}`

                },

                body:JSON.stringify({

                    amount,
                    method,
                    destination,
                    holder,
                    note

                })

            }

        );

        const data = await response.json();

        safePopup({

            type:response.ok ? "success" : "error",

            title:response.ok
                ? "Withdrawal Successful"
                : "Failed",

            message:data.message

        });

        if(response.ok){

            amountInput.value="";

            holderName.value="";

            noteInput.value="";

            updatePaymentFields();

            await loadPlatformData();

        }

    }

    catch(err){

        console.log(err);

        safePopup({

            type:"error",

            title:"Server Error",

            message:"Unable to process withdrawal."

        });

    }

}


/*================================
        PLATFORM WITHDRAW
================================*/



});