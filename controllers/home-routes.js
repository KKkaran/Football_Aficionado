const router = require('express').Router()
const {Users, Posts, Comments} = require('../models')
const moment = require("moment");

router.get('/',(req,res)=>{
    let name = 'Guest';
    console.log("*****************************\n")
    console.log(req.session.username);
    console.log("\n****************************")
    if(req.session.username) name = req.session.username;
    
    Posts.findAll(
        {   
            order:[['updatedAt','DESC']],
            include:[
                {
                    model:Users,
                    attributes:['username'],
                    foreignKey:'id'
                },
                {
                    model:Comments,
                    foreignKey:'user_id',
                    attributes:['comment_text'],
                    include:[
                        {
                            model:Users,
                            foreignKey:'id',
                            attributes:['username']
                        }
                    ]
                }
            ]
        }
    )
    .then(db=>{
        const posts = db.map(r=>r.get({plain:true}))
        const updatedPosts = posts.map(r=>{
            r.date = require("moment")(r.createdAt).format("LLLL")
        })
        const posts2 = {
            post: posts,
            user:req.session.username,
            login:req.session.loggedIn
        }
        res.render('homepage', {posts2});
        console.log(posts2)

    })
})
router.get('/users/:id',(req,res)=>{
    console.log("in specif users dashboard")
    Users.findOne({
        where:{
            id: req.params.id
        },
        
        include:[
            {
                model:Posts,
                order:[['createdAt','DESC']],
            },
            {
                model:Comments,
                include:[
                    {
                        model:Posts
                    }
                ]
            }
        ]
    })
    .then(db=>{
        console.log(db)
        const posts = db.get({plain:true})
        const postss = posts.posts;
        console.log(posts.username)
        postss.map(r=>{
             r.date = require("moment")(r.createdAt).format("LLLL")
        })
        
        console.log(postss)
        res.json({
            posts:postss.reverse(),
            username:posts.username
        })
    })
})
router.get('/singlePost/:id',(req,res)=>{
    
    if(!req.session.loggedIn){
        res.render('login')
        return
    }
    Posts.findOne({
        where:{
            id: req.params.id
        },
        include:[
            {
                model:Users,
                attributes:['username'],
                foreignKey:'id'
            },
            {
                model:Comments,
                foreignKey:'user_id',
                attributes:['comment_text'],
                include:[
                    {
                        model:Users,
                        foreignKey:'id',
                        attributes:['username']
                    }
                ]
                
            }
        ]
    })
    .then(db=>{
        const post = db.get({plain:true})
        // const g = post.map(r=>{
        //     r.date = require("moment")(r.createdAt).format("LLLL")
        // })
        const ggg = post.createdAt;
        post.date = require("moment")(ggg).format("LLLL")
        const updatedPost = {
            post:post,
            userId:req.session.user_id
        }
        res.render('single-post', {updatedPost});
        console.log(updatedPost)
    })
    .catch(er=>{
        console.log(er);
        res.status(500).json(er)
    })
})
router.get('/logout',(req,res)=>{
    if(req.session.loggedIn){
        req.session.destroy(()=>{
            res.render("login")
            return
        })
    }
    res.render('login')
})
router.get('/dashboard',(req,res)=>{
    
    if(!req.session.loggedIn){
        res.render('login')
        return
    }
    res.render('dashboard')
 
})

module.exports = router;