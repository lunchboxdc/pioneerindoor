if(!process.env.FB_TOKEN) {
    console.error("FB_TOKEN environment variable missing!");
    process.exit();
}

var request = require('request');
var _ = require('lodash');
var mongoose = require('mongoose');
var FacebookPost = require('../persistence/models/facebookPost');

mongoose.connect('mongodb://localhost/pi');

request({
    url: 'https://graph.facebook.com/v2.3/PioneerIndoor/posts',
    qs: {limit: 7, fields: 'from,name,story,message,description,caption,picture,link,type'},
    method: 'get',
    headers: {
        "Authorization": process.env.FB_TOKEN
    }
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        var json = JSON.parse(body);
        _.each(json.data, function(post) {
            var facebookPost = new FacebookPost();
            facebookPost.postId = post.id;
            facebookPost.name = post.name;
            facebookPost.story = post.story;
            facebookPost.message = post.message;
            facebookPost.picture = post.picture;
            facebookPost.link = post.link;
            facebookPost.type = post.type;
            facebookPost.created_time = post.created_time;
            facebookPost.save(function(err) {
                if (err) {
                    if(err.code!==11000) {
                        console.log(err.message);
                    }
                } else {
                    console.log("successfully added post");
                }
            });
        });
    }
});