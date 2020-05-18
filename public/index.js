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
const ordersList = document.querySelector(".orders-list");

let quantityCount = 0;
let totalCount = 0;
let priceCount = 0;
let nameCount = 0;
let selectedOrderId = 0;
let ordersLength = 0;
let tablesLength = 0;
let orderSum = 0;

listTitleName.innerHTML = `Order (${ordersLength})`;
tableTitle.innerHTML = `Order (${tablesLength})`;
cost.innerHTML = orderSum;

let currentOrderData;
const selectOrder = (id) => {
  orderSum = 0;
  let selId = document.getElementById(id);
  if (selId) selId.classList.remove("current");
  selectedOrderId = id;
  selId.classList.add("current");
  fetch("/order/" + id)
    .then((data) => data.json())
    .then((data) => {
      currentOrderData = data;
      showInfo(data);
    });
};

const showInfo = (currentOrder) => {
  tableSearchLine.value = "";
  orderNum.innerHTML = currentOrder.order.ID;
  commonCustomer.innerHTML =
    currentOrder.customer.FirstName + " " + currentOrder.customer.LastName;
  commonOrdered.innerHTML = currentOrder.order.Created;
  commonShipped.innerHTML = currentOrder.order.Shipped;
  shippingName.innerHTML =
    currentOrder.customer.FirstName + " " + currentOrder.customer.LastName;
  shippingStreet.innerHTML = currentOrder.customer.Adress;
  shippingCity.innerHTML = currentOrder.customer.Zip;
  shippingRegion.innerHTML = currentOrder.customer.Region;
  shippingCountry.innerHTML = currentOrder.customer.Country;
  processorFirstName.innerHTML = currentOrder.customer.FirstName;
  processorLastName.innerHTML = currentOrder.customer.LastName;
  processorAdress.innerHTML = currentOrder.customer.Adress;
  processorPhone.innerHTML = currentOrder.customer.Phone;
  processorEmail.innerHTML = currentOrder.customer.Email;
  scrollTable.innerHTML = "";
  tableTitle.innerHTML = `Line items (${currentOrder.products.length})`;
  currentOrder.products.forEach((value) => showProductInfo(scrollTable, value));
  cost.innerHTML = orderSum;
};

const showProductInfo = (idl, line) => {
  let newdiv = document.createElement("div");
  newdiv.classList.add("details-line");
  newdiv.id = line.prod.ID;
  newdiv.innerHTML = `<div class="line-product">${line.prod.Name}<br />${
    line.prod.ID
  }</div>
  <div class="title-hide">Unit Price</div>
  <div class="line-price">${
    line.prod.Price + "<span>" + line.prod.Currency + "</span>"
  }</div>
  <div class="title-hide">Quantity</div>
  <div class="line-quantity">${line.Quantity}</div>
  <div class="title-hide">Total</div>
  <div class="line-total">${
    line.prod.Price * line.Quantity + "<span>" + line.prod.Currency + "</span>"
  }</div>`;
  idl.appendChild(newdiv);
  orderSum += line.prod.Price * line.Quantity;
};

// const openMenu = () => {
//   ordersList.classList.add("open");
// };

const addToList = (list, order) => {
  let newDiv = document.createElement("div");
  newDiv.id = order.ID;
  newDiv.addEventListener("click", () => {
    let selected = document.getElementById(selectedOrderId);
    if (selected) selected.classList.remove("current");
    selectOrder((selectedOrderId = newDiv.id));
    newDiv.classList.add("current");
  });
  newDiv.classList.add("item");
  let stateColor;
  if (order.OrderStatus.replace(/\s+/g, "") === "Pending") {
    stateColor = "orange";
  } else if (order.OrderStatus.replace(/\s+/g, "") === "Late") {
    stateColor = "red";
  } else if (order.OrderStatus.replace(/\s+/g, "") === "Accepted") {
    stateColor = "green";
  }
  newDiv.innerHTML = `
    <div class="item-first-line">
    <div class="item-order">
      <span>Order</span>
      <span class="order-id">${order.ID}</span>
    </div>
    <div class="date-order">${order.Created}</div>
  </div>
  <p class="name-state">
    <span class="client-name">HELLO</span>
    <span class="order-state ${stateColor}">${order.OrderStatus.replace(
    /\s+/g,
    ""
  )}</span>
  </p>
  <p>
    <span>Shipped:</span>
    <span class="shipped-date-order">${order.Shipped}</span>
  </p>`;
  list.appendChild(newDiv);
};

const switcher = (tab) => {
  if (tab == "s") {
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

const hideicon = (str) => {
  if (str === "table") {
    hideTable.classList.add("non-display");
  } else {
    hide.classList.add("non-display");
  }
};

const showicon = (str) => {
  if (str === "table") {
    hideTable.classList.remove("non-display");
  } else {
    hide.classList.remove("non-display");
  }
};
const setfilter = (el) => {
  fetch("/orders")
    .then((data) => data.json())
    .then((data) => filterOrders(data, el));
};
const resetfilter = (el) => {
  fetch("/orders")
    .then((data) => data.json())
    .then((data) => refilterOrders(data, el));
};
const filterOrders = (orders, filter) => {
  let s = "";
  let counter = 0;
  if (filter.value) {
    items.innerHTML = "";
    orders.forEach((value) => {
      s = value.ID + value.Shipped + value.Created;
      if (s.toLowerCase().indexOf(filter.value.toLowerCase()) >= 0) {
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

const refilterOrders = (orders, filter) => {
  filter.value = "";
  items.innerHTML = "";
  orders.forEach((value) => addToList(items, value));
  if (orders.length > 0) {
    selectOrder(orders[0].ID);
  }
};

const setTableFilter = (filter) => {
  fetch("/order/" + selectedOrderId)
    .then((data) => data.json())
    .then((data) => filterTable(filter, data));
};

const filterTable = (filter, order) => {
  let s = "";
  let count = 0;
  if (filter.value) {
    scrollTable.innerHTML = "";
    order.products.forEach((val) => {
      s = val.prod.ID + val.prod.Name + val.prod.Price + val.Quantity;
      if (s.toLowerCase().indexOf(filter.value.toLowerCase()) >= 0) {
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

const resetTableFilter = (el) => {
  fetch("/order/" + selectedOrderId)
    .then((data) => data.json())
    .then((data) => refilterTable(data, el));
};

const refilterTable = (order, filter) => {
  filter.value = "";
  scrollTable.innerHTML = "";
  order.products.forEach((value) => showProductInfo(scrollTable, value));
};

const sortByName = (param) => {
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
          // document.querySelectorAll("sortByName").src =
          //   "assets/images/dessort.png";
          return a - b;
          break;
        case 2:
          // document.querySelectorAll(".sortByName").src =
          //   "assets/images/close.png";
          return b - a;
          break;
        case 3:
        case 0:
          counter = 0;
      }
    })
    .forEach(function (n, i) {
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

const form = document.querySelectorAll("form")[2];
const prodForm = document.querySelectorAll("form")[0];
const deleteProdForm = document.querySelectorAll("form")[1];
const overlay = document.querySelector(".overlay");

const mapCurrentOrderData = (id) => {
  const obj = {
    "creating-date": currentOrderData.order.Created,
    "shipping-date": currentOrderData.order.Shipped,
    "status-select": currentOrderData.order.OrderStatus.trim(),
    address: currentOrderData.customer.Adress,
    zip: currentOrderData.customer.Zip,
    region: currentOrderData.customer.Region,
    country: currentOrderData.customer.Country,
    "first-name": currentOrderData.customer.FirstName,
    "last-name": currentOrderData.customer.LastName,
    company: currentOrderData.customer.Company,
    email: currentOrderData.customer.Email,
    phone: currentOrderData.customer.Phone,
  };
  return obj[id];
};

let isCreate;
const openForm = (params) => {
  isCreate = params === "create";
  const select = document.getElementById("processor-select");
  fetch("/customers")
    .then((data) => data.json())
    .then((customers) => {
      if (params === "create") {
        customers
          .filter(({ FirstName }) => FirstName)
          .forEach((customer) => {
            const option = document.createElement("option");
            option.value = customer.ID;
            option.innerText = customer.Company;
            select.appendChild(option);
          });
      } else {
        select.innerHTML = "";
        customers
          .filter(({ FirstName }) => FirstName)
          .forEach((customer) => {
            const option = document.createElement("option");
            option.value = customer.ID;
            option.innerText = customer.Company;
            if (customer.ID === currentOrderData.customer.ID) {
              option.selected = true;
            }
            select.appendChild(option);
          });

        [
          "creating-date",
          "shipping-date",
          "status-select",
          "address",
          "zip",
          "region",
          "country",
          "first-name",
          "last-name",
          "company",
          "email",
          "phone",
        ].forEach((id) => {
          document.getElementById(id).value = mapCurrentOrderData(id);
        });
      }
    });

  form.classList.add("active");
  overlay.classList.add("active");
};

const closeForm = () => {
  form.classList.remove("active");
  overlay.classList.remove("active");
  form.reset();
};

const getElementsByIds = (ids) =>
  ids.map((id) => document.getElementById(id).value);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const [
    Created,
    Shipped,
    OrderStatus,
    Adress,
    Zip,
    Region,
    Country,
    FirstName,
    LastName,
    Company,
    Email,
    Phone,
    processorSelect,
  ] = getElementsByIds([
    "creating-date",
    "shipping-date",
    "status-select",
    "address",
    "zip",
    "region",
    "country",
    "first-name",
    "last-name",
    "company",
    "email",
    "phone",
    "processor-select",
  ]);
  if (isCreate) {
    fetch("/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        processorSelect !== "0"
          ? { Created, Shipped, OrderStatus, processorSelect }
          : {
              Created,
              Shipped,
              OrderStatus,
              Adress,
              Zip,
              Region,
              Country,
              FirstName,
              LastName,
              Company,
              Email,
              Phone,
            }
      ),
    }).then(() => {
      fetch("/orders")
        .then((data) => data.json())
        .then((data) => createOrder(data));
    });
  } else {
    fetch("/order", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        processorSelect,
        Created,
        Shipped,
        OrderStatus,
        Adress,
        Zip,
        Region,
        Country,
        FirstName,
        LastName,
        Company,
        Email,
        Phone,
        ID: selectedOrderId,
        isOpened,
      }),
    }).then(() => {
      fetch("/orders")
        .then((data) => data.json())
        .then((data) => createOrder(data));
    });
  }

  form.reset();
  form.classList.remove("active");
  overlay.classList.remove("active");
});

const btn = document.getElementById("toggleBtn");

let isOpened = false;
btn.addEventListener("click", (e) => {
  e.preventDefault();

  const el = document.getElementById("processor-labels");
  const text = btn.innerText;

  if (text === "Create") btn.innerText = "Close";
  else btn.innerText = "Create";

  [
    "creating-date",
    "shipping-date",
    "status-select",
    "address",
    "zip",
    "region",
    "country",
    "first-name",
    "last-name",
    "company",
    "email",
    "phone",
    "processor-select",
  ].forEach(
    (id) =>
      (document.getElementById(id).required = text === "Create" ? true : false)
  );

  el.classList.toggle("superactive");
  isOpened = !isOpened;
});

window.onload = () => {
  fetch("/orders")
    .then((data) => data.json())
    .then((data) => {
      createOrder(data);
    });
};

function createOrder(ordersFromServer) {
  items.innerHTML = "";
  ordersFromServer.forEach((value) => {
    addToList(items, value);
  });
  selectOrder(ordersFromServer[0].ID);
}
//хз тут типа два раза тыкать нужно
const deleteOrder = () => {
  fetch("/order/" + selectedOrderId, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(() =>
    fetch("/orders")
      .then((data) => data.json())
      .then((data) => createOrder(data))
  );
};

let selectedProductId = 0;
const productsLists = document.querySelector(".product-lists");
const selectedProducts = document.querySelector(".select-products");
const deleteProductsLists = document.querySelector(".delete-product-lists");
const deletSelectedProducts = document.querySelector(".delete-select-products");

const editProductLists = () => {
  fetch("/products")
    .then((res) => res.json())
    .then((products) => {
      products.forEach((product) => {
        const div = document.createElement("div");
        div.innerHTML = product.Name + " " + product.Price;
        div.id = product.ID + "d";
        div.addEventListener("click", () => {
          let selected = document.getElementById(selectedProductId);
          if (selected) selected.classList.remove("current");
          selectedProductId = div.id;
          div.classList.add("current");
        });
        selectedProducts.appendChild(div);
      });
    });

  productsLists.classList.toggle("active");
};
const closeProductForm = () => {
  prodForm.classList.remove("active");
  overlay.classList.remove("active");
  selectedProducts.innerHTML = "";
  prodForm.reset();
};

prodForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let ProductId = selectedProductId + "";
  fetch("/order/" + selectedOrderId + "/product", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ProductId: ProductId.slice(0, -1),
      Quantity: document.getElementById("entered-quantity").value,
    }),
  }).then(() => {
    fetch("/order/" + selectedOrderId)
      .then((data) => data.json())
      .then((data) => {
        currentOrderData = data;
        showInfo(data);
      });
  });

  selectedProducts.innerHTML = "";
  prodForm.reset();
  prodForm.classList.remove("active");
  overlay.classList.remove("active");
});

let removingProducts = [];
const deleteProductLists = () => {
  currentOrderData.products.forEach((product) => {
    const div = document.createElement("div");
    div.innerHTML = product.prod.Name + " " + product.prod.Price;
    div.id = product.prod.ID + "v";
    div.addEventListener("click", () => {
      let id = div.id + "";
      removingProducts.push(id.slice(0, -1));
      div.classList.add("current");
    });
    deletSelectedProducts.appendChild(div);
  });
  deleteProductsLists.classList.toggle("active");
};

deleteProdForm.addEventListener("submit", (e) => {
  e.preventDefault();
  removingProducts.forEach((el) => {
    fetch("/order/" + selectedOrderId + "/product/" + el, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(() => {
      fetch("/order/" + selectedOrderId)
        .then((data) => data.json())
        .then((data) => {
          currentOrderData = data;
          showInfo(data);
        });
    });
  });
  removingProducts = [];
  deleteProdForm.reset();
  deleteProdForm.classList.remove("active");
  deletSelectedProducts.innerHTML = "";
  overlay.classList.remove("active");
});

const closeDeletingForm = () => {
  deleteProdForm.classList.remove("active");
  overlay.classList.remove("active");
  deletSelectedProducts.innerHTML = "";
  deleteProdForm.reset();
};
