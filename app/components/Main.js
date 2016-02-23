
//--------------------------------------------------------------------------
//  Import modules
//--------------------------------------------------------------------------
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, hashHistory} from 'react-router';

import {Login, Logout} from './Login';
import Register from './Register';
import {Group, Groups, GroupCreate, GroupDelete, GroupEdit} from './Groups';
import {Contact, ContactCreate, ContactEdit, ContactDelete} from './Contacts';


//--------------------------------------------------------------------------
//  DreamFactory 2.0 instance specific constants
//--------------------------------------------------------------------------
const INSTANCE_URL = '';
const APP_API_KEY = '';
const VERSION = '1.0.0';

//--------------------------------------------------------------------------
//  Route Wrappers
//--------------------------------------------------------------------------

var LoginWrapper = React.createClass({
  render: function () {
    return (
      <Login url={INSTANCE_URL} version={VERSION} />
    );
  }
});

var LogoutWrapper = React.createClass({
  render: function () {
    return (
      <Logout url={INSTANCE_URL} />
    );
  }
});

var RegisterWrapper = React.createClass({
  render: function () {
    return (
      <Register url={INSTANCE_URL} />
    );
  }
});

var GroupsWrapper = React.createClass({
  render: function () {
    return (
      <Groups url={INSTANCE_URL} apikey={APP_API_KEY} />
    );
  }
});

var GroupWrapper = React.createClass({
  render: function () {
  	var groupId = this.props.params.groupId;

    return (
      <Group url={INSTANCE_URL} apikey={APP_API_KEY} groupId={groupId} />
    );
  }
});

var GroupCreateWrapper = React.createClass({
  render: function () {
    var groupId = this.props.params.groupId;

    return (
      <GroupCreate url={INSTANCE_URL} apikey={APP_API_KEY} />
    );
  }
});

var GroupDeleteWrapper = React.createClass({
  render: function () {
    var groupId = this.props.params.groupId;

    return (
      <GroupDelete url={INSTANCE_URL} apikey={APP_API_KEY} groupId={groupId} />
    );
  }
});

var GroupEditWrapper = React.createClass({
  render: function () {
    var groupId = this.props.params.groupId;

    return (
      <GroupEdit url={INSTANCE_URL} apikey={APP_API_KEY} groupId={groupId} />
    );
  }
});

var ContactWrapper = React.createClass({
  render: function () {
    var contactId = this.props.params.contactId;

    return (
      <Contact url={INSTANCE_URL} apikey={APP_API_KEY} contactId={contactId} />
    );
  }
});

var ContactCreateWrapper = React.createClass({
  render: function () {
    var groupId = this.props.params.groupId;

    return (
      <ContactCreate url={INSTANCE_URL} apikey={APP_API_KEY} groupId={groupId} />
    );
  }
});

var ContactEditWrapper = React.createClass({
  render: function () {
    var contactId = this.props.params.contactId;

    return (
      <ContactEdit url={INSTANCE_URL} apikey={APP_API_KEY} contactId={contactId} />
    );
  }
});

var ContactDeleteWrapper = React.createClass({
  render: function () {
    var contactId = this.props.params.contactId;

    return (
      <ContactDelete url={INSTANCE_URL} apikey={APP_API_KEY} contactId={contactId} />
    );
  }
});


//--------------------------------------------------------------------------
//  Routes
//--------------------------------------------------------------------------
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={LoginWrapper}/>
        <Route path="login" component={LoginWrapper} />
        <Route path="logout" component={LogoutWrapper} />
        <Route path="register" component={RegisterWrapper} />
  			<Route path="groups" component={GroupsWrapper} />
        <Route path="group/create" component={GroupCreateWrapper} />
        <Route path="group/:groupId/edit" component={GroupEditWrapper} />
        <Route path="group/:groupId/delete" component={GroupDeleteWrapper} />
  			<Route path="group/:groupId" component={GroupWrapper} />
        <Route path="contact/:groupId/create" component={ContactCreateWrapper} />
        <Route path="contact/:contactId/edit" component={ContactEditWrapper} />
        <Route path="contact/:contactId/delete" component={ContactDeleteWrapper} />
        <Route path="contact/:contactId" component={ContactWrapper} />  
    </Router>
), document.getElementById('app'));



