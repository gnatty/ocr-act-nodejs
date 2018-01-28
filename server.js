const express = require('express')
const bodyParser = require('body-parser')
const uniqid = require('uniqid');
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const open = require("open");

/**
  * @const {array} todoList - Array of todo object.
  */
const todoList = []
/**
  * @var {object} globalIo - socket io logged user context.
  */
let globalIo = null

/********************************************************
  *******************************************************
  * FUNCTION
  *******************************************************
  *******************************************************
  */

/**
  *
  * @param {string} type - Return type success or error.
  * @param {object}`data - Object data.
  * @return {object} an object.
  */
function returnJsonResponse(type, data) {
  if(type === 'error') {
    return {'error': data}
  }
  return {'success': data}
}

/********************************************************
  *******************************************************
  * CONFIGURATION
  *******************************************************
  *******************************************************
  */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/node_modules'))
app.use('/assets', express.static(__dirname + '/assets'))

/********************************************************
  *******************************************************
  * SOCKET IO 
  *******************************************************
  *******************************************************
  */
io.on('connection', (socket) => {
  globalIo = socket;

  socket.on('disconnect', () => {
    globalIo = null;
  })
})

/********************************************************
  *******************************************************
  * ROUTES
  *******************************************************
  *******************************************************
  */

/**
  * Render todo list.
  *
  * @Route(name="todo::listing", path="/", method="GET")
  */
app.get('/', (req, res) => {
  res.render('listing.ejs', {
    todolist: todoList
  });
})

/**
  * List all todo as json string.
  *
  * @Route(name="todo::all", path="/todo/all", method="GET")
  */
app.get('/todo/all', (req, res) => {
  res.json(returnJsonResponse('success', todoList))
})

/**
  * Add a new todo to the list and send an emit a socketio message 
  * to all connected client.
  *
  * @Route(name="todo::add", path="/todo/add", method="POST")
  * @param {string} req.body.message - Todo message
  */
app.post('/todo/add', (req, res) => {
  console.log(req.body);
  if( req.body.message == null ) {
    res.json(returnJsonResponse('error', null));
    return;
  }

  let data = {
    id: uniqid('todo-'),
    message: req.body.message
  };
  todoList.splice(0, 0, data);

  if(globalIo != null) {
    globalIo.emit('todo::created', data);
    globalIo.broadcast.emit('todo::created', data);
  }
  
  res.json(returnJsonResponse('success', data));
  return;
})


/**
  * Delete a todo by his id.
  * Emit a socketio message to all connected client if todo is removed.
  *
  * @Route(name="todo::delete", path="/todo/delete", method="POST")
  * @param {integer} req.body.id - Todo id to remove.
  */
app.post('/todo/delete', (req, res) => {
  if( req.body.id == null ) {
    res.json(returnJsonResponse('error', null));
    return;
  }

  let todoIndex = todoList.findIndex((todo) => {
    return todo.id == req.body.id;
  });
  let data = {
    id: req.body.id
  };
  if( todoIndex >= 0 ) {
    todoList.splice(todoIndex, 1);

    if(globalIo != null) {
      globalIo.emit('todo::delete', data);
      globalIo.broadcast.emit('todo::delete', data);
    }
    res.json(returnJsonResponse('success', data));
    return;
  } else {
    res.json(returnJsonResponse('error', null));
    return;
  }
})

/**
  * If no route found redirect to main route.
  *
  * @Route(name="not_found_route", path="*")
  */
app.use( (req, res, next) => {
  res.redirect('/');
})

/**
  * Launch server on port 3000.
  */
server.listen(3000, () => {
  console.log('==========================================');
  console.log('Server started on port 3000')
  console.log('[url] http://localhost:3000')
  console.log('[url] http://127.0.0.1:3000/')
  open("http://localhost:3000/")
})