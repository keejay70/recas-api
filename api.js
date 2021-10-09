const mysql = require('mysql');

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'gisdb'
});

conn.connect();

const reportCrime = async (request, response) => {

    var report_details = request.body.report_details;
    var crimeType_id = request.body.crimeType_id;
    var datetime = new Date();
    var reporter_name = request.body.reporter_name;
    var reporter_contact = request.body.reporter_contact;
    var reporter_address = request.body.reporter_address;
    var latitude = request.body.latitude;
    var longitude = request.body.longitude;
    var statuss = "ongoing"
    var user_id = request.body.user_id;


    var sql = "INSERT INTO crimes VALUES ('','"+report_details+"','"+crimeType_id+"','"+datetime+"','"+reporter_name+"','"+reporter_contact+"','"+reporter_address+"','"+latitude+"','"+longitude+"','"+statuss+"','"+user_id+"')"
    
    conn.query(sql, function (error, results) {
        if (error) throw error;

        response.status(200).json("Crime reported")
    });
};

module.exports = {
    reportCrime
    
};