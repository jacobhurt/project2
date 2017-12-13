var express = require('express');
var router = express.Router();
var doctor_dal = require('../model/doctor_dal');



// View All Doctors
router.get('/all', function(req, res) {
    doctor_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('Doctor/DoctorViewAll', { 'result':result });
        }
    });

});

// View the Doctor for the given id
router.get('/', function(req, res){
    if(req.query.DID == null) {
        res.send('Doctor ID is null');
    }
    else {
        doctor_dal.getById(req.query.DID, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('Doctor/DoctorViewById', {'result': result});
            }
        });
    }
});

// Return the add a new Doctor form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    doctor_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('Doctor/DoctorAdd', {'name': result});
        }
    });
});

// View the Doctor for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.Doctor.LName == null) {
        res.send('Doctor Name must be provided.');
    }
    else if(req.query.DID == null) {
        res.send('At least Doctor must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        doctor_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/Doctor/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.DID == null) {
        res.send('A Doctor id is required');
    }
    else {
        doctor_dal.edit(req.query.DID, function(err, result){
            res.render('Doctor/DoctorUpdate', {Doctor: result[0][0], name: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.DID == null) {
        res.send('A Doctor id is required');
    }
    else {
        doctor_dal.getById(req.query.DID, function(err, Doctor){
            doctor_dal.getAll(function(err, name) {
                res.render('Doctor/DoctorUpdate', {Doctor: Doctor[0], name: name});
            });
        });
    }

});

router.get('/update', function(req, res) {
    doctor_dal.update(req.query, function(err, result){
        res.redirect(302, '/Doctor/all');
    });
});

// Delete a Doctor for the given Doctor_id
router.get('/delete', function(req, res){
    if(req.query.DID == null) {
        res.send('Doctor_id is null');
    }
    else {
        doctor_dal.delete(req.query.DID, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/Doctor/all');
            }
        });
    }
});

module.exports = router;