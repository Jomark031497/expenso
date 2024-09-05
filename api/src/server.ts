import express from "express";

const main = async () => {
  const app = express();

  app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});
