const express = require("express");
const app = express();
const { sendSMS } = require('./sms');
const { git, regex } = require('./constant');
// start firebase config
const admin = require("firebase-admin");
const credentials = require("./key.fiebase.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials)
})
const db = admin.firestore();
// end firebase 

app.use((req, res, next) => {
  express.json({
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf.toString();
    },
  })(req, res, (err) => { if (err) { res.status(400).send('error parsing data'); return; } next(); });
});

app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => { err ? res.sendStatus(400) : next() })

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log("Server running on port " + PORT));



app.get("/", (req, res, next) => res.sendStatus(400));

// (POST) CreateNewAccessCode
app.post("/create", (req, res, next) => handlePostCreate(req, res, next))

// (POST) ValidateAccessCode
app.post("/validate", (req, res, next) => handlePostValidate(req, res, next))

// (GET) searchGithubUsers
app.get("/users", (req, res, next) => handleGetUsers(req, res, next));

// (GET) findGithubUserProfile
app.get("/user/:userID", (req, res, next) => handleGetUserById(req, res, next));

//(POST) likeGithubUser
app.post("/like", (req, res, next) => handlePostLike(req, res, next));

// (GET) getUserProfile
app.get("/profile", (req, res, next) => handleGetUserProfileByPhoneNumber(req, res, next));

// Function here
async function handlePostCreate(req, res, next) {
  try {
    console.log(req);
    let { phoneNumber } = req.body;
    if (phoneNumber) {
      if (phoneNumber.match(regex)) {
        let digitNumber = Math.floor(100000 + Math.random() * 900000);
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '84' + phoneNumber.slice(0, 1)
        }
        const phoneJson = {
          phoneNumber: phoneNumber,
          digitNumber: digitNumber
        }
        const resp = await db.collection('account').doc(phoneNumber).set(phoneJson);
        // console.log(resp);
        const message = "Your code is " + digitNumber;
        sendSMS(phoneNumber, 'github search app', message);
        res.sendStatus(200)
      } else {
        res.status(400).send('your phone number is not valid');
      }
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  };
}

async function handlePostValidate(req, res, next) {
  try {
    let { accessCode, phoneNumber } = req.body;
    if (accessCode && phoneNumber) {
      if (phoneNumber.match(regex)) {
        if (accessCode.toString().match(`^[0-9]{6}$`)) {
          const userRef = db.collection('account').doc(phoneNumber);
          const resp = await userRef.get();
          if (resp) {
            if (accessCode == resp.data().digitNumber) {
              res.sendStatus(200);
            }
            else {
              res.status(400).send('your validation code is wrong!')
            }
          } else {
            res.sendStatus(404);
          }
        }
        else {
          res.status(400).send('your validation code is not valid');
        }
      } else {
        res.status(400).send('your phone number is not valid');
      }
    }
    else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  };
}

async function handleGetUsers(req, res, next) {
  try {
    console.log(req);
    let { q } = req.query;
    fetch(git.search + q).then(
      (resp) => resp.json()).then(
        (data) => {
          console.log(data);
          res.status(200).send(data)
        }
      ).catch((error) => {
        res.sendStatus(400);
      });
  }
  catch (err) {
    console.log(err);
    res.sendStatus(400);
  };
}

async function handleGetUserById(req, res, next) {
  try {
    let userID = req.params.userID;
    fetch(git.user + userID).then(
      (resp) => resp.json()).then(
        (data) => {
          console.log(data);
          res.status(200).send(data);
        }
      ).catch((error) => {
        console.error('Error:', error);
        res.sendStatus(400);
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  };
}

async function handlePostLike(req, res, next) {
  try {
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  };
}

async function handleGetUserProfileByPhoneNumber(req, res, next) {
  try {
    let { phone } = req.query;
    // fetch(git.user + userID).then(
    //   (resp) => resp.json()).then(
    //     (data) => {
    //       console.log(data);
    //       res.status(200).send(data);
    //     }
    //   ).catch((error) => {
    //     console.error('Error:', error);
    //     res.sendStatus(500);
    //   });
    res.status(200).send({ phone: phone })
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  };
}
