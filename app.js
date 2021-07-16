require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https");
const { response } = require("express");
const { env } = require("process");

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.post("/", function(req,res){
    var fullName = req.body.fullName;
    var email = req.body.email;
    var data ={
        members : [ {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : fullName 
                }
            }
        ]
    };
    var jsondata = JSON.stringify(data);
    const options ={
        method: "POST",
        auth: env.MCHIMPAUTH
    }
    const request = https.request(env.MCHIMPURL, options, function(response){

        if(response.statusCode===200)
            res.sendFile(__dirname + "/success.html");
        else
            res.sendFile(__dirname + "/failure.html");

    })
    request.write(jsondata);
    request.end();
})

app.listen( process.env.PORT || 3000, function(){
    console.log("Server is up and running at Port : 3000");
})

app.get('*', function(req, res){
    res.sendFile(__dirname +"/404.html", 404);
});