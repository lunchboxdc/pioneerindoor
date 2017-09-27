var request = require('request-promise');
var Promise = require('bluebird');
var fs = require('fs');
var moment = require('moment');
var PiDAO = require('../persistence/PiDAO');

const facebookApiUrl = 'https://graph.facebook.com/v2.10/PioneerIndoor';

module.exports = {
    getPosts: function() {
        var fbPosts;
        var mysqlPosts;

        return request({
                url: facebookApiUrl + '/posts',
                qs: {limit: 10, fields: 'created_time,from,name,story,message,description,caption,picture,link,type,status_type,attachments,object_id'},
                method: 'get',
                headers: {
                    "Authorization": process.env.FB_TOKEN
                }
            })
            .then(function(result) {
                fbPosts = JSON.parse(result).data;
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
                            .thenReturn('Removed facebook post --> facebookId: ' + mysqlPosts[i].id);

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
                                .thenReturn('Updated post --> facebookId: ' + fbPosts[i].id);
                        } else {
                            task = PiDAO.insertFacebookPost(facebookPost)
                                .thenReturn('Inserted post --> facebookId: ' + fbPosts[i].id);
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
            var uri = facebookApiUrl + '/picture';
            request.head(uri, function() {
                request(uri).pipe(fs.createWriteStream(__dirname+'/../assets/image/fbPicture.jpg')).on('close', function() {
                    console.debug('FacebookService: updated profile picture');
                });
            });
        }
    }
};