const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const recommend = require('./recommender');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/recommend', (req, res) => {
  const { prompt } = req.body;
  const recommendation = recommend(prompt);
  res.json(recommendation);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
