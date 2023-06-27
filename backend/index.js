const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
var gtts = require('node-gtts')('en');
var fs = require('fs');
var path = require('path');
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.post('/speech', function(req, res) {
    const text = req.body.text
    gtts.save("audio.mp3", text, function(err, result){
        if(err) { throw new Error(err); }
        console.log("converted");
        fs.readFile("./audio.mp3", function(err, result) {
            res.send(result.toString("base64"));
          });
        }
    );
  })

app.listen(process.env.PORT, () => {
  console.log(`server listening at http://localhost:${process.env.PORT}`);
});
