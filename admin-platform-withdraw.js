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


const admin = getAdmin();


if(
    !admin ||
    admin.role !== "SUPER_ADMIN"
){

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


function loadPlatformData(){


    const db = getDB();


    const withdrawals = 
    db.platformWithdrawals || [];



    if(balanceElement){

        balanceElement.innerText =
        formatMoney(
            admin.balance || 0
        );

    }



    const totalWithdraw =
    withdrawals.reduce(

        (sum,item)=>
        sum + Number(item.amount || 0),

        0

    );



    if(totalWithdrawElement){

        totalWithdrawElement.innerText =
        formatMoney(totalWithdraw);

    }



    const today =
    new Date().toLocaleDateString();



    const todayAmount =
    withdrawals.filter(item=>{


        return new Date(
            item.createdAt
        ).toLocaleDateString() === today;


    })
    .reduce(

        (sum,item)=>
        sum + Number(item.amount || 0),

        0

    );



    if(todayWithdrawElement){

        todayWithdrawElement.innerText =
        formatMoney(todayAmount);

    }


}



loadPlatformData();
loadWithdrawHistory();

/*================================
        LOAD WITHDRAW HISTORY
================================*/

function loadWithdrawHistory(){

    const db = getDB();

    const withdrawals =
    db.platformWithdrawals || [];

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





    if(amount > Number(admin.balance || 0)){


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


function createWithdrawal(
    amount,
    method,
    destination,
    holder,
    note
){


    const db = getDB();



    if(!db.platformWithdrawals){

        db.platformWithdrawals = [];

    }




    const withdrawal = {


        id:
        "PW-" +
        Date.now(),


        amount:
        amount,


        method:
        method,


        destination:
        destination,


        holder:
        holder,


        note:
        note,


        status:
        "completed",


        createdAt:
        new Date().toISOString()


    };





    db.platformWithdrawals.push(
        withdrawal
    );




    admin.balance =
    Number(admin.balance || 0)
    -
    amount;



    saveDB(db);



    safePopup({

        type:"success",

        title:"Withdrawal Successful",

        message:

        `
        ${formatMoney(amount)}
        withdrawn successfully.
        `

    });



    loadPlatformData();



}


/*================================
        PLATFORM WITHDRAW
================================*/

withdrawBtn.addEventListener("click", () => {

    const amount = Number(amountInput.value);

    if (!amount || amount <= 0) {

        safePopup({

            type: "error",

            title: "Invalid Amount",

            message: "Enter a valid withdrawal amount."

        });

        return;

    }

    const db = getDB();

    if (db.admin.balance < amount) {

        safePopup({

            type: "error",

            title: "Insufficient Balance",

            message: "Platform balance is too low."

        });

        return;

    }

    db.admin.balance -= amount;

    if (!db.platformWithdrawals) {

        db.platformWithdrawals = [];

    }

    db.platformWithdrawals.unshift({

        id: "PW" + Date.now(),

        amount: amount,

        method: methodSelect.value,

        destination: document.getElementById("accountInput")
            ? document.getElementById("accountInput").value
            : "-",

        holder: holderName.value,

        note: noteInput.value,

        status: "Completed",

        createdAt: new Date().toISOString()

    });

    saveDB(db);

loadPlatformData();

loadWithdrawHistory();

safePopup({

    type:"success",

    title:"Withdrawal Successful",

    message:"Platform withdrawal completed."

});

amountInput.value = "";

holderName.value = "";

noteInput.value = "";

updatePaymentFields();

});

});