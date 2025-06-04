const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Example in-memory data
let students = [
  { id: 1, name: 'John Doe', grade: 'A' },
  { id: 2, name: 'Jane Smith', grade: 'B' }
];
let teachers = [
  { id: 1, name: 'Mr. Anderson', subject: 'Math' },
  { id: 2, name: 'Ms. Johnson', subject: 'English' }
];
let classes = [
  { id: 1, name: 'Math 101', teacherId: 1 },
  { id: 2, name: 'English 101', teacherId: 2 }
];

// Students API
app.get('/api/students', (req, res) => {
  res.json(students);
});
app.post('/api/students', (req, res) => {
  const { name, grade } = req.body;
  const newStudent = { id: Date.now(), name, grade };
  students.push(newStudent);
  res.status(201).json(newStudent);
});
app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  students = students.filter(s => s.id !== id);
  res.status(204).end();
});
// Add PUT endpoint for editing students
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, grade } = req.body;
  const student = students.find(s => s.id === id);
  if (student) {
    student.name = name;
    student.grade = grade;
    res.json(student);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Teachers API
app.get('/api/teachers', (req, res) => {
  res.json(teachers);
});
app.post('/api/teachers', (req, res) => {
  const { name, subject } = req.body;
  const newTeacher = { id: Date.now(), name, subject };
  teachers.push(newTeacher);
  res.status(201).json(newTeacher);
});
app.delete('/api/teachers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  teachers = teachers.filter(t => t.id !== id);
  res.status(204).end();
});
// Add PUT endpoint for editing teachers
app.put('/api/teachers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, subject } = req.body;
  const teacher = teachers.find(t => t.id === id);
  if (teacher) {
    teacher.name = name;
    teacher.subject = subject;
    res.json(teacher);
  } else {
    res.status(404).json({ error: 'Teacher not found' });
  }
});

// Classes API
app.get('/api/classes', (req, res) => {
  // Populate teacher name for each class
  const result = classes.map(cls => ({
    ...cls,
    teacherName: teachers.find(t => t.id === cls.teacherId)?.name || 'Unknown'
  }));
  res.json(result);
});
app.post('/api/classes', (req, res) => {
  const { name, teacherId } = req.body;
  const newClass = { id: Date.now(), name, teacherId: parseInt(teacherId) };
  classes.push(newClass);
  res.status(201).json(newClass);
});
app.delete('/api/classes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  classes = classes.filter(c => c.id !== id);
  res.status(204).end();
});
// Add PUT endpoint for editing classes
app.put('/api/classes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, teacherId } = req.body;
  const cls = classes.find(c => c.id === id);
  if (cls) {
    cls.name = name;
    cls.teacherId = parseInt(teacherId);
    cls.teacherName = teachers.find(t => t.id === cls.teacherId)?.name || 'Unknown';
    res.json(cls);
  } else {
    res.status(404).json({ error: 'Class not found' });
  }
});

// Serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
