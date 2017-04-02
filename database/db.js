var mongoose = require('mongoose');
//连接
var db = mongoose.connect('mongodb://localhost/maplebookshop');//连接数据库
db.connection.on("error", function (error) {  console.log("数据库连接失败：" + error); }); 
db.connection.on("open", function () {  console.log("------数据库连接成功！------"); });
//创建模型
var Schema = mongoose.Schema;
var userSchema = new Schema({
	name: String,
	password: String
});//定义了一个新模型，但是次模型还未和user集合关联
// exports.user = db.model('user', userSchema);//与user集合关联
//model
var User = mongoose.model('user', userSchema);
//实体
var newUser = new User({
	name: "penny",
	password: "456"
});



