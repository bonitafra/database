const express = require('express'); 
const mysql = require('mysql');
const bodyParser = require('body-parser'); 
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pertemuan5'
});

connection.connect((err) => {
    if (err) {
        console.error("Terjadi Kesalahan Koneksi pada MySQL: " + err.stack);
        return;
    }
    console.log("Koneksi MySQL berhasil dengan id " + connection.threadId);
});

app.set('view engine', 'ejs');

// Ini adalah routing create, read, update, delete

// Read
app.get('/', (req, res) => { 
    const query = 'SELECT * FROM users'; 
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send("Terjadi kesalahan saat mengambil data.");
        }
        res.render('index', { users: results }); 
    });
});

// Create / Input / Insert 
app.post('/add', (req, res) => { 
    const { name, email, phone } = req.body;
    const query = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';
    connection.query(query, [name, email, phone], (err, results) => {
        if (err) {
            return res.status(500).send("Terjadi kesalahan saat menambahkan data.");
        }
        res.redirect('/'); 
    });
});

// Update - Get data for editing
app.get('/edit/:id', (req, res) => { 
    const query = 'SELECT * FROM users WHERE id = ?'; 
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).send("Terjadi kesalahan saat mengambil data.");
        }
        res.render('edit', { user: results[0] }); // Pastikan ada view 'edit.ejs'
    });
});

// Update 
app.post('/update/:id', (req, res) => {
    const { name, email, phone } = req.body;
    const query = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
    connection.query(query, [name, email, phone, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).send("Terjadi kesalahan saat memperbarui data.");
        }
        res.redirect('/'); 
    });
});

app.listen(3000, () => {
    console.log("Server berjalan di port 3000, buka web melalui http://localhost:3000");
});
