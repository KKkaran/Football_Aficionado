const router = require('express').Router()
const {Users, Posts, Comments} = require('../models')

router.get('/',(req,res)=>{
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
        res.render('homepage', {posts});
        console.log(posts)
    })
})

router.get('/singlePost/:id',(req,res)=>{
    
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
module.exports = router;