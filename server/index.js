
const express = require("express");
const cors = require("cors");
const newsRouter = require("./routes/news");

const app = express();
app.use(cors());
app.use("/api/news", newsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
