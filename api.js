const mysql = require('mysql');
const Pusher = require("pusher");
var moment = require('moment');


const pusher = new Pusher({
    appId: "1279671",
    key: "cb4b3192ce43653d8642",
    secret: "088bb54113a2fb73c137",
    cluster: "ap1",
    useTLS: true
});

require('dotenv').config();

// var conn = mysql.createConnection({
//   host     : process.env.DB_HOST,
//   user     : process.env.DB_USER,
//   password : process.env.PASSWORD,
//   database : process.env.DATABASE,
// });

var conn = mysql.createConnection({
    host     : "remotemysql.com",
    user     : "i1vjyob0OY",
    password : "GNJ2drDQPG",
    database : "i1vjyob0OY",
  });

conn.connect();

const reportCrime = async (request, response) => {
    var report_details = request.body.report_details;
    var crimeType_id = request.body.crimeType_id;
    //var datetime = moment().format('yyyy-mm-dd:hh:mm:ss');
    var datetime = "2021-10-31 13:08:00";
    var reporter_name = request.body.reporter_name;
    var reporter_contact = request.body.reporter_contact;
    var reporter_address = request.body.reporter_address;
    var latitude = request.body.latitude;
    var longitude = request.body.longitude;
    var statuss = "ongoing";
    //var user_id = request.body.user_id;
    var user_id = 1;
    var barangay = request.body.barangay;

    var sql = "INSERT INTO crimes VALUES (NULL,'"+report_details+"','"+crimeType_id+"','"+datetime+"','"+reporter_name+"','"+reporter_contact+"','"+reporter_address+"','"+latitude+"','"+longitude+"','"+statuss+"','"+user_id+"','"+barangay+"')"
    
    conn.query(sql, function (error, results) {
        if (error) {
            return response.status(500).json(error);
        }

        response.status(200).json("Crime reported");
    });
};

const getCrimeType = async (request, response) => {
    var returnObj = {
        status:1,
        data:""
    }

    var sql = "SELECT id FROM crimetype WHERE type='"+request.body.crime_type+"' LIMIT 1";
    conn.query(sql, function (error, results) {
        if (error) {
            returnObj.data = error
            return response.status(500).json(returnObj);
        }
        returnObj.status = 0;
        returnObj.data = results;
        response.status(200).json(returnObj);
    });
};

//not updated or used
const editCrime = async (request, response) => {

    var report_details = request.body.report_details;
    var crimeType_id = request.body.crimeType_id;
    var datetime = new Date().getDate();
    var reporter_name = request.body.reporter_name;
    var reporter_contact = request.body.reporter_contact;
    var reporter_address = request.body.reporter_address;
    var latitude = request.body.latitude;
    var longitude = request.body.longitude;
    var statuss = "ongoing";
    var user_id = request.body.user_id;


    var sql = "UPDATE crimes SET report_details='"+report_details+"', crimeType_id="+crimeType_id+", reporter_name='"+reporter_name+"', reporter_contact='"+reporter_contact+"', reporter_address='"+reporter_address+"', latitude="+latitude+", longitude="+longitude+", status='"+statuss+"', user_id="+user_id+" WHERE id="+4;
    
    conn.query(sql, function (error, results) {
        if (error) {
            return response.status(500).json("error updating crime")
        }

        response.status(200).json("Crime report updated")
    });
};

const getAllCrimes = async (request, response) => {

    var sql = "SELECT * FROM crimes JOIN crimetype ON crimes.crimeType_id = crimetype.id ORDER BY crimes.id DESC";

    var returnObj = {
        status:1,
        data:""
    }

    conn.query(sql, function (error, results) {
        if (error){
            returnObj.data = error;
            return response.status(500).json(returnObj)
        }


        returnObj.status = 0;
        returnObj.data = results;
        response.status(200).json(returnObj)
    });
};



const searchCrime = async (request, response) => {

    // var choice = request.body.choice;
    // var crimecase = request.body.crimecase;
    // var status = request.body.status;
    // var searchbrgy = request.body.searchbarangay;
    // var contact = request.body.contact;
    // var from = request.body.from;
    // var to = request.body.to;
    var choice = null
    var crimecase = null
    var statuss = null
    var searchbarangay = null
    var contact = null
    var from = request.body.from;
    var to = request.body.to;
    var ctype = null;

    var part0=""
    var part1=""
    var part2=""
    var part3=""
    var part4=""
    var part5=""
    var part6=""

    if(request.body.choice == ''){
        part1 = "("+choice+" IS NULL OR crimetype.against='"+choice+"')";
    }else if(request.body.choice == '0' ){
        choice = "Persons";
        part1 = "('"+choice+"' IS NULL OR crimetype.against='"+choice+"')";
    }else{
        choice = "Property";
        part1 = "('"+choice+"' IS NULL OR crimetype.against='"+choice+"')";
    }

    if(request.body.crimecase != ""){
        crimecase = request.body.crimecase
        part2 = "('"+crimecase+"' IS NULL OR crimetype.id='"+crimecase+"')"
    }else{
        part2 = "("+crimecase+" IS NULL OR crimetype.id='"+crimecase+"')"
    }

    if(request.body.status != ""){
        statuss = request.body.status
        part3 = "('"+statuss+"' IS NULL OR status='"+statuss+"')"
    }else{
        part3 = "("+statuss+" IS NULL OR status='"+statuss+"')"
    }

    if(request.body.searchbarangay != ""){
        searchbarangay = request.body.searchbarangay
        part4 = "('"+searchbarangay+"' IS NULL OR barangay='"+searchbarangay+"')"
    }else{
        part4 = "("+searchbarangay+" IS NULL OR barangay='"+searchbarangay+"')"
    }

    if(request.body.contact != ""){
        contact = request.body.contact
        part5 = "('"+contact+"' IS NULL OR reporter_contact='"+contact+"')"
    }else{
        part5 = "("+contact+" IS NULL OR reporter_contact='"+contact+"')"
    }

    if(request.body.from == "" && request.body.to != "" ){
        part6 = " AND (date < '"+to+"')";
    }else if(request.body.from != "" && request.body.to == "" ){
        var currDate = new Date().toISOString().slice(0, 10);

        part6 = " AND (date BETWEEN '"+from+"' AND '"+currDate+"')";
    }else if(request.body.from == "" && request.body.to == "" ){
        part6 = ""
    }

     console.log(choice)
     console.log(crimecase)
     console.log(statuss)

    var sql = "SELECT * FROM crimes JOIN crimetype ON crimes.crimeType_id=crimetype.id WHERE "+part1+"AND"+part2+"AND"+part3+"AND"+part4+"AND"+part5+part6;


    console.log(sql)

    var returnObj = {
        status:1,
        data:""
    }

    conn.query(sql, function (error, results) {
        if (error){
            returnObj.data = error;
            return response.status(500).json(returnObj)
        }


        returnObj.status = 0;
        returnObj.data = results;
        response.status(200).json(returnObj)
    });
};


const getAllCrimeTypes = async (request, response) => {
    
    var sql = "SELECT * from crimeType";

    var returnObj = {
        status:1,
        data:""
    }

    conn.query(sql, function (error, results) {
        if (error){
            returnObj.data = error;
            return response.status(500).json(returnObj)
        }


        returnObj.status = 0;
        returnObj.data = results;
        response.status(200).json(returnObj)
    });
};

const getOneCrime = async (request, response) => {
    
    var id = request.body.id;
    console.log(id)

    var sql = "SELECT * from crimes JOIN crimetype ON crimes.crimeType_id = crimetype.id WHERE crimes.id="+parseInt(id);

    var returnObj = {
        status:1,
        data:""
    }

    conn.query(sql, function (error, results) {
        if (error){
            returnObj.data = error;
            return response.status(500).json(returnObj)
        }

        returnObj.status = 0;
        returnObj.data = results;
        console.log(returnObj)
        response.status(200).json(returnObj)
    });
};


const sendLatLong = async (request, response) => {

    var latitude = request.body.latitude;
    var longitude = request.body.longitude;
    var id = request.body.id;

    var sql = "UPDATE users SET latitude="+latitude+", longitude="+longitude+" WHERE id="+id;
    
    conn.query(sql, function (error, results) {
        if (error) {
            return response.status(500).json("not ok")
        }

        response.status(200).json("ok")
    });

};


const register = async (request, response) => {

    var returnObj = {
        status:1,
        data:""
    }

    var username = request.body.username;
    var password = request.body.password;
    var type = request.body.type;
    var status = request.body.status;
    var contact_no = request.body.contact_no;

    var sql = "INSERT INTO users VALUES ('','"+unit_no+"','"+status+"','"+type+"','"+contact_no+"','"+username+"','"+password+"'')";

    conn.query(sql, function (error, results) {
        if (error){
            returnObj.data = error;
            return response.status(500).json(returnObj)
        }


        returnObj.status = 0;
        returnObj.data = results;
        response.status(200).json(returnObj)
    });

};

const login = async (request, response) => {

    var returnObj = {
        status:1,
        data:""
    }

    var username = request.body.username;
    var password = request.body.password;

    var sql = "SELECT * FROM users WHERE username ='"+username+"' && password ='"+password+"'";

    conn.query(sql, function (error, results) {
        if (error){
            returnObj.data = error;
            return response.status(500).json(returnObj)
        }


        returnObj.status = 0;
        returnObj.data = results;
        response.status(200).json(returnObj)
    });
};
  
const getUnitLocation = (req,res) => {
    var lat = req.body.lat;
    var long = req.body.long;
    var accuracy = req.body.accuracy;
    var id = req.body.userId;
    pusher.trigger("units", "get-units", {
        message: "success",
        lat : lat,
        long : long,
        accuracy : accuracy,
        id : id
      });
}





module.exports = {
    reportCrime,
    editCrime,
    getAllCrimes,
    searchCrime,
    getAllCrimeTypes,
    sendLatLong,
    login,
    register,
    getUnitLocation,
    getCrimeType,
    getOneCrime
};