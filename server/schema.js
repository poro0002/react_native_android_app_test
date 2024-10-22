// This schema is being use one-to-one relationship with embedded documents in the server code
// as all the user information is stored within a single document in the database.
// the schema has to be exact to the data being parsed

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    pass: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    collection: 'mobile-users'  // This ensures the data is stored in the 'mobile-users' collection
});

const User = mongoose.model('User', userSchema);

export default User;