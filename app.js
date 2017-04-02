var koa = require('koa');
//koa中间件
var controller = require('koa-route');
// var bodyParser = require('koa-bodyparser');
var koaBody = require('koa-body')();
var app = new koa();//需要new
// app.use(bodyParser());
//渲染模板
var views = require('co-views');
var render = views('./view', {//view是存放路径
	map: {html: 'ejs'}//模板引擎
});

//co-body
var parse = require('co-body');

/*mongodb-start*/
var mongoose = require('mongoose');
//连接
var db = mongoose.connect('mongodb://localhost/maplebookshop');//连接数据库
db.connection.on("error", function (error) {  console.log("数据库连接失败：" + error); }); 
db.connection.on("open", function () {  console.log("------数据库连接成功！------"); });
//创建模型
var Schema = mongoose.Schema;
//定义了一个新模型，但是该模型还未和user集合关联
/*User表start*/
var userSchema = new Schema({
	name: String,
	password: String
});
//model
var User = mongoose.model('user', userSchema);
//实体
var admin = new User({
	name: "lijunjin",
	password: "maple"
});
/*User表end*/
/*book表start*/
var bookSchema = new Schema({
	book_id: Number,
	word_count: Number,
 	score_count: Number,
 	title: String,
 	content: String,
 	tags: Array,
 	price: Number,
 	authors: String,
 	rights: String,
 	cover: String,
 	latest: String,
 	related_title: String,
 	related_cover: String,
 	author_title: String,
 	author_cover: String
});
var Book = mongoose.model('book', bookSchema);
/*book表end*/
/*search-start*/
var searchSchema = new Schema({
	rate_count: Number,
 	title: String,
 	cover: String,
 	source: Number,
 	rate: Number,
 	intro: String,
 	role: Array,
 	source_id: String,
 	id: Number
});
var Search = mongoose.model('search', searchSchema);
app.use(controller.get('/ajax/ljmsearch', function*(){
	var ls = new Search({
		rate_count: 0,
		title: "中华英雄123",
		cover: "http://cover.read.duokan.com/mfsv2/download/s010/p010C4EJ9R8u/UDKjOb6trKfegU.jpg!s",
		source: 1,
		rate: 0,
		intro: "香港漫画大师",
		role: ["作者","马荣威"],
		source_id: "7b516",
		id: 1013305
	});
	ls.save();
	this.body = yield Search.find({});
}));
/*search-end*/
app.use(controller.get('/ajax/ljm', function*(){
// 	var ljm = new Book({
// 	book_id: 18218,
// 	word_count: 70971,
//  	score_count: 113,
//  	title: "老九门",
//  	content: "【陈伟霆、张艺兴、赵丽颖主演，同名电视剧正在热播】民国时期，长沙车站开来一辆来历不明的火车，彻查发现来自一座深山中的百年矿山，因为常年开采导致地皮塌陷，矿山中弥漫着一股奇怪的浓雾，长沙老九门盗墓家族张家和红家经过了一番查探，发现了深埋矿山之下，有着另外一个秘密，经过一番探险，他们深入矿山之中，来到矿山的底部，看到了让人无法置信的景象。千年之前坠落的三颗陨石，长白山下埋藏的秘密，他们到底从矿山底部带出了什么东西，为何世界慢慢变的异样诡异？",
//  	tags: ["寻墓探险", "悬疑探险", "灵异"],
//  	price: 5,
//  	authors: "南派三叔",
//  	rights: "阅文集团旗下起点中文网",
//  	cover: "http://cover.read.duokan.com/mfsv2/download/fdsc3/p01TQfpyV6px/06EirDzmjj8zuK.jpg",
//  	latest: "第二十七章 缠斗",
//  	related_title: "食咒",
//  	related_cover: "http://cover.read.duokan.com/mfsv2/download/fdsc3/p01QivZjexs1/9FS6XpwmPq9ZxF.jpg",
//  	author_title: "盗墓笔记",
//  	author_cover: "http://cover.read.duokan.com/mfsv2/download/s010/p01FoJjh8xkR/gnLHnCbrfVNDtR.jpg!s"
// });
	// ljm.save();
	this.body = yield Book.find({});
	// console.log('ccccccc');
    // this.response.body = 'Hello World!';
}));



app.use(controller.get('/ajax/search', function*(){
	this.set('Cache-Control', 'no-cache');
	var querystring = require('querystring');
	var _this = this;
	var params = querystring.parse(this.req._parsedUrl.query);//将HTTPquerystring转化为obj形式
    var start = params.start;
    var end = params.end;
    var keyword = params.keyword;
	this.body = yield service.get_search_data(start, end, keyword);//因为异步返回，所以前面想要yield
}));









// var querystring = require('querystring');
// app.use(controller.get('/book', function*(){
// 	this.set('Cache-Control', 'no-cache');
//     var params = querystring.parse(this.req._parsedUrl.query);
//     var bookId = params.id;
// 	this.body = yield render('book', {nav: '书籍详情', bookId: bookId});
// }));

var querystring = require('querystring');
app.use(controller.get('/ajax/bookljm', function*(){
	this.set('Cache-Control', 'no-cache');
	var params = querystring.parse(this.req._parsedUrl.query);//将HTTPquerystring转化为obj形式
    var id = params.id;
    if(!id) {
    	id = "";//先给空的，到了下一层，就有给18218
    }
	this.body = service.get_book_data(id);
}));

app.use(controller.get('/ajax/mongoose', function*(){
	var user = new User({
		name: "pgg",
		password: "266"
	});
	// user.save();
	this.body = yield User.find({});
	// console.log('ccccccc');
    // this.response.body = 'Hello World!';
}));

app.use(controller.get('/mgo', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('mgo', {title: '数据库'});
}));











var co = require('co');
var thunkify = require('thunkify');
var find = thunkify(function () {
    User.find.apply(User, arguments)
});//apply可以指定作用域,能够扩充函数赖以运行的作用域
var findOne = thunkify(function () {
    User.findOne.apply(User, arguments)
});

module.exports = {
    model: User,
    addUser: function *(name, password) {
        var newUser = new User({
            name: name,
            password: password
        });
        co(function *() {
            try {
                yield newUser.save();
            } catch (err) {
                console.log(err);
            }
        });
    },
    thereIs: function *(name) {
        return co(function *() {
            try {
                var user = yield find({name: name});
                return !!user.length;
            } catch (err) {
                console.log(err);
            }
        })
    },
    pwRight: function *(name, password) {
        return co(function *() {
            try {
                var user = yield findOne({name: name});
                return user.password == password;
            } catch (err) {
                console.log(err);
            }
        })
    }

};

// function Login() {

// }

// Login.prototype.addUser = function *(next) {
//     var name = this.query.name;
//     var password = this.query.password;
//     if (!(yield User.thereIs(name))) {
//         yield User.addUser(name, password);
//         this.body = true;
//     } else {
//         this.body = false;
//     }
// };

// module.exports = new Login();

// app.use(controller.post('/addUser', function*(){
//     var name = this.query.name;
//     var password = this.query.password;
//     var thereIs = function *(name) {
//         return co(function *() {
//             try {
//                 var user = yield find({name: name});
//                 return !!user.length;
//             } catch (err) {
//                 console.log(err);
//             }
//         })
//     };
//     if (!(yield User.thereIs(name))) {
//         yield User.addUser(name, password);
//         this.body = true;
//     } else {
//         this.body = false;
//     }
// 	    console.log(username);
// 	    // debugger;
	    
// }));

/*mongodb-end*/
/*创建node服务*/
var http = require('http');
var server = http.createServer(function(req,res){
 if(req.url!=="/favicon.ico"){
  req.on('data',function(data){
   console.log("服务器接收到的数据：　"+decodeURIComponent(data));
  });
  req.on("end",function(){
   console.log('客户端请求数据全部接收完毕');
  });
  }
 res.end();
});



















/*中间跳转页*/
app.use(controller.post('/dologin', function*(){
	// var username = this.request.username || '',
	//     password = this.request.password || '';
	    var username = this.request.username,
	    password = this.request.password;
	    console.log(username);
	    // debugger;
	    console.log('sign with name: ${username}');
	    if (username == 'koa' && password == '123') {
	    	this.response.body = '<h1>Welcome, ${username}!</h1>';
	    } else {
	    	this.response.body = 'Login failed <p><a href="/sign">try again!</a></p>';
	    	// this.redirect('/sign');
	    }
}));
// 

// router.post('/signin', async (ctx, next) => {
//     var
//         name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     console.log(`signin with name: ${name}, password: ${password}`);
//     if (name === 'koa' && password === '12345') {
//         ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
//     } else {
//         ctx.response.body = `<h1>Login failed!</h1>
//         <p><a href="/">Try again</a></p>`;
//     }
// });

app.use(controller.get('/new', function*(){
	this.set('Cache-Control', 'no-cache');
	this.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
        debugger;
}));

app.use(controller.post('/signin', function*(){
	// this.set('Cache-Control', 'no-cache');
        var name = this.request.body.name || '';
        var password = this.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        this.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        this.response.body = `<h1>Login failed!</h1>
        <p><a href="/new">Try again</a></p>`;
    }
}));




app.use(controller.get('/regtest', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('regtest', {title: '测试提交'});
}));

app.use(controller.get('/home', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('home', {title: 'lijunjin', username: 'lijunjin'});
}));


// app.use(controller.get('/testmiddle', function*(){
// 	this.set('Cache-Control', 'no-cache');
// 	this.body = yield render('testmiddle', {title: '中间页面'});
// }));

app.use(controller.get('/ucenter', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('ucenter', {title: '测试提交'});
}));


//集成静态资源,中间件需要配置
var koa_static = require('koa-static-server');
app.use(koa_static({
	rootDir: './static/',//整个静态资源的目录
	rootPath: '/static',//URL上面的路径,即我们访问的目录，上面那个是查找静态资源的位置
	maxage: 0//指定缓存，因为静态文件有缓存周期，要指定过期时间，设置时间为0即不缓存

}));
var service = require('./service/webAppService.js');//引用的不是中间件，而是

app.use(controller.get('/route_test', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = 'hello koa from Sally!';
}));

app.use(controller.get('/ejs_test', function*(){//用来写页面的demo
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('test', {title: 'title_test'});//generator语言特性，异步回调，在es6里面,而promise是一种设计模式
}));

 
app.use(controller.get('/api_test', function*(){//'/api_test'叫做路由，其实就是代表你去访问的时候的路径组成
	this.set('Cache-Control', 'no-cache');
	this.body = service.get_test_data();
}));

app.use(controller.get('/', function*(){//不用任何路由，默认访问到首页
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('index', {title: '书城首页'});//generator语言特性，异步回调，在es6里面,而promise是一种设计模式
}));

app.use(controller.get('/search', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('search', {title: '搜索', nav: '搜索'});
}));

app.use(controller.get('/reader', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('reader');
}));

app.use(controller.get('/category', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('category', {title: '分类', nav: '分类'});
}));

app.use(controller.get('/rank', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('rank', {title: '排行', nav: '排行'});
}));

app.use(controller.get('/male', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('male', {title: '男榜', nav: '男生频道'});
}));

app.use(controller.get('/female', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('female', {title: '女榜', nav: '女生频道'});
}));

app.use(controller.get('/day', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('day', {title: '日签到', nav: '签到'});
}));

/*登录start*/
app.use(controller.get('/sign', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('sign', {title: '登录'});
}));
// app.use(controller.get('/regtest', function*(){
// 	this.set('Cache-Control', 'no-cache');
// 	this.body = "666";
// }));
app.use(controller.post('/dosign', koaBody, function*(){
	console.log("11");
	this.set('Cache-Control', 'no-cache');
	// var username = this.query.username;
	// var password = this.query.password;
	console.log(this.request.body);
	// this.body = yield render('sign', {title: '登录'});
	this.body = yield JSON.stringify(this.request.body);
}));
/*登录end*/
app.use(controller.get('/register', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('register', {title: '注册'});
}));

app.use(controller.get('/checkin', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('checkin', {title: '签到', nav: '签到'});
}));

app.use(controller.get('/catedetail', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('catedetail', {title: '目录', nav: '目录'});
}));

var querystring = require('querystring');
app.use(controller.get('/book', function*(){
	this.set('Cache-Control', 'no-cache');
    var params = querystring.parse(this.req._parsedUrl.query);
    var bookId = params.id;
	this.body = yield render('book', {nav: '书籍详情', bookId: bookId});
}));



//任务代码
// app.use(controller.get('/ajax/search', function*(){
// 	this.set('Cache-Control', 'no-cache');
// 	var querystring = require('querystring');
// 	var _this = this;
// 	var params = querystring.parse(this.req._parsedUrl.query);//将HTTPquerystring转化为obj形式
//     var start = params.start;
//     var end = params.end;
//     var keyword = params.keyword;
// 	this.body = yield service.get_search_data(start, end, keyword);//因为异步返回，所以前面想要yield
// }));

app.use(controller.get('/ajax/index', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = service.get_index_data();
}));

app.use(controller.get('/ajax/rank', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = service.get_rank_data();
}));

app.use(controller.get('/ajax/category', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = service.get_category_data();
}));

app.use(controller.get('/ajax/bookbacket', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = service.get_bookbacket_data();
}));

app.use(controller.get('/ajax/female', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = service.get_female_data();
}));

app.use(controller.get('/ajax/male', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = service.get_male_data();
}));
//书籍比较不一样，有id参数
var querystring = require('querystring');
app.use(controller.get('/ajax/book', function*(){
	this.set('Cache-Control', 'no-cache');
	var params = querystring.parse(this.req._parsedUrl.query);//将HTTPquerystring转化为obj形式
    var id = params.id;
    if(!id) {
    	id = "";//先给空的，到了下一层，就有给18218
    }
	this.body = service.get_book_data(id);
}));
//章节
app.use(controller.get('/ajax/chapter', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = service.get_chapter_data();
}));
//章节数据内容
app.use(controller.get('/ajax/chapter_data', function*(){
	this.set('Cache-Control', 'no-cache');
	var params = querystring.parse(this.req._parsedUrl.query);//将HTTPquerystring转化为obj形式
    var id = params.id;
    if(!id) {
    	id = "";//先给空的，到了下一层，就有给18218
    }
	this.body = service.get_chapter_content_data(id);
}));

app.use(controller.get('/ajax/check', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = service.get_check_data();
}));

app.use(controller.get('/ajax/catedetail', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = service.get_catedetail_data();
}));

/* GET home page. */
app.use(controller.get('/home', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = yield render('home', {title: '登录成功页', username: service.userList().username});
}));

app.use(controller.get('/userData', function*(){
	this.set('Cache-Control', 'no-cache');
	this.body = service.getLogin();
}));




app.listen(3005);
console.log("Koa server is started!");