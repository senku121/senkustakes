/*==================================================
        SENKU STAKES
        DEPOSIT JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{
if(!checkAccountStatus()){

    window.location.href="login.html";

    return;

}
checkAccountStatus();

setInterval(checkAccountStatus,3000);

/*================================
        PAYMENT METHOD SWITCH
================================*/


const paymentOptions=document.querySelectorAll(

".payment-option"

);



paymentOptions.forEach(option=>{


    option.addEventListener("click",()=>{


        paymentOptions.forEach(item=>{


            item.classList.remove("active");


        });



        option.classList.add("active");


const method=option.dataset.method;


const gatewayText=document.querySelector(
".qr-box p"
);


const gatewayTitle=document.querySelector(
".qr-box h3"
);



if(method==="card"){


    gatewayTitle.innerText="Card Payment";


    gatewayText.innerText=
    "Card gateway details will appear here.";


}


else if(method==="crypto"){


    gatewayTitle.innerText="Crypto Payment";


    gatewayText.innerText=
    "Crypto wallet address will appear here.";


}


else if(method==="bank"){


    gatewayTitle.innerText="Bank Transfer";


    gatewayText.innerText=
    "Bank transfer details will appear here.";


}



    });


});


const loader=document.querySelector(
".gateway-loader"
);


if(loader){


    setTimeout(()=>{


        loader.style.display="none";


    },2000);


}




/*================================
        CONFIRM DEPOSIT
================================*/


const confirmBtn=document.getElementById(
"confirmDeposit"
);


const amountInput=document.querySelector(
".amount-input input"
);


const depositError=document.getElementById(
"depositError"
);



if(confirmBtn){


confirmBtn.addEventListener("click",()=>{


    let amount=Number(amountInput.value);



    /* Minimum deposit $1 */

if(isNaN(amount) || amount < 1){

    depositError.style.display="flex";

    depositError.querySelector("span").innerText =
    "Minimum deposit amount is $1.00";

    amountInput.focus();

    return;

}



    // ADD MONEY TO STORAGE

    addDeposit(amount);



    depositError.style.display="none";



    confirmBtn.disabled=true;



    confirmBtn.innerHTML=

    `

    <i class="fa-solid fa-spinner fa-spin"></i>

    Processing...

    `;



    setTimeout(()=>{


        confirmBtn.innerHTML=

        `

        <i class="fa-solid fa-circle-check"></i>

        Deposit Successful

        `;



        confirmBtn.style.background=

        "linear-gradient(135deg,#16a34a,#22c55e)";



        amountInput.value="";



        setTimeout(()=>{


            window.location.href="dashboard.html";


        },1500);



    },1500);



});


}






/*================================
        INPUT FORMAT
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

".form-card,.payment-card,.payment-details,.deposit-history,.confirm-deposit"

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