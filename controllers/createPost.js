module.exports = (req,res) => {
    if (req.session.userId) {
        return res.render('create',{
            errors: req.flash('postErrors'),
            data: req.flash('data')[0]
        });
    }
    res.redirect('/auth/login');
}