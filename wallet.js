/*==================================================
        SENKU STAKES
        WALLET JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{


console.log("Wallet JS loaded");


console.log(getUserData());


const userData = getUserData();


const walletBalance = document.getElementById(
"walletBalance"
);


const totalDeposited = document.getElementById(
"totalDeposited"
);


const totalWithdrawn = document.getElementById(
"totalWithdrawn"
);



if(walletBalance){

    walletBalance.innerText =
    formatMoney(userData.balance);

}



if(totalDeposited){

    totalDeposited.innerText =
    formatMoney(userData.deposited);

}



if(totalWithdrawn){

    totalWithdrawn.innerText =
    formatMoney(userData.withdrawn);

}



/*================================
        DEPOSIT BUTTON
================================*/


const depositBtn=document.querySelector(

".deposit-btn"

);



if(depositBtn){


depositBtn.addEventListener("click",()=>{


    depositBtn.innerHTML=`

        <i class="fa-solid fa-spinner fa-spin"></i>

        Opening...

    `;



    setTimeout(()=>{


        window.location.href="deposit.html";


    },800);



});


}





/*================================
        WITHDRAW BUTTON
================================*/


const withdrawBtn=document.querySelector(

".withdraw-btn"

);



if(withdrawBtn){


withdrawBtn.addEventListener("click",()=>{


    withdrawBtn.innerHTML=`

        <i class="fa-solid fa-spinner fa-spin"></i>

        Opening...

    `;



    setTimeout(()=>{


        window.location.href="withdraw.html";


    },800);



});


}



/*================================
        TRANSACTIONS
================================*/

const transactionBtn=document.querySelector(
".view-transactions"
);

if(transactionBtn){

transactionBtn.addEventListener("click",(e)=>{

e.preventDefault();

transactionBtn.innerHTML=`

<i class="fa-solid fa-spinner fa-spin"></i>

Opening...

`;

setTimeout(()=>{

window.location.href="transactions.html";

},700);

});

}




/*================================
        CARD ENTRANCE
================================*/


const elements=document.querySelectorAll(

".wallet-stat,.history-card,.wallet-actions,.wallet-footer"

);



elements.forEach((element,index)=>{


    element.style.opacity="0";


    element.style.transform=

    "translateY(25px)";



    setTimeout(()=>{


        element.style.transition=".6s ease";


        element.style.opacity="1";


        element.style.transform=

        "translateY(0)";



    },300+(index*150));



});




});