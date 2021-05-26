const express = require('express');
const firebase = require('./firebase');
const router = express.Router();
const EncryptionService = require('./encrypt');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "sandbank-ena.cofdaw3zgftv.ca-central-1.rds.amazonaws.com",
    user: "admin",
    password: "enaso1227",
    port: 3306,
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const hashed = await EncryptionService.encrypt(password);
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("uid ", user.uid, "**");
            console.log(email, hashed);
            con.connect(function (err) {
                con.query(`INSERT INTO main.users (uid, email, password) VALUES ('${user.uid}', '${email}','${hashed}')`, (err, result, fields) => {
                    if (err) res.send(err);
                    if (result) res.send(result);
                    if (fields) console.log(fields);
                });
            });
            // res.json(user);
        })
        .catch((error) => {
            var errorMessage = error.message;
            res.json({ err: errorMessage });
        });
})

router.get('/', (req, res) => {
    const { email, password } = req.body;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            con.connect((err) => {
                if (err) res.send(err);
                con.query(`SELECT * FROM main.users HAVING uid='${user.uid}'`, async (err, result, field) => {
                    if (err) res.send(err);
                    if (result) {
                        const checkPassword = await EncryptionService.compare(password, result[0].password);
                        const token = await user.getIdToken();
                        if (user.email == result[0].email && checkPassword) {
                            con.query(`UPDATE main.users SET accessToken='${token}' WHERE uid='${user.uid}'`, async (err,result, field) => {
                                if (err) res.send(err);
                                if (result){
                                    res.sendStatus(200);
                                }
                            })
                        }else{
                            res.json({message: "User data does not match from the database"});
                        }
                    } else {
                        res.json({ message: "Matching user not found in database" })
                    }
                })
            })
        })
        .catch((error) => {
            var errorMessage = error.message;
            res.json({ err: errorMessage });
        })
})

module.exports = router;