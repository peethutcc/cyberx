const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('mysql');
const config = require('./dbconfig.js');
var conn = mysql.createConnection(config);
var session = require('express-session');

let app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

//conn.connect()

/*app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/styles'));
*/
/*app.get("/", function(req, res) {
    res.sendFile("index.html");
    
});*/
app.use(function (req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers','content-type,x-accesstoken');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.get("/home", function(req, res) {
   let sql = "SELECT courseid FROM course";
   conn.query(sql, function(err, result, fields){
        if(err){
            return console.error(err.message);
        }
        else{
            res.json(result);
        }
   });
    
});


app.post("/api", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    
    //res.end("Received Feedback: "+feedback+" Received Username: "+username);
    res.json({result:"success",username: username, password:password});
});

app.post("/register", function(req, res) {
    let username1 = req.body.username1;
    let password1 = req.body.password1;


        let sql = "INSERT INTO user(user, password) VALUES(?,?)";
        conn.query(sql, [username1,password1], function (err, result, fields) {
            if (err) {
                return console.error(err.message);
            }           
            
            // get inserted rows
            let numrows = result.affectedRows;
            if(numrows != 1) {
                res.json(JSON.stringify("Sign up failed"));
            }
            else {
                res.json(JSON.stringify("Sign up Complete!"));
            }
        });
    });


    app.post("/login", function (req, res) {
        let username = req.body.username;
        let password = req.body.password;


        if (username && password) {
            conn.query('SELECT * FROM user WHERE user = ? AND password = ?', [username, password], function(error, results, fields) {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.user = username;
                    
                    res.json(JSON.stringify(" Login success"));
                    
                } else {
                    res.json(JSON.stringify("incorrect Username and/or Password!"));
                   
                   
                }			
                res.end();
            });
        } else {
            res.json(JSON.stringify("Please enter Username and Password!"));
            res.end();
        }
    });

    




        
       /* let sql = "SELECT password FROM user WHERE user=?";
        con.query(sql, [username], function (err, result, fields) {
            if (err) {
                return console.error(err.message);
            }           
     
            let numrows = result.length;
            //if that user is not unique
            if(numrows != 1) {
                //login failed
                res.status(401).end();
                alert(JSON.stringify(res.status));
            }
            else {
                // console.log(result[0].password);
    
                //verify password, async method
                bcrypt.compare(password, result[0].password, function(err, resp) {
                    if (err) {
                        return console.error(err.message);
                    }
    
                    if(resp == true) {
                        //correct login send destination URL to client
                        if(result[0].role == 1) {
                            //admin
                            res.send("admin");
                        }
                        else {
                            //users
                            res.send("user");
                        }
                    }
                    else {
                        //wrong username or password
                        res.status(403).end();
                    }
                });                       
            }
        });
    });*/
    



const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Server is ready at " + port);
});
