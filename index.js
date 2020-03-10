let orders = [
  {
    id: "1",
    OrderInfo: {
      createdAt: "10.08.1991",
      customer: "Alfryuoeds Futterkiste",
      status: "Accepted",
      shippedAt: "8.09.1991"
    },
    ShipTo: {
      name: "Maria Anders",
      Address: "Obere Str. 57",
      ZIP: "12209",
      Region: "Germany",
      Country: "Germany"
    },
    CustomerInfo: {
      firstName: "Maria",
      lastName: "Anders",
      address: "Obere Str. 57",
      phone: "030-0074321",
      email: "Maria.Anders@company.com"
    },
    products: [
      {
        id: "1",
        name: "Chai",
        price: "18",
        currency: "EUR",
        quantity: "2",
        totalPrice: "36"
      },
      {
        id: "2",
        name: "Aniseed Syrup",
        price: "10",
        currency: "EUR",
        quantity: "3",
        totalPrice: "30"
      },
      {
        id: "3",
        name: "Chef Anton's Cajun Seasoning",
        price: "22",
        currency: "EUR",
        quantity: "2",
        totalPrice: "44"
      },
      {
        id: "4",
        name: "Chef Anton's Gumbo Mix",
        price: "36",
        currency: "EUR",
        quantity: "21",
        totalPrice: "756"
      },
      {
        id: "5",
        name: "Grandma's Boysenberry Spread",
        price: "25",
        currency: "EUR",
        quantity: "5",
        totalPrice: "125"
      }
    ]
  },
  {
    id: "2",
    OrderInfo: {
      createdAt: "23.12.2006",
      customer: "Bon app",
      status: "Pending",
      shippedAt: "13.02.2007"
    },
    ShipTo: {
      name: "Laurence Lebihan",
      Address: "12, rue des Bouchers",
      ZIP: "13008",
      Region: "France",
      Country: "France"
    },
    CustomerInfo: {
      firstName: "Laurence",
      lastName: "Lebihan",
      address: "12, rue des Bouchers",
      phone: "91.24.45.40",
      email: "Laurence.Lebihan@company.com"
    },
    products: [
      {
        id: "1",
        name: "Queso Cabrales",
        price: "21",
        currency: "EUR",
        quantity: "5",
        totalPrice: "105"
      },
      {
        id: "2",
        name: "Queso Manchego La Pastora",
        price: "38",
        currency: "EUR",
        quantity: "3",
        totalPrice: "114"
      },
      {
        id: "3",
        name: "Pavlova",
        price: "120",
        currency: "EUR",
        quantity: "5",
        totalPrice: "600"
      },
      {
        id: "4",
        name: "Sir Rodney's Marmalade",
        price: "5",
        currency: "EUR",
        quantity: "3",
        totalPrice: "15"
      },
      {
        id: "5",
        name: "Genen Shouyu",
        price: "40",
        currency: "EUR",
        quantity: "7",
        totalPrice: "280"
      },
      {
        id: "6",
        name: "Tofu",
        price: "23.25",
        currency: "EUR",
        quantity: "1",
        totalPrice: "23.25"
      },
      {
        id: "7",
        name: "Alice Mutton",
        price: "32",
        currency: "EUR",
        quantity: "39",
        totalPrice: "1248"
      }
    ]
  }
];

const items = document.querySelector(".items");
const listTitleName = document.querySelector(".list-title-name");
const tableTitle = document.querySelector(".table-title");
const sortByNameBtn = document.querySelector("#sortByName");
const tableSearchLine = document.querySelector("#table-search-line");
const sortByPriceBtn = document.querySelector("#sortByPrice");
const sortByQuantityBtn = document.querySelector("#sortByQuantity");
const sortByTotalBtn = document.querySelector("#sortByTotal");
const hide = document.querySelector("#reload");
const hideTable = document.querySelector("#table-reload");
let quantityCount = 0;
let totalCount = 0;
let priceCount = 0;
let nameCount = 0;
let selectedOrderId = 0;

listTitleName.innerHTML = `Order (${orders.length})`;
tableTitle.innerHTML = `Order (${orders.length})`;

const selectOrder = id => {
  let selId = document.getElementById(id);
  if (selId) selId.classList.remove("current");
  selectedOrderId = id;
  selId.classList.add("current");
  showInfo(id);
};

const showInfo = orderId => {
  let order = orders.find(el => {
    return el.id == orderId;
  });
  if (order) {
    tableSearchLine.value = "";
    orderNum.innerHTML = order.id;
    cost.innerHTML = sum(order);
    commonCustomer.innerHTML = order.OrderInfo.customer;
    commonOrdered.innerHTML = order.OrderInfo.createdAt;
    commonShipped.innerHTML = order.OrderInfo.shippedAt;
    shippingName.innerHTML = order.ShipTo.name;

    shippingStreet.innerHTML = order.ShipTo.Address;
    shippingCity.innerHTML = order.ShipTo.ZIP;
    shippingRegion.innerHTML = order.ShipTo.Region;
    shippingCountry.innerHTML = order.ShipTo.Country;
    processorName.innerHTML =
      order.CustomerInfo.firstName + " " + order.CustomerInfo.lastName;
    employeeId.innerHTML = "id";
    processorJobTitle.innerHTML = "jobtitle";
    processorPhone.innerHTML = order.CustomerInfo.phone;
    scrollTable.innerHTML = "";
    tableTitle.innerHTML = `Line items (${order.products.length})`;
    order.products.forEach(value => showProductInfo(scrollTable, value));
  }
};

const showProductInfo = (idl, line) => {
  let newdiv = document.createElement("div");
  newdiv.classList.add("details-line");
  newdiv.id = line.id;
  newdiv.innerHTML = `<div class="line-product">${line.name}<br />${
    line.id
  }</div>
  <div class="title-hide">Unit Price</div>
  <div class="line-price">${line.price +
    "<span>" +
    line.currency +
    "</span>"}</div>
  <div class="title-hide">Quantity</div>
  <div class="line-quantity">${line.quantity}</div>
  <div class="title-hide">Total</div>
  <div class="line-total">${line.totalPrice +
    "<span>" +
    line.currency +
    "</span>"}</div>`;
  idl.appendChild(newdiv);
};

const addToList = (list, order) => {
  let newDiv = document.createElement("div");
  newDiv.id = order.id;
  newDiv.addEventListener("click", () => {
    let selected = document.getElementById(selectedOrderId);
    if (selected) selected.classList.remove("current");
    showInfo((selectedOrderId = newDiv.id));
    newDiv.classList.add("current");
  });
  newDiv.classList.add("item");
  let stateColor;
  if (order.OrderInfo.status === "Pending") {
    stateColor = "orange";
  } else if (order.OrderInfo.status === "Too late") {
    stateColor = "red";
  } else if (order.OrderInfo.status === "Accepted") {
    stateColor = "green";
  }
  newDiv.innerHTML = `
    <div class="item-first-line">
    <div class="item-order">
      <span>Order</span>
      <span class="order-id">${order.id}</span>
    </div>
    <div class="date-order">${order.OrderInfo.createdAt}</div>
  </div>
  <p class="name-state">
    <span class="client-name">${order.OrderInfo.customer}</span>
    <span class="order-state ${stateColor}">${order.OrderInfo.status}</span>
  </p>
  <p>
    <span>Shipped:</span>
    <span class="shipped-date-order">${order.OrderInfo.shippedAt}</span>
  </p>`;
  list.appendChild(newDiv);
};

const switcher = p => {
  if (p == "s") {
    shipping.classList.remove("non-display");
    shipping.classList.add("shipping");
    processor.classList.remove("processor");
    processor.classList.add("non-display");
    shippedButton.classList.add("borderbottom");
    processorButton.classList.remove("borderbottom");
  } else {
    processor.classList.remove("non-display");
    processor.classList.add("processor");
    shipping.classList.remove("shipping");
    shipping.classList.add("non-display");
    shippedButton.classList.remove("borderbottom");
    processorButton.classList.add("borderbottom");
  }
};

const hideicon = str => {
  if (str === "table") {
    hideTable.classList.add("non-display");
  } else {
    hide.classList.add("non-display");
  }
};

const showicon = str => {
  if (str === "table") {
    hideTable.classList.remove("non-display");
  } else {
    hide.classList.remove("non-display");
  }
};

const setfilter = el => {
  let s = "";
  let counter = 0;
  if (el.value) {
    items.innerHTML = "";
    orders.forEach(value => {
      s =
        value.id +
        value.OrderInfo.customer +
        value.OrderInfo.shippedAt +
        value.OrderInfo.createdAt;
      if (s.toLowerCase().indexOf(el.value.toLowerCase()) >= 0) {
        selectedOrderId = value.id;
        addToList(items, value);
        counter++;
      }
    });
    if (counter <= 0) {
      items.innerHTML = "no orders";
    } else {
      let elem = items.querySelectorAll(".item")[0];
      selectOrder(elem.id);
    }
    listTitleName.innerHTML = `Order (${counter})`;
  }
};

const resetfilter = el => {
  el.value = "";
  items.innerHTML = "";
  orders.forEach(value => addToList(items, value));
  if (orders.length > 0) {
    selectOrder(orders[0].id);
    showInfo(orders[0].id);
  }
};

const setTableFilter = el => {
  let s = "";
  let count = 0;
  let order = orders.find(elem => {
    return elem.id === selectedOrderId;
  });

  if (el.value) {
    scrollTable.innerHTML = "";
    order.products.forEach(val => {
      s =
        val.id +
        val.name +
        val.price +
        val.currency +
        val.quantity +
        val.totalPrices;
      if (s.toLowerCase().indexOf(el.value.toLowerCase()) >= 0) {
        showProductInfo(scrollTable, val);
        count++;
      }
    });
    if (count <= 0) {
      scrollTable.innerHTML = "no result";
    }
  }
  tableTitle.innerHTML = `Line items (${count})`;
};

const resetTableFilter = el => {
  el.value = "";
  scrollTable.innerHTML = "";
  const { id } = document.getElementById(selectedOrderId);
  const order = orders.find(order => order.id === id);
  order.products.forEach(value => showProductInfo(scrollTable, value));
};

const sum = order => {
  let s = 0;
  order.products.forEach(value => {
    s += +value.totalPrice;
  });
  return `${s.toFixed(2)}`;
};

const sortByName = param => {
  nameCount++;
  const items = document.querySelectorAll(".details-line");
  Array.from(items)
    .sort((a, b) => {
      a = a.querySelector(param).innerText.toLowerCase();
      b = b.querySelector(param).innerText.toLowerCase();
      switch (nameCount) {
        case 1:
          return (a > b) - (a < b);
          break;
        case 2:
          return (a < b) - (a > b);
          break;
        case 3:
        case 0:
          nameCount = 0;
      }
    })
    .forEach((n, i) => {
      n.style.order = i;
    });
};

const sortByParam = (param, counter) => {
  counter++;
  let items = document.querySelectorAll(".details-line");
  Array.from(items)
    .sort((a, b) => {
      a = parseInt(a.querySelector(param).innerText.toLowerCase());
      b = parseInt(b.querySelector(param).innerText.toLowerCase());
      switch (counter) {
        case 1:
          return a - b;
          break;
        case 2:
          return b - a;
          break;
        case 3:
        case 0:
          counter = 0;
      }
    })
    .forEach(function(n, i) {
      n.style.order = i;
    });
  return counter;
};

switcher("s");

sortByNameBtn.addEventListener("click", () => sortByName(".line-product"));
sortByPriceBtn.addEventListener(
  "click",
  () => (priceCount = sortByParam(".line-price", priceCount))
);
sortByQuantityBtn.addEventListener(
  "click",
  () => (quantityCount = sortByParam(".line-quantity", quantityCount))
);
sortByTotalBtn.addEventListener(
  "click",
  () => (nameCount = sortByParam(".line-total", nameCount))
);

if (orders.length > 0) {
  items.innerHTML = "";
  orders.forEach(value => addToList(items, value));
  selectOrder(orders[0].id);
  showInfo(orders[0].id);
}
