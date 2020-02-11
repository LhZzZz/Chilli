import React, { Component } from 'react';
import '../App.css';


class MainPage extends Component {
	constructor(props){
		super(props);
		this.state={
			username:'',
			password:'',
			nickname:'',
			confirmPassword:'',
			newuser:false
		}
	}

	componentDidMount() {
		let username = '15279102541';
		fetch(`http://localhost:3001/posts/${username}`,{
			mode:'cors'
		}).then(response=>response.json()).then(res=>{
			console.log(res)
		})
	}


	render() {
		return (
			<div className='MainContainer'>
				<div className={'sloganContain'}>
					<p className={'slogan'}>Welcome to BBlog</p>
					<p className={'subslogan'}>文字背后的精彩!</p>
				</div>
				<div className={'LoginContain'}>
					<div className={'inputContain'}>
						<img src={require('../imgs/user.png')} alt={'账号'}/>
						<input className={'input'} onChange={this.setUsername.bind(this)} type={'text'} placeholder={'请输入账号'}/>
					</div>
					{this.state.newuser?<div className={'inputContain'}>
						<img src={require('../imgs/icons8-happy.png')} alt={'昵称'}/>
						<input className={'input'} onChange={this.setNickName.bind(this)} placeholder={'请输入昵称'}/>
					</div>:null}
					<div className={'inputContain'}>
						<img src={require('../imgs/lock.png')} alt={'密码'}/>
						<input className={'input'} onChange={this.setPassword.bind(this)} type={'password'} placeholder={'请输入密码'}/>
					</div>
					{this.state.newuser?<div className={'inputContain'}>
						<img src={require('../imgs/confirm.png')} alt={'密码'}/>
						<input className={'input'} onChange={this.confirmPassword.bind(this)} type={'password'} placeholder={'请再次输入密码'}/>
					</div>:null}
					<div onClick={()=>{
						let newuser = this.state.newuser;
						this.setState({
							newuser:!newuser,
							confirmPassword:''
						})
					}} id={'registeBt'}>
						{!this.state.newuser?
							<p>新用户注册</p>:<p>去登录</p>
						}
					</div>
					<div className={'loginbt'} onClick={this.login.bind(this)}>
						{!this.state.newuser?<p>登录</p>:<p>注册</p>}
					</div>
				</div>
			</div>
		);
	}

	setUsername(e){
		console.warn('用户名',e.target.value);
		this.setState({
			username:e.target.value
		})
	}

	setNickName(e){
		this.setState({
			nickname:e.target.value
		});
	}

	setPassword(e){
		console.warn('密码',e.target.value);
		this.setState({
			password:e.target.value
		})
	}

	confirmPassword(e){
		this.setState({
			confirmPassword:e.target.value
		})
	}




	login(){
		// console.log('登录')
		let {username,password,nickname} = this.state;
		if (this.state.newuser){
			//注册
			let comfirmpassword = this.state.confirmPassword
			if (username===''||password===''){
				alert('请输入账号密码')
			}else {
				if (comfirmpassword===''||comfirmpassword!==password){
					alert('两次密码不一致')
				}else {
					fetch(`http://localhost:3001/registe/${username}/${password}/${nickname}`,{
						mode:'cors'
					}).then(response=>response.json()).then(res=>{
						console.log(res)
						if (res.affectedRows===1) {
							alert('注册成功')
							//TODO
						}else {
							alert('注册失败，该用户已存在')
						}
					})
				}
			}
		} else {
			if (username===''||password===''){
				alert('请输入账号密码')
			}else {
				//TODO
				fetch(`http://localhost:3001/login/${username}`,{
					mode:'cors'
				}).then(response=>response.json()).then(res=>{
					console.log(res)
					if (res.length===1&&res[0].password === password){
						console.warn('登录成功');
						this.props.history.push({pathname:'/about/',state:{
								username:username,
							}})
					}else {
						alert('登录失败!请确认账号密码无误.')
					}
				})
			}
		}
	}

}
export default MainPage;
