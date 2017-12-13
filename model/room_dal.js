var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view company_view as
 select s.*, a.street, a.zip_code from company s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM Room;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(RoomID, callback) {
    var query = 'Select * from Patient where RoomID = ?;';
    var queryData = [RoomID];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO Patient (LName, FName) VALUES (?)';

    var queryData = [params.Patient.LName];

    connection.query(query, params.Patient.LName, function(err, result) {

        // THEN USE THE COMPANY_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO COMPANY_ADDRESS
        var RoomID = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO Patient (RoomID, LName, FName) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var PatientData = [];
        if (params.RoomID.constructor === Array) {
            for (var i = 0; i < params.RoomID.length; i++) {
                PatientData.push([RoomID, params.RoomID[i]]);
            }
        }
        else {
            PatientData.push([RoomID, params.RoomID]);
        }

        // NOTE THE EXTRA [] AROUND companyAddressData
        connection.query(query, [PatientData], function(err, result){
            callback(err, result);
        });
    });

};

exports.delete = function(RoomID, callback) {
    var query = 'DELETE FROM Patient WHERE RoomID = ?';
    var queryData = [RoomID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var PatientInsert = function(RoomID, RoomIDArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO Patient (RoomID, LName, FName) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var PatientData = [];
    if (RoomIDArray.constructor === Array) {
        for (var i = 0; i < params.RoomID.length; i++) {
            PatientData.push([RoomID, params.RoomID[i]]);
        }
    }
    else {
        PatientData.push([PatientData, params.RoomID]);
    }
    connection.query(query, [PatientData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.PatientInsert = PatientInsert;

//declare the function so it can be used locally
var PatientDeleteAll = function(RoomID, callback){
    var query = 'DELETE FROM Patient WHERE RoomID = ?';
    var queryData = [RoomID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.PatientDeleteAll = PatientDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE Patient SET Patient.LName = ? WHERE RoomID = ?';
    var queryData = [params.Patient.LName, params.RoomID];

    connection.query(query, queryData, function(err, result) {
        //delete company_address entries for this company
        PatientDeleteAll(params.RoomID, function(err, result){

            if(params.RoomID != null) {
                //insert company_address ids
                PatientInsert(params.RoomID, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};



exports.edit = function(RoomID, callback) {
    var query = 'CALL patient_getinfo(?)';
    var queryData = [RoomID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};