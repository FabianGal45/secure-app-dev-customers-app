// https://expressjs.com/en/starter/hello-world.html
const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

//https://www.npmjs.com/package/sqlite3
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE customers (name TEXT, nickname TEXT, age INTEGER, favorite_food TEXT)");
});

// Root redirects to the /customers 
app.get('/', (req, res) => {
    res.redirect('/customers?context=Customers');
});

// Log the used port and URL of the app
app.listen(port, () => {
  console.log(`App listening on port ${port} | http://localhost:${port}`)
})


// View used to add customer via the browser.
app.get('/add-customer', (req, res) => {
    res.render('add_customer');
});

// Create a new customer
app.post('/customers', (req, res) => {
    const { name, nickname, age, favorite_food } = req.body;
    const query = `INSERT INTO customers (name, nickname, age, favorite_food) VALUES (?, ?, ?, ?)`;

    db.run(query, [name, nickname, age, favorite_food], function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.redirect('/customers');
        }
    });
});

// Get all customers
app.get('/customers', (req, res) => {
    db.all("SELECT rowid, * FROM customers", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.render('index', { customers: rows });
        }
    });
});

// Get all customers but for a REST api which displays data in a JSON format. This is used to get and display sensitive information as a vulnerability. 
app.get('/api/customers', (req, res) => {
    db.all("SELECT * FROM customers", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});
  
// Update a customer
app.put('/customers/:id', (req, res) => {
    const { name, nickname, age, favorite_food } = req.body;
    const { id } = req.params;
    const query = `UPDATE customers SET name = ?, nickname = ?, age = ?, favorite_food = ? WHERE rowid = ?`;
    
    db.run(query, [name, nickname, age, favorite_food, id], function(err) {
    if (err) {
        res.status(500).send(err.message);
    } else if (this.changes === 0) {
        res.status(404).send("Customer not found");
    } else {
        res.status(200).send(`Customer updated successfully`);
    }
    });
});
  

// Delete a customer - Fixed SQL injection
app.get('/delete-customer/:id', (req, res) => {
    const id = req.params.id; 

    db.run(`DELETE FROM customers WHERE rowid = ?`, [id], function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.redirect('/customers');
        }
    });
});