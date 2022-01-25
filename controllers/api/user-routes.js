const router = require('express').Router();
const {Users, Posts, Comments} = require('../../models')


//this will get all the users
router.get('/',(req,res)=>{

    Users.findAll({
        attributes:{
            exclude:['password']
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
    .then(db=>res.json(db))
    .catch(er=>{
        console.log(er);
        res.status(500).json(er)
    })

})

//this will get a specific user
router.get('/:id',(req,res)=>{
    Users.findOne({
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

//this will create a new user
router.post('/',(req,res)=>{
    Users.create({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    })
    .then(db=>res.json({
        success:"user created successfully",
        data:{
            id:db.id,
            username:db.username,
            email:db.email
        }
    }))
    .catch(er=>{
        console.log(er);
        res.status(500).json(er)
    })
})

module.exports = router;