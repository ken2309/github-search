require('dotenv').config();
const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET_KEY
})

// const from = "Vonage APIs"
// const to = "84927094946"
// const text = ''

async function sendSMS(to, froms, text) {
    let from = froms ?? "DBK APIs";
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); return true })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); return false});
}

// sendSMS();
module.exports = {
  sendSMS: sendSMS
}