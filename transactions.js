/*==================================================
        SENKU STAKES
        TRANSACTIONS JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{



/*================================
        LOAD TRANSACTION DATA
================================*/


const userData = getUserData();


const transactions = userData.transactions || [];

console.log("Transactions:", transactions);

const list = document.getElementById(
"transactionList"
);



const totalTransactions =
document.getElementById("totalTransactions");


const totalDeposits =
document.getElementById("totalDeposits");


const totalWithdrawals =
document.getElementById("totalWithdrawals");





let depositTotal = 0;

let withdrawTotal = 0;





transactions.forEach(tx=>{


    if(tx.type==="Deposit"){

        depositTotal += Number(tx.amount);

    }


    if(tx.type==="Withdrawal"){

    withdrawTotal += Math.abs(Number(tx.amount));

}


});





/*================================
        SUMMARY UPDATE
================================*/


if(totalTransactions){

    totalTransactions.innerText =
    transactions.length;

}



if(totalDeposits){

    totalDeposits.innerText =
    "$"+depositTotal.toLocaleString();

}



if(totalWithdrawals){

    totalWithdrawals.innerText =
    "$"+withdrawTotal.toLocaleString();

}







/*================================
        DISPLAY TRANSACTIONS
================================*/


if(list){


    if(transactions.length===0){


        list.innerHTML=`

        <div class="empty-transactions">


        <i class="fa-solid fa-clock-rotate-left"></i>


        <h3>
        No Transactions Found
        </h3>


        <p>
        Your transaction history will appear here after wallet activity.
        </p>


        </div>

        `;


    }


    else{


        list.innerHTML="";



        [...transactions].reverse().forEach(tx=>{
            console.log("Rendering:", tx);


            let icon =
            "fa-wallet";


            let typeClass =
            tx.type.toLowerCase();



            if(tx.type==="Deposit"){

                icon="fa-arrow-down";

            }



            if(tx.type==="Withdrawal"){

    icon="fa-arrow-up";

}





            list.innerHTML += `
            
            


            <div class="transaction-item ${typeClass}">


                <div class="transaction-left">


                    <i class="fa-solid ${icon}"></i>


                    <div>


                        <h3>

                        ${tx.type}

                        </h3>


                        <p>

                        ${tx.date} • ${tx.status}

                        </p>


                    </div>


                </div>




                <strong>

                ${tx.amount >= 0 ? "+" : "-"}
$${Math.abs(tx.amount).toLocaleString()}

                </strong>



            </div>


            `;



        });
        console.log("Generated HTML:", list.innerHTML);


    }


}







/*================================
        FILTER SYSTEM
================================*/


const filters =
document.querySelectorAll(".filter");


const items =
()=>document.querySelectorAll(".transaction-item");




filters.forEach(filter=>{


    filter.addEventListener("click",()=>{


        filters.forEach(btn=>{

            btn.classList.remove("active");

        });



        filter.classList.add("active");



        let type = filter.innerText.toLowerCase();

if(type==="withdraw"){
    type="withdrawal";
}




        items().forEach(item=>{


            if(type==="all"){

                item.style.display="flex";

            }

            else if(item.classList.contains(type)){

                item.style.display="flex";

            }

            else{

                item.style.display="none";

            }


        });



    });


});






/*================================
        SEARCH SYSTEM
================================*/


const search =
document.querySelector(".search-box input");



if(search){


search.addEventListener("input",()=>{


    let value =
    search.value.toLowerCase();



    items().forEach(item=>{


        if(item.innerText.toLowerCase().includes(value)){


            item.style.display="flex";


        }

        else{


            item.style.display="none";


        }


    });


});


}







/*================================
        PAGE ANIMATION
================================*/


const elements=document.querySelectorAll(

".summary-card,.filter-card,.transaction-card"

);



elements.forEach((element,index)=>{


    element.style.opacity="0";

    element.style.transform="translateY(30px)";



    setTimeout(()=>{


        element.style.transition=".6s ease";


        element.style.opacity="1";


        element.style.transform="translateY(0)";


    },300+(index*150));



});



});