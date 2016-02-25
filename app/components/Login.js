
//--------------------------------------------------------------------------
//  Import modules
//--------------------------------------------------------------------------
import React, {PropTypes} from 'react';
import {Router, Link, hashHistory} from 'react-router';
import {Modal, ModalClose} from 'react-modal-bootstrap';

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
    	return {
            value_email: '', 
            value_password: '',
            isOpen: false,
            modalContent: {
                headline: '',
                body: '',
                extended: ''
            }
        };
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
                success: function(response) {
                	var session_token = response.session_token;
                	localStorage.setItem('session_token', session_token);
                    hashHistory.push('/groups');
                },
                error: function(response) {
                    console.log(response)
                    this.setState({
                        modalContent: {
                            headline: response.statusText,
                            body: response.responseJSON.error.message,
                            extended: response.responseText
                        }
                    })
                    
                    this.openModal();
                }.bind(this)
            });
        }
    },
    openModal: function() {
        this.setState({isOpen: true});
    },
    closeModal: function() {
        this.setState({isOpen: false})
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
                            	<Link className="btn btn-default login-btn-register" to="/register">Register</Link>
                            </div>
                        </form>
                        <div className="row">
                            <p className="text-center"><br/>React Address Book v{version}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2"></div>
                <ErrorModal 
                    isOpen={this.state.isOpen} 
                    headline={this.state.modalContent.headline}
                    body={this.state.modalContent.body}
                    extended={this.state.modalContent.extended}
                    closeModal={this.closeModal}
                />
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
//  Modal Messages
//--------------------------------------------------------------------------
var ErrorModal = React.createClass({
    hideModal: function() {
        this.props.closeModal();
    },
    render: function() {
        var { isOpen, headline, body, extended } = this.props;

        return (
            <Modal isOpen={isOpen} onRequestHide={this.hideModal}>
                <div className='modal-header'>
                    <ModalClose onClick={this.hideModal}/>
                    <h4 className='modal-title'>{headline}</h4>
                </div>
                <div className='modal-body'>
                    <p>{body}</p>
                    <div>
                        <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseError" aria-expanded="false" aria-controls="collapseError">
                            <h6>Show/hide full message</h6>
                        </button>
                        <div className="collapse" id="collapseError">
                            <div className="well" id="errorMsg">{extended}</div>
                        </div>
                    </div>
                </div>
                <div className='modal-footer'>
                    <button className='btn btn-default' onClick={this.hideModal}>
                        Close
                    </button>
                </div>
            </Modal>
        )
    }
});


//--------------------------------------------------------------------------
//  Module Export
//--------------------------------------------------------------------------
module.exports = {
    Login: Login,
    Logout: Logout
};

