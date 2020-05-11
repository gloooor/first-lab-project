const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Customer extends Model {}
class Order extends Model {}
class Product extends Model {}
class OrderProduct extends Model {}

function internalORM(sequelize) {
  Customer.init(
    {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      FirstName: { type: Sequelize.STRING, allowNull: false },
      LastName: { type: Sequelize.STRING, allowNull: false },
      Company: { type: Sequelize.STRING, allowNull: false },
      Adress: { type: Sequelize.STRING, allowNull: false },
      Zip: { type: Sequelize.STRING, allowNull: false },
      Phone: { type: Sequelize.STRING, allowNull: false },
      Email: { type: Sequelize.STRING, allowNull: false },
      Region: { type: Sequelize.STRING, allowNull: false },
      Country: { type: Sequelize.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "Customer",
      timestamps: false,
    }
  );

  Order.init(
    {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      Created: { type: Sequelize.DATE, allowNull: false },
      Shipped: { type: Sequelize.DATE, allowNull: true },
      OrderStatus: { type: Sequelize.STRING, allowNull: false },
      CustomerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: Customer, key: "ID" },
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      timestamps: false,
    }
  );

  Product.init(
    {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: { type: Sequelize.STRING, allowNull: false },
      Price: { type: Sequelize.INTEGER, allowNull: false },
      Currency: { type: Sequelize.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Product",
      timestamps: false,
    }
  );

  OrderProduct.init(
    {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: Order, key: "ID" },
      },
      ProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: Product, key: "ID" },
      },
      Quantity: { type: Sequelize.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "OrderProduct",
      tableName: "OrderProduct",
      timestamps: false,
    }
  );
}

exports.ORM = (s) => {
  internalORM(s);
  return { Customer, Order, Product, OrderProduct };
};
