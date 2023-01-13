const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const totp = require('totp-generator')

const app = express();
app.use(cors())

app.get('/', (req, res) => {
    console.log(req.query)
    const { weight, hash, dustbinId, } = req.query;
    const now = Date.parse(new Date());
    const otp = totp(hash, { timestamp: now });
    console.log(otp)
    const token = jwt.sign({ weight }, otp)
    console.log(token)
    return res.send({ token, dustbinId, timeStamp: now })
})

app.listen('4001', () => console.log("Running on 4001"))