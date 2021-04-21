import Task from './Task';
const baseURL = "/api";

// Fetch all the tasks from the API - this is async so I have to use await
async function getTasks(filter) {

    let url = "/tasks";
    if(filter){
        const queryParams = "?filter=" + filter;
        url += queryParams;
    }
    const response = await fetch(baseURL + url);
    const tasksJson = await response.json();

    // Convert JSON format into my format
    if(response.ok){
        //return tasksJson.map((t) => Task.from(t));
        return tasksJson.map((t) => new Task(t.id,t.description,t.important, t.privateTask,t.deadline,t.project, t.completed));
    } else {
        throw tasksJson;  // An object with the error coming from the server
    }
}

// Fetch the insertion of a task - this is async so I have to use then and a Promise
// This is a POST so I have to manually create the fetch
async function addTask(task) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/tasks", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // JSON format convertion
            body: JSON.stringify(task),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

// Fetch the update of a task - this is async so I have to use then and a Promise
// This is a PUT so I have to manually create the fetch
async function updateTask(task) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/tasks/" + task.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // JSON format convertion
            body: JSON.stringify(task),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

// Fetch the delete of a task - this is async so I have to use then and a Promise
// This is a DELETE so I have to manually create the fetch but it's easier
async function deleteTask(taskId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/tasks/" + taskId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

const API = { getTasks,addTask, updateTask,deleteTask} ;
export default API;
