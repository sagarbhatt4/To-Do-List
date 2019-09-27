import SQLite from 'react-native-sqlite-storage';
const database = SQLite.openDatabase({ name: "todo.sqlite3" });     // Open database for performing operation on tables

// Table names
const taskTable = 'task';
const todoListTable = 'todoList';

// Create database tables
export function createTable() {
    database.transaction((tx) => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS ' + taskTable + ' (taskId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, taskName TEXT NOT NULL, backgroundColor TEXT NOT NULL)', [], (tx, results) => {
                console.log('[DataBase] ' + taskTable + ' Table created successfully');
            })

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS ' + todoListTable + ' (todoId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, todoName TEXT NOT NULL, todoDescription TEXT NOT NULL, taskId INTEGER NOT NULL, isSelected BOOLEAN NOT NULL)', [], (tx, results) => {
                console.log('[DataBase] ' + todoListTable + ' Table created successfully');
            })
    })
}

// Insert task details
export function insertTaskData(name, color, callback) {
    database.transaction((tx) => {
        tx.executeSql('INSERT INTO ' + taskTable + ' (taskName,backgroundColor) VALUES(?,?)', [name, color], (select, results) => {
            callback('Task added')
        })
    })
}

// Get task list
export function getTaskList(callback) {
    
    let taskData = []
    let taskId = ''
    let taskName = ''
    let color = ''
    let query = 'SELECT * FROM ' + taskTable;

    database.transaction((tx) => {
        tx.executeSql(query, [], (select, results) => {
            for (let i = 0; i < results.rows.length; i++) {
                taskId = results.rows.item(i).taskId
                taskName = results.rows.item(i).taskName
                color = results.rows.item(i).backgroundColor
                taskData.push({ taskId: taskId, taskName: taskName, color: color })
            }
            callback(taskData);
        })
    })
}

// Insert todo details
export function insertTodoData(name, description, taskId, callback) {
    database.transaction((tx) => {
        tx.executeSql('INSERT INTO ' + todoListTable + ' (todoName,todoDescription,taskId,isSelected) VALUES(?,?,?,?)', [name, description, taskId, false], (select, results) => {
            callback('Todo Added')
        })
    })
}

// Get todo list
export function getToDoList(taskId, callback) {

    let todoData = []
    let todoId = ''
    let todoName = ''
    let todoDescription = ''
    let isSelected = ''
    let query = 'SELECT * FROM ' + todoListTable + ' WHERE taskId = ' + taskId;

    database.transaction((tx) => {
        tx.executeSql(query, [], (select, results) => {
            for (let i = 0; i < results.rows.length; i++) {
                todoId = results.rows.item(i).todoId
                todoName = results.rows.item(i).todoName
                todoDescription = results.rows.item(i).todoDescription
                isSelected = results.rows.item(i).isSelected
                todoData.push({ todoId: todoId, taskId: taskId, todoName: todoName, todoDescription: todoDescription, isSelected: isSelected })
            }
            callback(todoData);
        })
    })
}

// Update todo for done or undone
export function updateTodoStatus(taskId, todoId, status, callback) {

    let query = 'UPDATE ' + todoListTable + ' SET isSelected = ' + status + ' WHERE todoId = ' + todoId + ' AND taskId = ' + taskId;

    database.transaction((tx) => {
        tx.executeSql(query, [], (select, results) => {
            // alert(JSON.stringify(results))
            callback(" Todo update successfully");
        })
    })
}