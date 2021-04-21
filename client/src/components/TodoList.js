import React from 'react';
import TodoItem from './TodoItem';
import ListGroup from 'react-bootstrap/ListGroup';

// Function to draw the main TodoList (table)
// this will be represented as a ListGroup
const TodoList = (props) => {

  let {tasks, editTask, updateTask, deleteTask} = props;

  return (
    <>
      {tasks && 
      <ListGroup as="ul" variant="flush">
        {tasks.map((task) => <TodoItem key = {task.id} task = {task} editTask = {editTask} updateTask = {updateTask} deleteTask = {deleteTask} />) }
      </ListGroup>}
    </>
  );
}

export default TodoList;
