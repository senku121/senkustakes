/*==================================================
        ADMIN WITHDRAW PAGE
==================================================*/

document.addEventListener("DOMContentLoaded", async () => {

const token = localStorage.getItem("adminToken")

if(!token){

    window.location.href="admin-login.html";

    return;

}

const requestContainer =
document.getElementById("withdrawRequests");

const pendingCount =
document.getElementById("pendingCount");

const pendingAmount =
document.getElementById("pendingAmount");

const searchInput =
document.getElementById("withdrawSearch");

let withdrawRequests=[];

/*================================
        LOAD REQUESTS
================================*/

async function loadRequests(){

    try{

        const response = await fetch(

            "https://senkustakes-api.onrender.com/api/admin/withdraws",

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

        withdrawRequests=data;

        renderRequests();

    }

    catch(err){

        console.log(err);

        alert("Unable to connect to server.");

    }

}
/*================================
        RENDER REQUESTS
================================*/

function renderRequests(){

    let keyword = searchInput.value.toLowerCase();

    let requests = withdrawRequests.filter(request=>{

        if(!keyword) return true;

        return (
            (request.user?.username || "")
            .toLowerCase()
            .includes(keyword)
        );

    });

    const pending = requests.filter(

        request=>request.status==="Pending"

    );

    pendingCount.innerText = pending.length;

    const total = pending.reduce(

        (sum,item)=>sum+Number(item.amount),

        0

    );

    pendingAmount.innerText =
    formatMoney(total);

    requestContainer.innerHTML="";

    if(requests.length===0){

        requestContainer.innerHTML=`

        <div class="empty">

            <i class="fa-solid fa-wallet"></i>

            <h2>No Withdrawal Requests</h2>

            <p>No withdrawal requests found.</p>

        </div>

        `;

        return;

    }

    requests.forEach(request=>{

        requestContainer.innerHTML += `

        <div class="request-card">

            <div class="request-left">

                <h3>

                    ${request.user?.username || "Unknown User"}

                </h3>

                <p>

                    <strong>Method:</strong>

                    ${request.method}

                </p>

                <p>

                    <strong>Account:</strong>

                    ${request.account}

                </p>

                <p>

                    <strong>Date:</strong>

                    ${new Date(request.createdAt).toLocaleString()}

                </p>

            </div>

            <div class="request-right">

                <div class="request-amount">

                    ${formatMoney(Number(request.amount))}

                </div>

                <div class="status ${request.status.toLowerCase()}">

                    ${request.status}

                </div>

                <div class="action-buttons">

                    ${
                        request.status==="Pending"
                        ?
                        `
                        <button
                        class="approve-btn"
                        data-id="${request.id}">
                        Approve
                        </button>

                        <button
                        class="reject-btn"
                        data-id="${request.id}">
                        Reject
                        </button>
                        `
                        :
                        ""
                    }

                </div>

            </div>

        </div>

        `;

    });

}

searchInput.addEventListener(

    "input",

    renderRequests

);
/*================================
        APPROVE / REJECT ACTIONS
================================*/

document.addEventListener(
"click",
async(e)=>{


/*=========================
        APPROVE
=========================*/


if(e.target.classList.contains("approve-btn")){


    const id =
    e.target.dataset.id;


    try{


        const response =
        await fetch(

            `https://senkustakes-api.onrender.com/api/admin/withdraws/${id}/approve`,

            {

                method:"POST",

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );


        const data =
        await response.json();


        alert(data.message);


        await loadRequests();


    }

    catch(err){

        console.log(err);

        alert("Server error.");

    }


}



/*=========================
        REJECT
=========================*/


if(e.target.classList.contains("reject-btn")){


    const id =
    e.target.dataset.id;


    try{


        const response =
        await fetch(

            `https://senkustakes-api.onrender.com/api/admin/withdraws/${id}/reject`,

            {

                method:"POST",

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );


        const data =
        await response.json();


        alert(data.message);


        await loadRequests();


    }

    catch(err){

        console.log(err);

        alert("Server error.");

    }


}



});
/*================================
        INITIAL LOAD
================================*/

await loadRequests();


});