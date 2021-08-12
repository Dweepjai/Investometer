//select elements
const balanceEl = document.querySelector(".balance .value");
const cryptoTotalEl = document.querySelector(".crypto-total");
const equityTotalEl = document.querySelector(".equity-total");
const cryptoEl = document.querySelector("#crypto");
const equityEl = document.querySelector("#equity");
const allEl = document.querySelector("#all");
const cryptoList = document.querySelector("#crypto .list");
const equityList = document.querySelector("#equity .list");
const allList = document.querySelector("#all .list");

//select buttons
const equityBtn = document.querySelector(".tab1");
const cryptoBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

//input buttons
const addEquity = document.querySelector(".add-equity");
const equityTitle = document.getElementById("equity-title-input");
const equityExchange = document.getElementById("equity-exchange-input");
const equityAmount = document.getElementById("equity-amount-input");

const addCrypto = document.querySelector(".add-crypto");
const cryptoTitle = document.getElementById("crypto-title-input");
const cryptoExchange = document.getElementById("crypto-exchange-input");
const cryptoAmount = document.getElementById("crypto-amount-input");


//variables
let ENTRY_LIST;
let balance = 0, crypto = 0, equity = 0;

const DELETE = "delete", EDIT = "edit";

// look if there is a save data in local storage
ENTRY_LIST = JSON.parse(window.localStorage.getItem("entry_list")) || [];
updateUI();

//event listners
equityBtn.addEventListener("click", function(){
    show(equityEl);
    hide( [cryptoEl, allEl] );
    active( equityBtn );
    inactive( [cryptoBtn, allBtn] );
});
cryptoBtn.addEventListener("click", function(){
    show(cryptoEl);
    hide( [equityEl, allEl] );
    active( cryptoBtn );
    inactive( [equityBtn, allBtn] );
});
allBtn.addEventListener("click", function(){
    show(allEl);
    hide( [cryptoEl, equityEl] );
    active( allBtn );
    inactive( [cryptoBtn, equityBtn] );
});

addEquity.addEventListener("click", function(){
    //if one of the inputs is empty => exit
    if(!equityTitle.value || !equityAmount.value ) return;

    // save entry to ENTRY_LIST
    let equity = {
        type : "equity",
        title : equityTitle.value,
        exchange : equityExchange.value,
        amount : parseFloat(equityAmount.value)
    }
    ENTRY_LIST.push(equity);

    updateUI();
    clearInput( [equityTitle, equityExchange, equityAmount])
})

addCrypto.addEventListener("click", function(){
    //if one of the inputs is empty => exit
    if(!cryptoTitle.value || !cryptoAmount.value ) return;

    // save entry to ENTRY_LIST
    let crypto = {
        type : "crypto",
        title : cryptoTitle.value,
        exchange : cryptoExchange.value,
        amount : parseFloat(cryptoAmount.value)
    }
    ENTRY_LIST.push(crypto);

    updateUI();
    clearInput( [cryptoTitle, cryptoExchange, cryptoAmount])
})

cryptoList.addEventListener("click", deleteOrEdit);
equityList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

//helpers

function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if( targetBtn.id == DELETE ){
        deleteEntry(entry);
    }else if(targetBtn.id == EDIT ){
        editEntry(entry);
    }
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1);

    updateUI();
}

function editEntry(entry){
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id];

    if(ENTRY.type == "crypto"){
        cryptoAmount.value = ENTRY.amount;
        cryptoTitle.value = ENTRY.title;
        cryptoExchange.value = ENTRY.exchange;
    }else if(ENTRY.type == "equity"){
        equityAmount.value = ENTRY.amount;
        equityTitle.value = ENTRY.title;
        equityExchange.value = ENTRY.exchange;
    }

    deleteEntry(entry);
}

function updateUI(){
    crypto = calculateTotal("crypto", ENTRY_LIST);
    equity = calculateTotal("equity", ENTRY_LIST);
    balance = calculateBalance(crypto,equity);

    // DETERMINE SIGN OF BALANCE
    let sign = "₹";

    //update UI
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    equityTotalEl.innerHTML = `<small>₹</small>${equity}`;
    cryptoTotalEl.innerHTML = `<small>₹</small>${crypto}`;
    
    clearElement( [equityList, cryptoList, allList] );

    ENTRY_LIST.forEach( (entry, index) => {
        if( entry.type == "equity" ){
            showEntry(equityList, entry.type, entry.title, entry.exchange, entry.amount, index)
        }else if( entry.type == "crypto" ){
            showEntry(cryptoList, entry.type, entry.title, entry.exchange, entry.amount, index)
        }
        showEntry(allList, entry.type, entry.title, entry.exchange, entry.amount, index)
    });

    updateChart(crypto, equity);

    window.localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, exchange, amount, id){

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}  <div class="colon">:</div>  ${exchange}  <div class="colon">:</div>  ₹${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){
    let sum = 0;
    
    list.forEach( entry => {
        if(entry.type == type){
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(crypto, equity){
    return crypto + equity;
}

function clearInput(inputs){
    inputs.forEach( input => {
        input.value = "";
    })
}

function show(element){
    element.classList.remove("hide");
}

function hide(elements){
    elements.forEach(element =>{
        element.classList.add("hide");
    })
}

function active(element){
    element.classList.add("active");
}

function inactive(elements){
    elements.forEach(element =>{
        element.classList.remove("active");
    })
}