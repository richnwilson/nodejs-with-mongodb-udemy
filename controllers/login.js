module.exports = (req,res) => {
    res.render('login', {
        errors: req.flash("loginErrors"),
        data: req.flash('data')[0]
    });
}