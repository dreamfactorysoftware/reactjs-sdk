
//--------------------------------------------------------------------------
//  Import modules
//--------------------------------------------------------------------------
import React from 'react';
import {Router, Link, hashHistory} from 'react-router';


//--------------------------------------------------------------------------
//  Login
//--------------------------------------------------------------------------
var Header = React.createClass({
    render: function () {
        return (
            <div className="navbar navbar-default navbar-static-top " role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <img src="./img/DreamFactory-logo-horiz.png" className="header-logo-align" height="25" />
                    </div>
                </div>
            </div>
        );
    }
});

var LoginForm = React.createClass({
	getInitialState: function() {
    	return {value_email: '', value_password: ''};
  	},
	handleClick: function(event){
        var url = this.props.url;

        if(event.target.id === 'signin') {
        	$.ajax({
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                url: url + '/api/v2/user/session',
                data: JSON.stringify({
                    "email": this.state.value_email,
                    "password": this.state.value_password
                }),
                cache:false,
                method:'POST',
                success:function (response) {
                	var session_token = response.session_token;
                	localStorage.setItem('session_token', session_token);
                    hashHistory.push('/groups');
                }
            });
        }
    },
    handleChange: function (name, e) {
      var change = {};
      change[name] = e.target.value;
      this.setState(change);
    },
	render: function() {
        var version = this.props.version;

		return (
			<div>
				<div className="row"></div>
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <div className="login">
                        <form>
                            <div className="form-group form-control-size" >
                                <input type="email" className="form-control" id="email" placeholder="Email" value={this.state.value_email} onChange={this.handleChange.bind(this, 'value_email')} />
                            </div>
                            <div className="form-group form-control-size" >
                                <input type="password" className="form-control" id="password" placeholder="Password" value={this.state.value_password} onChange={this.handleChange.bind(this, 'value_password')} />
                            </div>
                            <div className="form-group form-control-size" >
                                <button id="signin" className="btn btn-default login-btn-signin" type="button" onClick={this.handleClick}>Sign In</button>
                            </div>
                            <div className="form-group form-control-size" >
                            	<Link className="btn btn-default login-btn-register" to="/register" >Register</Link>
                            </div>
                        </form>
                        <div className="row">
                            <p className="text-center"><br/>React Address Book v{version}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2"></div>
            </div>
		);
	}
});

var Login = React.createClass({
    render: function() {
    	var { url, version } = this.props;

        return (
            <div>
                <Header/>
                <div className="container">
                    <div className="row">
                        <div className="center-block trim">
                            <LoginForm url={url} version={version} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


//--------------------------------------------------------------------------
//  Logout
//--------------------------------------------------------------------------
var Logout = React.createClass({
    doLogout: function(){
        var url = this.props.url;

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/user/session',
            cache:false,
            method:'DELETE',
            success:function (response) {
                localStorage.removeItem('session_token');
                hashHistory.push('/login');
            }
        });
    },
    componentWillMount: function(){
        this.doLogout();
    },
    render: function() {
        var { url } = this.props;

        return (
            <div></div>
        );
    }
});


//--------------------------------------------------------------------------
//  Module Export
//--------------------------------------------------------------------------
module.exports = {
    Login: Login,
    Logout: Logout
};

