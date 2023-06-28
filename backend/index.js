const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
var gtts = require('node-gtts')('en');
var fs = require('fs');
var path = require('path');
const app = express();

dotenv.config();
app.use(express.json());
var allowedOrigins = ['http://localhost:3000',
                      'https://tts-translator.vercel.app/'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

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
