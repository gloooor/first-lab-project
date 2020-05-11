const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const sequelize = new Sequelize("OrderBase", "sa", "03042001loi", {
  dialect: "mssql",
  host: "localhost",
});
const { Customer, Order, Product, OrderProduct } = require("./model").ORM(
  sequelize
);

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors("*"));

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.send(orders);
  } catch (err) {
    res.status(404).send("Orders isn't found");
  }
});

app.get("/order/:id", async (req, res) => {
  try {
    let products = [];
    const order = await Order.findByPk(req.params.id);
    const customer = await Customer.findByPk(order.ID);
    const orderProduct = await OrderProduct.findAll({
      where: { OrderId: order.ID },
    });
    for await (const el of orderProduct) {
      const prod = await Product.findByPk(el.ProductId);
      products.push(prod);
    }
    res.send({ order, customer, orderProduct, products });
  } catch (err) {
    res.send("Order isn't found");
  }
});

// {
//   "Created": "2019-11-14",
//   "Shipped": "2019-12-04",
//   "OrderStatus": "Accepted ",
//   "FirstName": "KsbJKSDFHJDFH",
//   "LastName": "Lenovec",
//   "Company": "SiMi",
//   "Adress": "Larenko Str. 98",
//   "Zip": "957254",
//   "Phone": "+26483758945",
//   "Email": "simisimi@gmail.com",
//   "Region": "JK",
//   "Country": "Spain"
//   }

// {
//   "Created": "2019-11-14",
//   "Shipped": "2019-12-04",
//   "OrderStatus": "Accepted ",
//   "select": 3
//   }
app.post("/order", async (req, res) => {
  if (!req.body) res.status(400).send("Failed to post");
  try {
    if (req.body.select) {
      const customer = await Customer.findByPk(req.body.select);
      const order = await Order.create({
        Created: req.body.Created,
        Shipped: req.body.Shipped,
        OrderStatus: req.body.OrderStatus,
        CustomerId: customer.ID,
      });
      res.status(200).send("Order is created");
    } else {
      const customer = await Customer.create({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Company: req.body.Company,
        Adress: req.body.Adress,
        Zip: req.body.Zip,
        Phone: req.body.Phone,
        Email: req.body.Email,
        Region: req.body.Region,
        Country: req.body.Country,
      });
      const order = Order.create({
        Created: req.body.Created,
        Shipped: req.body.Shipped,
        OrderStatus: req.body.OrderStatus,
        CustomerId: customer.ID,
      });
      res.send("Order is created");
    }
  } catch (err) {
    res.json({
      error: "Cannot find customer with same id",
    });
  }
});

// {
//   "Created": "2019-11-14",
//   "Shipped": "2019-12-04",
//   "OrderStatus": "Accepted ",
//   "CustomerId": 3
//   }
app.put("/order", async (req, res) => {
  if (!req.body) res.status(400).send("Failed to change");
  try {
    const counter = await Order.count({ where: { ID: req.body.ID } });
    if (counter != 0) {
      const result = await Order.update(
        {
          Created: req.body.Created,
          Shipped: req.body.Shipped,
          OrderStatus: req.body.OrderStatus,
          CustomerId: req.body.CustomerId,
        },
        {
          where: {
            ID: req.body.ID,
          },
        }
      );
      res.send("Order is changed");
    } else {
      res.status(404).send("Cannot find order with same id");
    }
  } catch (err) {
    res.json({
      error: err.message,
    });
  }
});

app.delete("/order/:id", async (req, res) => {
  const counter = await Order.count({ where: { ID: req.params.id } });
  if (counter != 0) {
    try {
      const result = await Order.destroy({
        where: {
          ID: req.params.id,
        },
      });

      res.send("Order is deleted");
    } catch (err) {
      res.json({
        error: err.message,
      });
    }
  } else {
    res.status(404).send("Cannot find order with same id");
  }
});

app.get("/products", async (req, res) => {
  try {
    const result = await Product.findAll();
    res.json(result);
  } catch (err) {
    res.json({
      error: err.message,
    });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const counter = await Product.count({ where: { ID: req.params.id } });
    if (counter != 0) {
      const product = await Product.findByPk(req.params.id);
      res.send(product);
    } else {
      res.status(404).send("Cannot find product with same id");
    }
  } catch (err) {
    res.json({
      error: err.message,
    });
  }
});

// {
//   "Name": "Tomato",
//   "Price": 6,
//   "Currency": "$"
// }
app.post("/product", async (req, res) => {
  if (!req.body) res.status(400).send("Failed to post");
  try {
    const counter = await Product.count({ where: { Name: req.body.Name } });
    if (counter == 0) {
      const result = await Product.create(req.body);
      res.json(result);
    } else {
      res.status(404).send(`${req.body.Name} product already exist`);
    }
  } catch (err) {
    console.log(err.message);
    res.json({
      error: err,
    });
  }
});

// {
//   "ID": 7,
//   "Name": "Tomatnhjbho",
//   "Price": 6,
//   "Currency": "$"
// }
app.put("/product", async (req, res) => {
  if (!req.body) res.status(400).send("Failed to change");
  try {
    const counter = await Product.count({ where: { ID: req.body.ID } });
    if (counter != 0) {
      const result = await Product.update(
        {
          Name: req.body.Name,
          Price: req.body.Price,
          Currency: req.body.Currency,
        },
        {
          where: {
            ID: req.body.ID,
          },
        }
      );
      res.send("Product is changed");
    } else {
      res.status(404).send("Cannot find product with same id");
    }
  } catch (err) {
    res.json({
      error: err,
    });
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const counter = await Product.count({ where: { ID: req.params.id } });
    if (counter != 0) {
      const result = await Product.destroy({
        where: {
          ID: req.params.id,
        },
      });
      res.send("The product is deleted");
    } else {
      res.status(404).send("Cannot find product with same id");
    }
  } catch (err) {
    res.json({
      error: err,
    });
  }
});

// {
//   "ProductId": 3,
//   "Quantity": 34
// }

app.post("/order/:id/product", async (req, res) => {
  if (!req.body) res.status(400).send("Failed to post");
  try {
    const counter = await Order.count({ where: { ID: req.params.id } });
    if (counter != 0) {
      const result = await OrderProduct.create({
        OrderId: req.params.id,
        ProductId: req.body.ProductId,
        Quantity: req.body.Quantity,
      });
      res.send("Product ia added to order");
    } else {
      res.status(404).send("Cannot find order with same id");
    }
  } catch (err) {
    res.json({
      error: err,
    });
  }
});

app.delete("/order/:id/product/:productid", async (req, res) => {
  if (!req.body) res.status(400).send("Failed to post");
  try {
    const counter = await Order.count({ where: { ID: req.params.id } });
    const count = await Product.count({ where: { ID: req.params.productid } });

    if (counter != 0 && count != 0) {
      const result = await OrderProduct.destroy({
        where: {
          ProductId: req.params.productid,
          OrderId: req.params.id,
        },
      });
      res.send("Product is deleted from order");
    } else {
      res.status(404).send("Cannot find order with same id");
    }
  } catch (err) {
    res.json({
      error: err,
    });
  }
});

sequelize.authenticate().then(() => {
  app.listen(8080, () =>
    console.log("Server started on http://localhost:8080")
  );
});
