var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb+srv://pirragoku6969:omatikaya3@cluster0.c8ukh09.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"))

app.post("/sign_up", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;

    var data = {
        "name": name,
        "email": email,
        "phno": phno,
        "password": password
    }

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('signup_success.html')

});

app.post("/search", (req, res) => {
    var EnrollmentNumber = req.body.EnrollmentNumber;

    db.collection('sn').findOne({ EnrollmentNumber: EnrollmentNumber }, (err, result) => {
        if (err) {
            throw err;
        }
        if (result == null) {
            res.send("No student found with this enrollment number.");
        } else {
            res.send(`
            <html>
            <head>
                <title>Student Information</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f2f2f2;
                    }
                    h2 {
                        color: #00539C;
                    }
                    table {
                        margin: 20px;
                        border-collapse: collapse;
                        border: 2px solid #00539C;
                    }
                    td, th {
                        border: 1px solid #00539C;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #00539C;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <h2>Student Information</h2>
                <table>
                    <tr>
                        <th>Name</th>
                        <td>${result.StudentName}</td>
                    </tr>
                    <tr>
                        <th>Enrollment Number</th>
                        <td>${result.EnrollmentNumber}</td>
                    </tr>
                    
                </table>
            </body>
            </html>
        `);

        }
    });
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

app.listen(3000, () => {
    console.log("Listening on PORT 3000");
});
