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
        }
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
router.delete("/:id",(req,res)=>{
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
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
})
module.exports = router;