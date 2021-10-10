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
    var datetime = moment().format('yyyy-mm-dd:hh:mm:ss');;
    var reporter_name = request.body.reporter_name;
    var reporter_contact = request.body.reporter_contact;
    var reporter_address = request.body.reporter_address;
    var latitude = request.body.latitude;
    var longitude = request.body.longitude;
    var statuss = "ongoing";
    //var user_id = request.body.user_id;
    var user_id = 1;

    console.log(datetime)
    console.log(crimeType_id)
    var sql = "INSERT INTO crimes VALUES ('','"+report_details+"','"+crimeType_id+"','"+datetime+"','"+reporter_name+"','"+reporter_contact+"','"+reporter_address+"','"+latitude+"','"+longitude+"','"+statuss+"','"+user_id+"')"
    
    conn.query(sql, function (error, results) {
        if (error) {
            return response.status(500).json("error adding crime");
        }

        response.status(200).json("Crime reported");
    });
};

const getCrimeType = async (request, response) => {
    var returnObj = {
        status:1,
        data:""
    }
    console.log(request.body.crime_type +"----"+request.body.crime_on)

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


const editCrime = async (request, response) => {

    var report_details = request.body.report_details;
    var crimeType_id = request.body.crimeType_id;
    var datetime = new Date();
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

    var sql = "SELECT * FROM crimes JOIN crimetype ON crimes.crimeType_id = crimetype.id";

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
    
    var report_details = request.body.report_details;
    var crimeType_id = request.body.crimeType_id;
    var reporter_contact = request.body.reporter_contact;
    var statuss = request.body.status;
    var date = request.body.status;

    var returnObj = {
        status:1,
        data:""
    }

    var sql = "SELECT * FROM crimes WHERE ("+report_details+" IS NULL OR report_details="+report_details+") AND ("+crimeType_id+" IS NULL OR crimeType_id="+crimeType_id+") AND ("+reporter_contact+" IS NULL OR reporter_contact="+reporter_contact+") AND ("+statuss+" IS NULL OR statuss="+statuss+")";

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
    pusher.trigger("my-channel", "my-event", {
        message: "success",
        lat : lat,
        long : long,
        accuracy : accuracy
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
    getCrimeType
};