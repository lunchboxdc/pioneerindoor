var request = require('request');
var async = require('async');
var fs = require('fs');
var FacebookPost = require('../persistence/models/facebookPost');

module.exports = {
    getPosts: function() {
        try {
            if(!process.env.FB_TOKEN) {
                console.error("FB_TOKEN environment variable missing!");
            } else {
                console.debug('FacebookService: getting posts.');
                request({
                    url: 'https://graph.facebook.com/v2.3/PioneerIndoor/posts',
                    qs: {limit: 10, fields: 'from,name,story,message,description,caption,picture,link,type,status_type,attachments'},
                    method: 'get',
                    headers: {
                        "Authorization": process.env.FB_TOKEN
                    }
                }, function(error, response, body){
                    if(error) {
                        console.error(error.stack);
                    } else {
                        var json = JSON.parse(body);
                        async.each(json.data, function(post, callback) {
                            var story = post.story ? post.story.toLowerCase() : '';
                            if(story.indexOf("profile picture")<0 && story.indexOf("cover photo")<0 && story.indexOf("shared")<0) {
                                var facebookPost = new FacebookPost();
                                facebookPost.postId = post.id;
                                facebookPost.fromName = post.from.name;
                                facebookPost.name = post.name;
                                facebookPost.story = post.story;
                                facebookPost.message = post.message;
                                facebookPost.picture = post.picture;
                                facebookPost.link = post.link;
                                facebookPost.description = post.description;
                                facebookPost.caption = post.caption;
                                facebookPost.type = post.type;
                                facebookPost.status_type = post.status_type;
                                facebookPost.created_time = post.created_time;

                                try {
                                    facebookPost.attachmentImage = post.attachments.data[0].media.image.src;
                                } catch (e) {
                                }

                                facebookPost.save(function (err) {
                                    if (err) {
                                        if (err.code !== 11000) {
                                            console.error(err.message);
                                        }
                                    } else {
                                        console.info('FacebookService: added post.');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }
    },
    getProfilePicture: function() {
        if(!process.env.FB_TOKEN) {
            console.error("FB_TOKEN environment variable missing!");
        } else {
            console.debug('FacebookService: getting profile picture.');
            var uri = 'https://graph.facebook.com/v2.3/PioneerIndoor/picture';
            request.head(uri, function(err, res, body) {
                request(uri).pipe(fs.createWriteStream(__dirname+'/../assets/image/fbPicture.jpg')).on('close', function() {
                    console.info('FacebookService: updated profile picture');
                });
            });
        }
    }
}

/*async.waterfall([
    function(next) {
        request({
            url: 'https://graph.facebook.com/v2.3/PioneerIndoor/posts',
            qs: {limit: 7, fields: 'from,name,story,message,description,caption,picture,link,type'},
            method: 'get',
            headers: {
                "Authorization": process.env.FB_TOKEN
            }
        }, next);
    },
    function(response, body, next) {
        var json = JSON.parse(body);
        console.log(json);
        next();
    },
    function() {

    }
], function(err, result) {
    console.log('finished');
});*/

/*FacebookPost.find({})
    .sort({created_time: 'desc'})
    .exec(function(err, facebookPosts) {
        if (err) {
            console.error(err);
        } else {
            console.log('finished facebook posts find sorted desc');
            async.each(facebookPosts, function(post) {
                console.log("iteration of find all facebook posts sorted by date desc");
            });
        }
});*/
