const express = require('express');
const cors = require('cors');
const app_ = express();
const PORT = 3000;

let tasks = [];
let nextTaskId = 1; //id ko trung

app_.use(express.json());
app_.use(cors());
//api all data
app_.get('/api/todos', (req, res) => {
  res.json(tasks);
});

//test api lấy dữ liệu từ id cụ thể

// app_.get('/api/todos/:id', (req, res) => {
//     const taskId = parseInt(req.params.id);
//     const task = tasks.find(task => task.id === taskId);

//     if (!task) {
//       return res.status(404).json({ error: 'Công việc không tồn tại' });
//     }

//     res.json(task);
// });


// api add
app_.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Vui lòng nhập tên công việc' });
  }

  const newTask = {
    // id: tasks.length + 1/ test thử 
    id: nextTaskId, // id ms ko trùng 
    title,
    completed: false,
  };

  tasks.push(newTask);
  nextTaskId++; 

  res.status(201).json(newTask);
});
//api update
app_.patch('/api/todos/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Công việc không tồn tại' });
  }

  const { title, completed } = req.body;
  if (title !== undefined) {
    task.title = title;
  }
  if (completed !== undefined) {
    task.completed = completed;
  }

  res.json(task);
});

//api del
app_.delete('/api/todos/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
  }

  res.sendStatus(204);
});

app_.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
