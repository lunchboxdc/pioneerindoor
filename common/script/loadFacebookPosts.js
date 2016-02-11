var FacebookPost = require('../../persistence/models/facebookPost');

var jsonPosts = [
    {
        "_id": "564e88000b858d084a9f28d1",
        "attachmentImage": "https://external.xx.fbcdn.net/safe_image.php?d=AQBmfIT9qR66KYc9&w=720&h=720&url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FGUCs8_qO_Sg%2Fmaxresdefault.jpg&cfs=1",
        "created_time": "2015-11-20T02:35:04+0000",
        "status_type": "shared_story",
        "type": "video",
        "caption": "youtube.com",
        "description": "Montage of footage that was shot during Pioneer Indoor tryouts in 2016. http://www.pioneerindoordrums.org Video by http://www.reelcake.com Thanks to Martin E...",
        "link": "https://youtu.be/GUCs8_qO_Sg",
        "picture": "https://external.xx.fbcdn.net/safe_image.php?d=AQDRkGTNRvlNLFPc&w=130&h=130&url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FGUCs8_qO_Sg%2Fmaxresdefault.jpg&cfs=1",
        "message": "The beginning Of P10!!",
        "name": "Pioneer Indoor 2016 Audition Teaser",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1029458343773195",
        "__v": 0
    },
    {
        "_id": "564e80f90b858d084a9f28b6",
        "attachmentImage": "https://external.xx.fbcdn.net/safe_image.php?d=AQBmfIT9qR66KYc9&w=720&h=720&url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FGUCs8_qO_Sg%2Fmaxresdefault.jpg&cfs=1",
        "created_time": "2015-11-20T02:03:04+0000",
        "status_type": "shared_story",
        "type": "video",
        "caption": "youtube.com",
        "description": "Montage of footage that was shot during Pioneer Indoor tryouts in 2016. http://www.pioneerindoordrums.org Video by http://www.reelcake.com Thanks to Martin E...",
        "link": "https://youtu.be/GUCs8_qO_Sg",
        "picture": "https://external.xx.fbcdn.net/safe_image.php?d=AQDRkGTNRvlNLFPc&w=130&h=130&url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FGUCs8_qO_Sg%2Fmaxresdefault.jpg&cfs=1",
        "message": "Reel Cake made this awesome video of our 2016 auditions - check it out! #PioIndoor2016",
        "name": "Pioneer Indoor 2016 Audition Teaser",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1029447800440916",
        "__v": 0
    },
    {
        "_id": "5648e4400b858d084a9f1329",
        "attachmentImage": "https://scontent.xx.fbcdn.net/hphotos-xpf1/t31.0-8/s720x720/12240860_1027530260632670_8146253600827260086_o.jpg",
        "created_time": "2015-11-15T19:51:17+0000",
        "status_type": "added_photos",
        "type": "photo",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.453304324721936.83977562.450744598311242/1027530260632670/?type=3",
        "picture": "https://scontent.xx.fbcdn.net/hphotos-xlf1/v/t1.0-0/s130x130/12240028_1027530260632670_8146253600827260086_n.jpg?oh=9bfb5d7b68879529ce14ae4a7b08bbd6&oe=56B7FB0D",
        "message": "Another fantastic weekend for Pio Indoor 2016! 81 talented musicians auditioned for the ensemble and we could not be more excited for the season.",
        "name": "Timeline Photos",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1027530260632670",
        "__v": 0
    },
    {
        "_id": "564548d09b46aa795b108ec7",
        "attachmentImage": "https://external.xx.fbcdn.net/safe_image.php?d=AQAN6gq5y6P38OT0&w=720&h=720&url=https%3A%2F%2Fscontent-ord1-1.xx.fbcdn.net%2Fhphotos-xap1%2Ft31.0-8%2F12244399_1026207460764950_4764563646670393850_o.jpg&cfs=1",
        "created_time": "2015-11-13T02:15:01+0000",
        "status_type": "shared_story",
        "type": "link",
        "caption": "pioneerindoordrums.org",
        "description": "Pioneer Indoor is a two-time silver medalist WGI Independent Open indoor percussion ensemble.",
        "link": "https://www.pioneerindoordrums.org/",
        "picture": "https://external.xx.fbcdn.net/safe_image.php?d=AQApTRGmWNGWLAeh&w=130&h=130&url=https%3A%2F%2Fscontent-ord1-1.xx.fbcdn.net%2Fhphotos-xap1%2Ft31.0-8%2F12244399_1026207460764950_4764563646670393850_o.jpg&cfs=1",
        "message": "Round 2 of #PioIndoor2016 auditions - Saturday, November 14.\n\nAre you ready? Because we are.",
        "name": "Pioneer Indoor | Home",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1026207950764901",
        "__v": 0
    },
    {
        "_id": "563fc1309b46aa795b107962",
        "created_time": "2015-11-08T21:34:14+0000",
        "status_type": "added_photos",
        "type": "photo",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.674562519262781.1073741827.450744598311242/1024476144271415/?type=3",
        "picture": "https://fbcdn-photos-d-a.akamaihd.net/hphotos-ak-xfp1/v/t1.0-0/s130x130/12193771_1024476144271415_5800000350440652665_n.jpg?oh=1fe233c71f515c08961b630a32c38b9a&oe=56B3267C&__gda__=1459090861_7b9d88260df829991bedf8da953f0f2d",
        "message": "Biggest turnout ever for our first audition day of the 2016 season! We're humbled by the level of talent that chooses to audition for our ensemble each year. An incredible start to our 10th anniversary season!",
        "story": "Pioneer Indoor Percussion Ensemble added 15 new photos.",
        "name": "Photos from Pioneer Indoor Percussion Ensemble's post",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1024476890938007",
        "__v": 0
    },
    {
        "_id": "563d12799b46aa795b106ded",
        "attachmentImage": "https://scontent.xx.fbcdn.net/hphotos-xta1/v/t1.0-9/s720x720/12189009_1023577711027925_4132435101092074204_n.jpg?oh=bc46211c7ad0e5a5a325755615500df9&oe=56B51004",
        "created_time": "2015-11-06T20:42:11+0000",
        "status_type": "added_photos",
        "type": "photo",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.453304324721936.83977562.450744598311242/1023577711027925/?type=3",
        "picture": "https://fbcdn-photos-e-a.akamaihd.net/hphotos-ak-xta1/v/t1.0-0/s130x130/12189009_1023577711027925_4132435101092074204_n.jpg?oh=afdf7c365fe567f7e04098c8feffdec8&oe=56C93411&__gda__=1454677358_5c7b79351739af36a0a05559e9ea2631",
        "message": "It's almost time...\n\nhttps://www.pioneerindoordrums.org/",
        "name": "Timeline Photos",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1023577711027925",
        "__v": 0
    },
    {
        "_id": "563508a91d04af1d779c7477",
        "attachmentImage": "https://external.xx.fbcdn.net/safe_image.php?d=AQAm8AyF91amGv_K&w=720&h=720&url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FOUXaEJOIYcY%2Fhqdefault.jpg&cfs=1",
        "created_time": "2015-10-31T18:23:01+0000",
        "status_type": "shared_story",
        "type": "video",
        "caption": "youtube.com",
        "description": "Spiritum Ipsum",
        "link": "https://www.youtube.com/watch?v=OUXaEJOIYcY",
        "picture": "https://external.xx.fbcdn.net/safe_image.php?d=AQBka8Q9hUd6DI24&w=130&h=130&url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FOUXaEJOIYcY%2Fhqdefault.jpg&cfs=1",
        "message": "\"In a graveyard, one night...\"\n\nHappy Halloween from Pio Indoor!",
        "name": "Pioneer Indoor 2014",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1020755131310183",
        "__v": 0
    },
    {
        "_id": "563419981d04af1d779c7147",
        "attachmentImage": "https://external.xx.fbcdn.net/safe_image.php?d=AQB9IygfMZtGidRs&w=720&h=720&url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F69Nm40rKbX4%2Fhqdefault.jpg&cfs=1",
        "created_time": "2015-10-31T01:21:00+0000",
        "status_type": "shared_story",
        "type": "video",
        "caption": "youtube.com",
        "description": "Get some Halloween costume inspiration from these WGI shows! Check out these shows and more on the WGI Zone! wgizone.com",
        "link": "https://youtu.be/69Nm40rKbX4",
        "picture": "https://external.xx.fbcdn.net/safe_image.php?d=AQCQfsmEnVai5f-d&w=130&h=130&url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F69Nm40rKbX4%2Fhqdefault.jpg&cfs=1",
        "message": "Check out the opening feature of the WGI Sport of the Arts 2015 Halloween video! It's pretty spooooOoooOoooky...",
        "name": "Happy Halloween from WGI!",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1020737401311956",
        "__v": 0
    },
    {
        "_id": "5622a410760b846f09479cc1",
        "attachmentImage": "https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/p720x720/12096186_1015018188550544_4314887390132598765_n.jpg?oh=3ec2d96d94a9ac819703656ccf4e3fa9&oe=56872686",
        "created_time": "2015-10-17T19:36:46+0000",
        "status_type": "added_photos",
        "type": "photo",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.674562519262781.1073741827.450744598311242/1015018188550544/?type=3",
        "picture": "https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-0/p130x130/12096186_1015018188550544_4314887390132598765_n.jpg?oh=3ecc0b79bbcc167f468f5904ed892d49&oe=56CAA493",
        "message": "Three weeks and counting! Come drum with us on November 7 and audition for #PioIndoor2016.\n\nRegister at http://www.pioneerindoordrums.org",
        "name": "Mobile Uploads",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1015018188550544",
        "__v": 0
    },
    {
        "_id": "561993c0760b846f094781a8",
        "attachmentImage": "https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/p720x720/12112081_1012183552167341_1288652792623710_n.jpg?oh=7d3f87f90565fb1866bb6fbb10f1d9c8&oe=56CC1B8C",
        "created_time": "2015-10-10T22:35:10+0000",
        "status_type": "added_photos",
        "type": "photo",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.674562519262781.1073741827.450744598311242/1012183552167341/?type=3",
        "picture": "https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-0/q84/p130x130/12112081_1012183552167341_1288652792623710_n.jpg?oh=aa4d10a3459f92ed1bc495521be49f08&oe=56D17830",
        "message": "Just a friendly reminder from #PioIndoor2016 - make sure you hug a drummer today!",
        "name": "Mobile Uploads",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1012183552167341",
        "__v": 0
    },
    {
        "_id": "560d8e6943ef7cde28b60cf1",
        "attachmentImage": "https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s720x720/12033161_1008272745891755_1270157720486538380_n.jpg?oh=da9a64a3fe621c564f19f25bf67c9759&oe=56858178",
        "created_time": "2015-10-01T19:41:55+0000",
        "status_type": "added_photos",
        "type": "photo",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.453304324721936.83977562.450744598311242/1008272745891755/?type=3",
        "picture": "https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-0/s130x130/12033161_1008272745891755_1270157720486538380_n.jpg?oh=37a4705bd6932b0c76fa321474e107dc&oe=5698616D",
        "message": "The 10th anniversary season of Pioneer Indoor is just around the corner!\n\nRegister online to audition on November 7 and be a part of #PioIndoor2016 - https://www.pioneerindoordrums.org/",
        "name": "Timeline Photos",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1008272745891755",
        "__v": 0
    },
    {
        "_id": "5606ca60ae4f0d064936d3df",
        "created_time": "2015-09-26T16:30:14+0000",
        "status_type": "shared_story",
        "type": "link",
        "caption": "www.pioneerindoordrums.org",
        "link": "http://www.pioneerindoordrums.org/auditions",
        "message": "Your to-do list this weekend:\n1. Practice\n2. Register for #PioIndoor2016 auditions\n3. Practice more\n\nRegister for 2016 auditions at http://www.pioneerindoordrums.org/auditions",
        "name": "www.pioneerindoordrums.org",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1006102552775441",
        "__v": 0
    },
    {
        "_id": "5601f03128590e2074344b3d",
        "attachmentImage": "https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s720x720/12042958_1002059283179768_2320498728441431369_n.jpg?oh=28bc19004f5be17fbf50ccf9d7130a91&oe=56A2425A",
        "created_time": "2015-09-23T00:15:01+0000",
        "status_type": "added_photos",
        "type": "photo",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.453304324721936.83977562.450744598311242/1002059283179768/?type=3",
        "picture": "https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-0/s130x130/12042958_1002059283179768_2320498728441431369_n.jpg?oh=d1a5339bab80cf27503bfe5e6934eb2b&oe=569A144F",
        "message": "On Twitter? So are we! Follow #PioIndoor2016 at https://twitter.com/pioneer_indoor.",
        "name": "Timeline Photos",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1002059283179768",
        "__v": 0
    },
    {
        "_id": "55fc7b51674ef8ac3ebaea36",
        "attachmentImage": "https://fbexternal-a.akamaihd.net/safe_image.php?d=AQB5fqtJa3EwJM2z&w=720&h=720&url=http%3A%2F%2Fi.ytimg.com%2Fvi%2Fi7Z2iRsDx8I%2Fmaxresdefault.jpg&cfs=1&sx=12&sy=0&sw=720&sh=720",
        "created_time": "2015-09-18T20:59:01+0000",
        "status_type": "shared_story",
        "type": "video",
        "caption": "youtube.com",
        "description": "Bettery Every Day!",
        "link": "https://www.youtube.com/watch?v=i7Z2iRsDx8I&feature=youtu.be",
        "picture": "https://fbexternal-a.akamaihd.net/safe_image.php?d=AQAPXNiDkaDgPKom&w=130&h=130&url=http%3A%2F%2Fi.ytimg.com%2Fvi%2Fi7Z2iRsDx8I%2Fmaxresdefault.jpg&cfs=1&sx=12&sy=0&sw=720&sh=720",
        "message": "Are you ready to be undeniable? Register for #PioIndoor2015 auditions at https://www.pioneerindoordrums.org/audition. See you on November 7!",
        "name": "Pioneer Indoor 2016",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1002082596510770",
        "__v": 0
    },
    {
        "_id": "55fb22c9aff57e88572b5896",
        "attachmentImage": "https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/s720x720/12036388_1001506893235007_5795031945554552647_n.jpg?oh=01f0f9423e3e928a62cf508f74528746&oe=56A979AC",
        "created_time": "2015-09-17T20:26:01+0000",
        "status_type": "added_photos",
        "type": "photo",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.453304324721936.83977562.450744598311242/1001506893235007/?type=1",
        "picture": "https://fbcdn-photos-d-a.akamaihd.net/hphotos-ak-xat1/v/t1.0-0/s130x130/12036388_1001506893235007_5795031945554552647_n.jpg?oh=ded9a7d640967f6810fd1bdba34b082f&oe=569DFCB9&__gda__=1453130770_fd8d0146e18cc803e882680cfc91c9b7",
        "message": "HUGE NEWS: Our brand new website is live and registration for 2016 auditions is now open! Check it out and tell your friends! https://www.pioneerindoordrums.org/",
        "name": "Timeline Photos",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_1001506893235007",
        "__v": 0
    },
    {
        "_id": "55f90ec1d047a5a4255ff122",
        "attachmentImage": "https://scontent.xx.fbcdn.net/hphotos-xft1/v/t1.0-9/s720x720/11895940_986738688045161_2308757234672793550_n.jpg?oh=e5c9e2489d631f092462c2f7c3c82690&oe=56628161",
        "created_time": "2015-08-21T19:44:00+0000",
        "status_type": "added_photos",
        "type": "photo",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.453304324721936.83977562.450744598311242/986738688045161/?type=1",
        "picture": "https://scontent.xx.fbcdn.net/hphotos-xft1/v/t1.0-0/s130x130/11895940_986738688045161_2308757234672793550_n.jpg?oh=c27904222580a64026a9a9a85ccba051&oe=56A47D9E",
        "message": "The countdown to Pioneer Indoor 2016 begins!",
        "name": "Timeline Photos",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_986738688045161",
        "__v": 0
    },
    {
        "_id": "55fc92c1674ef8ac3ebaea75",
        "attachmentImage": "https://scontent.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/11870723_982038528515177_4572327812126353580_n.jpg?oh=a7f2db37a363246d23704db12f91a0f5&oe=569A9DB2",
        "created_time": "2015-08-13T19:47:50+0000",
        "status_type": "added_photos",
        "type": "photo",
        "caption": "Congrats to all of our 2015 members who marched an outstanding season of DCI tour this summer! We can't wait to see you on November 7!",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.982038435181853.1073741830.450744598311242/982038528515177/?type=1",
        "picture": "https://fbcdn-photos-f-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-0/p130x130/11870723_982038528515177_4572327812126353580_n.jpg?oh=56ca6c6aab08d8f1b9c9cb3a1b1e85c0&oe=56AAEA3C&__gda__=1452890795_d499b5277f583ef008ead643239ba703",
        "message": "Congrats to all of our 2015 members who marched an outstanding season of DCI tour this summer! We can't wait to see you on November 7!",
        "story": "Pioneer Indoor Percussion Ensemble added 12 new photos to the album: Pioneer Indoor in DCI, 2015.",
        "name": "Pioneer Indoor in DCI, 2015",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_982038528515177",
        "__v": 0
    },
    {
        "_id": "55f90ec1d047a5a4255ff123",
        "attachmentImage": "https://scontent.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/11870723_982038528515177_4572327812126353580_n.jpg?oh=a7f2db37a363246d23704db12f91a0f5&oe=569A9DB2",
        "created_time": "2015-08-13T19:47:50+0000",
        "status_type": "added_photos",
        "type": "photo",
        "caption": "Congrats to all of our 2015 members who marched an outstanding season of DCI tour this summer! We can't wait to see you on November 7!",
        "link": "https://www.facebook.com/PioneerIndoor/photos/a.982038435181853.1073741830.450744598311242/982038528515177/?type=1",
        "picture": "https://fbcdn-photos-f-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-0/p130x130/11870723_982038528515177_4572327812126353580_n.jpg?oh=56ca6c6aab08d8f1b9c9cb3a1b1e85c0&oe=56AAEA3C&__gda__=1452890795_d499b5277f583ef008ead643239ba703",
        "message": "Congrats to all of our 2015 members who marched an outstanding season of DCI tour this summer! We can't wait to see you on November 7!",
        "story": "Pioneer Indoor Percussion Ensemble added 12 new photos to the album: Pioneer Indoor in DCI, 2015.",
        "name": "Pioneer Indoor in DCI, 2015",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_982054005180296",
        "__v": 0
    },
    {
        "_id": "55f90ec1d047a5a4255ff124",
        "created_time": "2015-05-29T02:43:05+0000",
        "status_type": "shared_story",
        "type": "link",
        "caption": "pehsband.wix.com",
        "description": "http://pehsband.wix.com/chiperccamp",
        "link": "http://pehsband.wix.com/chiperccamp",
        "message": "http://pehsband.wix.com/chiperccamp",
        "name": "pehsband.wix.com",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_940433356009028",
        "__v": 0
    },
    {
        "_id": "55f90ec1d047a5a4255ff125",
        "attachmentImage": "https://external.xx.fbcdn.net/safe_image.php?d=AQBHMhpJEgaDTMag&w=720&h=720&url=https%3A%2F%2Fwww.facebook.com%2Fads%2Fimage%2F%3Fd%3DAQIjV9CvSqPX_HLr3RuWTS08HspMdoKgRCCQ6cfqw6glN44VOqNYt1WRUiz7cIGFy8nuWoWUE026pqnRUpIun71nifBMCFOcew4hE37UxGd8Zl0sv556T23TgBqA5CsDF-0pt5bAEy_sgxOoPLbP542p&cfs=1",
        "created_time": "2015-04-14T20:05:03+0000",
        "status_type": "shared_story",
        "type": "video",
        "caption": "youtube.com",
        "description": "WGI World Competition, Dayton Ohio, 2015 Drum circle",
        "link": "https://www.youtube.com/watch?feature=youtu.be&v=d7fw_1MDbLg&app=desktop",
        "picture": "https://external.xx.fbcdn.net/safe_image.php?d=AQCA28mAJIgFiF_p&w=130&h=130&url=https%3A%2F%2Fwww.facebook.com%2Fads%2Fimage%2F%3Fd%3DAQIjV9CvSqPX_HLr3RuWTS08HspMdoKgRCCQ6cfqw6glN44VOqNYt1WRUiz7cIGFy8nuWoWUE026pqnRUpIun71nifBMCFOcew4hE37UxGd8Zl0sv556T23TgBqA5CsDF-0pt5bAEy_sgxOoPLbP542p&cfs=1",
        "message": "Look who made a special appearance at the WGI Sport of the Arts drum circle after finals... #PioIndoor2015 #DoTheJellyfish",
        "name": "WGI Drumcircle2015",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_920173928034971",
        "__v": 0
    },
    {
        "_id": "55f90ec1d047a5a4255ff126",
        "attachmentImage": "https://fbexternal-a.akamaihd.net/safe_image.php?d=AQDLM98qwA2b6_8Q&w=720&h=720&url=http%3A%2F%2Fi.ytimg.com%2Fvi%2FXk3EJi7Y8vE%2Fhqdefault.jpg&cfs=1",
        "created_time": "2015-04-13T03:33:06+0000",
        "status_type": "shared_story",
        "type": "video",
        "caption": "youtube.com",
        "description": "Pioneer Indoor 2015 Production In To The Deep Silver Medalists in Independent Open Class www.pioneerindoordrums.org",
        "link": "https://www.youtube.com/watch?v=Xk3EJi7Y8vE&feature=youtu.be",
        "picture": "https://fbexternal-a.akamaihd.net/safe_image.php?d=AQArripLS9TZO01b&w=130&h=130&url=http%3A%2F%2Fi.ytimg.com%2Fvi%2FXk3EJi7Y8vE%2Fhqdefault.jpg&cfs=1",
        "message": "https://www.youtube.com/watch?v=Xk3EJi7Y8vE&feature=youtu.be",
        "name": "Pioneer Indoor 2015 WGI FINALS",
        "fromName": "Pioneer Indoor Percussion Ensemble",
        "postId": "450744598311242_919222448130119",
        "__v": 0
    }
];

AdminUser.remove({}, function(err) {
    if (err) {
        res.send(err);
    } else {
        console.log('successfully deleted posts');
        jsonPosts.forEach(function(post) {
            var facebookPost = new FacebookPost();
            facebookPost.postId = post.id;
            facebookPost.fromName = post.fromName;
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
                facebookPost.attachmentImage = attachmentImage;
            } catch (e) {
            }

            facebookPost.save(function (err) {
                if (err) {
                    if (err.code !== 11000) { //duplicate entry - let these go, we don't need to be saving the same posts
                        console.error(err.message);
                    }
                } else {
                    console.info('FacebookService: added post.');
                }
            });
        });
    }
});

