var request = require('request');
var async = require('async');
var fs = require('fs');
var FacebookPost = require('../persistence/models/facebookPost');

module.exports = {
    getPosts: function() {
        try {
            if (!process.env.FB_TOKEN) {
                console.error("FB_TOKEN environment variable missing!");
            } else {
                console.debug('FacebookService: getting posts.');
                request({
                    url: 'https://graph.facebook.com/v2.3/PioneerIndoor/posts',
                    qs: {limit: 10, fields: 'from,name,story,message,description,caption,picture,link,type,status_type,attachments,object_id'},
                    method: 'get',
                    headers: {
                        "Authorization": process.env.FB_TOKEN
                    }
                }, function(error, response, body) {
                    if (error) {
                        console.error(error.stack);
                    } else {
                        FacebookPost.find({}).exec(function(err, facebookPosts) {
                            if (err) {
                                res.send(err);
                            } else {
                                var posts = JSON.parse(body).data;

                                for (var i = 0; i < facebookPosts.length; i++) {
                                    var keepPost = false;
                                    for (var t = 0; t < posts.length; t++) {
                                        if (posts[t].id === facebookPosts[i]._id) {
                                            keepPost = true;
                                            break;
                                        }
                                    }
                                    if (!keepPost) {
                                        FacebookPost.remove({_id: facebookPosts[i]._id}, function(err) {
                                            if (err) {
                                                res.send(err);
                                            } else {
                                                res.json({message: 'Deleted old facebook post'});
                                            }
                                        });
                                    }
                                }

                                async.each(posts, function(post) {
                                    var story = post.story ? post.story.toLowerCase() : '';
                                    if (story.indexOf("profile picture") < 0 && story.indexOf("cover photo") < 0 && story.indexOf("shared") < 0) {
                                        var facebookPost = {
                                            fromName: post.from.name,
                                            name: post.name,
                                            story: post.story,
                                            picture: post.picture,
                                            link: post.link,
                                            description: post.description,
                                            caption: post.caption,
                                            type: post.type,
                                            status_type: post.status_type,
                                            created_time: post.created_time
                                        };

                                        if (post.message) {
                                            var maxChars = 140;
                                            var message;
                                            if (/\s/.test(post.message.charAt(maxChars))) {
                                                var lastCharIndex = maxChars;
                                                for (var i = maxChars; i > -1; i--) {
                                                    if (!/\s/.test(post.message.charAt(i-1))) {
                                                        lastCharIndex = i;
                                                        break;
                                                    }
                                                }
                                                message = post.message.substr(0, lastCharIndex);
                                            } else {
                                                var nextSpaceIndex;
                                                for (var i = maxChars; i < post.message.length; i++) {
                                                    var char = post.message.charAt(i);
                                                    if (/\s/.test(char)) {
                                                        nextSpaceIndex = i;
                                                        break;
                                                    }
                                                }

                                                message = post.message.substr(0, nextSpaceIndex);
                                            }

                                            if (!post.object_id) {
                                                post.object_id = post.id.substring(post.id.indexOf('_') + 1, post.id.length);
                                            }

                                            facebookPost.message = message + '... <a href="https://www.facebook.com/PioneerIndoor/posts/' + post.object_id + '" target="_blank">See More</a>';
                                        }

                                        try {
                                            facebookPost.attachmentImage = post.attachments.data[0].media.image.src;
                                        } catch (e) {
                                        }

                                        FacebookPost.findOneAndUpdate({
                                            _id: post.id
                                        }, facebookPost, {upsert: true}, function(err, post) {
                                            if (err) {
                                                console.error(err);
                                            } else {
                                                console.debug('FacebookService: upserted post.');
                                            }
                                        });
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
            request.head(uri, function() {
                request(uri).pipe(fs.createWriteStream(__dirname+'/../assets/image/fbPicture.jpg')).on('close', function() {
                    console.debug('FacebookService: updated profile picture');
                });
            });
        }
    }
};

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
