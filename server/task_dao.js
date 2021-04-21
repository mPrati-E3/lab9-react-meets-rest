'use strict'

const Task = require('./task');
const db = require('./db');
const moment = require('moment');

/**
 * Function to create a Task object from a row of the tasks table
 * @param {*} row a row of the tasks table
 */
const createTask = function (row) {
    const importantTask = (row.important === 1) ? true : false;
    const privateTask = (row.private === 1) ? true : false; 
    const completedTask = (row.completed === 1) ? true : false;
    return new Task(row.id, row.description, importantTask, privateTask, row.deadline, row.project, completedTask);
}

// Check if the task date is today
const isToday = function(date) {
    return moment(date).isSame(moment(), 'day');
}

// Check if the task date is next week
const isNextWeek = function(date) {
    const nextWeek = moment().add(1, 'weeks');
    const tomorrow = moment().add(1, 'days');
    return moment(date).isAfter(tomorrow) && moment(date).isBefore(nextWeek);
}

/**
 * Get tasks and optionally filter them
 * This is async so I have to use a Promise 
 */
exports.getTasks = function(filter) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM tasks";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let tasks = rows.map((row) => createTask(row));

                // If I have a passed filter, I'll switch it to know which tasks I have to draw
                if(filter){
                    switch(filter){
                        case "important":
                            tasks = tasks.filter((el) => {
                                return el.important;
                            });
                            break;
                        case "private":
                            tasks = tasks.filter((el) => {
                                return el.privateTask;
                            });
                            break;
                        case "shared":
                            tasks = tasks.filter((el) => {
                                return !el.privateTask;
                            });
                            break;
                        case "today":
                            tasks = tasks.filter((el) => {
                                if(el.deadline)
                                    return isToday(el.deadline);
                                else
                                    return false;
                            });
                            break;
                        case "week":
                            tasks = tasks.filter((el) => {
                                if(el.deadline)
                                    return isNextWeek(el.deadline);
                                else
                                    return false;
                            });
                            break;
                        default:
                            //try to filter by project
                            tasks = tasks.filter((el) => {
                                return el.project === filter;
                            });
                    }
                }
                resolve(tasks);
            }
        });
    });
}

/**
 * Get a task with given id
 * This is async so I have to use a Promise 
 */
exports.getTask = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM tasks WHERE id = ?";
        db.all(sql, [id], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const task = createTask(rows[0]);
                resolve(task);
            }
        });
    });
}

/**
 * Delete a task with a given id
 * This is async so I have to use a Promise 
 */
exports.deleteTask = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        db.run(sql, [id], (err) => {
            if(err)
                reject(err);
            else 
                resolve(null);
        })
    });
}

/**
 * Insert a task in the database and returns the id of the inserted task. 
 * To get the id, this.lastID is used. To use the "this", db.run uses "function (err)" instead of an arrow function.
 * This is async so I have to use a Promise 
 */
exports.createTask = function(task) {
    if(task.deadline){
        task.deadline = moment(task.deadline);
    }
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks(description, important, private, project, deadline, completed) VALUES(?,?,?,?,?,?)';

        db.run(sql, [task.description, task.important, task.privateTask, task.project, task.deadline.format("YYYY-MM-DD HH:mm"), task.completed], function (err) {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                console.log(this.lastID);
                resolve(this.lastID);
            }
        });
    });
}

/**
 * Update an existing task with a given id. newTask contains the new values of the task (e.g., to mark it as "completed")
 * This is async so I have to use a Promise 
 */
exports.updateTask = function(id, newTask) {
    if(newTask.deadline)
        newTask.deadline = moment(newTask.deadline);
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tasks SET description = ?, important = ?, private = ?, project = ?, deadline = ?, completed = ? WHERE id = ?';
        db.run(sql, [newTask.description, newTask.important, newTask.privateTask, newTask.project, newTask.deadline.format("YYYY-MM-DD HH:mm"), newTask.completed, id], (err) => {
            if(err){
                console.log(err);
                reject(err);
            }
            else
                resolve(null);
        })
    });
}
