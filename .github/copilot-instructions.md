Here are some basic instructions, first consider that sometimes I will talk to you in English and others in Portuguese but always
answer back in Portuguese
this project is a project for a hospital called Santa Joana and we are building it using Spring Boot for the backend
the path is inside santajoana/src... for the frontend we built it initially using pure HTML CSS and JavaScript but now we are migrating it to React using javascript, not jsx or typescript


- Directory structure
frontend/ #first version of the frontend built using HTML CSS and JavaScript and it's our main inspiration for styling
json_samples/ #here we have some samples that could be used to call endpoints of our Spring API, and they should also be present on the controllers we will list later
react/ # it's the new module we are building but we will not touch it for now
santajoana/ # here is where the Spring API is located and we have tests, controllers, services and etc, to validate something of code samples maybe use the santajoana/src/main/java/rest/controller
modelo_fisico.sql # contains the data that creates our database and its structure
Relatório BD.pdf # contains a bit more information about the project

- Code instructions:
I always like to follow good programming practices so always follow the SOLID principles, be aware of code smells, etc.
I don't like to use ELSE so avoid using it throughout the code, prefer using early returns instead,
when creating a new function add comments explaining what it does (parameters and return), where it is used
Before creating a function, you need to verify if this function doesnt already exists somewhere ekse

- Dev instructions
We are going to build the second part imagining it was built for the admin using React, for the admin dashboard we will also use
Recharts and shadcn
VERY IMPORTANT: The patient code is already built in JavaScript HTML and CSS, but we want to inspire and use the same pattern 
of styling, components, etc., so access all of that inside frontend/ to use as reference and replicate it elsewhere

---
applyTo: "**"
---
After each iteration create a report in .github/ folder with the changes you just made and next steps


- Definition of the second part of the system

The idea here is to have an admin and this admin will be able to perform the following actions:

First we need to diferentiate the common user from the admin user, but dont bother with that now,
we are creating it separately first and than handle that, create this inside admin/

- NEW FEATURES
1. CRUD PRODUCTS AND CATEGORIES
2. CRUD ROOMS AND CATEGORIES
3. CHANGE A PATIENT'S STATUS TO DISCHARGED
4. UPDATE ORDER STATUS
5. ASSOCIATE A HOUSEKEEPER TO AN ORDER
6. CREATE STAY
7. HISTORY OF PATIENT STAYS – VIEW PREVIOUS HOSPITALIZATIONS
8. VIEW BILLING BY PERIOD – SUM INVOICE.TOTAL_VALUE GROUPED BY DATE/MONTH
9. CONTROL OF ORDERS BY HOUSEKEEPER – ORDERS MADE AND STATUS BY COLLABORATOR

--------- CHARTS RELATED TO PATIENTS ---------

- DASHBOARD
1. QUANTITY OF PATIENTS WITH STAY - (value)
2. QUANTITY OF OCCUPIED vs AVAILABLE ROOMS (pie chart)
3. AVERAGE LENGTH OF STAY (value)
4. AVERAGE AGE OF PATIENTS (value)

-------- CHARTS RELATED TO PRODUCTS/BILLING --------

1. QUANTITY OF PRODUCTS IN EACH CATEGORY ()
2. Billing for the current month (value)
3. Order throughput - (value)
4. Average spending per patient - (value)
5. Most ordered products by category - (bar chart)