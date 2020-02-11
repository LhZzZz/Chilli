import React, { Component } from 'react';
import '../css/ContentPage.css';
const moment = require('moment');

class ContentPage extends Component {
	constructor(props){
		super(props);
		this.state={
			selectIndex:1,//1代表是主页2代表是浏览
			addNew:false,//是否要写新博客
			replayIndex:-1
		}
	}

	componentDidMount() {
		var username = this.props.location.state.username;
		//获取用户信息
		fetch(`http://localhost:3001/posts/${username}`,{
			mode:'cors'
		}).then(response=>response.json()).then(res=>{
			this.setState(res[0]);
		})
		//获取用户博客信息
		fetch(`http://localhost:3001/getUserBlog/${username}`,{
			mode:'cors'
		}).then(response=>response.json()).then(res=>{
			console.log('blogs',res);
			this.setState({
				blogs:res
			});
		})

		//TODO 获取用户博客内容
	}

	mouseover(){
		this.setState({onMouseOver:true})
	}
	mouseleave(){
		this.setState({onMouseOver:false})
	}


	setSearchText(e){
		console.log(e.target.value);
		this.setState({
			searchText:e.target.value
		})
	}

	Search(){
		if (this.state.searchText&&this.state.searchText!==''){
			var username = this.props.location.state.username;
			// 搜索用户
			fetch(`http://localhost:3001/searchUser/${this.state.searchText}`,{
				mode:'cors'
			}).then(response=>response.json()).then(res=>{
				this.setState({
					SearchUserArr:res
				})
			});
			//搜索博文
			fetch(`http://localhost:3001/SearchAllBlog/${username}/${this.state.searchText}`,{
				mode:'cors'
			}).then(response=>response.json()).then(res=>{
				console.log('搜索到的博文',res)
				this.setState({
					allblogs:res
				})
			})
			this.setState({selectIndex:3})
		} else {
			return 0;
		}
	}

	changeToFind(){
		this.setState({selectIndex:2,commentsIndex:-1});

		var username = this.props.location.state.username;
		fetch(`http://localhost:3001/getAllBlog/${username}`,{
			mode:'cors'
		}).then(response=>response.json()).then(res=>{
			console.log('allblogs',res);
			this.setState({
				allblogs:res
			});
		})
	}

	changeToMine(){
		this.setState({selectIndex:1,commentsIndex:-1});
		var username = this.props.location.state.username;
		fetch(`http://localhost:3001/getUserBlog/${username}`,{
			mode:'cors'
		}).then(response=>response.json()).then(res=>{
			console.log('blogs',res);
			this.setState({
				blogs:res
			});
		})

	}

	changeToSearch(){

	}


	renderHeader(){
		let index = this.state.selectIndex
		return(
			<div className={'header'}>
				<div id={'headerContainer'}>
					<div id={'slogan'}>
						<p>BBlog<span>文字背后的精彩</span></p>
					</div>
					<div id={'headerbar'}>
						<div id={'bars'}>
							<div onClick={()=>this.changeToMine()} className={index===1?'contentHeaderBarselect':'contentHeaderBar'}>
								<p>我的</p>
							</div>
							<div onClick={()=>this.changeToFind()} className={index===2?'contentHeaderBarselect':'contentHeaderBar'}>
								<p>发现</p>
							</div>
							<div id={'searchbar'}>
								<img alt={'搜索'} src={require('../imgs/search.png')}/>
								<input onChange={this.setSearchText.bind(this)} maxLength={20} placeholder={'用户名、关键字'} />
								<div onClick={()=>this.Search()} id={'seatchbt'}>
									<span>搜索</span>
								</div>
							</div>
						</div>
						<div id={'headerrightbar'}>
							<p style={{'fontSize':'10px','marginRight':'40px','color':'orangered'}}>{this.state.nickname}</p>
							<div onClick={()=>this.props.history.replace('/')} onMouseOver={this.mouseover.bind(this)} onMouseLeave={this.mouseleave.bind(this)} id={this.state.onMouseOver?'loginoutBt_2':'logionoutBt'}>
								<b id={'loginP'}>退出登录</b>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	showComments(item,i){
		this.setState({
			commentBottomIndex:-1,
			replayIndex:-1,
			replaying:false
		});
		if (this.state.commentsIndex===i){
			this.setState({
				commentsIndex:-1,
				comments:[],
			})
		} else {
			console.log('评论item',item)
			fetch(`http://localhost:3001/getComments/${item.id}`,{
				mode:'cors'
			}).then(response=>response.json()).then(res=>{
				console.log('comments',res);
				this.setState({
					comments:res,
					commentsIndex:i
				});
			});
		}
	}

	showMenu(i){
		if (this.state.menuIndex===i){
			this.setState({
				menuIndex:-1
			})
		} else {
			this.setState({
				menuIndex:i
			})
		}
	}

	showCommentBottomBar(){
		if (this.that.state.replayIndex!==-1)
			return 0;
		this.that.setState({
			commentBottomIndex:this.index
		})
	}

	hideCommentBottomBar(){
		console.log(this.state.replaying);
		if (this.state.replaying){
			return 0
		} else {
			console.log('adadsasdasd')
			this.setState({
				commentBottomIndex:-1
			})
		}
	}

	showEdit(i){
		if (this.state.editIndex === i){
			this.setState({editIndex:-1})
		} else {
			this.setState({
				editIndex:i
			})
		}
	}

	showReplay(i){
		let replayIndex = this.state.replayIndex
		if (replayIndex===i){
			this.setState({
				replayIndex:-1,
				replaying:false
			})
		} else {
			this.setState({
				replayIndex:i,
				replaying:true
			})
		}
	}

	setReply(e){
		// console.log(e.target.value);
		this.setState({
			replyText:e.target.value
		})
	}

	addReply(item,i){
		if (this.state.replyText&&this.state.replyText!==''){
			console.log(this.state.replyText)
			console.log(item)
			//todo
			fetch(`http://localhost:3001/addReply/${item.id}/${encodeURIComponent(this.state.replyText)}`,{
				mode:'cors',
				method:'post'
			}).then(response=>response.json()).then(res=>{
				// console.log(res)
				if (res.affectedRows===1){
					item.reply = this.state.replyText;
					let newAarr = this.state.comments;
					newAarr[i] = item;
					this.setState({
						comments:newAarr,
						replyText:'',
						replayIndex:-1
					})
				} else {
					this.setState({
						replyText:'',
						replayIndex:-1
					})
				}
			})

		} else {
			console.log('没有回复')
		}
	}

	edit(e){
		// console.log(e.target.value)
		this.that.setState({newBlog:e.target.value});
		console.log(this.index)
	}

	deleteBlog(item,i){
		var result =  window.confirm ('确认删除么');
		if (result){
			fetch(`http://localhost:3001/deleteBlog/${item.username}/${item.id}`,{
				mode:'cors'
			}).then(response=>response.json()).then(res=>{
				console.log('deleteblog',res);
				if (res.affectedRows ===1 ){
					console.log('删除成功了');
					//TODO更新state中的text
					let originBlog = this.state.blogs;
					originBlog.splice(i,1);
					this.setState({
						blogs:originBlog
					})
				}
			})
		}else {
			// console.log('删除失败了')
		}
	}

	updateBlog(item,i){
		let newBlog = this.state.newBlog;
		if (newBlog&&newBlog!==''&&newBlog!==item.text){
			var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			//TODO 更新内容
			fetch(`http://localhost:3001/updateBlog/${item.id}/${encodeURIComponent(newBlog)}/${date}`,{
				mode:'cors',
				method:'post'
			}).then(response=>response.json()).then(res=>{
				// console.log(res)
				if (res.affectedRows===1){
					item.text = newBlog;
					item.date = date;
					let newAarr = this.state.blogs;
					newAarr[i] = item;
					this.setState({
						blogs:newAarr,
						editIndex:-1,
						menuIndex:-1,
						newBlog:''
					})
				} else {
					this.setState({
						editIndex:-1,
						menuIndex:-1,
						newBlog:''
					})
				}
			})

		} else {
			console.log('没有新内容');
			this.setState({
				editIndex:-1,
				menuIndex:-1,
				newBlog:''
			})
		}
	}

	addNewBlog(){
		if (this.state.newBlogText&&this.state.newBlogText!==''){
			var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			console.log(date);
			let {username,newBlogText} = this.state;
			fetch(`http://localhost:3001/addBlog/${username}/${encodeURIComponent(newBlogText)}/${date}`,{
				mode:'cors',
				method:'post'
			}).then(response=>response.json()).then(res=>{
				if (res.affectedRows===1){
					fetch(`http://localhost:3001/getUserBlog/${username}`,{
						mode:'cors'
					}).then(response=>response.json()).then(res=>{
						console.log('blogs',res);
						this.setState({
							blogs:res,
							addNew:false
						});
					})
				}else {
					this.setState({addNew:false})
				}
			})
		} else {
			this.setState({
				addNew:false
			})
		}
	}

	addNewBlogText(e){
		console.log('新博客内容是',e.target.value);
		this.setState({newBlogText:e.target.value})
	}

	setComment(e){
		console.log(e.target.value);
		this.setState({
			commentText:e.target.value
		});
	}

	addComment(item,i){
		if (this.state.commentText&&this.state.commentText!==''){

			var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			var {nickname,commentText} = this.state;
			fetch(`http://localhost:3001/addComment/${item.id}/${nickname}/${item.nickname}/${encodeURIComponent(commentText)}/${date}`,{
				mode:'cors',
				method:'post'
			}).then(response=>response.json()).then(res=>{
				if (res.affectedRows===1){
					let blog = this.state.allblogs;
					blog[i].comments = blog[i].comments + 1;
					this.setState({commentText:'',allblogs:blog});
					fetch(`http://localhost:3001/getComments/${item.id}`,{
						mode:'cors'
					}).then(response=>response.json()).then(res=>{
						console.log('comments',res);
						this.setState({
							comments:res
						});
					})
				}else {
					// this.setState({addNew:false})
					console.log('评论失败')
				}
			})
		}else {
			this.setState({commentsIndex:-1})
		}
	}

	getAllLikes(){
		let num = 0;
		if (this.state.blogs){
			this.state.blogs.map((item,i)=>{
				return num  += item.likenum;
			})
		}
		return num;
	}

	renderBlog(item,i){
		var d = new Date(item.date);
		var times=d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日' + d.getHours() + ':' + (d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes());
		return(
			<div key={i} id={'BlogContainer'}>
				<div id={'textContain'}>
					{this.state.editIndex===i?null:
						<div id={'blogTextContainer'}>
							<p id={'blogtext'}>{item.text.split ('\n').map((item, i) => <span style={{'fontSize':'10px'}} key={i}>{item}<br/></span>)}</p>
						</div>}
					{this.state.editIndex===i?<textarea onChange={this.edit.bind({index:i,that:this})}  placeholder={'800字以内'} maxLength={500} defaultValue={item.text}/>:null}
				</div>
				<div id={'bottomBar'}>
					<div><span style={{'color':'gray','fontSize':'10px'}}>{times}</span></div>
					<div className={'bts'}>
						<div onClick={()=>this.showComments(item,i)} className={'btsbt'}>
							<img src={require('../imgs/comments.png')} alt={'评论'}/>
							<p>{item.comments}</p>
						</div>
						<div className={'btsbt'}>
							<img src={require('../imgs/redliked.png')} alt={'点赞'}/>
							<p>{item.likenum?item.likenum:0}</p>
						</div>
						{/*<div className={'btsbt'}>*/}
							{/*<img src={require('../imgs/goldstar.png')} alt={'收藏'}/>*/}
							{/*<p>{item.liked}</p>*/}
						{/*</div>*/}
						<div onClick={()=>this.showMenu(i)} className={'btsbt'}>
							<img src={require('../imgs/menu.png')} alt={'菜单'}/>
						</div>
					</div>
				</div>
				{this.state.menuIndex===i?this.state.editIndex!==i?
					<div className={'menuBar'}>
						<div onClick={()=>this.showEdit(i)} className={'btsbt'}>
							<img src={require('../imgs/edit.png')} alt={'修改'}/>
							<p>修改</p>
						</div>
						<div onClick={()=>this.deleteBlog(item,i)} className={'btsbt'}>
							<img src={require('../imgs/delete.png')} alt={'删除'}/>
							<p style={{'color':'red'}}>删除</p>
						</div>
					</div>:<div className={'menuBar'}>
						<div onClick={()=>this.updateBlog(item,i)} className={'btsbt'}>
							<p>完成</p>
						</div>
						<div onClick={()=>this.setState({
							editIndex:-1,
							menuIndex:-1,
							newBlog:''
						})} className={'btsbt'}>
							<p style={{'color':'red'}}>取消</p>
						</div>
					</div>:null}
				{this.state.commentsIndex===i&&this.state.comments?
					<div id={'commentContainer'}>
						<div id={'commentBar'}>
							<span style={{fontSize:10}}>{this.state.comments.length} 条评论</span>
							<div onClick={()=>this.setState({commentsIndex:-1})} id={'HideBt'}>
								<span id={'hideBt'} style={{fontSize:10}} >收起</span>
								<img src={require('../imgs/close.png')} style={{'width':'10px','height':'10px'}} alt={'收起'}/>
							</div>
						</div>
						{this.state.comments.map((item,i)=>{
							var d = new Date(item.date);
							var times=d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日' + d.getHours() + ':' + d.getMinutes();
							return(
								<div
									onMouseLeave={this.hideCommentBottomBar.bind(this)}
									onMouseOver={this.showCommentBottomBar.bind({that:this,index:i,comment:item})} key={i} id={'comment'}>
									<div id={'commentHeader'}>
										<b style={{fontSize:10,fontWeight:'400'}}>{item.commentor} :</b>
										<b style={{fontSize:10,fontWeight:'normal',color:'gray'}}>{times}</b>
									</div>
									<b style={{fontSize:10,fontWeight:'normal',marginTop:5}}>{item.comments}</b>

									{item.reply?<b style={{fontSize:10,fontWeight:'normal',marginTop:5}}>我:{item.reply}</b>:null}
									{this.state.commentBottomIndex===i?
										<div id={"commentBottomBar"}>
										<div onClick={()=>this.showReplay(i)} style={{'marginRight':'10px'}}>
											<img src={require('../imgs/replay.png')} style={{'width':'10px','height':'10px','paddingRight':'5px'}} alt={'收起'}/>
											<span>{this.state.replayIndex!==i?'回复':'取消回复'}</span>
										</div>
										{/*<div><span style={{'color':'gray'}}>删除评论</span></div>*/}
									</div>:null}
									{this.state.replayIndex===i?
										<div id={'replaycontainer'}>
											<textarea onChange={this.setReply.bind(this)} maxLength={50} placeholder={'回复'+item.commentor+'(50字内):'} style={{'width':'80%'}}/>
											<div onClick={()=>this.addReply(item,i)} id={'replybt'}><span style={{'fontSize':'12px'}}>回复</span></div>
										</div>:null}
								</div>
							)
						})}
				</div>:null}

			</div>
		)
	}

	likeBlog(item,i){
		console.log(item);
		var newAllBlogs = this.state.allblogs;
		var username = this.props.location.state.username;
		if (item.userlike!==null){//如果点赞了
			console.log('点赞了')
			fetch(`http://localhost:3001/dislikeBlog/${item.id}/${username}`,{
				mode:'cors'
			}).then(response=>response.json()).then(res=>{
				if (res.affectedRows===1){
					newAllBlogs[i].userlike = null;
					newAllBlogs[i].liked = newAllBlogs[i].liked - 1;
					this.setState({allblogs:newAllBlogs})
				}else {
					// this.setState({addNew:false})
					console.log('取消点赞失败')
				}
			})
		} else {//如果没点赞
			console.log('没点赞')
			fetch(`http://localhost:3001/likeBlog/${item.id}/${username}`,{
				mode:'cors'
			}).then(response=>response.json()).then(res=>{
				if (res.affectedRows===1){
					newAllBlogs[i].userlike = username;
					newAllBlogs[i].liked = newAllBlogs[i].liked + 1;
					this.setState({allblogs:newAllBlogs})
				}else {
					// this.setState({addNew:false})
					console.log('点赞失败')
				}
			})
		}
	}


	renderAllBlog(item,i){
		var d = new Date(item.date);
		var times=d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日' + d.getHours() + ':' + (d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes());
		return(
			<div key={i} id={'BlogContainer'}>
				<div id={'textContain'}>
					{this.state.editIndex===i?null:
						<div id={'blogTextContainer'}>
							<p>{item.nickname} :</p>
							<p id={'blogtext'}>{item.text.split ('\n').map((item, i) => <span style={{'fontSize':'10px'}} key={i}>{item}<br/></span>)}</p>
						</div>}
					{this.state.editIndex===i?<textarea onChange={this.edit.bind({index:i,that:this})}  placeholder={'800字以内'} maxLength={500} defaultValue={item.text}/>:null}
				</div>
				<div id={'bottomBar'}>
					<div><span style={{'color':'gray','fontSize':'10px'}}>{times}</span></div>
					<div className={'bts'}>
						<div onClick={()=>this.showComments(item,i)} className={'btsbt'}>
							<img src={require('../imgs/comments.png')} alt={'评论'}/>
							<p>{item.comments}</p>
						</div>
						<div onClick={()=>this.likeBlog(item,i)} className={'btsbt'}>
							<img src={item.userlike!==null?require('../imgs/redliked.png'):require('../imgs/liked.png')} alt={'点赞'}/>
							<p>{item.liked}</p>
						</div>
					</div>
				</div>
				{this.state.commentsIndex===i&&this.state.comments?
					<div id={'commentContainer'}>
						<div id={'commentArea'}>
							<textarea autoFocus={true} value={this.state.commentText} onChange={this.setComment.bind(this)} placeholder={'50字以内'} maxLength={50} style={{'width':'80%'}}/>
							<div onClick={()=>this.addComment(item,i)} id={"commentBt"}>
								<span>发表评论</span>
							</div>
						</div>
						<div id={'commentBar'}>
							<span style={{fontSize:10}}>{this.state.comments.length} 条评论</span>
							<div onClick={()=>this.setState({commentsIndex:-1})} id={'HideBt'}>
								<span id={'hideBt'} style={{fontSize:10}} >收起</span>
								<img src={require('../imgs/close.png')} style={{'width':'10px','height':'10px'}} alt={'收起'}/>
							</div>
						</div>
						{this.state.comments.map((item,i)=>{
							var d = new Date(item.date);
							var times=d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日' + d.getHours() + ':' + d.getMinutes();
							return(
								<div
									onMouseLeave={this.hideCommentBottomBar.bind(this)}
									onMouseOver={this.showCommentBottomBar.bind({that:this,index:i,comment:item})} key={i} id={'comment'}>
									<div id={'commentHeader'}>
										<b style={{fontSize:10,fontWeight:'400'}}>{item.commentor} :</b>
										<b style={{fontSize:10,fontWeight:'normal',color:'gray'}}>{times}</b>
									</div>
									<b style={{fontSize:10,fontWeight:'normal',marginTop:5}}>{item.comments}</b>
									{item.reply?<b style={{fontSize:10,fontWeight:'normal',marginTop:5}}>{item.author}:{item.reply}</b>:null}
								</div>
							)
						})}
					</div>:null}

			</div>
		)
	}

	renderAddNew(){
		return(
			<div id={'blogcontain'}>
				<div id={'BlogContainer'}>
					<div id={'textContain'}>
						<textarea  placeholder={'500字以内'} maxLength={500} onChange={this.addNewBlogText.bind(this)}/>
					</div>
					<div id={'bottomBar'}>
						<div className={'bts'}>
							<div onClick={()=>this.addNewBlog()} className={'btsbt'}>
								<p style={{'backgroundColor':'orangered','padding':'10px','color':'white'}}>完成</p>
							</div>
							<div onClick={()=>this.setState({addNew:false})} className={'btsbt'}>
								<p style={{'backgroundColor':'lightgray','padding':'10px','color':'gray'}}>取消</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	renderContent(){
		return(
			<div id={'content'}>
				{this.state.addNew?this.renderAddNew():
					<div id={'blogcontain'}>
						{this.state.selectIndex===1?this.renderMine():null}
						{this.state.selectIndex===2?this.renderFind():null}
						{this.state.selectIndex===3?this.renderSearchUserResult():null}
						{this.state.selectIndex===3?this.renderSearchBlogResult():null}
					</div>}
				<div id={'userbar'}>
					<div id={'userinfo'}>
						<div className={'userlabel'}><div className={'labelcontent'}><img src={require('../imgs/book.png')} alt={'文章'}/><b style={{'fontSize':'10px'}}>文章数</b></div><b style={{'fontSize':'10px'}}>{this.state.blogs?this.state.blogs.length:0}</b></div>
						<div className={'userlabel'}><div className={'labelcontent'}><img src={require('../imgs/liked.png')} alt={'点赞'}/><b>获赞数</b></div><b>{this.getAllLikes()}</b></div>
					</div>
					<div id={'toolbar'}>
						<div onClick={()=>{
							let addNew = this.state.addNew;
							this.setState({addNew:!addNew,editIndex:-1})
						}} className={'toolbarBt'}>
							<img src={require('../imgs/plus.png')} style={{'width':'20px','height':'20px'}} alt={'新博客'}/>
						</div>
					</div>
				</div>
			</div>
		)
	}

	renderFind(){
		if (this.state.allblogs&&this.state.allblogs.length>0){
			return this.state.allblogs.map((item,i)=>{
				return this.renderAllBlog(item,i)
			})
		} else {
			return(
				<p>这里还什么都没有呢* _ *</p>
			)
		}
	}

	renderMine(){
		if (this.state.blogs&&this.state.blogs.length>0){
			return this.state.blogs.map((item,i)=>{
				return this.renderBlog(item,i)
			})
		} else {
			return(
				<p>这里还什么都没有呢* _ *</p>
			)
		}
	}

	renderSearchBlogResult(){
		return(
			<div id={'searchBlogContainer'}>
				<span style={{'color':'gray','marginBottom':'10px'}}>相关内容</span>
				{
			this.state.allblogs&&this.state.allblogs.length>0?
						this.state.allblogs.map((item,i)=>{
							return this.renderAllBlog(item,i)
						}):null
			}
			</div>
		)
	}

	renderSearchUserResult(){
		if (this.state.SearchUserArr&&this.state.SearchUserArr.length>0){
			return (
				<div id={'searchUserContainer'}>
					<span style={{'color':'gray'}}>相关用户</span>
					{
				this.state.SearchUserArr.map((item,i)=>{
					return(
						<div className={'searchUser'} key={i}>{item.nickname}</div>
					)
				})}
				</div>
			)
		} else {
			return null
		}
	}



	render() {
		return (
			<div className='Container'>
				{this.renderHeader()}
				{this.renderContent()}
			</div>
		);
	}
}

export default ContentPage;
