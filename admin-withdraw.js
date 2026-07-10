/*==================================================
        SENKU STAKES
        ADMIN WITHDRAW REQUESTS
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

/*================================
        ADMIN CHECK
================================*/

const admin=getAdmin();

if(!admin || admin.role!=="SUPER_ADMIN"){

    window.location.href="admin-login.html";

    return;

}

/*================================
        ELEMENTS
================================*/

const requestContainer =
document.getElementById("withdrawRequests");

const pendingCount =
document.getElementById("pendingCount");

const pendingAmount =
document.getElementById("pendingAmount");

const searchInput =
document.getElementById("withdrawSearch");

/*================================
        LOAD REQUESTS
================================*/

function loadRequests(){

    const db=getDB();

    let requests =
    db.withdrawRequests || [];

    const keyword =
    searchInput.value.toLowerCase();

    requests=requests.filter(request=>

        request.username
        .toLowerCase()
        .includes(keyword)

    );

    const pending =
    requests.filter(

        request=>request.status==="Pending"

    );

    pendingCount.innerText =
    pending.length;

    const total =
    pending.reduce(

        (sum,item)=>

        sum+Number(item.amount),

        0

    );

    pendingAmount.innerText =
    formatMoney(total);

    requestContainer.innerHTML="";

    if(requests.length===0){

        requestContainer.innerHTML=`

        <div class="empty">

            <i class="fa-solid fa-wallet"></i>

            <h2>

                No Withdrawal Requests

            </h2>

            <p>

                Pending withdrawal requests will appear here.

            </p>

        </div>

        `;

        return;

    }

    requests.forEach(request=>{

        requestContainer.innerHTML+=`

        <div class="request-card">

            <div class="request-left">

                <h3>

                    ${request.username}

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

                    <strong>Email:</strong>

                    ${request.email || "-"}

                </p>

                <p>

                    <strong>Note:</strong>

                    ${request.note || "-"}

                </p>

                <p>

                    <strong>Date:</strong>

                    ${request.createdAt}

                </p>

            </div>

            <div class="request-right">

                <div class="request-amount">

                    ${formatMoney(request.amount)}

                </div>

                <div class="status ${request.status.toLowerCase()}">

                    ${request.status}

                </div>

                <div class="action-buttons">

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

                </div>

            </div>

        </div>

        `;

    });

}

loadRequests();

/*================================
        SEARCH
================================*/

searchInput.addEventListener(

"input",

loadRequests

);

/*================================
        APPROVE / REJECT
================================*/

document.addEventListener("click",(e)=>{

/*------------- APPROVE -------------*/

if(e.target.classList.contains("approve-btn")){

    const id=e.target.dataset.id;

    const db=getDB();

    const request=db.withdrawRequests.find(

        r=>r.id===id

    );

    if(!request){

        return;

    }

    if(request.status!=="Pending"){

        showPopup({

            type:"warning",

            title:"Already Processed",

            message:"This request has already been processed."

        });

        return;

    }

    const user=db.users.find(

        u=>u.id===request.userId

    );

    if(user){

        user.lockedBalance-=request.amount;

        user.withdrawn+=request.amount;
    }

    request.status="Approved";

    db.transactions.unshift({

        id:"TXN"+Date.now(),

        userId:request.userId,

        type:"Withdrawal",

        amount:-request.amount,

        status:"Approved",

        date:new Date().toLocaleString()

    });

    saveDB(db);

    showPopup({

        type:"success",

        title:"Withdrawal Approved",

        message:"Ready for payment gateway integration."

    });

    loadRequests();

}

/*------------- REJECT -------------*/

if(e.target.classList.contains("reject-btn")){

    const id=e.target.dataset.id;

    const db=getDB();

    const request=db.withdrawRequests.find(

        r=>r.id===id

    );

    if(!request){

        return;

    }

    if(request.status!=="Pending"){

        showPopup({

            type:"warning",

            title:"Already Processed",

            message:"This request has already been processed."

        });

        return;

    }

    const user=db.users.find(

        u=>u.id===request.userId

    );

    if(user){

        user.balance+=request.amount;

        user.lockedBalance-=request.amount;

    }

    request.status="Rejected";

    saveDB(db);

    showPopup({

        type:"success",

        title:"Withdrawal Rejected",

        message:"Funds have been returned to the user."

    });

    loadRequests();

}

});



});