module.exports = (req,res,next) => {
    console.log(`I am executed before getting about page '${req.url}`);
    next();
}