/*==================================================
        SENKU STAKES
        ADMIN TRANSACTIONS
==================================================*/

document.addEventListener("DOMContentLoaded", async () => {

const token = localStorage.getItem("adminToken")

if(!token){

    window.location.href="admin-login.html";

    return;

}

const table =
document.getElementById("transactionTable");

const searchInput =
document.getElementById("transactionSearch");

const filter =
document.getElementById("typeFilter");

const depositTotal =
document.getElementById("depositTotal");

const withdrawTotal =
document.getElementById("withdrawTotal");

const pendingTotal =
document.getElementById("pendingTotal");

const empty =
document.getElementById("emptyTransactions");

let transactions=[];


/*================================
        LOAD TRANSACTIONS
================================*/

async function loadTransactions(){

    try{

        const response = await fetch(

            "https://senkustakes-api.onrender.com/api/admin/transactions",

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if(!response.ok){

            alert(data.message);

            return;

        }

        transactions=data;

        renderTransactions();

    }

    catch(err){

        console.log(err);

        alert("Unable to connect to server.");

    }

}


/*================================
        RENDER TABLE
================================*/

function renderTransactions(){

    let keyword =
    searchInput.value.toLowerCase();

    let type =
    filter.value.toLowerCase();

    let rows = transactions.filter(tx=>{

        const username =
        tx.user?.username || "";

        const text = (

            tx.id +

            username +

            tx.type +

            tx.status +

            tx.amount

        ).toLowerCase();

        if(keyword && !text.includes(keyword)){

            return false;

        }

        if(type==="all"){

            return true;

        }

        if(type==="deposit"){

            return tx.type==="Deposit";

        }

        if(type==="withdraw"){

            return tx.type==="Withdrawal";

        }

        if(type==="pending"){

            return tx.status==="Pending";

        }

        if(type==="completed"){

            return tx.status==="Completed";

        }

        if(type==="rejected"){

            return tx.status==="Rejected";

        }

        return true;

    });


    table.innerHTML="";

    if(rows.length===0){

        empty.style.display="block";

        return;

    }

    empty.style.display="none";


    let deposits=0;

    let withdrawals=0;

    let pending=0;


    rows.forEach(tx=>{

        if(tx.type==="Deposit"){

            deposits+=Number(tx.amount);

        }

        if(tx.type==="Withdrawal"){

            withdrawals+=Number(tx.amount);

        }

        if(tx.status==="Pending"){

            pending++;

        }

        table.innerHTML+=`

        <tr>

            <td>${tx.id}</td>

            <td>

                ${tx.user?.username || "-"}

            </td>

            <td>

                ${tx.type}

            </td>

            <td>

                $${Number(tx.amount).toFixed(2)}

            </td>

            <td>

                ${tx.status}

            </td>

            <td>

                ${new Date(tx.createdAt).toLocaleString()}

            </td>

        </tr>

        `;

    });


    depositTotal.innerText =
    "$"+deposits.toFixed(2);

    withdrawTotal.innerText =
    "$"+withdrawals.toFixed(2);

    pendingTotal.innerText =
    pending;

}


/*================================
        SEARCH
================================*/

searchInput.addEventListener(

    "input",

    renderTransactions

);


/*================================
        FILTER
================================*/

filter.addEventListener(

    "change",

    renderTransactions

);


/*================================
        LOAD
================================*/

await loadTransactions();

});