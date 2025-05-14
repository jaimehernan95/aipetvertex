// server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Remove the mockData import and recommendation endpoint
// Add any real API endpoints you need here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});