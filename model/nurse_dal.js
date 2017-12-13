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
    var query = 'SELECT * FROM Nurse;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(NID, callback) {
    var query = 'Select * from Nurse where NID = ?;';
    var queryData = [NID];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO Nurse (LName, FName) VALUES (?)';

    var queryData = [params.Nurse.LName];

    connection.query(query, params.Nurse.LName, function(err, result) {

        // THEN USE THE COMPANY_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO COMPANY_ADDRESS
        var NID = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO Nurse (NID, LName, FName) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var NurseData = [];
        if (params.NID.constructor === Array) {
            for (var i = 0; i < params.NID.length; i++) {
                NurseData.push([NID, params.NID[i]]);
            }
        }
        else {
            NurseData.push([NID, params.NID]);
        }

        // NOTE THE EXTRA [] AROUND companyAddressData
        connection.query(query, [NurseData], function(err, result){
            callback(err, result);
        });
    });

};

exports.delete = function(NID, callback) {
    var query = 'DELETE FROM Nurse WHERE NID = ?';
    var queryData = [NID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var NurseInsert = function(NID, NIDArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO Nurse (NID, LName, FName) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var NurseData = [];
    if (NIDArray.constructor === Array) {
        for (var i = 0; i < params.NID.length; i++) {
            NurseData.push([NID, params.NID[i]]);
        }
    }
    else {
        NurseData.push([NurseData, params.NID]);
    }
    connection.query(query, [NurseData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.NurseInsert = NurseInsert;

//declare the function so it can be used locally
var NurseDeleteAll = function(NID, callback){
    var query = 'DELETE FROM Nurse WHERE NID = ?';
    var queryData = [NID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.NurseDeleteAll = NurseDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE Nurse SET Nurse.LName = ? WHERE NID = ?';
    var queryData = [params.Nurse.LName, params.NID];

    connection.query(query, queryData, function(err, result) {
        //delete company_address entries for this company
        NurseDeleteAll(params.NID, function(err, result){

            if(params.NID != null) {
                //insert company_address ids
                NurseInsert(params.NID, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};



exports.edit = function(NID, callback) {
    var query = 'CALL Nurse_getinfo(?)';
    var queryData = [NID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};