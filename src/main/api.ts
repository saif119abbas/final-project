import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const port = Number(process.env.PORT ?? "3000");
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
