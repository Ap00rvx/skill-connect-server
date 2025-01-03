const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connect = require('./database/connect');
const gauth = require('./routes/gAuth.routes');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
const storage = require('./storage/storage');
const multer = require('multer');
const upload = multer({ storage });
const postRoutes = require('./routes/post.routes');
const http = require('http');
const { Server } = require('socket.io');

// Import the Socket.IO controller
const conversationController = require('./controllers/conversation.controller');

// Load environment variables
dotenv.config();

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend's URL for security
    methods: ['GET', 'POST' , 'PUT', 'DELETE'],
  },
});
const port = process.env.PORT || 4000;
// Connect to database
connect();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use('/', gauth);
app.use('/api/user', userRoutes);
app.use('/api/p', postRoutes);

// File Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send({ message: 'File uploaded successfully!', url: req.file });
});

// Socket.IO Handlers
conversationController(io);

// Test Routes
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/ping', (req, res) => res.send('Test Route!'));

// Start Server

server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
