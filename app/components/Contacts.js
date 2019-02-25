
//--------------------------------------------------------------------------
//  Import modules
//--------------------------------------------------------------------------
import React from 'react';
import ReactDOM from 'react-dom';
import {Link, hashHistory} from 'react-router';
import {Modal, ModalClose} from 'react-modal-bootstrap';


//--------------------------------------------------------------------------
//  Show Contact
//--------------------------------------------------------------------------
var HeaderContact = React.createClass({
    getInitialState: function() {
        return {
            isOpen: false,
            confirm: true,
            modalContent: {
                headline: '',
                body: '',
                extended: ''
            }
        }
    },
    modalConfirm: function() {
        this.setState({
            isOpen: false,
        })

        var url = location.href;
        var param = 'group'
        param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

        var regexS = "[\\?&]"+param+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var urlparams = regex.exec( url );

        var contactId = this.props.contactId;

        hashHistory.push('/contact/' + contactId + '/delete?group=' + urlparams[1]);
    },
    modalClose: function() {
        this.setState({
            isOpen: false,
        })
    },
	handleClick: function(event){
		var contactId = this.props.contactId;

        switch (event.target.id) {
			case 'contact_menu_logout':
				hashHistory.push('/login');
				break;	
			case 'contact_menu_back':
                var url = location.href;
                var param = 'group'
                param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

                var regexS = "[\\?&]"+param+"=([^&#]*)";
                var regex = new RegExp( regexS );
                var urlparams = regex.exec( url );

                hashHistory.push('/group/' + urlparams[1]);
				break;	
			case 'contact_menu_edit':
                var url = location.href;
                var param = 'group'
                param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

                var regexS = "[\\?&]"+param+"=([^&#]*)";
                var regex = new RegExp( regexS );
                var params = regex.exec( url );

				hashHistory.push('/contact/' + contactId + '/edit?group=' + params[1]);
				break;	
			case 'contact_menu_delete':
                this.setState({
                    modalContent: {
                        headline: 'Delete Contact',
                        body: 'Do you want to delete this contact?',
                        extended: ''
                    }
                })
                this.setState({
                    isOpen: true,
                })
				break;	
		}
    },
    render: function () {
        return (
            <div>
                <div className="navbar navbar-default navbar-static-top cen">
                   	<div className="col-md-4 pull-left">
                        <ul className="nav navbar-nav">
                        <li className="pull-left"><button type="button" id="contact_menu_back" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Back</button></li>
                        <li className="pull-left"><button type="button" id="contact_menu_logout" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Logout</button></li>
                        </ul>
                    </div> 
                   	<div className="col-md-4">
                   		<img src="./img/DreamFactory-logo-horiz.png" className="header-logo-align" height="25" />
                   	</div> 
                   	<div className="col-md-4">
                        <ul className="nav navbar-nav pull-right">
                   		   <li className="pull-right"><button type="button" id="contact_menu_edit" className="btn btn-default btn-menu" onClick={this.handleClick}>Edit Contact</button></li>
                            <li className="pull-right"><button type="button" id="contact_menu_delete" className="btn btn-default btn-menu" onClick={this.handleClick}>Delete Contact</button></li>
                        </ul>
                   	</div> 
                </div>
                <ErrorModal 
                    isOpen={this.state.isOpen} 
                    headline={this.state.modalContent.headline}
                    body={this.state.modalContent.body}
                    extended={this.state.modalContent.extended}
                    closeModal={this.modalClose}
                    confirmModal={this.modalConfirm}
                    confirm={this.state.confirm}
                />
            </div>
        );
    }
});

var ContactForm = React.createClass({
	getInitialState: function() {
    	return {
            data: [],
            id: 0,
    		firstName: '',
    		lastName: '',
    		twitter: '',
    		skype: '',
    		notes: '',
    		info: [],
            isOpen: false,
            modalContent: {
                headline: '',
                body: '',
                extended: ''
            }
        }
  	},
 	componentDidMount: function(){
 		this.getContactData();
 	},
 	componentDidUpdate: function(){

 	},
    openModal: function() {
        this.setState({isOpen: true});
    },
    closeModal: function() {
        this.setState({isOpen: false})
    },
 	getContactData: function() {
 		var url = this.props.url;
		var key = this.props.apikey;
		var contactId = this.props.contactId;
		var token = localStorage.getItem('session_token');

 		var params = '?ids=' + contactId;

    	$.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact' + params,
            data: null,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                if (response.hasOwnProperty('resource')) {
                    this.setState({id: response.resource[0].id});
                    this.setState({firstName: response.resource[0].first_name});
                    this.setState({lastName: response.resource[0].last_name});
                    this.setState({notes: response.resource[0].notes});
                    this.setState({twitter: response.resource[0].twitter});
                    this.setState({skype: response.resource[0].skype});

                    this.getContactInfoData()
                }
                else
                    console.log(response);
            }.bind(this),
            error: function(response) {
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
 	},
 	getContactInfoData: function() {
 		var url = this.props.url;
		var key = this.props.apikey;
		var contactId = this.props.contactId;
		var token = localStorage.getItem('session_token');

		var params = 'filter=contact_id%3D' + contactId;

    	$.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_info',
            data: params,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                if (response.hasOwnProperty('resource')) {
                    this.setState({info: response.resource});
                }
                else
                    console.log(response);
            }.bind(this),
            error: function(response) {
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
 	},
	render: function() {
		return (			
			<div>
				<div className="row vert-offset-top-30"></div>
	            <div className="col-md-2"></div>
	            <div className="col-md-8">
	            	<div className="row center-elem">
                        <img src="./img/default_portrait.png" height="180" />
                    </div>
                    <div className="row center-elem">
                        <h2><span id="contact_firstName">{this.state.firstName}</span> <span id="contact_lastName">{this.state.lastName}</span></h2>
                    </div>
                    <div className="row" id="contact_social">
                        {this.state.twitter && <span><img src="./img/twitter2.png" height="25" />&nbsp;&nbsp;{this.state.twitter} <br/><br/></span> }
                        {this.state.skype && <span><img src="./img/skype.png" height="25" />&nbsp;&nbsp;{this.state.skype} <br/><br/></span> }
                    </div>
                    <div className="row">
                        <h4>Notes</h4>
                        <span id="contact_notes">{this.state.skype}</span>
                    </div>
                    <div className="row" id="contact_info_types">
                        {this.state.info.map(function(listValue){
                            return <div><br/><div className="infobox" key={listValue.id}>
                            	<h4>{listValue.info_type}</h4>
                            	<div className="col-md-12">
                            	<div className="col-md-1">&nbsp;</div>
                            	<div className="col-md-1"><div className="height-25px"><img src="./img/phone.png" className="height-25px" /></div><br/><img src="./img/mail.png" className="height-25px" /></div>
                            	<div className="col-md-4"><div className="height-25px">{listValue.phone}</div><br/>{listValue.email}</div>
                            	<div className="col-md-1"><img src="img/home.png" className="height-25px" /></div>
                            	<div className="col-md-4">{listValue.address}<br/>{listValue.city}, {listValue.state} {listValue.zip}<br/>{listValue.country}</div>
                            	<div className="col-md-1">&nbsp;</div>
                            	</div>
                            	</div>
                            	</div>
                        })}
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

var Contact = React.createClass({
    render: function() {
    	var { url, apikey, contactId } = this.props;

        return (
            <div>
                <HeaderContact contactId={contactId} />
                <div className="container">
                    <div className="row">
                        <div className="center-block trim">
                            <ContactForm url={url} apikey={apikey} contactId={contactId} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


//--------------------------------------------------------------------------
//  Create Contact
//--------------------------------------------------------------------------
var HeaderContactCreate = React.createClass({
	handleClick: function(event){
		var groupId = this.props.groupId;

        switch (event.target.id) {
			case 'contact_menu_logout':
				hashHistory.push('/login');
				break;	
			case 'contact_menu_back':
				hashHistory.push('/group/' + groupId);
				break;	
		}
    },
    render: function () {
        return (
            <div className="navbar navbar-default navbar-static-top cen">
               	<div className="col-md-4 pull-left">
                    <ul className="nav navbar-nav">
                    <li className="pull-left"><button type="button" id="contact_menu_back" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Back</button></li>
                    <li className="pull-left"><button type="button" id="contact_menu_logout" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Logout</button></li>
                    </ul>
                </div> 
               	<div className="col-md-4">
               		<img src="./img/DreamFactory-logo-horiz.png" className="header-logo-align" height="25" />
               	</div> 
               	<div className="col-md-4">
               		
               	</div> 
            </div>
        );
    }
});

var InfoForm = React.createClass({
    handleInfosChange: function(id, props, data) {
        var update = {id: parseInt(id), name: data.target.name, value: data.target.value};

        this.props.onInfosChanged(update);
    },
    render: function() {
        return <div>
                <div className="form-group vert-offset-top-30"></div>
                <div className="form-group"><select name="info_type" className="form-control type" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)}><option value="work">Work</option><option value="home">Home</option><option value="mobile">Mobile</option><option value="other">Other</option></select></div>
                <div className="form-group"><input type="text" className="form-control phone" name="phone" placeholder="Phone" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} /></div>
                <div className="form-group"><input type="text" className="form-control email" name="email" placeholder="Email" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} /></div>
                <div className="form-group"><input type="text" className="form-control address" name="address" placeholder="Address" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} /></div>
                <div className="form-group"><input type="text" className="form-control city" name="city" placeholder="City" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} /></div>
                <div className="form-group"><input type="text" className="form-control state" name="state" placeholder="State" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} /></div>
                <div className="form-group"><input type="text" className="form-control zip" name="zip" placeholder="Zip" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} /></div>
                <div className="form-group"><input type="text" className="form-control country" name="country" placeholder="Country" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} /></div>
            </div>;
    }
});

var ContactCreateForm = React.createClass({
	getInitialState: function() {
    	return {
            data: [],
    		firstName: '',
    		lastName: '',
    		twitter: '',
    		skype: '',
    		notes: '',
            infos: [],
            contactId: '',
            isOpen: false,
            modalContent: {
                headline: '',
                body: '',
                extended: ''
            }
        }
  	},  	
    onInfosChanged: function(infos) {
        var info = this.state.infos;
        var updId = infos.id;
        var updName = infos.name;
        var updValue = infos.value;

        var updatedInfos = {};
        updatedInfos[updName] = updValue;

        info[updId] = this.mergeObj(info[updId], updatedInfos);

        this.setState({infos: info})
    },
    mergeObj: function(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    },
    setContactData: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var token = localStorage.getItem('session_token');

        var firstName = this.state.firstName;
        var lastName = this.state.lastName;
        var twitter = this.state.twitter;
        var skype = this.state.skype;
        var notes = this.state.notes;
    
        var obj = {};

        obj['first_name'] = firstName;
        obj['last_name'] = lastName;
        obj['image_url'] = '';
        obj['twitter'] = twitter;
        obj['skype'] = skype;
        obj['notes'] = notes;

        var params = JSON.stringify({resource: [obj]});

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact',
            data: params,
            cache:false,
            method:'POST',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                    if (response.hasOwnProperty('resource')) {
                        this.setState({contactId: response.resource[0].id});
                        this.setContactRelation();
                    }
                    else
                        console.log(response);
            }.bind(this),
            error: function(response) {
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
    },
    setContactRelation: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var groupId = this.props.groupId;
        var token = localStorage.getItem('session_token');

        var obj = {};

        obj['contact_group_id'] = parseInt(groupId);
        obj['contact_id'] = parseInt(this.state.contactId);

        var params = JSON.stringify({resource: [obj]});

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group_relationship',
            data: params,
            cache:false,
            method:'POST',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                    if (response.hasOwnProperty('resource')) {
                        this.setContactInfos();
                    }
                    else
                        console.log(response);
            }.bind(this),
            error: function(response) {
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
    },
    setContactInfos: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var groupId = this.props.groupId;
        var token = localStorage.getItem('session_token');
        var infos = this.state.infos;

        for(var i in infos) {
            var info = infos[i];
            delete info.id;

            info['contact_id'] = parseInt(this.state.contactId);
            info['ordinal'] = 0;

            var params = JSON.stringify({resource: [info]});

            $.ajax({
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                url: url + '/api/v2/db/_table/contact_info',
                data: params,
                cache:false,
                method:'POST',
                headers: {
                    "X-DreamFactory-API-Key": key,
                    "X-DreamFactory-Session-Token": token
                },
                success:function (response) {

                },
                error: function(response) {
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

        hashHistory.push('/group/' + groupId);
    },
    handleChange: function (name, e) {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    },
    _onAddClick: function() {
        var infos = this.state.infos;
        var len = infos.length;

        infos.push({
            id: len,
            info_type: 'work',
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        });

        this.setState({infos: infos});
    },
    _onSaveClick: function() {
        this.setContactData()
    },
    _onCancelClick: function() {
    	var groupId = this.props.groupId;
		
		hashHistory.push('/group/' + groupId);
  	},
    openModal: function() {
        this.setState({isOpen: true});
    },
    closeModal: function() {
        this.setState({isOpen: false})
    },
	render: function() {
        var self = this;

		return (
			<div>
				<div className="row vert-offset-top-30"></div>
	            <div className="col-md-2"></div>
	            <div className="col-md-8">
	            	<div className="person">
                        <form id="contact_create">
                            <input type="hidden" id="contact_create_group" value="" />
                            <input type="hidden" id="contact_create_contact" value="" />
                            <div className="form-group" >
                                <input type="text" 
                                	className="form-control" 
                                	id="first_name" 
                                	placeholder="First Name"
                                	value={this.state.firstName} 
                             		onChange={this.handleChange.bind(this, 'firstName')} 
                             	/>
                            </div>
                            <div className="form-group" >
                                <input type="text" 
                                	className="form-control" 
                                	id="last_name" 
                                	placeholder="Last Name" 
                                	value={this.state.lastName} 
                             		onChange={this.handleChange.bind(this, 'lastName')}
                                />
                            </div>
                            <div className="form-group" >
                                <input type="text" 
                                	className="form-control" 
                                	id="twitter" 
                                	placeholder="Twitter" 
                                	value={this.state.twitter} 
                             		onChange={this.handleChange.bind(this, 'twitter')}
                                />
                            </div>
                            <div className="form-group" >
                                <input type="text" 
                                	className="form-control" 
                                	id="skype" 
                                	placeholder="Skype" 
                                	value={this.state.skype} 
                             		onChange={this.handleChange.bind(this, 'skype')}
                                />
                            </div>
                            <div className="form-group" >
                                <input type="text" 
                                	className="form-control" 
                                	id="notes" 
                                	placeholder="Notes" 
                                	value={this.state.notes} 
                             		onChange={this.handleChange.bind(this, 'notes')}
                                />
                            </div>
                            <div className="form-group" >
                                <input type="hidden" className="form-control" id="image_url" placeholder="" />
                            </div>
                            <div id="contact_infos"></div>
                            <div className="form-group" >
                                <button className="btn btn-default contact-btn-address" id="contact_create_add_address" type="button" onClick={this._onAddClick}>Add New Address</button>
                            </div>
                            <div className="form-group" >
                                <button id="btn_contact_save" className="btn btn-default contact-btn-save" type="button" onClick={this._onSaveClick}>Save</button>
                            </div>
                            <div className="form-group" >
                                <button id="btn_contact_cancel" className="btn btn-default contact-btn-cancel" type="button" onClick={this._onCancelClick}>Cancel</button>
                            </div>

                            {this.state.infos.map(function(result) {
                               return <InfoForm onInfosChanged={self.onInfosChanged} key={result.id} data={result}/>;
                            })}                            
                        </form>
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

var ContactCreate = React.createClass({
    render: function() {
    	var { url, apikey, groupId } = this.props;

        return (
            <div>
                <HeaderContactCreate text="React Address Book"/>
                <div className="container">
                    <div className="row">
                        <div className="center-block trim">
                            <ContactCreateForm url={url} apikey={apikey} groupId={groupId} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


//--------------------------------------------------------------------------
//  Edit Contact
//--------------------------------------------------------------------------
var HeaderContactEdit = React.createClass({
    handleClick: function(event){
        var contactId = this.props.contactId;

        switch (event.target.id) {
            case 'contact_menu_logout':
                hashHistory.push('/login');
                break;  
            case 'contact_menu_back':
                hashHistory.push('/contact/' + contactId);
                break;  
        }
    },
    render: function () {
        return (
            <div className="navbar navbar-default navbar-static-top cen">
                <div className="col-md-4 pull-left">
                    <ul className="nav navbar-nav">
                    <li className="pull-left"><button type="button" id="contact_menu_back" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Back</button></li>
                    <li className="pull-left"><button type="button" id="contact_menu_logout" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Logout</button></li>
                    </ul>
                </div> 
                <div className="col-md-4">
                    <img src="./img/DreamFactory-logo-horiz.png" className="header-logo-align" height="25" />
                </div> 
                <div className="col-md-4"></div> 
            </div>
        );
    }
});

var InfoEditForm = React.createClass({
    handleInfosChange: function(id, props, data) {
        var update = {id: parseInt(id), name: data.target.name, value: data.target.value};

        this.props.onInfosChanged(update);
    },
    render: function() {
        return <div>
            <div className="form-group vert-offset-top-30"></div>
            <div className="form-group">
                <select name="info_type" className="form-control type" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} value={this.props.data.info_type}>
                    <option value="work">Work</option>
                    <option value="home">Home</option>
                    <option value="mobile">Mobile</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="form-group"><input type="text" className="form-control phone" name="phone" placeholder="Phone" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} value={this.props.data.phone} /></div>
            <div className="form-group"><input type="text" className="form-control email" name="email" placeholder="Email" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} value={this.props.data.email} /></div>
            <div className="form-group"><input type="text" className="form-control address" name="address" placeholder="Address" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)}  value={this.props.data.address} /></div>
            <div className="form-group"><input type="text" className="form-control city" name="city" placeholder="City" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)}  value={this.props.data.city} /></div>
            <div className="form-group"><input type="text" className="form-control state" name="state" placeholder="State" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)}  value={this.props.data.state} /></div>
            <div className="form-group"><input type="text" className="form-control zip" name="zip" placeholder="Zip" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} value={this.props.data.zip} /></div>
            <div className="form-group"><input type="text" className="form-control country" name="country" placeholder="Country" onChange={this.handleInfosChange.bind(this, this.props.data.id, this)} value={this.props.data.country} /></div>
        </div>;
    }
});

var ContactEditForm = React.createClass({
    getInitialState: function() {
        return {
            data: [],
            id: 0,
            firstName: '',
            lastName: '',
            twitter: '',
            skype: '',
            notes: '',
            infos: [],
            contactId: '',
            isOpen: false,
            modalContent: {
                headline: '',
                body: '',
                extended: ''
            }
        }
    },
    componentDidMount: function(){    
        this.getContactData();
    },
    getContactData: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var contactId = this.props.contactId;
        var token = localStorage.getItem('session_token');

        var params = '?ids=' + contactId;

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact' + params,
            data: null,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                if (response.hasOwnProperty('resource')) {
                    this.setState({id: response.resource[0].id});
                    this.setState({firstName: response.resource[0].first_name});
                    this.setState({lastName: response.resource[0].last_name});
                    this.setState({notes: response.resource[0].notes});
                    this.setState({twitter: response.resource[0].twitter});
                    this.setState({skype: response.resource[0].skype});

                    this.getContactInfoData();
                }
                else
                    console.log(response);
            }.bind(this),
            error: function(response) {
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
    },

    getContactInfoData: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var contactId = this.props.contactId;
        var token = localStorage.getItem('session_token');

        var params = 'filter=contact_id%3D' + contactId;

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_info',
            data: params,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                    if (response.hasOwnProperty('resource')) {
                        this.setState({infos: response.resource});
                    }
                    else
                        console.log(response);
            }.bind(this),
            error: function(response) {
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
    },
    onInfosChanged: function(infos) {
        var info = this.state.infos;
        var objId = null;

        for(var i = 0; i < info.length; i += 1) {
            if(info[i]['id'] === infos.id) {
                objId = i;
            }
        }

        var updId = infos.id;
        var updName = infos.name;
        var updValue = infos.value;

        var updatedInfos = {};
        updatedInfos[updName] = updValue;

        info[objId] = this.mergeObj(info[objId], updatedInfos);

        this.setState({infos: info});
    },
    mergeObj: function(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    },
    setContactData: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var token = localStorage.getItem('session_token');

        var firstName = this.state.firstName;
        var lastName = this.state.lastName;
        var twitter = this.state.twitter;
        var skype = this.state.skype;
        var notes = this.state.notes;
    
        var obj = {};

        obj['first_name'] = firstName;
        obj['last_name'] = lastName;
        obj['image_url'] = '';
        obj['twitter'] = twitter;
        obj['skype'] = skype;
        obj['notes'] = notes;
        obj['image_url'] = '';

        var params = JSON.stringify({resource: [obj]});

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact',
            data: params,
            cache:false,
            method:'POST',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {                    
                if (response.hasOwnProperty('resource')) {
                    this.setState({contactId: response.resource[0].id});
                    this.setContactRelation();
                }
                else
                    console.log(response);
            }.bind(this),
            error: function(response) {
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
    },
    setContactRelation: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var groupId = this.props.groupId;
        var token = localStorage.getItem('session_token');

        var obj = {};
        obj['contact_group_id'] = parseInt(groupId);
        obj['contact_id'] = parseInt(this.state.contactId);

        var params = JSON.stringify({resource: [obj]});

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group_relationship',
            data: params,
            cache:false,
            method:'POST',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                if (response.hasOwnProperty('resource')) {
                    this.setContactInfos();
                }
                else
                    console.log(response);
            }.bind(this),
            error: function(response) {
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
    },
    setContactInfos: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var contactId = this.props.contactId;
        var token = localStorage.getItem('session_token');

        var infos = this.state.infos;

        for(var i in infos) {
            var info = infos[i];
            delete info.id;

            info['contact_id'] = parseInt(contactId);
            info['ordinal'] = 0;

            var params = JSON.stringify({resource: [info]});

            $.ajax({
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                url: url + '/api/v2/db/_table/contact_info',
                data: params,
                cache:false,
                method:'POST',
                headers: {
                    "X-DreamFactory-API-Key": key,
                    "X-DreamFactory-Session-Token": token
                },
                success:function (response) {
                    
                },
                error: function(response) {
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

        var contactId = this.props.contactId;
        var url = location.href;
        var param = 'group'
        param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

        var regexS = "[\\?&]"+param+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var urlparams = regex.exec( url );

        hashHistory.push('/contact/' + contactId + '?group=' + urlparams[1]);
    },
    updateContactData: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var contactId = this.props.contactId;
        var token = localStorage.getItem('session_token');

        var obj = {}

        obj['first_name'] = this.state.firstName;
        obj['last_name'] = this.state.lastName;
        obj['twitter'] = this.state.twitter;
        obj['skype'] = this.state.skype;
        obj['notes'] = this.state.notes;
        obj['image_url'] = '';

        var params = JSON.stringify(obj);

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact/' + contactId,
            data: params,
            cache:false,
            method:'PATCH',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                this.deleteContactInfos();
            }.bind(this),
            error: function(response) {
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
    },
    deleteContactInfos: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var contactId = this.props.contactId;
        var token = localStorage.getItem('session_token');

        var params = 'filter=contact_id%3D' + contactId;

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_info?' + params,
            cache:false,
            method:'DELETE',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                this.setContactInfos();
            }.bind(this),
            error: function(response) {
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
    },
    handleChange: function (name, e) {
      var change = {};
      change[name] = e.target.value;
      this.setState(change);
    },
    _onAddClick: function() {
        var infos = this.state.infos;
        var len = infos.length;

        infos.push({
            id: len,
            info_type: 'work',
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        });

        this.setState({infos: infos});
    },

    _onSaveClick: function() {
        this.updateContactData()
    },
    _onCancelClick: function() {
        var contactId = this.props.contactId;
        var url = location.href;
        var param = 'group'
        param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

        var regexS = "[\\?&]"+param+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var params = regex.exec( url );
        
        hashHistory.push('/contact/' + contactId + '?group=' + params[1]);
    },
    openModal: function() {
        this.setState({isOpen: true});
    },
    closeModal: function() {
        this.setState({isOpen: false})
    },
    render: function() {
        var self = this;

        return (
            <div>
                <div className="row vert-offset-top-30"></div>
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <div className="person">
                        <form id="contact_create">
                            <input type="hidden" id="contact_create_group" value="" />
                            <input type="hidden" id="contact_create_contact" value="" />
                            <div className="form-group" >
                                <input type="text" 
                                    className="form-control" 
                                    id="first_name" 
                                    placeholder="First Name"
                                    value={this.state.firstName} 
                                    onChange={this.handleChange.bind(this, 'firstName')} 
                                />
                            </div>
                            <div className="form-group" >
                                <input type="text" 
                                    className="form-control" 
                                    id="last_name" 
                                    placeholder="Last Name" 
                                    value={this.state.lastName} 
                                    onChange={this.handleChange.bind(this, 'lastName')}
                                />
                            </div>
                            <div className="form-group" >
                                <input type="text" 
                                    className="form-control" 
                                    id="twitter" 
                                    placeholder="Twitter" 
                                    value={this.state.twitter} 
                                    onChange={this.handleChange.bind(this, 'twitter')}
                                />
                            </div>
                            <div className="form-group" >
                                <input type="text" 
                                    className="form-control" 
                                    id="skype" 
                                    placeholder="Skype" 
                                    value={this.state.skype} 
                                    onChange={this.handleChange.bind(this, 'skype')}
                                />
                            </div>
                            <div className="form-group" >
                                <input type="text" 
                                    className="form-control" 
                                    id="notes" 
                                    placeholder="Notes" 
                                    value={this.state.notes} 
                                    onChange={this.handleChange.bind(this, 'notes')}
                                />
                            </div>
                            <div className="form-group" >
                                <input type="hidden" className="form-control" id="image_url" placeholder="" />
                            </div>
                            <div id="contact_infos"></div>
                            <div className="form-group" >
                                <button className="btn btn-default contact-btn-address" id="contact_create_add_address" type="button" onClick={this._onAddClick}>Add New Address</button>
                            </div>
                            <div className="form-group" >
                                <button id="btn_contact_save" className="btn btn-default contact-btn-save" type="button" onClick={this._onSaveClick}>Save</button>
                            </div>
                            <div className="form-group" >
                                <button id="btn_contact_cancel" className="btn btn-default contact-btn-cancel" type="button" onClick={this._onCancelClick}>Cancel</button>
                            </div>
                            {this.state.infos.map(function(result) {
                               return <InfoEditForm onInfosChanged={self.onInfosChanged} key={result.id} data={result}/>;
                            })}
                        </form>
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

var ContactEdit = React.createClass({
    render: function() {
        var { url, apikey, contactId } = this.props;

        return (
            <div>
                <HeaderContactEdit contactId={contactId} />
                <div className="container">
                    <div className="row">
                        <div className="center-block trim">
                            <ContactEditForm url={url} apikey={apikey} contactId={contactId} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


//--------------------------------------------------------------------------
//  Delete Contact
//--------------------------------------------------------------------------
var ContactDelete = React.createClass({
    getInitialState: function() {
        return {
            isOpen: false,
            modalContent: {
                headline: '',
                body: '',
                extended: ''
            }
        }
    }, 
    deleteContact: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var contactId = this.props.contactId;
        var token = localStorage.getItem('session_token');

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact/' + contactId,
            cache:false,
            method:'DELETE',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                this.deleteContactInfos();
            }.bind(this),
            error: function(response) {
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
    },
    deleteGroupRelations: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var contactId = this.props.contactId;
        var token = localStorage.getItem('session_token');

        var params = 'filter=contact_id%3D' + contactId;

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group_relationship?' + params,
            cache:false,
            method:'DELETE',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                var url = location.href;
                var param = 'group'
                param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

                var regexS = "[\\?&]"+param+"=([^&#]*)";
                var regex = new RegExp( regexS );
                var urlparams = regex.exec( url );

                hashHistory.push('/group/' + urlparams[1]);
            },
            error: function(response) {
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
    },
    deleteContactInfos: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var contactId = this.props.contactId;
        var token = localStorage.getItem('session_token');

        var params = 'filter=contact_id%3D' + contactId;

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_info?' + params,
            cache:false,
            method:'DELETE',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                this.deleteGroupRelations();
            }.bind(this),
            error: function(response) {
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
    },
    componentWillMount: function(){
        this.deleteContact();
    },
    openModal: function() {
        this.setState({isOpen: true});
    },
    closeModal: function() {
        this.setState({isOpen: false})
    },
    render: function() {
        var { url, apikey, groupId } = this.props;

        return (
            <div>
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


//--------------------------------------------------------------------------
//  Modal Messages
//--------------------------------------------------------------------------
var If = React.createClass({
    render: function() {
        if (this.props.confirm) {
            return this.props.children;
        }
        else {
            return false;
        }
    }
});

var ErrorModal = React.createClass({
    hideModal: function() {
        this.props.closeModal();
    },
    render: function() {
        var { isOpen, headline, body, extended, confirm } = this.props;

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
                <If confirm={confirm}>
                        <button className='btn btn-primary' onClick={this.props.confirmModal}>OK</button>
                    </If>
                    <button className='btn btn-default' onClick={this.hideModal}>
                        Close
                    </button>
                </div>
            </Modal>
        )
    }
});


//--------------------------------------------------------------------------
//  Module Exports
//--------------------------------------------------------------------------
module.exports = {
        Contact: Contact,
        ContactCreate: ContactCreate,
        ContactEdit: ContactEdit,
        ContactDelete: ContactDelete
    };





