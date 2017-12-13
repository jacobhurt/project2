var express = require('express');
var router = express.Router();
var nurse_dal = require('../model/nurse_dal');



// View All Nurses
router.get('/all', function(req, res) {
    nurse_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('Nurse/NurseViewAll', { 'result':result });
        }
    });

});

// View the Nurse for the given id
router.get('/', function(req, res){
    if(req.query.NID == null) {
        res.send('Nurse ID is null');
    }
    else {
        nurse_dal.getById(req.query.NID, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('Nurse/NurseViewById', {'result': result});
            }
        });
    }
});

// Return the add a new Nurse form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    nurse_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('Nurse/NurseAdd', {'name': result});
        }
    });
});

// View the Nurse for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.Nurse.LName == null) {
        res.send('Nurse Name must be provided.');
    }
    else if(req.query.NID == null) {
        res.send('At least Nurse must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        nurse_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/Nurse/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.NID == null) {
        res.send('A Nurse id is required');
    }
    else {
        nurse_dal.edit(req.query.NID, function(err, result){
            res.render('Nurse/NurseUpdate', {Nurse: result[0][0], name: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.NID == null) {
        res.send('A Nurse id is required');
    }
    else {
        nurse_dal.getById(req.query.NID, function(err, Nurse){
            nurse_dal.getAll(function(err, name) {
                res.render('Nurse/NurseUpdate', {Nurse: Nurse[0], name: name});
            });
        });
    }

});

router.get('/update', function(req, res) {
    nurse_dal.update(req.query, function(err, result){
        res.redirect(302, '/Nurse/all');
    });
});

// Delete a Nurse for the given Nurse_id
router.get('/delete', function(req, res){
    if(req.query.NID == null) {
        res.send('Nurse_id is null');
    }
    else {
        nurse_dal.delete(req.query.NID, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/Nurse/all');
            }
        });
    }
});

module.exports = router;