const { response } = require("express");

//db connection
let db;

//connection to indexedDB 
const request = indexedDB.open('budget_tracker',1);

//emitting if the database version changes
request.onupgradeneeded = function(e){
    //saving a reference to the database. 
    const db = e.target.result;

    db.createObjectStore('new_budget', {autoIncrement: true});

};
//requesting on success
request.onsuccess = function(e){
    db = e.target.result;

    //checking if the app is online
    if (navigator.onLine){
        uploadBudget();
    }
};
//in case of an error
request.onerror = function(e){
    //checking the error
    console.log(e.target.errorCode);

};

//new transaction with no internet function.
let saveRecord = (record) => {
    //opne new transaction
    const transaction = db.transaction(["new_budget"], "readwrite");

    //accessing 
    const objectStore = transaction.objectStore("new_budget");

    //add record to your store with add method
    objectStore.add(record); 

};

function uploadBudget() {
    //opening transaction on db 
    const transaction = db.transaction(["new_budget"], "readwrite");

    //accessing 
    const objectStore = transaction.objectStore("new_budget");

    //getting the record
    const getAll = objectStore.getAll();

    //if succesfully did it
    getAll.onsuccess = function () {
        //in case of data in indexedDb's store, it will be sent to db
        if (getAll.result.length > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers:{
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
            })
            .then((response)=> response.json())
            .then((serverResponse)=>{
                if (serverResponse.message){
                    throw new Error(serverResponse);
                }
                //opening new transaction
                const transaction = db.transaction(["new_budget"], "readwrite");
                //accessing 
                const objectStore = transaction.objectStore("new_budget");
                //clearing items
                objectStore.clear();
                
                alert("Transaction have been successfull! =)")
            })
            .catch((err)=>{
                console.log(err);
            });
        }
    };

}
//when coming back online 
window.addEventListener("online", uploadBudget);





