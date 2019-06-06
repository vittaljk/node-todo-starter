// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var cors = require('cors');
var http = require('http').Server(app);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// DATABASE SETUP
var mongoose = require('mongoose');
mongoose.connect('mongodb://vittaljk:way22sms@ds263436.mlab.com:63436/learning'); // connect to our database

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
	console.log("DB connection alive");
});

var User = require('./app/models/user');
var Todo = require('./app/models/todo');
// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
	// do logging
	console.log('middleware logging.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
	res.json({
		message: 'hooray! welcome to our api!'
	});
});

// START THE SERVER
// =============================================================================
var server = app.listen(port);
var io = require('socket.io').listen(server);

io.on('connection', (socket) =>{
    console.log('a user is connected');
    socket.emit('event2', {
        msg: 'Server to client, do you read me? Over.'
    });
})

router.route('/users')

    // get all users endpoint
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        }).sort({ 'detection_time': -1 });
    })

    // add user endpoint
    .post(function (req, res) {

		var user = new User();
        user.phone_number = req.body.phone_number;
        user.location = req.body.location;
        user.save(function (err) {
			if (err)
				res.send(err);

			res.json({
				message: 'user created!'
            });
            io.emit('userCreated', user)
		});
    })


router.route('/users/:id')

    // update user endpoint
    .put(function (req, res) {
        User.findById(req.params.id, function (err, user) {

            if (err)
                res.send(err);

            user.phone_number = req.body.phone_number;
            user.location = req.body.location;
            user.save(function (err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'user updated!'
                });
            });

        });
    })

    // delete user endpoint
    .delete(function (req, res) {
        User.remove({
            _id: req.params.id
        }, function (err, user) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully deleted'
            });
        });
    });

// TODO apis
router.route('/todo')

    // get all users endpoint
    .get(function (req, res) {
        Todo.find(function (err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    })

    // add user endpoint
    .post(function (req, res) {      
        var todo = new Todo();
        todo.name = req.body.name;
        todo.description = req.body.description;
        todo.save(function (err) {
            if (err)
                res.send(err);
			res.json({
                message: 'todo created!',
                status: 200,
                data: todo
            });
        });
    })


router.route('/todo/:id')

    // update user endpoint
    .put(function (req, res) {
        Todo.findById(req.params.id, function (err, todo) {

            if (err)
                res.send(err);

            todo.description = req.body.description;
            
            todo.save(function (err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'todo updated!',
                    status: 200,
                    data: todo
                });
            });

        });
    })

    // delete user endpoint
    .delete(function (req, res) {
        Todo.remove({
            _id: req.params.id
        }, function (err, todo) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully deleted',
                status: 200,
                data: todo
            });
        });
    });

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

