const fs = require('fs/promises');
const path = require('path');
const express = require('express');


const app = express();
app.use( express.json() );

const jsonTodoPath = path.resolve('./files/todo-list.json');


//////// obtener la lista
app.get('/tasks', async (request, response) => {

    const todoList = await fs.readFile(jsonTodoPath, 'utf8');

    response.send(todoList);
    response.end();

});

/// Crear una nueva trea
app.post('/tasks', async (request, response) => {
    const task = request.body;
    const jsonArray = await fs.readFile(jsonTodoPath, 'utf8');
    const newId = jsonArray[jsonArray.length -1].id + 1;

    if( task.title && task.description ){
        jsonArray.push({id:newId, title:task.title, description:task.description, status: false});
        await fs.writeFile(jsonTodoPath, JSON.stringify(jsonArray));
    }else{
        console.log('Hay un error')
    }
    response.end();
});

app.put('/tasks/:id', async (request, response) => {
    const idUrl = Number(request.url.replace('/tasks/', ''));
    const task = request.body;
    const jsonArray = JSON.parse(await fs.readFile(jsonTodoPath, 'utf8'));
    const indexTask = jsonArray.findIndex(param => param.id == idUrl);

    if (indexTask != -1 && task.status == true || task.status == false){
        jsonArray[indexTask].status = task.status;
        await fs.writeFile(jsonTodoPath, JSON.stringify(jsonArray));
    }else{
        console.log('errorr')
    }
    
    response.end();
});

app.delete('/tasks/:id', async (request, response) => {
    const idUrl = Number(request.url.replace('/tasks/', ''));
    
    const jsonArray = JSON.parse(await fs.readFile(jsonTodoPath, 'utf8'));
    const indexTask = jsonArray.findIndex(param => param.id == idUrl);

    if (indexTask != -1 ){
        const newTodoList = jsonArray.filter(task => task.id != idUrl);
        await fs.writeFile(jsonTodoPath, JSON.stringify(newTodoList));
    }else{
        console.log('errorr')
    }
    
    response.end();
});






const PORT = 8000;

app.listen(PORT);



