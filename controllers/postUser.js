const user = require('../database/models/User');

module.exports = (req,res) => {
    // Because we set app.use to use bodyParser this will be stored as JSON object
    user.create(req.body,(error,user) => {
        if (error) {
            // Grab error array and pull description of errors as an array
            // - The nice thing here is that it pulls the error message from the User schema required string :)
            let errors=["General error. Please try again."];
            try {
                errors = !error.errors ? [error.message] :Object.keys(error.errors).map(key => error.errors[key].message);
            } catch(e) {      
                console.log('[controller > postUser.js]:',e);
            }
            // Store in req object middleware 'flash' that we have errors in a new property called 'registrationErrors' - this is only valid for one cycle, doesn't persist. 
            req.flash('registrationErrors',errors);
            // Let's also store any data provided so we can reload
            req.flash('data',req.body);
            // 'return' ensures that return back to page without executing further code
            return res.redirect('/auth/register')
        }
        res.redirect('/auth/login');
    });
}