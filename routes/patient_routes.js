var express = require('express');
var router = express.Router();
var patient_dal = require('../model/patient_dal');



// View All Patients
router.get('/all', function(req, res) {
    patient_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('Patient/PatientViewAll', { 'result':result });
        }
    });

});

// View the Patient for the given id
router.get('/', function(req, res){
    req.query.PID = null;
    if(req.query.PID === null) {
        res.send('Patient ID is null');
    }
    else {
        patient_dal.getById(req.query.PID, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('Patient/PatientViewById', {'result': result});
            }
        });
    }
});

// Return the add a new Patient form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    patient_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('Patient/PatientAdd', {'name': result});
        }
    });
});

// View the Patient for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.Patient.LName == null) {
        res.send('Patient Name must be provided.');
    }
    else if(req.query.PID == null) {
        res.send('At least Patient must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        patient_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/Patient/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.PID == null) {
        res.send('A Patient id is required');
    }
    else {
        patient_dal.edit(req.query.PID, function(err, result){
            res.render('Patient/PatientUpdate', {Patient: result[0][0], name: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.PID == null) {
        res.send('A Patient id is required');
    }
    else {
        patient_dal.getById(req.query.PID, function(err, Patient){
            patient_dal.getAll(function(err, name) {
                res.render('Patient/PatientUpdate', {Patient: Patient[0], name: name});
            });
        });
    }

});

router.get('/update', function(req, res) {
    patient_dal.update(req.query, function(err, result){
        res.redirect(302, '/Patient/all');
    });
});

// Delete a Patient for the given Patient_id
router.get('/delete', function(req, res){
    if(req.query.PID == null) {
        res.send('Patient_id is null');
    }
    else {
        patient_dal.delete(req.query.PID, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/Patient/all');
            }
        });
    }
});

module.exports = router;