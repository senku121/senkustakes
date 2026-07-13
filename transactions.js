/*==================================================
        SENKU STAKES
        TRANSACTIONS JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{



/*================================
        LOAD TRANSACTION DATA
================================*/
async function loadTransactions(){

    try{

        const response = await fetch(
            "https://senkustakes-api.onrender.com/api/transactions",
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        transactions = await response.json();

        renderTransactions();

    }

    catch(err){

        console.log(err);

    }

}

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
    return;
}

let transactions = [];

async function loadTransactions() {

    try {

        const response = await fetch(
            "https://senkustakes-api.onrender.com/api/transactions",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        transactions = await response.json();

        renderTransactions();

    } catch (err) {

        console.log(err);

    }

}
function animateNumber(element, target, money){

    let current = 0;

    const increment = target / 30;

    const timer = setInterval(()=>{

        current += increment;

        if(current >= target){

            current = target;

            clearInterval(timer);

        }

        if(money){

            element.innerText =
            "$" + current.toFixed(2);

        }

        else{

            element.innerText =
            Math.floor(current);

        }

    },20);

}
function renderTransactions() {

    const list = document.getElementById("transactionList");

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

            withdrawTotal += Number(tx.amount);

        }

        

    });


animateNumber(
    totalTransactions,
    transactions.length,
    false
);

animateNumber(
    totalDeposits,
    depositTotal,
    true
);

animateNumber(
    totalWithdrawals,
    withdrawTotal,
    true
);



    if(transactions.length===0){

        list.innerHTML=`

        <div class="empty-transactions">

            <i class="fa-solid fa-clock-rotate-left"></i>

            <h3>No Transactions Found</h3>

            <p>Your transaction history will appear here after wallet activity.</p>

        </div>

        `;

        return;

    }



    list.innerHTML="";



    [...transactions].reverse().forEach(tx=>{

        let icon="fa-wallet";
        let typeClass="";



        if(tx.type==="Deposit"){

            icon="fa-arrow-down";
            typeClass="deposit";

        }

        if(tx.type==="Withdrawal"){

            icon="fa-arrow-up";
            typeClass="withdrawal";

        }



        list.innerHTML+=`

        <div class="transaction-item ${typeClass}">

            <div class="transaction-left">

                <i class="fa-solid ${icon}"></i>

                <div>

                    <h3>${tx.type}</h3>

                    <p>

    ${new Date(tx.createdAt).toLocaleString()}

</p>

<span class="tx-status ${tx.status.toLowerCase()}">

    ${tx.status}

</span>

                </div>

            </div>

            <strong>

                ${tx.type==="Deposit" ? "+" : "-"}

                $${Number(tx.amount).toFixed(2)}

            </strong>

        </div>

        `;

    });

}

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
        SEARCH + FILTER SYSTEM
================================*/

const filters = document.querySelectorAll(".filter");

const search = document.querySelector(".search-box input");

let currentFilter = "all";

function updateFilters(){

    const keyword = search.value.toLowerCase();

    document.querySelectorAll(".transaction-item").forEach(item=>{

        const matchesSearch =
        item.innerText.toLowerCase().includes(keyword);

        const matchesFilter =
        currentFilter==="all" ||
        item.classList.contains(currentFilter);

        item.style.display =
        (matchesSearch && matchesFilter)
        ? "flex"
        : "none";

    });

}

filters.forEach(btn=>{

    btn.addEventListener("click",()=>{

        filters.forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter =
        btn.innerText.toLowerCase();

        if(currentFilter==="withdraw"){

            currentFilter="withdrawal";

        }

        updateFilters();

    });

});

search.addEventListener("input",updateFilters);

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
loadTransactions();


});