const express = require('express');
//import my db connection
const db = require('./utilities/db-connection');
const path = require('path');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));


//testing connnection to db
db.connect((err) => {
    if (err) throw err;
    console.log('Database connected');
});

//endpoint for thank you file
app.get('/thankyou', (req, res) => {
    res.render("thankyou.ejs");
});

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/contact', (req, res) => {
    res.render("contact", { errors: [], formData: {} });
});

app.get('/about', (req, res) => {
    res.render("about");
});

app.post(
    '/add',
    [
        // Validation rules
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
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are errors, re-render the form with error messages
            return res.render('contact', { errors: errors.array(), formData: req.body });
        }

        const { firstname, lastname, email, phone, city, province, postalcode, feedbackmessage } = req.body;
        const sql = 'INSERT INTO contact_details (FirstName, LastName, Email, PhoneNumber, City, Province, PostalCode, FeedbackMessage) VALUES (?,?,?,?,?,?,?,?)';

        // Insert data into the database
        db.query(sql, [firstname, lastname, email, phone, city, province, postalcode, feedbackmessage], (err, result) => {
            if (err) {
                console.error("Database Error: ", err);
                // Return a response in case of a database error
                return res.status(500).send("An error occurred while processing your request.");
            } else{
                res.render('thankyou', { name: `${firstname} ${lastname}`, email });
            }
        });
    }
);


//endpoint for error pages
app.use((req, res) => {
    res.render("404.ejs");
});

app.listen(port, () => {
    console.log("Server is running");
});