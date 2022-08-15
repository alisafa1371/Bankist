"use strict";
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2020-07-01T21:31:17.178Z",
    "2020-07-02T07:42:02.383Z",
    "2020-08-11T09:15:04.904Z",
    "2021-08-10T10:17:24.185Z",
    "2021-08-08T14:11:59.604Z",
    "2022-07-26T17:01:17.194Z",
    "2022-07-28T23:36:17.929Z",
    "2022-08-11T10:51:36.790Z",
  ],
  locale: "pt-PT",
  currency: "EUR",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  locale: "en-US",
  currency: "USD",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2019-01-28T09:15:04.904Z",
    "2020-02-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-06-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  locale: "en-GB",
  currency: "GBP",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-10-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2019-01-25T14:18:46.235Z",
    "2020-01-05T16:33:06.386Z",
    "2020-05-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-09-26T12:01:20.894Z",
  ],
  locale: "tr-TR",
  currency: "TRY",
};

const accounts = [account1, account2, account3, account4];

// Selecting Dom elements

// Containers
const movmentsContainer = document.querySelector(".movments");
const mainContainer = document.querySelector(".app");
const headerContainer = document.querySelector(".header-wrapper");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
// Inputs
const loginInput = document.querySelector(".user-name");
const pinInput = document.querySelector(".pin");
const transferInput = document.getElementById("transfer");
const transferAmountInput = document.getElementById("transfer-amount");
const loanInput = document.getElementById("loan-amount");
const closeAccountUserInput = document.getElementById("confirm-user");
const closeAccountPinInput = document.getElementById("confirm-pin");
const operationInput = document.querySelectorAll(".operation-input");
// elements
const balanceValue = document.querySelector(".balance-value");
const depositSummery = document.querySelector(".summery--deposit");
const withdrawalSummery = document.querySelector(".summery--withdrawal");
const interestSummery = document.querySelector(".summery--interest");
const headerTitle = document.querySelector(".header-title");
const bgLogo = document.querySelector(".before-login-bg");
const currDate = document.querySelector(".balance-date");
const timer = document.querySelector(".time");
const help = document.querySelector(".help");

// Buttons
const loginBtn = document.querySelector(".login-btn");
const menuBtn = document.querySelector(".menu");
const transferBtn = document.querySelector(".operation-button--transfer");
const loanBtn = document.querySelector(".operation-button--loan");
const closeAccountBtn = document.querySelector(".operation-button--close");
const sortBtn = document.querySelector(".sort-btn");
const closeModalBtn = document.querySelector(".close-icon");

// Functions
// Date and Time Now

const calcDate = function (date, locale) {
  const daysPassed = Math.floor(
    Math.abs(new Date() - date) / (24 * 60 * 60 * 1000)
  );

  if (daysPassed === 0) {
    return "Today";
  } else if (daysPassed === 1) {
    return "Yesterday";
  } else if (daysPassed < 7) {
    return `${daysPassed} days ago`;
  } else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// Number Internationalization
const numberIntl = function (number, acc) {
  const options = {
    style: "currency",
    currency: acc.currency,
  };
  return new Intl.NumberFormat(acc.locale, options).format(number);
};

const logOutTimer = function () {
  // set time
  let time = 10 * 60;
  const tick = function () {
    const minute = String(Math.floor(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);
    // Update content
    timer.textContent = `${minute}:${second}`;
    time--;
    // Check if time is over and log out
    if (time < 0) {
      clearInterval(startTimer);
      // hide background logo
      bgLogo.classList.remove("hidden");
      // make main container visible
      mainContainer.classList.remove("active");
      // reset welcoming message
      headerTitle.textContent = "Login to continue";
    }
  };
  // call function immidietly otherwise it will start from 0 and then start from variable time
  tick();
  //Call function every second
  const startTimer = setInterval(tick, 1000);
  // will be used in Login section
  return startTimer;
};
// Update Ui function
const updateUI = function () {
  // Movment Container
  displayMovments(currentAccount);
  // Display Balance
  calcDisplayBalance(currentAccount);
  // Display Summery
  calcDisplaySummery(currentAccount);
};

// Make Inputs Empty
const emptyInput = function (inp1, inp2) {
  inp1.value = inp2.value = "";
  inp1.blur();
  inp2.blur();
};

// showing movments for each account after login

const displayMovments = function (acc, sort = false) {
  // make the container empty first
  movmentsContainer.innerHTML = "";
  // Check if its sorted or not
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    // Movment Date
    const movDate = new Date(acc.movementsDates[i]);
    const displayMoveDate = calcDate(movDate, acc.locale);
    // Number  Internationalization
    const amountIntl = numberIntl(mov, acc);
    const html = `
    <div class="movment-row row-flex">
      <div class="movment-type movment-type--${type}">${i + 1} ${type}</div>
      <div class="movment-date">${displayMoveDate}</div>
      <div class="movment-value">${amountIntl}</div>
    </div>
  `;
    movmentsContainer.insertAdjacentHTML("afterbegin", html);
  });
};

// Account Balence
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // Number  Internationalization
  const balanceIntl = numberIntl(balance, acc);
  acc["balance"] = balance;
  balanceValue.textContent = balanceIntl;
};

// Summery section
const calcDisplaySummery = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, item) => acc + item, 0);
  // Number  Internationalization
  const incomIntl = numberIntl(income, acc);
  depositSummery.textContent = incomIntl;
  const withdrawal = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, item) => acc + item, 0);
  // Number  Internationalization
  const withdrawalIntl = numberIntl(Math.abs(withdrawal), acc);
  withdrawalSummery.textContent = withdrawalIntl;

  // interest rate is different in each acc and only for deposits > 1$
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((deposit) => deposit > 1)
    .reduce((acc, deposit) => acc + deposit, 0);
  // Number  Internationalization
  const interestIntl = numberIntl(interest, acc);
  interestSummery.textContent = incomIntl;
};

// Creating user names
const userNameCreator = function (accs) {
  accs.forEach(function (acc) {
    acc["username"] = acc.owner
      .toLowerCase()
      .split(" ")
      .map((item) => item[0])
      .join("");
  });
};
userNameCreator(accounts);

// Login
let currentAccount, startTimer;
loginBtn.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();
  // Validate user name and pin
  currentAccount = accounts.find((acc) => acc.username === loginInput.value);

  if (currentAccount?.pin == pinInput.value) {
    // removing overflow hidden from body
    document.body.classList.add("logged-in");
    // hide background logo
    bgLogo.classList.add("hidden");
    // make main container visible
    mainContainer.classList.add("active");

    // Hidden header after login in mobile view
    headerContainer.classList.toggle("hidden");

    // Log Out timer
    // for first login startTimer === "" and its False after first time it will be True so previous startTimer will be clear
    if (startTimer) clearInterval(startTimer);
    startTimer = logOutTimer();

    // Welcoming message
    headerTitle.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}!`;
    updateUI();
    // Empty Login inputs
    emptyInput(loginInput, pinInput);
    // Empty all inputs
    operationInput.forEach(function (input) {
      emptyInput(input, input);
    });
  }
});

// Transfer Function

transferBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +transferAmountInput.value;
  const transferTo = accounts.find(
    (acc) => acc.username === transferInput.value
  );

  if (
    transferTo &&
    amount > 0 &&
    amount < currentAccount.balance &&
    currentAccount !== transferTo
  ) {
    transferTo.movements.push(amount);
    currentAccount.movements.push(-amount);

    // Transfer date
    transferTo.movementsDates.push(new Date());
    currentAccount.movementsDates.push(new Date());
  }
  updateUI();
  // make inputs empty
  emptyInput(transferInput, transferAmountInput);
});

// Loan
loanBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(loanInput.value);
  if (
    loanAmount > 0 &&
    // Is there any deposit more than 10% of loan amount which is requested
    currentAccount.movements.some((mov) => mov > loanAmount * 0.1)
  ) {
    // loan date
    currentAccount.movements.push(loanAmount);
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI();
    emptyInput(loanInput, loanInput);
  }
});
// Close Account
closeAccountBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const userConfirm = closeAccountUserInput.value;
  const pinConfirm = +closeAccountPinInput.value;
  if (
    userConfirm === currentAccount.username &&
    pinConfirm === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => currentAccount.username === userConfirm
    );
    accounts.splice(index, 1);
    // Empry inputs
    emptyInput(closeAccountUserInput, closeAccountPinInput);
    // Logout
    // hide background logo
    bgLogo.classList.remove("hidden");
    // make main container visible
    mainContainer.classList.remove("active");
  }
});

// Sort
let sorted = false;
sortBtn.addEventListener("click", function () {
  displayMovments(currentAccount, !sorted);
  sorted = !sorted;
});

// Mobile menu
menuBtn.addEventListener("click", function () {
  headerContainer.classList.toggle("hidden");
  bgLogo.classList.toggle("blur");
});

// modal

const modalClose = function () {
  modal.classList.remove("active");
};
const modalOpen = function () {
  modal.classList.add("active");
};

help.addEventListener("click", function (e) {
  e.preventDefault();
  modalOpen();
});
closeModalBtn.addEventListener("click", function (e) {
  e.preventDefault();
  modalClose();
});
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") modalClose();
});
overlay.addEventListener("click", modalClose);
