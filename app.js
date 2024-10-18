/** 
 * Name:Siddharth Mahendrabhai Nahar
 * Student ID:000930031
 * Date:17-10-2024
 * Course:Fall 2024 Web Application Development (CPRG-210-A)
 * Assignment 3 : Node Daily Assignments
*/

//Import all modules
const express = require('express');
const db = require('./utilities/db-connection');
const path = require('path');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000;
const getRandomGreeting = require('./greeting');


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));


db.connect((err) => {
    if (err) throw err;
    console.log('Database connected');
});


app.get('/', (req, res) => {
    const greeting = getRandomGreeting();
    res.render("home", { greeting });
});

//load contact page
app.get('/contact', (req, res) => {
    res.render("contact", { errors: [], formData: {} });
});

//load about page
app.get('/about', (req, res) => {
    res.render("about");
});

//add new contact
app.post('/add',
    [
        body('firstname').notEmpty().withMessage('First name is required').isAlpha().withMessage('First name must contain only letters'),
        body('lastname').notEmpty().withMessage('Last name is required').isAlpha().withMessage('Last name must contain only letters'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('phone').notEmpty().withMessage('Phone number is required').isMobilePhone().withMessage('Please enter a valid phone number'),
        body('city').notEmpty().withMessage('City is required'),
        body('province').notEmpty().withMessage('Province is required'),
        body('postalcode').notEmpty().withMessage('Postal code is required'),
        body('feedbackmessage').notEmpty().withMessage('Feedback message is required'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('contact', { errors: errors.array(), formData: req.body });
        }

        const { firstname, lastname, email, phone, city, province, postalcode, feedbackmessage } = req.body;
        const sql = 'INSERT INTO contact_details (FirstName, LastName, Email, PhoneNumber, City, Province, PostalCode, FeedbackMessage) VALUES (?,?,?,?,?,?,?,?)';

        db.query(sql, [firstname, lastname, email, phone, city, province, postalcode, feedbackmessage], (err, result) => {
            if (err) {
                console.error("Database Error: ", err);
                return res.status(500).send("An error occurred while processing your request.");
            } else {
                res.render('thankyou', { name: `${firstname} ${lastname}`, email });
            }
        });
    }
);

//get all list of contacts
app.get('/getAllContacts', (req, res) => {
    const sql = 'select * from contact_details';
    db.query(sql, (err, result, field) => {
        if (err) throw err;
        res.render('contacts-list', { allContacts: result });
    });
})

//get details of user using id
app.get('/edit/:id', (req, res) => {
    const sql = 'select * from contact_details where id=?';
    db.query(sql, [req.params.id], (err, result) => {
        res.render("contact", { errors: [], formData: result[0] });
    });
})

//edit contact using id
app.post('/edit/:id', (req, res) => {
    const { firstname, lastname, email, PhoneNumber, city, province, postalcode, feedbackmessage } = req.body;
    const sql = 'UPDATE contact_details' +
        ' SET firstname = ?, lastname=?, email = ?, PhoneNumber=?,city=?,province=?,postalcode=?,feedbackmessage=?' +
        ' where id = ?';
    db.query(sql, [firstname, lastname, email, PhoneNumber, city, province, postalcode, feedbackmessage, req.params.id], (err, result) => {
        if (err) {
            throw err
        } else {
            const sql = 'SELECT * FROM contact_details';

            db.query(sql, (err, result) => {
                if (err) throw err;
                res.render('contacts-list', { allContacts: result });
            });
        }
    });
})

//Delete contact using id
app.post('/delete/:id', (req, res) => {
    const contactId = req.params.id;
    const sql = 'DELETE FROM contact_details WHERE id = ?';
    db.query(sql, [contactId], (err, result) => {
        if (err) {
            throw err;
        } else {
            const sql = 'SELECT * FROM contact_details';

            db.query(sql, (err, result) => {
                if (err) throw err;
                res.render('contacts-list', { allContacts: result });
            });
        }
    });
});

//Thank you page render
app.get('/thankyou', (req, res) => {
    res.render("thankyou.ejs");
});

//rendering 404 page
app.use((req, res) => {
    res.render("404.ejs");
});

//Check if server is running or not
app.listen(port, () => {
    console.log("Server is running");
});