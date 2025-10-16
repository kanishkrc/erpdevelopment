const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const MongoDBStore = require("connect-mongo");
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const User = require('./models/user');
const { ErrorDetector, Product } = require("./models/db"); 
const Technician = require('./models/technician');
const Admin = require('./models/admin');

mongoose.connect('mongodb://localhost:27017/erpdevelopment', {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const store = MongoDBStore.create({
    mongoUrl: 'mongodb://localhost:27017/erpdevelopment',
    collectionName: 'sessions',
});

const sessionConfig = {
    name: "session",
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: false, 
    store: store,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ message: "Internal server error" });
        if (!user) return res.status(401).json({ message: "Invalid username or password" });
        
        req.logIn(user, (err) => { 
            if (err) return res.status(500).json({ message: "Internal server error" });
            res.status(200).json({ message: "User login successful", redirectUrl: "/" });
        });
    })(req, res, next);
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user instance
        const newUser = new User({ username, email });
        await User.register(newUser, password); // Uses passport-local-mongoose's register method

        // Auto-login the user after registration
        req.logIn(newUser, (err) => {
            if (err) return res.status(500).json({ message: 'Login error after registration' });
            res.status(201).json({
                message: 'User registered successfully',
                redirectUrl: '/' 
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.post('/login/technician', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const technician = await Technician.findOne({
            $or: [{ username }, { email }]
        });

        if (!technician) {
            return res.status(401).json({ message: "Invalid technician credentials" });
        }

        const isMatch = await technician.authenticate(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid technician credentials" });
        }

        req.logIn(technician, (err) => {
            if (err) return res.status(500).json({ message: "Login error" });
            res.status(200).json({
                message: "Technician login successful",
                redirectUrl: "/technician"
            });
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post('/login/admin', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const admin = await Admin.findOne({
            $or: [{ username }, { email }]
        });

        if (!admin) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        const isMatch = await admin.authenticate(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        req.logIn(admin, (err) => {
            if (err) return res.status(500).json({ message: "Login error" });
            res.status(200).json({
                message: "Admin login successful",
                redirectUrl: "/admin"
            });
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});



app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ message: "Error during logout" });
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Error clearing session" });
            }
            res.clearCookie('session'); 
            res.status(200).json({ message: "Logged out successfully", redirectUrl: "/" });
        });
    });
});


app.get('/isloggedin', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ isLoggedIn: true, username: req.user.username });
    } else {
        req.flash('error', 'You must be signed in first');
        return res.status(401).json({ message: 'Not authenticated', redirectUrl: '/signin', error: req.flash('error') });
    }
});

app.post("/errorform", async (req, res) => {
    try {
        console.log("Received form data:", req.body);

        if (!req.body || !req.body.products) {
            return res.status(400).json({ error: "No form data provided" });
        }

       
        const productDocs = await Product.insertMany(req.body.products);

        
        const newForm = new ErrorDetector({
            srfNo: req.body.srfNo,
            date: req.body.date,
            probableDate: req.body.probableDate,
            organization: req.body.organization,
            address: req.body.address,
            contactPerson: req.body.contactPerson,
            mobileNumber: req.body.mobileNumber,
            telephoneNumber: req.body.telephoneNumber,
            emailId: req.body.emailId,
            products: productDocs.map((p) => p._id),
            decisionRules: req.body.decisionRules || {} 
        });

        await newForm.save(); // Ensure this runs every time
        console.log("ErrorDetector form successfully saved!");

        return res.status(201).json({
            message: "Form submitted successfully",
            redirectURL: "/", 
        });

    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).json({ error: "Error saving form data" });
    }
});


app.get('/logout/technician', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Error during technician logout" });
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ message: "Error clearing session" });
            res.clearCookie("session");
            res.status(200).json({ message: "Technician logged out successfully", redirectUrl: "/technician-login" });
        });
    });
});

app.get('/logout/admin', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Error during admin logout" });
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ message: "Error clearing session" });
            res.clearCookie("session");
            res.status(200).json({ message: "Admin logged out successfully", redirectUrl: "/admin-login" });
        });
    });
});



app.listen(5000, () => {
    console.log('Server running on port 5000');
});
