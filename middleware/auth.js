const user = require('../database/models/User');

module.exports = async (req,res,next) => {
    try {
        // If no session Id, then redirect to login
        if (typeof req.session.userId === 'undefined') {
            return res.redirect('/auth/login');
        }
        // fetch user from DB
        const {id} = await user.findById(req.session.userId);
        if (!id) {
            return res.redirect('/auth/login');
        }
        next()
    } catch(e) {
        console.log('[controller > auth.js]:',e);
        res.redirect('/auth/login');
        next()
    }
}