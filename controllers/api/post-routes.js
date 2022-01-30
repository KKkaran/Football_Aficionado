const router = require('express').Router();
const {Users,Posts, Comments} = require('../../models')


//this will get all the posts
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
    .then(db=>res.json(db))
    .catch(er=>{
        console.log(er);
        res.status(500).json(er)
    })
})

//this will get a specific post
router.get('/:id',(req,res)=>{
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
    .then(db=>res.json(db))
    .catch(er=>{
        console.log(er);
        res.status(500).json(er)
    })
})

//this will create a new post
router.post('/',(req,res)=>{
    Posts.create({
        title:req.body.title,
        description:req.body.description,
        creator_id:req.body.creator_id
    })
    .then(db=>res.json({
        success:"post created successfully",
        data:{
            id:db.id,
            title:db.title,
        }
    }))
    .catch(er=>{
        console.log(er);
        res.status(500).json(er)
    })
})
//delete a post by id
router.get("/del/:id",(req,res)=>{
    console.log(req.params.id)
    //try to get all the comments and then delete them and then 
    //delete the post...
    Comments.findAll({
        where:{
            post_id:req.params.id
        }
    }).then(db=>{
        const comments = db.map(r=>r.get({plain:true}))
        const commentIds = comments.map(r=>r.id)
        console.log(commentIds)
        Comments.destroy({
            where:{
                id:commentIds
            }
        }).then(d=>{
            Posts.destroy({
                where:{
                    id:req.params.id
                }
            })
            .then(dbPostData => {
                if (!dbPostData) {
                  res.status(404).json({ message: 'No post found with this id' });
                  return;
                }
                res.render("dashboard")
              })
              .catch(err => {
                console.log(err);
                res.status(500).json(err);
              });
        })
        .catch(er=>{
            console.log(er);
            //res.status(500).json(er)
        })
    })
    .catch(er=>{
        console.log(er);
        //res.status(500).json(er)
    })





    
})
//updating/edit a post in DB
router.put("/:id",(req,res)=>{
    Posts.update({
        title:req.body.title,
        description:req.body.description
    },{
        where:{
            id:req.params.id
        }
    }).then(r=>res.json(r))
    .catch(er=>{
        console.log(er);
        res.status(500).json(er)
    })
})

router.get("/edit/:id",(req,res)=>{
    console.log(req.params.id)
    //from post id lets get the title and desc using seq and send the obj to handlebars for the view
    Posts.findOne({
        where:{
            id:req.params.id
        }
    })
    .then(db=>{
        const post = db.get({plain:true})
        console.log(post)
        res.render("editPost",{post})
    })
})


module.exports = router;