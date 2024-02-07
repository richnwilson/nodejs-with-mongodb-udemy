const post = require('../database/models/Post');

module.exports = async (req,res) => {
    try {
        // Post schema has a 'link' to userObj that once populated below will store the user Id object of the person who created the post
        const posts = await post.find({}).populate('userObj');
        res.render('index', {
            posts
        })
    } catch(e) {
        console.log('[controller > homepage.js]:',e);
        res.render('/');
    }
}