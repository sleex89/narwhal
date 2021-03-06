const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const axios = require('axios');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const multer = require('multer');
 
const PORT = process.env.PORT || 5000;
const USER_MICROSERVICE_URL = process.env.USER_MICROSERVICE_URL || 'http://localhost:3033';
const MESSAGE_MICROSERVICE_URL = process.env.MESSAGE_MICROSERVICE_URL ? process.env.MESSAGE_MICROSERVICE_URL + '/messages' : 'http://localhost:3335/messages';

// *** SERVER CONFIGURATION ***

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Import routes handled by Express Router
const pods = require('./routes/pods');
const categories = require('./routes/categories');
const messages = require('./routes/messages');
const search = require('./routes/search');

// Define a single source of route paths
const routes = {
  register: USER_MICROSERVICE_URL + '/register',
  login: USER_MICROSERVICE_URL + '/login',
  editProfile: USER_MICROSERVICE_URL + '/editProfile',
  pods: '/pods',
  categories: '/categories',
  messages: '/messages',
  search: '/search'
};

// Set static path
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static('client/build'));
} else {
  app.use(express.static(__dirname + '/../client/build'));
}

// Amazon S3 config
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
});
const s3 = new AWS.S3();

// Multer config
// Memory storage keeps file data in a buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 52428800 }
});

// Socket.IO config
io.on('connection', socket => {
  socket.on('JOIN_ROOM', (payload) => {
    socket.join(payload.room);
  });

  socket.on('LEAVE_ROOM', (room) => {
    socket.leave(room);
  });

  socket.on('SEND_MESSAGE', (payload) => {
    // Insert the message into the message microservice
    axios.post(`${MESSAGE_MICROSERVICE_URL}/new-message`, payload)
      .then((results) => {
        io.to(payload.room).emit('RECEIVE_MESSAGE', { message: results.data });
      })
      .catch((e) => {
      });
  });
});

// ****************************

// *** UNPROTECTED ROUTES ***

// Register account route
app.post('/register', (req, res, next) => {
  axios.post(routes.register, req.body)
    .then(user => {
      res.status(200).json({
        token: user.data.token,
        user: user.data.user
      })
    })
    .catch(err => {
      return res.status(404).json({
        error: err.response.data.error,
        message: err.response.data.message
      })
    });
});

// Login route
app.post('/login', (req, res, next) => {
  axios.post(routes.login, req.body)
    .then(user => {
      res.status(200).json({
          token: user.data.token,
          user: user.data.user
      });
    })
    .catch(err => {
        return res.status(404).json({
          error: err.response.data.error,
          message: err.response.data.message
        })
    });
});

// Route to upload a pod avatar
app.post('/uploadPod', upload.single('image'), (req, res, next) => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
		dd = '0' + dd;
  }
  if (mm < 10) {
		mm = '0' + mm;
  }
  today = mm + '-' + dd + '-' + yyyy;

  let random = Math.random().toString(36).substring(7);

  s3.upload({
    Bucket: process.env.AWS_BUCKET,
    Key: `pod/${today}/${random}/${req.file.originalname}`,
    Body: req.file.buffer,
    ACL: 'public-read'
  }, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).send(data.Location);
  })
})

// Route to upload a user avatar
app.post('/uploadUser', upload.single('image'), (req, res, next) => {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	today = mm + '-' + dd + '-' + yyyy;

	let random = Math.random()
		.toString(36)
		.substring(7);

	s3.upload(
		{
			Bucket: process.env.AWS_BUCKET,
			Key: `user/${today}/${random}/${req.file.originalname}`,
			Body: req.file.buffer,
			ACL: 'public-read',
		},
		(err, data) => {
			if (err) {
        console.log('error uploading image to s3', err);
				return res.status(400).send(err);
      }
			return res.status(200).send(data.Location);
		}
	);
});

// ****************************

// Enable authentication middleware
app.use((req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'asdfvadasfdfasdfcv3234asdf', (err, decod) => {
      if (err) {
        res.status(403).json({
          message: "Token expired"
        });
      } else {
        req.decoded=decod;
        next();
      }
    });
  } else {
    res.status(403).json({
      message:"No token"
    });
  }
});


// *** PROTECTED ROUTES ***

// Edit profile route
app.post('/editProfile', (req, res, next) => {
  axios.post(routes.editProfile, req.body)
    .then(user => {
      res.status(200).json({
        token: user.data.token,
        user: user.data.user
      });
    })
    .catch(err => {
      console.log('ERR', err.response)
      res.status(401).json({
        error: err.response.data.error,
        message: err.response.data.message,
        errorType: err.response.data.errorType
      })
    });
})

// Pods route
app.use(routes.pods, pods);

// Categories route
app.use(routes.categories, categories);

// Messages route
app.use(routes.messages, messages);

// Search route
app.use(routes.search, search);

// ****************************

// Start server
http.listen(PORT);
