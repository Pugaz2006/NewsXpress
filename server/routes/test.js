const express = require('express');
const newsRouter = require('./news'); // adjust path if needed

const app = express();
app.use('/api/news', newsRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
});
