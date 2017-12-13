var express = require('express');
var router = express.Router();
var room_dal = require('../model/room_dal');
var patient_dal = require('../model/patient_dal');
var doctor_dal = require('../model/doctor_dal');
var nurse_dal = require('../model/nurse_dal');


// View All Rooms
router.get('/all', function(req, res) {
    room_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('Room/RoomViewAll', { 'result':result });
        }
    });

});

// View the Room for the given id
router.get('/', function(req, res){
    if(req.query.RoomID == null) {
        res.send('Room ID is null');
    }
    else {
        room_dal.getById(req.query.RoomID, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('Room/RoomViewById', {'result': result});
            }
        });
    }
});

// Return the add a new Room form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    room_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('Room/RoomAdd', {'name': result});
        }
    });
});

// View the Room for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.Room.LName == null) {
        res.send('Room Name must be provided.');
    }
    else if(req.query.RoomID == null) {
        res.send('At least Room must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        room_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/Room/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.RoomID == null) {
        res.send('A Room id is required');
    }
    else {
        room_dal.edit(req.query.RoomID, function(err, result){
            res.render('Room/RoomUpdate', {Room: result[0][0], name: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.RoomID == null) {
        res.send('A Room id is required');
    }
    else {
        room_dal.getById(req.query.RoomID, function(err, Room){
            room_dal.getAll(function(err, name) {
                res.render('Room/RoomUpdate', {Room: Room[0], name: name});
            });
        });
    }

});

router.get('/update', function(req, res) {
    room_dal.update(req.query, function(err, result){
        res.redirect(302, '/Room/all');
    });
});

// Delete a Room for the given Room_id
router.get('/delete', function(req, res){
    if(req.query.RoomID == null) {
        res.send('Room_id is null');
    }
    else {
        room_dal.delete(req.query.RoomID, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/Room/all');
            }
        });
    }
});

module.exports = router;