const router = require('express').Router();
const { Comments } = require('../../models');

router.get('/', (req, res) => {
    Comments.findAll()
    .then(db=>res.json(db))
    .catch(er=>{
        console.log(er);
        res.status(400).json(er)
    })
});

router.post('/', (req, res) => {
    Comments.create({
        comment_text: req.body.comment_text,
        user_id: req.body.user_id,
        post_id: req.body.post_id
      })
        .then(dbCommentData => res.json({
          success:"good",
          dbCommentData:dbCommentData
        }))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
});

router.delete('/:id', (req, res) => {
    Comments.destroy({
      where:{
        id:req.params.id
      }
    })
    .then(r=>res.json(r))
    .catch(er=>{
      console.log(er)
      res.status(500).json(er)
    })
});

module.exports = router;