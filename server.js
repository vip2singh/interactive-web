const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store
let tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' }
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/data', (req, res) => {
  res.json(tableData);
});

app.post('/api/data', (req, res) => {
  const newRow = {
    id: Math.max(...tableData.map(r => r.id), 0) + 1,
    ...req.body
  };
  tableData.push(newRow);
  res.status(201).json(newRow);
});

app.put('/api/data/:id', (req, res) => {
  const index = tableData.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    tableData[index] = { ...tableData[index], ...req.body };
    res.json(tableData[index]);
  } else {
    res.status(404).json({ error: 'Row not found' });
  }
});

app.delete('/api/data/:id', (req, res) => {
  const index = tableData.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    const deleted = tableData.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ error: 'Row not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
