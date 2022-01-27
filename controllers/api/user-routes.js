const router = require('express').Router();
const {Users, Posts, Comments} = require('../../models')


router.get('/session',(req,res)=>{

    if(req.session.loggedIn){
        res.status(200).json({
            data:{
                id:req.session.user_id,
                username:req.session.username,
                loggedIn:true
            }
        })
    }else{
        res.status(400).json({
            data:"guest user"
        })
    }
})
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
    .then(db=>
        {
            console.log(db)
            req.session.save(() => {
                req.session.user_id = db.id;
                req.session.username = db.username;
                req.session.loggedIn = true;
                
                res.json({
                    success:"user created successfully",
                    data:{
                        id:db.id,
                        username:db.username,
                        email:db.email
                    }});
            })
        }
    )
    .catch(er=>{
        console.log(er);
        res.status(500).json(er)
    })
})
//this will check the user credentials
router.post('/login',(req,res)=>{
    console.log("in login route")
    
    const email = req.body.email;
    const password = req.body.password

    console.log(req.body)
    Users.findOne({
        where:{
            email:email
        }
    })
    .then(db=>{
        if(!db){
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
        if(!db.checkPassword(password)){
            res.status(401).json({ message: 'Incorrect password!' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = db.id;
            req.session.username = db.username;
            req.session.loggedIn = true;
            
            res.json({message: 'You are now logged in!' });
        })
    })
})

module.exports = router;