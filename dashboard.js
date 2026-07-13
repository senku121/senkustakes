/*==================================================
        SENKU STAKES
        DASHBOARD JAVASCRIPT
==================================================*/

document.addEventListener("DOMContentLoaded", async () => {

const token = localStorage.getItem("token");


if (!token) {

    window.location.href = "login.html";

    return;

}

let userData;


try {


    const response = await fetch(
        "https://senkustakes-api.onrender.com/api/wallet",
        {

            headers: {

                Authorization:`Bearer ${token}`

            }

        }
    );


    if(!response.ok){


        localStorage.removeItem("token");

        localStorage.removeItem("currentUser");


        window.location.href="login.html";

        return;


    }


    userData = await response.json();


}
catch(error){


    console.log(error);


    showPopup({

type:"error",

title:"Connection Error",

message:"Cannot connect to the server."

});


    return;


}


const welcome=document.getElementById(
"dashboardWelcome"
);

const username=document.getElementById(
"dashboardUsername"
);

if(welcome){

    welcome.innerText=
    `Welcome back, ${userData.username} 👋`;

}

if(username){

    username.innerText=
    userData.username;

}


const balanceElement = document.getElementById(
"dashboardBalance"
);


const depositedElement = document.getElementById(
"dashboardDeposited"
);


const withdrawnElement = document.getElementById(
"dashboardWithdrawn"
);

const lockedElement =
document.getElementById("dashboardLocked");

if(balanceElement){

    balanceElement.innerText =
    formatMoney(userData.balance);

}



if(depositedElement){

    depositedElement.innerText =
    formatMoney(userData.deposited);

}



if(withdrawnElement){

    withdrawnElement.innerText =
    formatMoney(userData.withdrawn);

}

if (lockedElement) {

    lockedElement.innerText =
    formatMoney(userData.lockedBalance || 0);

}

/*================================
        LOAD RECENT TRANSACTIONS
================================*/


const transactionContainer = document.getElementById("dashboardTransactions");

if (transactionContainer) {

    try {

        const response = await fetch(
            "https://senkustakes-api.onrender.com/api/transactions",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if(!response.ok){

    throw new Error("Unable to load transactions");

}

const transactions = await response.json();
console.log(transactions);

        if (transactions.length > 0) {

            transactionContainer.innerHTML = "";

            transactions.slice(0,5).forEach(tx=>{

                let icon = "fa-arrow-down";
                let color = "positive";
                let sign = "+";

                if(tx.type === "Withdrawal"){

                    icon = "fa-arrow-up";
                    color = "negative";
                    sign = "-";

                }

                transactionContainer.innerHTML += `

                <div class="transaction-row">

                    <div class="transaction-info">

                        <div class="transaction-icon">

                            <i class="fa-solid ${icon}"></i>

                        </div>

                        <div>

                            <h4>${tx.type}</h4>

                            <p>
${new Date(tx.createdAt).toLocaleString()}
<br>
Status: ${tx.status}
</p>

                        </div>

                    </div>

                    <div class="transaction-amount ${color}">

                        ${sign}$${Number(tx.amount).toFixed(2)}

                    </div>

                </div>

                `;

            });

        }

    } catch(err){

        console.log(err);

    }

}

/*================================
        SIDEBAR ACTIVE
================================*/


const menuItems=document.querySelectorAll(".sidebar nav a");


menuItems.forEach(item=>{


    item.addEventListener("click",()=>{


        menuItems.forEach(link=>{

            link.classList.remove("active");

        });



        item.classList.add("active");


    });


});





/*================================
        NOTIFICATION BUTTON
================================*/


const notification=document.querySelector(".top-actions button");


notification.addEventListener("click",()=>{


    notification.classList.toggle("notify-active");



    if(notification.classList.contains("notify-active")){


        notification.innerHTML=

        `

        <i class="fa-solid fa-check"></i>

        `;


        setTimeout(()=>{


            notification.innerHTML=

            `

            <i class="fa-solid fa-bell"></i>

            `;


            notification.classList.remove("notify-active");


        },2000);


    }


});











/*================================
        CARD ENTRANCE ANIMATION
================================*/


const cards=document.querySelectorAll(

".balance-card, .quick-card, .stat-card, .transaction-row"

);



cards.forEach((card,index)=>{


    card.style.opacity="0";

    card.style.transform="translateY(30px)";



    setTimeout(()=>{


        card.style.transition=".6s ease";


        card.style.opacity="1";


        card.style.transform="translateY(0)";


    },index*100);



});





/*================================
        ADD FUNDS BUTTON
================================*/


const addFunds=document.querySelector(".welcome button");



if(addFunds){


addFunds.addEventListener("click",()=>{


    window.location.href = "deposit.html";


});


}





/*================================
        TRANSACTION CLICK
================================*/






document.addEventListener("click",(e)=>{

    const row = e.target.closest(".transaction-row");

    if(!row) return;

    row.style.background="rgba(123,44,255,.08)";

    setTimeout(()=>{

        row.style.background="";

    },500);

});





/*================================
        LOGOUT CONFIRMATION
================================*/


const logoutBtn=document.querySelector(".logout a");



if(logoutBtn){


logoutBtn.addEventListener("click",(e)=>{


    e.preventDefault();

showPopup({

type:"warning",

title:"Logout",

message:"Are you sure you want to logout?",

confirm:true,

onConfirm:()=>{

logout();

window.location.href="login.html";

}

});


});


}





});