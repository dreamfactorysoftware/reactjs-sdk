
//--------------------------------------------------------------------------
//  Import modules
//--------------------------------------------------------------------------
import React from 'react';
import {Router, Link, hashHistory} from 'react-router';


//--------------------------------------------------------------------------
//  Register User
//--------------------------------------------------------------------------
var Header = React.createClass({
    render: function () {
        return (
            <div className="navbar navbar-default navbar-static-top" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <img src="./img/DreamFactory-logo-horiz.png" className="header-logo-align" height="25" />
                    </div>
                </div>
            </div>
        );
    }
});

var RegisterForm = React.createClass({
	getInitialState: function() {
    	return {value_email: '', value_password: ''};
  	},
	handleClick: function(event){
        var url = this.props.url;

        if(event.target.id === 'register_user') {
        	$.ajax({
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                url: url + '/api/v2/user/register?login=true',
                data: JSON.stringify({
                    "first_name": this.state.value_firstname,
                    "last_name": this.state.value_lastname,
                    "email": this.state.value_email,
                    "new_password": this.state.value_password
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
		return (
			<div>
				<div className="row"></div>
				<div className="col-md-2"></div>
	            <div className="col-md-8">
	                <div className="login">
	                    <form>
	                        <div className="form-group form-control-size" >
	                            <input type="text" className="form-control" id="register_firstname" placeholder="First Name" value={this.state.value_firstname} onChange={this.handleChange.bind(this, 'value_firstname')} />
	                        </div>
	                        <div className="form-group form-control-size" >
	                            <input type="text" className="form-control" id="register_lastname" placeholder="Last Name" value={this.state.value_lastname} onChange={this.handleChange.bind(this, 'value_lastname')} />
	                        </div>
	                        <div className="form-group form-control-size" >
	                            <input type="email" className="form-control" id="register_email" placeholder="Email" value={this.state.value_email} onChange={this.handleChange.bind(this, 'value_email')} />
	                        </div>
	                        <div className="form-group form-control-size" >
	                            <input type="password" className="form-control" id="register_password" placeholder="Password" value={this.state.value_password} onChange={this.handleChange.bind(this, 'value_password')} />
	                        </div>
	                        <div className="form-group form-control-size" >
	                            <button id="register_user" className="btn btn-default login-btn-signin" type="button" onClick={this.handleClick}>Register User</button>
	                        </div>
	                        <div className="form-group form-control-size" >
	                            <Link to="/login" className="btn btn-default login-btn-cancel" >Cancel</Link>
	                        </div>
	                    </form>
	                </div>
	            </div>
	            <div className="col-md-2"></div>
	        </div>
	    );
	}
});

var Register = React.createClass({
    render: function() {
    	var { url } = this.props;

        return (
            <div>
                <Header/>
                <div className="container">
                    <div className="row">
                        <div className="center-block trim">
                            <RegisterForm url={url} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


//--------------------------------------------------------------------------
//  Module Export
//--------------------------------------------------------------------------
module.exports = Register;

