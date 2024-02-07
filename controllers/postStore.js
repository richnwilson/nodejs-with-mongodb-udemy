const post = require('../database/models/Post');

module.exports = (req,res) => {
    // Because we set app.use to use bodyParser this will be stored as JSON object
    post.create({
            ...req.body,
            userObj: req.session.userId
        },(error,post) => {
        if (error) {
            let errors=["General error. Please try again."];
            try {
                errors = !error.errors ? [error.message] :Object.keys(error.errors).map(key => error.errors[key].message);
            } catch(e) {        
                console.log('[controller > postStore.js]:',e);
            }
            // Store in req object middleware 'flash' that we have errors in a new property called 'registrationErrors' - this is only valid for one cycle, doesn't persist. 
            req.flash('postErrors',errors);
            // Let's also store any data provided so we can reload
            req.flash('data',req.body);            
            // return ensures that return back to page without executing further code
            return res.redirect('/post/new');
        }
        res.redirect('/');
    });
}