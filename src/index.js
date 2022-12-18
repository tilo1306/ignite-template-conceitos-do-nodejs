const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers
  const userAlreadyExist = users.find(user =>  user.username === username)
  
  if(!userAlreadyExist){
    return response.status(404).json({error: "User not found"})

  }
  request.user = userAlreadyExist
  return next()

}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body


  const userAlreadyExist = users.find(user =>  user.username === username)

if(userAlreadyExist){
      return response.status(400).json({error: "username Already exist"})

}

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

   users.push(user)

  return response.status(201).json(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
   const {todos} = request.user
   return  response.status(200).json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
 const {todos} = request.user
 const {title,deadline} = request.body

  const todo ={
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  todos.push(todo)


  return  response.status(201).json(todo)


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

  // Complete aqui
  const {id} = request.params
  const {todos} = request.user
  const {title,deadline} = request.body

  const findTodo = todos.find( todo => todo.id === id) 


  if(!findTodo){
    return response.status(404).json({error: 'Not Found'})
  }


  findTodo.title = title
  findTodo.deadline = deadline

  return response.status(200).json(findTodo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const {id} = request.params
  const {todos} = request.user

  const findTodo = todos.find( todo => todo.id === id) 
  if(!findTodo){
    return response.status(404).json({error: 'Not Found'})
  }

  findTodo.done = true

  return response.status(200).json(findTodo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const {id} = request.params
  const {todos} = request.user

  const findTodo = todos.find(p=> p.id === id)
  console.log(findTodo);
  if(!findTodo){
    return response.status(404).json({error: 'Not Found'})
  }

  todos.splice(id,1)


  return response.status(204).json(todos)
});

module.exports = app;