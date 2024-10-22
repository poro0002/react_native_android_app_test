import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt';
import xss from 'xss';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './schema.js'

dotenv.config();

const app = express();
const jwt_key = process.env.JWT_KEY;
const port = process.env.PORT;
const uri = process.env.MONGO_DB_URI;

app.use(cors({
  origin: '*', // Allow all origins for now (you can tighten this up later)
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// ----------------------------< Port Connection >---------------------------------------

app.listen(port, (err) => {
   if(err){
      console.log('error launching port', err)
      return
   } else{
      console.log(`listening on ${port}`)
   }

});


// ----------------------------< Database Connection >---------------------------------------

mongoose.connect(uri)
    .then(() => console.log('Connected to preferred MongoDB Database'))
      .catch(err => console.error('Error connection to MongoDB', err))


// ----------------------------< Register Route >---------------------------------------

app.post('/register', async (req, res) => {

const { username, email, pass} = req.body;




    // access the req.body.username/email
    // make sure the route is working properly with postman by sending test json data to the backend and handle it
try{
    // make sure there is no other account associated with those credentials
    const existingUser = await User.findOne({
              $or: [{ username }, { email }]
          });
//
//   if (existingUser) {
//              return res.status(409).json({ message: 'There is already an account associated with that username or email' });
//          }
if(!existingUser){
        const hashedPass = await bcrypt.hash(pass, 10) // (salt rounds) applies the hashing algorithm 10 times

              const newUser = await User.create({
                 username,
                 pass: hashedPass,
                 email,

              })

     return res.status(200).json({ message: 'Account successfully created' });
} else{
     return res.status(400).json({ message: 'there is another user with that username or email' });
}


    }catch(error){
       console.error('Error creating user', error);
       res.status(500).json({ message: 'error creating account' });
    }





    // use mongoose to create the new user in the mongo db
    // send a response object back with the intel that shows the account was either created successfully or not

})

// ----------------------------< Login Route >---------------------------------------

app.post('/login', async (req, res) => {

// now for the login logic we will be sent another body of input log values that we need to unpack
// we then need to compare this req.body input with the mongoose database
// if the username and password match, then the server has successfully found an account on the mongo database
// if not, we need to once again send a response error object back to the front end and display the message to the client
// telling them that their password or username was incorrect

    const { username, pass } = req.body;

    try {

        const userMatch = await User.findOne({ username });


        if (!userMatch) {
            return res.status(400).json({ message: 'Invalid username' });
        }


        const passwordMatch = await bcrypt.compare(pass, userMatch.pass);


        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }


       return res.status(200).json({
         message: 'User successfully logged in',
         username: req.body.username // Send the username back
       });

    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
});



