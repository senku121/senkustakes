/*==================================================
        SENKU STAKES
        GLOBAL DATABASE SYSTEM
==================================================*/


/*================================
        DEFAULT ADMIN
================================*/


const defaultAdmin = {

    id:"senku69",

    role:"SUPER_ADMIN",

    username:"senku",

    password:"Senku@69",

    name:"Super Admin",

    email:"admin@senkustakes.com",

    balance:0,

    createdAt:new Date().toLocaleString()

};





/*================================
        DATABASE TEMPLATE
================================*/


const defaultDatabase = {

admin:{
    id:"ADMIN001",
    username:"admin",
    password:"admin123",
    role:"ADMIN",
    balance:0
},
    users: [],


    agents: [],


    transactions: [],


        platformWithdrawals: [],


    deposits: [],


    withdrawals: [],

    

    withdrawRequests: [],


    agentRequests: [],


    games: [],


    settings:{


        siteName:"Senku Stakes",

        currency:"USD"


    },


    createdAt:new Date().toLocaleString()


};






/*================================
        INITIALIZE DATABASE
================================*/

function initializeDatabase(){

    let db = JSON.parse(localStorage.getItem("senkuDB"));

    if(!db){

        localStorage.setItem(
            "senkuDB",
            JSON.stringify(defaultDatabase)
        );

        return;
    }

    db.withdrawRequests ??= [];
    db.transactions ??= [];
    db.platformWithdrawals ??= [];
    db.deposits ??= [];
    db.withdrawals ??= [];
    db.agentRequests ??= [];
    db.games ??= [];

    localStorage.setItem(
        "senkuDB",
        JSON.stringify(db)
    );
}
/*==================================================
        DATABASE FUNCTIONS
==================================================*/


/*================================
        GET DATABASE
================================*/


function getDB(){

let db = JSON.parse(
localStorage.getItem("senkuDB")
);


if(!db){

db = {

admin:{
    id:"ADMIN001",
    username:"admin",
    password:"admin123",
    role:"SUPER_ADMIN",
    balance:0
},


users:[],


agents:[],


transactions:[],


agentRequests:[]
withdrawals:[]


};


localStorage.setItem(
"senkuDB",
JSON.stringify(db)
);


}


return db;


}






/*================================
        SAVE DATABASE
================================*/


function saveDB(data){


    localStorage.setItem(

        "senkuDB",

        JSON.stringify(data)

    );


}








/*================================
        ADMIN
================================*/


function getAdmin(){


    let db=getDB();


    return db.admin;


}







/*================================
        CURRENT USER SESSION
================================*/

function getCurrentUser(){

    const data = localStorage.getItem("currentUser");


    if(
        !data ||
        data === "undefined" ||
        data === "null"
    ){

        return null;

    }


    try{

        return JSON.parse(data);

    }

    catch(error){

        console.warn(
            "Invalid currentUser data removed:",
            error
        );


        localStorage.removeItem(
            "currentUser"
        );


        return null;

    }

}

/*================================
        SET CURRENT USER SESSION
================================*/

function setCurrentUser(user){

    if(!user){

        localStorage.removeItem(
            "currentUser"
        );

        return;

    }


    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

}



/*================================
        USERS
================================*/


function getUsers(){


    let db=getDB();


    return db.users;


}






function createUser(data){



    let db=getDB();



    let user={

    id:"USR"+Date.now(),

    role:"USER",

    firstName:data.firstName || "",

    lastName:data.lastName || "",

    username:data.username,

    email:data.email || "",

    phone:data.phone || "",

    country:data.country || "",

    password:data.password,

    balance:0,

    deposited:0,

    withdrawn:0,

    lockedBalance:0,

    bonus:0,

    status:"ACTIVE",

    createdAt:new Date().toLocaleString()

};



    db.users.push(user);



    saveDB(db);



    return user;



}








/*================================
        AGENTS
================================*/


function getAgents(){


    let db=getDB();


    return db.agents;


}







function createAgent(data){

    let db = getDB();

    const allowedRoles = [
        "AGENT",
        "SUPPORT_AGENT",
        "FINANCE_AGENT"
    ];

    let agent = {

        id:"AG"+Date.now(),

        role: allowedRoles.includes(data.role)
            ? data.role
            : "AGENT",

        username:data.username,

        password:data.password,

        name:data.name,

        balance:0,

        status:"ACTIVE",

        createdAt:new Date().toLocaleString()

    };

    db.agents.push(agent);

    saveDB(db);

    return agent;
}







/*================================
        BALANCE SYSTEM
================================*/


function updateUserBalance(id,amount){



    let db=getDB();



    let user=db.users.find(

        u=>u.id===id

    );



    if(!user){

        return false;

    }



    user.balance += amount;



    saveDB(db);



    return true;



}







function updateAgentBalance(id,amount){



    let db=getDB();



    let agent=db.agents.find(

        a=>a.id===id

    );



    if(!agent){

        return false;

    }



    agent.balance += amount;



    saveDB(db);



    return true;



}







function updateAdminBalance(amount){



    let db=getDB();



    db.admin.balance += amount;



    saveDB(db);



}








/*================================
        TRANSACTIONS
================================*/

function addTransaction(db,data){

    const transaction={

        id:"TXN"+Date.now(),

        ...data,

        date:new Date().toLocaleString()

    };

    db.transactions.unshift(transaction);

    return transaction;

}
/*================================
        USER DATA
================================*/

function getUserData(){

    const currentUser = getCurrentUser();

    if(!currentUser){

        return {

            balance:0,

            deposited:0,

            withdrawn:0,

            transactions:[]

        };

    }

    const db = getDB();

    const user = db.users.find(

        u => u.id === currentUser.id

    );

    if(!user){

        return {

            balance:0,

            deposited:0,

            withdrawn:0,

            transactions:[]

        };

    }

    return{

        balance:user.balance || 0,

        deposited:user.deposited || 0,

        withdrawn:user.withdrawn || 0,

        transactions:db.transactions.filter(

            t => t.userId === user.id

        )

    };

}



/*================================
        FORMAT MONEY
================================*/

function formatMoney(amount){

    amount = Number(amount || 0);

    return "$" + amount.toFixed(2);

}
/*================================
        LOGGED USER
================================*/

function getLoggedUser(){

    const session = getCurrentUser();

    if(!session){

        return null;

    }

    const db = getDB();

    return db.users.find(

        u => u.id === session.id

    );

}
/*================================
        USER DEPOSIT
================================*/

function addDeposit(amount){

    const currentUser = getCurrentUser();

    if(!currentUser){

        return false;

    }

    const db = getDB();

    const user = db.users.find(

        u => u.id === currentUser.id

    );

    if(!user){

        return false;

    }

    amount = Number(amount);

    user.balance += amount;

    user.deposited += amount;

    const transaction = {

        id:"TXN"+Date.now(),

        userId:user.id,

        type:"Deposit",

        amount:amount,

        status:"Completed",

        date:new Date().toLocaleString()

    };

    db.transactions.unshift(transaction);

    saveDB(db);

    return true;

}
/*================================
        CREATE WITHDRAW REQUEST
================================*/

function createWithdrawRequest(data){

    const currentUser = getCurrentUser();

    if(!currentUser){
        return false;
    }

    const db = getDB();

    if(!db.withdrawRequests){
    db.withdrawRequests = [];
}

if(!db.transactions){
    db.transactions = [];
}

    const user = db.users.find(
        u => u.id === currentUser.id
    );

    if(!user){
        return false;
    }

    const amount = Number(data.amount);

    if(isNaN(amount) || amount <= 0){
        return false;
    }

    if(user.balance < amount){
        return false;
    }

    // deduct user balance
    user.balance -= amount;

    user.lockedBalance =
        (user.lockedBalance || 0) + amount;

    // withdraw request
    const request = {

        id:"WR"+Date.now(),

        userId:user.id,

        username:user.username,

        amount,

        method:data.method,

        account:data.account,

        email:data.email,

        note:data.note,

        status:"Pending",

        createdAt:new Date().toLocaleString()

    };

    db.withdrawRequests.unshift(request);

    // transaction history
    db.transactions.unshift({

        id:"TXN"+Date.now(),

        userId:user.id,

        type:"Withdrawal",

        amount:-amount,

        status:"Pending",

        date:new Date().toLocaleString()

    });

    saveDB(db);

    return true;

}



/*================================
        ACCOUNT STATUS CHECK
================================*/

function checkAccountStatus(){

    const session = getCurrentUser();

    if(!session){
        return;
    }

    const db = getDB();

    const user = db.users.find(
        u => u.id === session.id
    );

    // User no longer exists
    if(!user){

        logout();

        window.location.href="login.html";

        return;

    }

    // Keep session updated
    setCurrentUser(user);

    if(user.status==="BLOCKED"){

        logout();

       showPopup({

type:"error",

title:"Account Blocked",

message:
"Your account has been blocked. Please contact the administrator.",

onConfirm:()=>{

logout();

window.location.href="login.html";

}

});

        window.location.href="login.html";

        return;

    }

    if(user.status==="FROZEN"){

    logout();

    showPopup({

type:"error",

title:"Account Frozen",

message:
"Your account has been Frozen. Please contact the administrator.",

onConfirm:()=>{

logout();

window.location.href="login.html";

}

});

    window.location.href="login.html";

    return false;

}

return true;

}

/*================================
        PLATFORM WITHDRAWALS
================================*/


function addPlatformWithdrawal(data){


    const db=getDB();


    const withdrawal={


        id:"PW"+Date.now(),


        amount:Number(data.amount),


        method:data.method,


        holder:data.holder || "",


        account:data.account || "",


        note:data.note || "",


        status:"COMPLETED",


        createdAt:new Date().toLocaleString()


    };



    db.platformWithdrawals.unshift(
        withdrawal
    );



    saveDB(db);



    return withdrawal;


}





function getPlatformWithdrawals(){


    const db=getDB();


    return db.platformWithdrawals || [];


}

/*================================
        LOGOUT
================================*/

function logout(){

    localStorage.removeItem("currentUser");

}




