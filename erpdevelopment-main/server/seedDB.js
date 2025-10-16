const mongoose = require('mongoose');
const Technician = require('./models/technician');
const Admin = require('./models/admin');

mongoose.connect('mongodb://localhost:27017/erpdevelopment', {})
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err));

const seedDB = async () => {
    try {
        // Remove existing data (Optional)
        await Technician.deleteMany({});
        await Admin.deleteMany({});

        // Create dummy technician
        const dummyTechnician = new Technician({
            username: "techuser",
            email: "tech@example.com"
        });

        await Technician.register(dummyTechnician, "techpassword");

        // Create dummy admin
        const dummyAdmin = new Admin({
            username: "adminuser",
            email: "admin@example.com"
        });

        await Admin.register(dummyAdmin, "adminpassword");

        console.log("Dummy data inserted successfully!");
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

// Run the function
seedDB();
