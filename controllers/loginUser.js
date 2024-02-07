const user = require('../database/models/User');
const bcrypt = require('bcrypt');

module.exports = async (req,res) => {
    try {
        // try to find user
        const {email, password} = req.body; 
        const dbRecord = await user.findOne({email});
        if (dbRecord === null) {
            req.flash('loginErrors',["Email does not exist. Please try again"]);
            req.flash('data',req.body);
            return res.redirect('/auth/login');
        }
        // compare user password
        if (dbRecord.email) {
            const checkPassword = await bcrypt.compare(password, dbRecord.password);
            // if user password is correct, then login
            if (checkPassword)  {
                // Works with express session middleware to store id (as mongoDB id) in req.session and is therefore accessible from any route
                req.session.userId = dbRecord._id.toString();
                req.session.username = dbRecord.username;
                return res.redirect('/');
            }
            // If invalid password
            req.flash('loginErrors',["Incorrect password. Please try again"]);
            req.flash('data',req.body);
            return res.redirect('/auth/login');
        }
        // else redirect user back to login
        req.flash('loginErrors',["General errors. Please try again"]);
        res.redirect('/auth/login');
    } catch(e) {
        console.log('[controller > loginUser.js]:',e);
        req.flash('loginErrors',["General errors. Please try again"]);
        res.redirect('/auth/login');
    }
}   