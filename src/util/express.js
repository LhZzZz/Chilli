const express = require('express');
const mysql = require('mysql');
const bordyPardse = require('body-parser');
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Lhz5453960@',
	database : 'bblog'
});

const app = express();
app.all('*',(rep,res,next)=>{
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	next();
});

//注册
app.get('/registe/:username/:password/:nickname',(request,response)=>{
	let params = request.params;
	try {
		connection.query('insert into user (username,password,nickname) values (?,?,?)',[params.username,params.password,params.nickname],(error,results,fields)=>{
			if (error){
				response.send({errCode:0})
			}else {
				response.send(results)
			}
		});
	}catch (e) {
		response.send({errCode:0})
	}
});
//登录
app.get('/login/:username',(request,response)=>{
	let params = request.params;
	try {
		connection.query('select password from user where username = ?',[params.username],(error,results,fields)=>{
			if (error){
				response.send({errCode:0})
			}else {
				response.send(results)
			}
		});
	}catch (e) {
		response.send({errCode:0})
	}
});
//获取用户信息
app.get('/posts/:username', function (req, res) {
	console.log(req.params.username);
	let params = req.params;
	try {
		connection.query(`SELECT * FROM user as us WHERE username = ?`,[params.username], function (error, results, fields) {
			if (error) {
				res.send({errCode:0})
			}else {
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
});
//获取用户自己的博文信息
app.get('/getUserBlog/:username', function (req, res) {
	console.log(req.params.username);
	let params = req.params;
	try {
		connection.query(`SELECT bl.id, bl.username, bl.text, bl.date, bl.liked, bl.comments,ll.likenum FROM blog as bl left join (select count(*) as likenum , blogid from likelist where likeorUsername != '' group by blogid) as ll on ll.blogid = bl.id  WHERE bl.username = ? order by bl.date DESC`,[params.username], function (error, results, fields) {
			if (error) {
				console.log(error)
				res.send({errCode:0})
			}else {
				console.log(results);
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
});
//获取所有博文
app.get('/getAllBlog/:username', function (req, res) {
	console.log(req.params.username);
	let params = req.params;
	try {
		connection.query(`SELECT bl.id,bl.username,bl.text,bl.date,bl.liked,bl.comments,us.nickname, ll.userlike FROM blog as bl join user as us left join (select count(likeorUsername) as userlike ,blogid  from likelist where likeorUsername = ? group by blogid) as ll on ll.blogid = bl.id  where us.username = bl.username order by bl.date DESC`,[params.username],function (error, results, fields) {
			if (error) {
				console.log(error);
				res.send({errCode:0})
			}else {
				console.log(results);
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
});
//删除博文
app.get('/deleteBlog/:username/:blogID', function (req, res) {
	console.log(req.params);
	let params = req.params;
	try {
		connection.query(`delete from blog  where username = ? and id = ?`,[params.username,params.blogID], function (error, results, fields) {
			if (error) {
				res.send({errCode:0})
			}else {
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
});
//新增博文
app.post('/addBlog/:username/:blogText/:date', function (req, res) {
	console.log(req.params);
	let params = req.params;
	try {
		connection.query(`insert into blog (username,text,date) values (?,?,?)`,[params.username,decodeURIComponent(params.blogText),params.date], function (error, results, fields) {
			if (error) {
				console.log(error);
				res.send({errCode:0})
			}else {
				console.log('新增了博客',results);
				connection.query('insert into likelist (blogID) values (?)',[results.insertId]);
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
})
//修改博文
app.post('/updateBlog/:blogID/:newText/:date', function (req, res) {
	console.log(req.params);
	let params = req.params;
	try {
		connection.query(`update blog set text = ?, date = ? where id = ? `,[decodeURIComponent(params.newText),params.date,params.blogID], function (error, results, fields) {
			if (error) {
				console.log(error);
				res.send({errCode:0})
			}else {
				console.log('update',results);
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
});
//获取评论
app.get('/getComments/:blogID', function (req, res) {
	let params = req.params;
	try {
		connection.query(`SELECT * FROM comments WHERE blogid = ? order by date DESC`,[params.blogID], function (error, results, fields) {
			if (error) {
				console.log('err',error);
				res.send({errCode:0})
			}else {
				// console.log(results);
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
});
//删除评论

//TODO点赞
app.get('/likeBlog/:blogID/:username', function (req, res) {
	let params = req.params;
	try {
		connection.query(`insert into likelist (blogid ,likeorUsername) values (?,?) `,[params.blogID,params.username], function (error, results, fields) {
			if (error) {
				console.log('err',error);
				res.send({errCode:0})
			}else {
				console.log(results);
				//更新点赞数
				connection.query('update blog set liked = liked + 1 where id = ?',[params.blogID]);
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
});
//TODO取消赞
app.get('/dislikeBlog/:blogID/:username', function (req, res) {
	let params = req.params;
	try {
		connection.query(`delete from likelist where blogid = ? and likeorUsername = ? `,[params.blogID,params.username], function (error, results, fields) {
			if (error) {
				console.log('err',error);
				res.send({errCode:0})
			}else {
				console.log(results);
				//更新点赞数
				connection.query('update blog set liked = liked - 1 where id = ?',[params.blogID]);
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
});
//新增评论
app.post('/addComment/:blogID/:commentor/:author/:comments/:date',function (req,res) {
	let params = req.params;
	try {
		connection.query(`insert  into comments (blogid,commentor,author,comments,date) values(?,?,?,?,?)`,
			[params.blogID,params.commentor,params.author,params.comments,params.date],
			function (error, results, fields) {
			if (error) {
				console.log('err',error);
				res.send({errCode:0})
			}else {
				// console.log(results);
				connection.query('update blog set comments = comments + 1 where id = ?',[params.blogID]);
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
});
//添加(修改)回复
app.post('/addReply/:commentID/:reply', function (req, res) {
	console.log(req.params);
	let params = req.params;
	try {
		connection.query(`update comments set reply = ? where id = ?`,[decodeURIComponent(params.reply), params.commentID], function (error, results, fields) {
			if (error) {
				res.send({errCode:0})
			}else {
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
})

//搜索用户
app.get('/searchUser/:username',(request,response)=>{
	let params = request.params;
	let filter = '%'+params.username+'%';
	try {
		connection.query('select * from user where username like ?',[filter],(error,results,fields)=>{
			if (error){
				console.log(error)
				response.send({errCode:0})
			}else {
				response.send(results)
			}
		});
	}catch (e) {
		response.send({errCode:0})
	}
});

//搜索博文
app.get('/SearchAllBlog/:username/:searchText', function (req, res) {
	let params = req.params;
	var filter = '%'+params.searchText+'%';
	try {
		connection.query(`SELECT bl.id,bl.username,bl.text,bl.date,bl.liked,bl.comments,us.nickname, ll.userlike FROM blog as bl join user as us left join (select count(likeorUsername) as userlike ,blogid  from likelist where likeorUsername = ? group by blogid) as ll on ll.blogid = bl.id  where us.username = bl.username and bl.text like ? order by bl.date DESC`,[params.username,filter],function (error, results, fields) {
			if (error) {
				console.log(error);
				res.send({errCode:0})
			}else {
				console.log(results);
				res.send(results);
			}
		});
	}catch (e) {
		res.send({errCode:0})
	}
});



app.listen(3001, () => {
	console.log('Go to http://localhost:3001/posts to see posts');
});
