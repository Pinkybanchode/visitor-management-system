const express = require("express");
const dotenv = require("dotenv");
const DbConnection = require('./databaseConnection');
const authRoutes = require("./routes/auth-routes.js");
const visitorRoutes = require("./routes/visitor-routes.js");
const dashboardRoutes = require("./routes/dashboard-routes.js");
const passRoutes = require("./routes/pass-routes.js");
const scanRoutes = require("./routes/scan-routes.js");
const cors = require("cors");
const appointmentRoutes = require("./routes/appoinment-routes.js");
const logRoutes = require("./routes/log-routes.js")
dotenv.config();
const app = express();
DbConnection();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res)=> {
    res.status(200).json({
        message: "This is Home Page :-)"
    })
})

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/passes", passRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/logs", logRoutes)
app.use("/api/dashboard", dashboardRoutes);
app.use((req, res) => {
    res.status(500).send({
        message: "Not Built Yet"
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>{
    console.log(`Server is up and running on http://localhost:${PORT}`)
})
