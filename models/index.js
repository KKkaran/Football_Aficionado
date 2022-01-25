const Users = require('./Users')
const Posts = require('./Posts')


Users.hasMany(Posts,{
    foreignKey:'creator_id'
})

Posts.belongsTo(Users,{
    foreignKey:'creator_id'
})

module.exports = {Users,Posts}