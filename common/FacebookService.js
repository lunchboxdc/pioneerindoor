var mongoose = require('mongoose');
var request = require('request-promise');
var Promise = require('bluebird');
var async = require('async');
var fs = require('fs');
var moment = require('moment');
var PiDAO = require('../persistence/PiDAO');
var FacebookPost = require('../persistence/models/facebookPost');

mongoose.Promise = Promise;

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
                                                console.error(err);
                                            } else {
                                                console.debug('Deleted old facebook post');
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
                                            if (post.message.length > maxChars) {
                                                if (/\s/.test(post.message.charAt(maxChars))) {
                                                    var lastCharIndex = maxChars;
                                                    for (var i = maxChars; i > -1; i--) {
                                                        if (!/\s/.test(post.message.charAt(i - 1))) {
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
                                            } else {
                                                facebookPost.message = post.message;
                                            }
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


    getPostsTest: function() {
        var fbPosts;
        var mysqlPosts;

        return request({
                url: 'https://graph.facebook.com/v2.3/PioneerIndoor/posts',
                qs: {limit: 10, fields: 'from,name,story,message,description,caption,picture,link,type,status_type,attachments,object_id'},
                method: 'get',
                headers: {
                    "Authorization": process.env.FB_TOKEN
                }
            })
            .then(function(result) {
                fbPosts = JSON.parse(result).data;
                return FacebookPost.find({}).exec();
            })
            .then(function(mongoPosts) {
                var tasks = [];

                for (var i = 0; i < mongoPosts.length; i++) {
                    var keepPost = false;
                    for (var t = 0; t < fbPosts.length; t++) {
                        if (fbPosts[t].id === mongoPosts[i]._id) {
                            keepPost = true;
                            break;
                        }
                    }
                    if (!keepPost) {
                        var task = FacebookPost
                            .remove({_id: mongoPosts[i]._id})
                            .exec()
                            .thenReturn('Removed facebook post (mongo) --> _id: ' + mongoPosts[i]._id);

                        tasks.push(task);
                    }
                }

                return Promise.all(tasks);
            })
            .then(function(results) {
                if (results) {
                    for (var i = 0; i < results.length; i++) {
                        console.info(results[i]);
                    }
                }

                var tasks = [];

                for (var i = 0; i < fbPosts.length; i++) {
                    var story = fbPosts[i].story ? fbPosts[i].story.toLowerCase() : '';
                    if (story.indexOf("profile picture") < 0 && story.indexOf("cover photo") < 0 && story.indexOf("shared") < 0) {
                        var facebookPost = {
                            fromName: fbPosts[i].from.name,
                            name: fbPosts[i].name,
                            story: fbPosts[i].story,
                            picture: fbPosts[i].picture,
                            link: fbPosts[i].link,
                            description: fbPosts[i].description,
                            caption: fbPosts[i].caption,
                            type: fbPosts[i].type,
                            status_type: fbPosts[i].status_type,
                            created_time: fbPosts[i].created_time
                        };

                        var tmpMessage = fbPosts[i].message;
                        if (tmpMessage) {
                            var maxChars = 140;
                            var message;
                            if (fbPosts[i].message.length > maxChars) {
                                if (/\s/.test(fbPosts[i].message.charAt(maxChars))) {
                                    var lastCharIndex = maxChars;
                                    for (var j = maxChars; j > -1; j--) {
                                        if (!/\s/.test(fbPosts[i].message.charAt(j - 1))) {
                                            lastCharIndex = j;
                                            break;
                                        }
                                    }
                                    message = fbPosts[i].message.substr(0, lastCharIndex);
                                } else {
                                    var nextSpaceIndex;
                                    for (var j = maxChars; j < fbPosts[i].message.length; j++) {
                                        var char = fbPosts[i].message.charAt(j);
                                        if (/\s/.test(char)) {
                                            nextSpaceIndex = j;
                                            break;
                                        }
                                    }

                                    message = fbPosts[i].message.substr(0, nextSpaceIndex);
                                }

                                if (!fbPosts[i].object_id) {
                                    fbPosts[i].object_id = fbPosts[i].id.substring(fbPosts[i].id.indexOf('_') + 1, fbPosts[i].id.length);
                                }

                                facebookPost.message = message + '... <a href="https://www.facebook.com/PioneerIndoor/posts/' + fbPosts[i].object_id + '" target="_blank">See More</a>';
                            } else {
                                facebookPost.message = fbPosts[i].message;
                            }
                        }

                        try {
                            facebookPost.attachmentImage = fbPosts[i].attachments.data[0].media.image.src;
                        } catch (e) {
                        }

                        var task = FacebookPost
                            .findOneAndUpdate({_id: fbPosts[i].id}, facebookPost, {upsert: true})
                            .exec()
                            .thenReturn('Upserted post (mongo) --> _id: ' + fbPosts[i].id);

                        tasks.push(task);
                    }
                }

                return Promise.all(tasks);
            })
            .then(function(results) {
                if (results) {
                    for (var i = 0; i < results.length; i++) {
                        console.info(results[i]);
                    }
                }

                return PiDAO.getFacebookPosts();
            })
            .then(function(result) {
                mysqlPosts = result;

                var tasks = [];

                for (var i = 0; i < mysqlPosts.length; i++) {
                    var keepPost = false;
                    for (var t = 0; t < fbPosts.length; t++) {
                        if (fbPosts[t].id === mysqlPosts[i].facebookId) {
                            keepPost = true;
                            break;
                        }
                    }
                    if (!keepPost) {
                        var task = PiDAO
                            .deleteFacebookPost(mysqlPosts[i].id)
                            .thenReturn('Removed facebook post (mysql) --> facebookId: ' + mysqlPosts[i].id);

                        tasks.push(task);
                    }
                }

                return Promise.all(tasks);
            })
            .then(function(results) {
                if (results) {
                    for (var i = 0; i < results.length; i++) {
                        console.info(results[i]);
                    }
                }

                var tasks = [];

                for (var i = 0; i < fbPosts.length; i++) {
                    var story = fbPosts[i].story ? fbPosts[i].story.toLowerCase() : '';
                    if (story.indexOf("profile picture") < 0 && story.indexOf("cover photo") < 0 && story.indexOf("shared") < 0) {
                        var createdTime = moment(fbPosts[i].created_time).format("YYYY-MM-DD HH:mm:ss");
                        var facebookPost = {
                            facebookId: fbPosts[i].id,
                            from: fbPosts[i].from.name,
                            type: fbPosts[i].type,
                            statusType: fbPosts[i].status_type,
                            name: fbPosts[i].name,
                            link: fbPosts[i].link,
                            picture: fbPosts[i].picture,
                            caption: fbPosts[i].caption,
                            story: fbPosts[i].story,
                            description: fbPosts[i].description,
                            createdTime: createdTime
                        };

                        var tmpMessage = fbPosts[i].message;
                        if (tmpMessage) {
                            var maxChars = 140;
                            var message;
                            if (fbPosts[i].message.length > maxChars) {
                                if (/\s/.test(fbPosts[i].message.charAt(maxChars))) {
                                    var lastCharIndex = maxChars;
                                    for (var j = maxChars; j > -1; j--) {
                                        if (!/\s/.test(fbPosts[i].message.charAt(j - 1))) {
                                            lastCharIndex = j;
                                            break;
                                        }
                                    }
                                    message = fbPosts[i].message.substr(0, lastCharIndex);
                                } else {
                                    var nextSpaceIndex;
                                    for (var j = maxChars; j < fbPosts[i].message.length; j++) {
                                        var char = fbPosts[i].message.charAt(j);
                                        if (/\s/.test(char)) {
                                            nextSpaceIndex = j;
                                            break;
                                        }
                                    }

                                    message = fbPosts[i].message.substr(0, nextSpaceIndex);
                                }

                                if (!fbPosts[i].object_id) {
                                    fbPosts[i].object_id = fbPosts[i].id.substring(fbPosts[i].id.indexOf('_') + 1, fbPosts[i].id.length);
                                }

                                facebookPost.message = message + '... <a href="https://www.facebook.com/PioneerIndoor/posts/' + fbPosts[i].object_id + '" target="_blank">See More</a>';
                            } else {
                                facebookPost.message = fbPosts[i].message;
                            }
                        }

                        try {
                            facebookPost.attachmentImage = fbPosts[i].attachments.data[0].media.image.src;
                        } catch (e) {
                        }

                        var postId;
                        for (var j = 0; j < mysqlPosts.length; j++) {
                            if (mysqlPosts[j].facebookId == fbPosts[i].id) {
                                postId = mysqlPosts[j].id;
                                break;
                            }
                        }

                        var task;
                        if (postId) {
                            task = PiDAO.updateFacebookPost(facebookPost, postId)
                                .thenReturn('Updated post (mysql) --> facebookId: ' + fbPosts[i].id);
                        } else {
                            task = PiDAO.insertFacebookPost(facebookPost)
                                .thenReturn('Inserted post (mysql) --> facebookId: ' + fbPosts[i].id);
                        }

                        tasks.push(task);
                    }
                }

                return Promise.all(tasks);
            })
            .then(function(result) {
                if (result) {
                    for (var i = 0; i < result.length; i++) {
                        console.info(result[i]);
                    }
                }
            });
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