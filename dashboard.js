/*==================================================
        SENKU STAKES
        DASHBOARD JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{
if(!checkAccountStatus()){

    window.location.href="login.html";

    return;

}

checkAccountStatus();

setInterval(checkAccountStatus,3000);

/*================================
        LOAD WALLET DATA
================================*/


const currentUser = getCurrentUser();

if(!currentUser || currentUser.role !== "USER"){

    window.location.href="login.html";

    return;

}

const db = getDB();

const userData = db.users.find(
    u => u.id === currentUser.id
);

if(!userData){

    window.location.href="login.html";

    return;

}
/*================================
        LOAD USER PROFILE
================================*/

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

/*================================
        LOAD RECENT TRANSACTIONS
================================*/


const transactionContainer=document.getElementById(
"dashboardTransactions"
);



if(transactionContainer){


    const transactions = db.transactions.filter(
    tx => tx.userId === userData.id
);


    if(transactions.length > 0){


        transactionContainer.innerHTML="";


        transactions.slice(0,5).forEach(tx=>{


            let icon="fa-arrow-down";
            let color="positive";
            let sign="+";


            if(tx.type==="Withdrawal"){

                icon="fa-arrow-up";
                color="negative";
                sign="-";

            }



            transactionContainer.innerHTML += `


            <div class="transaction-row">


                <div class="transaction-info">


                    <div class="transaction-icon">

                        <i class="fa-solid ${icon}"></i>

                    </div>



                    <div>


                        <h4>
                        ${tx.type}
                        </h4>


                        <p>
                        ${tx.date}
                        </p>


                    </div>


                </div>



                <div class="transaction-amount ${color}">

                    ${sign}$${Math.abs(tx.amount).toFixed(2)}

                </div>


            </div>


            `;



        });



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


    alert(

    "Deposit section coming soon."

    );


});


}





/*================================
        TRANSACTION CLICK
================================*/


const transactions=document.querySelectorAll(

".transaction-row, .empty-transactions"

);



transactions.forEach(transaction=>{


    transaction.addEventListener("click",()=>{


        transaction.style.background=

        "rgba(123,44,255,.08)";



        setTimeout(()=>{


            transaction.style.background="";


        },500);



    });


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