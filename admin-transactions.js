/*==================================================
        SENKU STAKES
        ADMIN TRANSACTIONS JAVASCRIPT
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{





/*================================
        ADMIN SECURITY
================================*/


const currentUser = getCurrentUser();


if(
    !currentUser ||
    currentUser.role !== "SUPER_ADMIN"
){

    window.location.href="admin-login.html";

    return;

}







/*================================
        LOGOUT
================================*/


const logoutBtn=document.querySelector(

".admin-logout"

);



if(logoutBtn){



logoutBtn.addEventListener("click",()=>{



    if(confirm("Logout from Admin Panel?")){


        logout();


        window.location.href="admin-login.html";


}



});



}







/*================================
        SEARCH SYSTEM
================================*/


const searchInput=document.querySelector(

"#transactionSearch"

);



const rows=document.querySelectorAll(

"#transactionTable tr"

);





if(searchInput){



searchInput.addEventListener("input",()=>{



    let value=

    searchInput.value.toLowerCase();




    rows.forEach(row=>{



        let text=

        row.innerText.toLowerCase();




        if(text.includes(value)){



            row.style.display="";


        }


        else{


            row.style.display="none";


        }



    });



});



}







/*================================
        TYPE FILTER
================================*/


const filter=document.querySelector(

"#typeFilter"

);



if(filter){



filter.addEventListener("change",()=>{



    let type=

    filter.value.toLowerCase();




    rows.forEach(row=>{



        let rowText=

        row.innerText.toLowerCase();




        if(type==="all"){



            row.style.display="";


        }


        else if(rowText.includes(type)){



            row.style.display="";


        }


        else{


            row.style.display="none";


        }



    });



});



}







/*================================
        APPROVE BUTTON
================================*/


const approveButtons=document.querySelectorAll(

".approve-btn"

);



approveButtons.forEach(button=>{



button.addEventListener("click",()=>{



    showConfirmModal({
    title: "Approve Transaction",
    message: "Are you sure you want to approve this transaction?",
    confirmText: "Approve",
    confirmClass: "approve",
    onConfirm: () => {

        button.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Approved
        `;

        button.style.background =
            "linear-gradient(135deg,#16a34a,#22c55e)";

        button.disabled = true;
    }
});



});



});







/*================================
        REJECT BUTTON
================================*/


const rejectButtons=document.querySelectorAll(

".reject-btn"

);



rejectButtons.forEach(button=>{



button.addEventListener("click",()=>{



    if(confirm("Reject this transaction?")){



        button.innerHTML=

        `

        <i class="fa-solid fa-xmark"></i>

        Rejected

        `;



        button.style.background=

        "linear-gradient(135deg,#ef4444,#dc2626)";



        button.disabled=true;



    }



});



});







/*================================
        VIEW TRANSACTION
================================*/


const viewButtons=document.querySelectorAll(

".manage-btn"

);



viewButtons.forEach(button=>{



button.addEventListener("click",()=>{



    showTransactionModal(transactionData);



});



});







/*================================
        PAGE ANIMATION
================================*/


const elements=document.querySelectorAll(

".transaction-box,.transaction-card"

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