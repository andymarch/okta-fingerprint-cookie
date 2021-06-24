const express = require('express')
const pkce = require('@okta/okta-auth-js')
var cookieParser = require('cookie-parser')
var cors = require('cors');

app = express()
app.use(cookieParser())
app.use(cors({ credentials: true }));
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
  }));

app.get("/fingerprint", async function(req,res) {
    try{
        var verifier = pkce.pkce.generateVerifier()
        res.cookie('__Secure-fingerprint',verifier, { maxAge: 900000, httpOnly: true, secure: true, sameSite: 'strict'  });
        res.status(200).send({verifier:verifier});
    } catch(error){
        console.log(error)
        res.status(500).send("An error occurred")
    }
})

app.get("/test",async function (req,res){
    console.log(req.headers)
    var verifier = req.cookies["__Secure-fingerprint"]
    var challenge = await pkce.pkce.computeChallenge(verifier)

    res.status(200).send()
})

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log('Fingerprint started on '+PORT))