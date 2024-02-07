const post = require('../database/models/Post');

module.exports = async (req,res) => {
    try {
        const thisPost = await post.findById(req.params.id);
        res.render('post', {
            thisPost
        });
    } catch(e) {
        console.log('[controller > getPost.js]:',e);
        res.render('/');
    }
}