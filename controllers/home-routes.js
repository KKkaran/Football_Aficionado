const router = require('express').Router()
const {Users, Posts, Comments} = require('../models')

router.get('/',(req,res)=>{
    let name = 'Guest';
    console.log("*****************************\n")
    console.log(req.session.username);
    console.log("\n****************************")
    if(req.session.username) name = req.session.username;
    
    Posts.findAll(
        {
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
        const posts2 = {
            post: posts,
            user:req.session.username,
            login:req.session.loggedIn
        }
        res.render('homepage', {posts2});
        console.log(posts)
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
                model:Posts
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
        const posts = db.get({plain:true})
        res.json({
            posts:posts.posts
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
        res.render('single-post', {post});
        console.log(post)
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