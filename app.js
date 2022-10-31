const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { logParser } = require("./utils/logParser");
const fileUpload = require("express-fileupload");
const path = require ("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

dotenv.config({
  path: "./opt/.env",
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

app.post("/logParser", logParser);

// Deployment

__dirname=path.resolve();
if(process.env.NODE_ENV==="production"){
app.use(express.static("client/build"))
}else{
  app.get("/",(req,res)=>{
    res.send("Api is running...")
  })
}
