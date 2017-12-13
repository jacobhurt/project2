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
    var query = 'SELECT * FROM Doctor;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(DID, callback) {
    var query = 'Select * from Doctor where DID = ?;';
    var queryData = [DID];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO Doctor (LName, FName) VALUES (?)';

    var queryData = [params.Doctor.LName];

    connection.query(query, params.Doctor.LName, function(err, result) {

        // THEN USE THE COMPANY_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO COMPANY_ADDRESS
        var DID = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO Doctor (DID, LName, FName) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var DoctorData = [];
        if (params.DID.constructor === Array) {
            for (var i = 0; i < params.DID.length; i++) {
                DoctorData.push([DID, params.DID[i]]);
            }
        }
        else {
            DoctorData.push([DID, params.DID]);
        }

        // NOTE THE EXTRA [] AROUND companyAddressData
        connection.query(query, [DoctorData], function(err, result){
            callback(err, result);
        });
    });

};

exports.delete = function(DID, callback) {
    var query = 'DELETE FROM Doctor WHERE DID = ?';
    var queryData = [DID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var DoctorInsert = function(DID, DIDArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO Doctor (DID, LName, FName) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var DoctorData = [];
    if (DIDArray.constructor === Array) {
        for (var i = 0; i < params.DID.length; i++) {
            DoctorData.push([DID, params.DID[i]]);
        }
    }
    else {
        DoctorData.push([DoctorData, params.DID]);
    }
    connection.query(query, [DoctorData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.DoctorInsert = DoctorInsert;

//declare the function so it can be used locally
var DoctorDeleteAll = function(DID, callback){
    var query = 'DELETE FROM Doctor WHERE DID = ?';
    var queryData = [DID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.DoctorDeleteAll = DoctorDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE Doctor SET Doctor.LName = ? WHERE DID = ?';
    var queryData = [params.Doctor.LName, params.DID];

    connection.query(query, queryData, function(err, result) {
        //delete company_address entries for this company
        DoctorDeleteAll(params.DID, function(err, result){

            if(params.DID != null) {
                //insert company_address ids
                DoctorInsert(params.DID, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};



exports.edit = function(DID, callback) {
    var query = 'CALL Doctor_getinfo(?)';
    var queryData = [DID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};