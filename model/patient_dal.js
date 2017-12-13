var mysql   = require('mysql');
var db = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view company_view as
 select s.*, a.street, a.zip_code from company s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM Patient;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(PID, callback) {
    var query = 'Select * from Patient where PID = ?;';
    var queryData = [PID];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO Patient (LName, FName) VALUES (?)';

    var queryData = [params.LName, params.FName];

    connection.query(query, params.LName, params.FName, function(err, result) {

        // THEN USE THE COMPANY_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO COMPANY_ADDRESS
        var PID = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO Patient (PID, LName, FName) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var PatientData = [];
        if (params.PID.constructor === Array) {
            for (var i = 0; i < params.PID.length; i++) {
                PatientData.push([PID, params.PID[i]]);
            }
        }
        else {
            PatientData.push([PID, params.PID]);
        }

        // NOTE THE EXTRA [] AROUND companyAddressData
        connection.query(query, [PatientData], function(err, result){
            callback(err, result);
        });
    });

};

exports.delete = function(PID, callback) {
    var query = 'DELETE FROM Patient WHERE PID = ?';
    var queryData = [PID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var PatientInsert = function(PID, PIDArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO Patient (PID, LName, FName) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var PatientData = [];
    if (PIDArray.constructor === Array) {
        for (var i = 0; i < params.PID.length; i++) {
            PatientData.push([PID, params.PID[i]]);
        }
    }
    else {
        PatientData.push([PatientData, params.PID]);
    }
    connection.query(query, [PatientData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.PatientInsert = PatientInsert;

//declare the function so it can be used locally
var PatientDeleteAll = function(PID, callback){
    var query = 'DELETE FROM Patient WHERE PID = ?';
    var queryData = [PID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.PatientDeleteAll = PatientDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE Patient SET Patient.LName = ? WHERE PID = ?';
    var queryData = [params.Patient.LName, params.PID];

    connection.query(query, queryData, function(err, result) {
        //delete company_address entries for this company
        PatientDeleteAll(params.PID, function(err, result){

            if(params.PID != null) {
                //insert company_address ids
                PatientInsert(params.PID, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};



exports.edit = function(PID, callback) {
    var query = 'CALL patient_getinfo(?)';
    var queryData = [PID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};