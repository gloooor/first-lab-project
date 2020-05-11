--create database OrderBase
use OrderBase
--»нформаци€ о заказчике
create table Customer
(  
  ID int primary key IDENTITY (1,1),
  FirstName nvarchar(50) not null,
  LastName nvarchar(50) not null, 
  Company nvarchar(50) not null, 
  Adress nvarchar(70) not null, 
  Zip nvarchar(50) not null, 
  Phone nvarchar(50) not null, 
  Email nvarchar(50) not null, 
  Region nvarchar(50) not null, 
  Country nvarchar(50) not null
); 

insert into Customer(FirstName, LastName, Company, Adress, Zip, Phone, Email, Region, Country) values 
('Leuly','Wooners','LetM','Sometone Str. 23','354631','+781017754894','Woonershome@gmail.com','LA','USA'),
('Martin','Advenis','Subtext','Algalote Str. 14, 6','100829','+781011437583','txtxtsubsub@gmail.com','Reg','USA'),
('Nikita','Rogachev','Pyaterochka','Kupalayskaya Str. 13','194736','+375227628459','nikitoss@gmail.com','Brest','Belarus'),
('Asab','Rutyski','ERT','Lernno Str. 2','369826','+375334567890','assa@gmail.com','Lerino','Franch'),
('Ksu','Lenovec','SiMi','Larenko Str. 98','957254','+26483758945','simisimi@gmail.com','JK','Spain'),
('Loren','Subkub','VST','Sidorenko Str. 15','100473','+375928574590','looooren@gmail.com','LA','USA');


--»нформаци€ о заказе
create table Orders
(  
  ID   int primary key IDENTITY (1,1),
  Created date not null,
  Shipped date, 
  OrderStatus char(20) not null,
  CustomerId int foreign key references Customer(ID) ON DELETE CASCADE not null
);

insert into Orders(Created, Shipped, OrderStatus, CustomerId) values 
('03.04.2020','04.04.2020','Accepted', 3),  
('01.06.2019','14.06.2019','Too late', 1),  
('07.03.2020','01.04.2020','Pending', 5), 
('23.10.2019','30.10.2020','Pending', 6),
('14.11.2019','04.12.2019','Accepted', 3),
('24.02.2020','04.04.2020','Pending', 2),
('01.03.2020','04.04.2020','Accepted', 4)


--»нформаци€ о продуктах, которые наход€тс€ в составе заказа
create table Product
(  
  ID int primary key IDENTITY (1,1),
  Name nvarchar(50) not null,
  Price money not null, 
  Currency nvarchar(10) not null
); 


insert into Product(Name, Price, Currency) values 
('Ink', 34 , '$'),
('Milk', 3 , '$'),
('Skirt', 304 , 'И'),
('Potato', 2 , '$'),
('Powder', 3 , 'И'),
('Dress', 3 , 'И'),
('Tomato', 6 , '$'),
('Cake', 56 , 'И'),
('Carrot', 4 , '$'),
('Sweets', 45 , '$'),
('Cocktail', 56 , '$'),
('Sauces', 34 , 'И'),
('Onion', 7 , '$'),
('Salat', 45 , 'И'),
('Shirt', 213 , '$');


create table OrderProduct
(  
  ID int primary key IDENTITY (1,1),
  OrderId int foreign key references Orders(ID) ON DELETE CASCADE not null,
  ProductId int foreign key references Product(ID) ON DELETE CASCADE not null, 
  Quantity int not null
); 
insert into OrderProduct(OrderId, ProductId, Quantity) values 
(1,2,34),
(1,3,3),
(1,2,12),
(1,5,63),
(2,10,56),
(2,13,23),
(2,7,9),
(2,1,25),
(3,4,13),
(3,2,45),
(4,6,81),
(4,8,17),
(4,9,13),
(4,12,31),
(4,14,45),
(4,3,34),
(5,13,15),
(5,12,24),
(5,10,16),
(6,11,13),
(6,4,16),
(7,6,24),
(7,13,13),
(7,2,6),
(7,8,11);
