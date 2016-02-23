
//--------------------------------------------------------------------------
//  Import Modules
//--------------------------------------------------------------------------
import React from 'react';
import ReactDOM from 'react-dom';
import {Link, hashHistory} from 'react-router';
import {Table, Column, Cell} from 'fixed-data-table';


//--------------------------------------------------------------------------
//  Groups
//--------------------------------------------------------------------------
var HeaderGroups = React.createClass({
	handleClick: function(event){
        switch (event.target.id) {
			case 'groups_menu_logout':
				hashHistory.push('/logout');
				break;	
			case 'groups_menu_plus':
				hashHistory.push('/group/create');
				break;	
		}
    },
    render: function () {
        return (
            <div className="navbar navbar-fixed-top df-nav cen col-md-12">
               	<div className="col-md-4 pull-left">
               		<ul className="nav navbar-nav">
                    <li className="pull-left"><button type="button" id="groups_menu_logout" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Logout</button></li>
                    </ul>
               	</div> 
               	<div className="col-md-4">
               		<img src="./img/DreamFactory-logo-horiz.png" className="header-logo-align" height="25" />
               	</div> 
               	<div className="col-md-4">
               		<ul className="nav navbar-nav pull-right">
						<li className="pull-right"><button type="button" id="groups_menu_plus" className="btn btn-default btn-menu" onClick={this.handleClick}>+</button></li>
                    </ul>
               	</div> 
            </div>
        );
    }
});

var GroupsTable = React.createClass({
	getInitialState: function() {
    	return {
            data: [],
    		selected:[],
    		filteredDataList: [],
    		filteredData: [],
    	    tableWidth: 100,
            tableHeight: 100
        }
  	},
    loadGroups: function(){
    	var url = this.props.url;
		var key = this.props.apikey;
		var token = localStorage.getItem('session_token');

    	$.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group',
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                    if (response.hasOwnProperty('resource')) {
                        this.setState({data: response.resource});
                        
                        this._update();
                        
                        this.setState({
					      	filteredDataList: response.resource
					    });

					    this.setState({
					      	filteredData: response.resource
					    });
                    }
                    else
                        console.log(response);
            }.bind(this)
        });
    },
    componentWillMount: function(){
 		this.loadGroups();
 	}, 
 	componentDidMount: function(){ 	
 		this._update();
 	},
 	componentDidUpdate: function(){

 	}, 	
  	_update() {
		this.setState({
        	tableWidth  : groups_search.offsetWidth,
        	tableHeight : this.state.data.length*50+2
      	});
  	},
  	_onFilterChange(e) {
		var filterBy = e.target.value.toLowerCase();
		var size = this.state.data.length;
		var filteredIndexes = [];
		var _filteredData = [];

        if (!e.target.value) {
            this.setState({
                filteredDataList: this._dataList,
            });
        }

		for (var index = 0; index < size; index++) {
			var {name} = this.state.data[index];
			if (name.toLowerCase().indexOf(filterBy) !== -1) {
				filteredIndexes.push(index);
				_filteredData.push(this.state.data[index])
			}
		}

		this.setState({
			filteredData: _filteredData
		});

		this.setState({
			filteredDataList: filteredIndexes
		});
	},
    _onRowSelect: function(e, index) {
    	var row = this.state.filteredData[index];
		hashHistory.push('/group/' + row.id);
  	},
	render: function() {
		return (
			<div>
				<div className="row vert-offset-top-30"></div>
	            <div className="col-md-2"></div>
	            <div className="col-md-8">
	            	<div className="input-group" id="groups_search">
                        <div className="input-group-addon">
                            <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                        </div>
                        <input type="text" id="table_groups_search" className="form-control" placeholder="Search for groups" onChange={this._onFilterChange} />
                    </div>
					<div className="row vert-offset-top-25"></div>
					<Table
						rowsCount={this.state.filteredData.length}
						rowHeight={50}
						headerHeight={0}
						width={this.state.tableWidth}
						height={this.state.tableHeight}
						onRowClick={this._onRowSelect}
						{...this.props}>
						<Column
						header={<Cell>Name</Cell>}
						cell={props => (
						<Cell {...props}>
							{this.state.filteredData[props.rowIndex].name}
						</Cell>
						)}
						flexGrow={1}
						width={100}
						height={50}
						isResizable={true}
						/>
					</Table>
	        	</div>
	        	<div className="col-md-2"></div>
	        </div>
		);
	}
});

var Groups = React.createClass({
    render: function() {
    	var { url, apikey } = this.props;

        return (
            <div>
                <HeaderGroups text="React Address Book"/>
                <div className="container">
                    <div className="row">
                        <div className="center-block trim">
                            <GroupsTable url={url} apikey={apikey} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


//--------------------------------------------------------------------------
//  Show Group
//--------------------------------------------------------------------------
var HeaderGroup = React.createClass({
	handleClick: function(event){
        var groupId = this.props.groupId;
        
		switch (event.target.id) {
			case 'group_menu_back':
				hashHistory.push('/groups');
				break;
			case 'group_menu_logout':
				hashHistory.push('/login');
				break;	
			case 'group_menu_plus':
				hashHistory.push('/contact/' + groupId + '/create');
				break;	
            case 'group_menu_edit':
                hashHistory.push('/group/' + groupId + '/edit');
                break;  
            case 'group_menu_delete':
                hashHistory.push('/group/' + groupId + '/delete');
                break;  
		}
    },
    render: function () {
        return (
            <div className="navbar navbar-fixed-top df-nav cen col-md-12">
               	<div className="col-md-4 pull-left">
               		<ul className="nav navbar-nav">
                    <li className="pull-left"><button type="button" id="group_menu_back" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Back</button></li>
                    <li className="pull-left"><button type="button" id="group_menu_logout" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Logout</button></li>
                    </ul>
               	</div> 
               	<div className="col-md-4">
               		<img src="./img/DreamFactory-logo-horiz.png" className="header-logo-align" height="25" />
               	</div> 
               	<div className="col-md-4">
                   	<ul className="nav navbar-nav pull-right">
						<li className="pull-right"><button type="button" id="group_menu_plus" className="btn btn-default btn-menu" onClick={this.handleClick}>+</button></li>
                        <li className="pull-right"><button type="button" id="group_menu_edit" className="btn btn-default btn-menu" onClick={this.handleClick}>Edit Group</button></li>
                    <li className="pull-right"><button type="button" id="group_menu_delete" className="btn btn-default btn-menu" onClick={this.handleClick}>Delete Group</button></li>
                    </ul>
               	</div> 
            </div>
        );
    }
});

var GroupTable = React.createClass({
	getInitialState: function() {
    	return {
            data: [],
    		selected:[],
    		filteredDataList: [],
    		filteredData: [],
    	    tableWidth  : 100,
            tableHeight : 100
        }
  	},
    _onFilterChange(e) {
        var filterBy = e.target.value.toLowerCase();
        var size = this.state.data.length;
        var filteredIndexes = [];
        var _filteredData = [];   	

        if (!e.target.value) {
      		this.setState({
        		filteredDataList: this._dataList,
      		});
    	}

		for (var index = 0; index < size; index++) {
			var first_name = this.state.data[index].first_name;
			var last_name = this.state.data[index].last_name;
			if ((first_name.toLowerCase().indexOf(filterBy) !== -1) || (last_name.toLowerCase().indexOf(filterBy) !== -1)) {
				filteredIndexes.push(index);
				_filteredData.push(this.state.data[index])
			}
		}

		this.setState({
			filteredData: _filteredData
		});

		this.setState({
			filteredDataList: filteredIndexes
		});
	},
    loadRelationship: function(){
    	var url = this.props.url;
		var key = this.props.apikey;
		var groupId = this.props.groupId;
		var token = localStorage.getItem('session_token');

		var contactIds = '';
        var params = 'filter=contact_group_id%3D' + groupId + '&fields=contact_id';

    	$.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group_relationship',
            data: params,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key, 
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                if (response.hasOwnProperty('resource')) {
                    this.setState({data: response.resource});

                    var ids = response.resource;

                    for(var id in ids) {
                    	contactIds += ids[id].contact_id + ',';
                    }
                    contactIds = contactIds.replace(/(^,)|(,$)/g, "")

                    if(contactIds !== ''){
                        this.setState({ids: contactIds});
                        this.loadContacts();
                    }
                }
                else
                    console.log(response);
            }.bind(this)
        });
    },
    loadContacts: function(){
    	var url = this.props.url;
		var key = this.props.apikey;
		var token = localStorage.getItem('session_token');

		var params = 'ids=' + this.state.ids;

    	$.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact',
            data: params,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                    if (response.hasOwnProperty('resource')) {
                        this.setState({data: response.resource});

                        this._update();

                        this.setState({
					      	filteredDataList: response.resource
					    });

					    this.setState({
					      	filteredData: response.resource
					    });
                    }
                    else
                        console.log(response);
            }.bind(this)
        });
    },
    componentWillMount: function(){
 		this.loadRelationship();
 	}, 
 	componentWillUnmount() {
 		this._update();
    },
 	componentDidUpdate: function(){

 	},
 	componentDidMount: function(){
        this._update();
 	},
 	componentWillReceiveProps(props) {
    	this._update();
  	},
  	_update() {
		var tableHeight = this.state.data.length*50+2;

		if(this.state.filteredData.length) {
			tableHeight = this.state.filteredData.length*50+2;
		}
	    
	    this.setState({
	        tableWidth  : group_search.offsetWidth,
	        tableHeight : tableHeight
	    });
	},
    handleChange: function (name, e) {
      var change = {};
      change[name] = e.target.value;
      this.setState(change);
    },
    _onRowSelect: function(e, index) {
    	var contact = this.state.data[index];
        hashHistory.push('/contact/' + contact.id);
  	},
	render: function() {
		return (
			<div>
				<div className="row vert-offset-top-30"></div>
	            <div className="col-md-2"></div>
	            <div className="col-md-8">
	            	<div className="input-group" id="group_search">
                        <div className="input-group-addon">
                            <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                        </div>
                        <input type="text" id="table_groups_search" className="form-control" placeholder="Search for groups" onChange={this._onFilterChange} />
                    </div>

					<Table
						rowsCount={this.state.filteredData.length}
						rowHeight={50}
						headerHeight={0}
						width={this.state.tableWidth}
						height={this.state.tableHeight}
						onRowClick={this._onRowSelect}
						{...this.props}>
						<Column
						header={<Cell>Name</Cell>}
						cell={props => (
						<Cell {...props}>
							{this.state.filteredData[props.rowIndex].first_name} {this.state.filteredData[props.rowIndex].last_name}
						</Cell>
						)}
						flexGrow={1}
						width={100}
						height={50}
						isResizable={true}
						/>
      				</Table>
	        	</div>
	        	<div className="col-md-2"></div>
	        </div>
		);
	}
});


var Group = React.createClass({
    render: function() {
    	var { url, apikey, groupId } = this.props;

        return (
            <div>
                <HeaderGroup groupId={groupId} />
                <div className="container">
                    <div className="row">
                        <div className="center-block trim">
                            <GroupTable url={url} apikey={apikey} groupId={groupId} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


//--------------------------------------------------------------------------
//  Create Group
//--------------------------------------------------------------------------
var HeaderGroupCreate = React.createClass({
    handleClick: function(event){        
        switch (event.target.id) {
            case 'group_menu_back':
                hashHistory.push('/groups');
                break;
            case 'group_menu_logout':
                hashHistory.push('/login');
                break;   
        }
    },
    render: function () {
        return (
            <div className="navbar navbar-fixed-top df-nav cen col-md-12">
                <div className="col-md-4 pull-left">
                    <ul className="nav navbar-nav">
                        <li className="pull-left"><button type="button" id="group_menu_back" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Back</button></li>
                        <li className="pull-left"><button type="button" id="group_menu_logout" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Logout</button></li>
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

var GroupCreateTable = React.createClass({
    getInitialState: function() {
        return {
            data: [],
            selected:[],
            filteredDataList: [],
            filteredData: [],
            tableWidth  : 100,
            tableHeight : 100,
            groupName: '',
            storedGroupID: 0 
        }
    },
    handleClick: function(event){
        var {checked, value} = event.target;   
        var selectedCheckboxes = this.state.selected;
        
        if ( checked && selectedCheckboxes.indexOf(value) < 0 ) { 
            selectedCheckboxes.push(value);
        } else {
            selectedCheckboxes.splice(selectedCheckboxes.indexOf(value), 1);
        }  

        this.setState({
            selected: selectedCheckboxes
        });
    },
    _onFilterChange(e) {
        var filterBy = e.target.value.toLowerCase();
        var size = this.state.data.length;
        var filteredIndexes = [];
        var _filteredData = [];

        if (!e.target.value) {
            this.setState({
                filteredDataList: this._dataList,
            });
        }

        for (var index = 0; index < size; index++) {
            var first_name = this.state.data[index].first_name;
            var last_name = this.state.data[index].last_name;
            
            if ((first_name.toLowerCase().indexOf(filterBy) !== -1) || (last_name.toLowerCase().indexOf(filterBy) !== -1)) {
                filteredIndexes.push(index);
                _filteredData.push(this.state.data[index])
            }
        }

        this.setState({
            filteredData: _filteredData
        });

        this.setState({
            filteredDataList: filteredIndexes
        });
    },
    loadContacts: function(){
        var url = this.props.url;
        var key = this.props.apikey;
        var token = localStorage.getItem('session_token');

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact',
            data: null,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                if (response.hasOwnProperty('resource')) {
                    this.setState({data: response.resource});
                    
                    this._update();

                    this.setState({
                        filteredDataList: response.resource
                    });

                    this.setState({
                        filteredData: response.resource
                    });
                }
                else
                    console.log(response);
            }.bind(this)
        });
    },
  
    componentWillMount: function(){
        this.loadContacts();
    }, 
    componentDidUpdate: function(){

    },
    componentDidMount: function(){

    },
    _update() {
        var tableHeight = this.state.data.length*50+2;

        if(this.state.filteredData.length) {
            tableHeight = this.state.filteredData.length*50+2;
        }
        
        this.setState({
            tableWidth: group_search.offsetWidth,
            tableHeight: tableHeight
        });        
    },
    handleChange: function (name, e) {
      var change = {};
      change[name] = e.target.value;
      this.setState(change);
    },
    _onSaveClick: function() {
        this.saveGroup();
    },

    saveGroup: function(){
        var url = this.props.url;
        var key = this.props.apikey;
        var token = localStorage.getItem('session_token');

        var obj = {};
        obj['name'] = this.state.groupName;

        var params = JSON.stringify({resource: [obj]});

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group',
            data: params,
            cache:false,
            method:'POST',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {                    
                    if (response.hasOwnProperty('resource')) {
                        this.setState({
                            storedGroupID: response.resource[0].id
                        });
                        
                        this.saveGroupRelations();
                    }
                    else 
                        console.log(response);
            }.bind(this)
        });
    },
    saveGroupRelations: function(){
        var url = this.props.url;
        var key = this.props.apikey;
        var token = localStorage.getItem('session_token');
        var storedGroupID = this.state.storedGroupID;
        var contacts = this.state.selected;

        for(var i = 0; i < contacts.length; i++) {
            var obj = {};

            obj['contact_group_id'] = storedGroupID;
            obj['contact_id'] = contacts[i];

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

                }
            });
        };

        hashHistory.push('/groups');
    },
    render: function() {
        return (
            <div>
                <div className="row vert-offset-top-30"></div>
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <form className="form-inline">
                      <div className="form-group">
                        <input type="text" 
                            className="form-control" 
                            id="groupName" 
                            placeholder="Group Name"
                             value={this.state.groupName} 
                             onChange={this.handleChange.bind(this, 'groupName')}  
                        />
                      </div>
                      &nbsp;&nbsp;&nbsp;
                      <button className="btn btn-default" onClick={this._onSaveClick}>Save</button>
                    </form>
                    <div className="row vert-offset-top-25"></div>
                    <div className="input-group" id="group_search">
                        <div className="input-group-addon">
                            <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                        </div>
                        <input type="text" id="table_groups_search" className="form-control" placeholder="Search for groups" onChange={this._onFilterChange} />
                    </div>
                    <Table
                        rowsCount={this.state.filteredData.length}
                        rowHeight={50}
                        headerHeight={0}
                        width={this.state.tableWidth}
                        height={this.state.tableHeight}
                        {...this.props}>
                        <Column
                            header={<Cell>Name</Cell>}
                            cell={props => (
                            <Cell {...props}>
                                {this.state.filteredData[props.rowIndex].first_name} {this.state.filteredData[props.rowIndex].last_name}
                            </Cell>
                            )}
                            flexGrow={1}
                            width={100}
                            height={50}
                            isResizable={true}
                        />
                        <Column
                            header={<Cell>Name</Cell>}
                            cell={props => (
                            <Cell {...props}>
                                <input type="checkbox" 
                                    name={'checkbox_' + this.state.filteredData[props.rowIndex].id} 
                                    value={this.state.filteredData[props.rowIndex].id}
                                    onClick={this.handleClick} />
                            </Cell>
                            )}
                            width={35}
                            height={50}
                        /> 
                    </Table>
                </div>
                <div className="col-md-2"></div>
            </div>
        );
    }
});

var GroupCreate = React.createClass({
    render: function() {
        var { url, apikey } = this.props;

        return (
            <div>
                <HeaderGroupCreate/>
                <div className="container">
                    <div className="row">
                        <div className="center-block trim">
                            <GroupCreateTable url={url} apikey={apikey} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


//--------------------------------------------------------------------------
//  Delete Group
//--------------------------------------------------------------------------
var GroupDelete = React.createClass({
    getInitialState: function() {
        return {
            ids: '',
            relations: []
        }
    },
    deleteGroup: function() {

        var url = this.props.url;
        var key = this.props.apikey;
        var groupId = this.props.groupId;
        var token = localStorage.getItem('session_token');

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group/' + groupId,
            cache:false,
            method:'DELETE',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                this.getGroupRelations();
            }.bind(this)
        });        
    },
    getGroupRelations: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var groupId = this.props.groupId;
        var token = localStorage.getItem('session_token');

        var contactIds = [];
        var relationIds = [];

        var params = 'filter=contact_group_id%3D' + groupId + '&fields=id';

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group_relationship?' + params,
            data: null,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                if (response.hasOwnProperty('resource')) {
                    var ids = response.resource;

                    for(var id in ids) {
                        relationIds.push(ids[id].id);
                    }

                    if(relationIds.length){
                        this.setState({relations: relationIds});
                        this.deleteGroupRelations();
                    }
                    else {
                        hashHistory.push('/groups');
                    }
                    
                }
            }.bind(this)
        });

    },
    deleteGroupRelations: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var groupId = this.props.groupId;
        var token = localStorage.getItem('session_token');

        var groupRelations = this.state.relations;

        for(var id in groupRelations) {

            var relationId = groupRelations[id];
        
            $.ajax({
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                url: url + '/api/v2/db/_table/contact_group_relationship/' + relationId,
                cache:false,
                method:'DELETE',
                headers: {
                    "X-DreamFactory-API-Key": key,
                    "X-DreamFactory-Session-Token": token
                },
                success:function (response) {

                }
            });
        }

        hashHistory.push('/groups');
    },
    componentWillMount: function(){
        this.deleteGroup();
    },
    render: function() {
        var { url, apikey, groupId } = this.props;

        return (
            <div></div>
        );
    }
});


//--------------------------------------------------------------------------
//  Edit Group
//--------------------------------------------------------------------------
var HeaderGroupEdit = React.createClass({
    handleClick: function(event){
        var groupId = this.props.groupId;
        
        switch (event.target.id) {
            case 'group_menu_back':
                hashHistory.push('/group/' + groupId);
                break;
            case 'group_menu_logout':
                hashHistory.push('/login');
                break;  
        }

    },
    render: function () {
        return (
            <div className="navbar navbar-fixed-top df-nav cen col-md-12">
                <div className="col-md-4 pull-left">
                    <ul className="nav navbar-nav">
                    <li className="pull-left"><button type="button" id="group_menu_back" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Back</button></li>
                    <li className="pull-left"><button type="button" id="group_menu_logout" className="btn btn-default btn-menu-logout" onClick={this.handleClick}>Logout</button></li>
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

var GroupEditTable = React.createClass({
    getInitialState: function() {
        return {
            data: [],
            selected:[],
            filteredDataList: [],
            filteredData: [],
            tableWidth  : 100,
            tableHeight : 100,
            groupName: ''
        }
    },
    handleClick: function(event){
        var {checked, value} = event.target;   
        var selectedCheckboxes = this.state.selected;

        if ( checked && selectedCheckboxes.indexOf(value) < 0 ) {
          selectedCheckboxes.push(parseInt(value));
        } else {
          selectedCheckboxes.splice(selectedCheckboxes.indexOf(value), 1);
        }  

        this.setState({
            selected: selectedCheckboxes
        });
    },
    _onFilterChange(e) {
        var filterBy = e.target.value.toLowerCase();
        var size = this.state.data.length;
        var filteredIndexes = [];
        var _filteredData = [];

        if (!e.target.value) {
            this.setState({
                filteredDataList: this._dataList,
            });
        }

        for (var index = 0; index < size; index++) {
            var first_name = this.state.data[index].first_name;
            var last_name = this.state.data[index].last_name;
            
            if ((first_name.toLowerCase().indexOf(filterBy) !== -1) || (last_name.toLowerCase().indexOf(filterBy) !== -1)) {
                filteredIndexes.push(index);
                _filteredData.push(this.state.data[index])
                console.log(this.state.data[index])
            }
        }

        this.setState({
            filteredData: _filteredData
        });

        this.setState({
            filteredDataList: filteredIndexes
        });
    },
    loadContacts: function(){
        var url = this.props.url;
        var key = this.props.apikey;
        var token = localStorage.getItem('session_token');

        var params = 'ids=' + this.state.ids;

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact',
            data: null,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                if (response.hasOwnProperty('resource')) {
                    this.setState({data: response.resource});

                    this._update();

                    this.setState({
                        filteredDataList: response.resource
                    });

                    this.setState({
                        filteredData: response.resource
                    });
                }
                else
                    console.log(response);
            }.bind(this)
        });
    },
    componentWillMount: function(){
        this.fillName();
        this.fillTable();  
        this.loadContacts();
    }, 
    componentDidMount: function(){
        this._update();
    },
    fillTable: function(){
        var url = this.props.url;
        var key = this.props.apikey;
        var groupId = this.props.groupId;
        var token = localStorage.getItem('session_token');

        var contactIds = [];
        var relationIds = [];

        var params = 'filter=contact_group_id%3D' + groupId + '&fields=contact_id';

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group_relationship?' + params,
            data: null,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {

                if (response.hasOwnProperty('resource')) {
                    var ids = response.resource;

                    for(var id in ids) {
                        contactIds.push(ids[id].contact_id);
                    }

                    if(contactIds.length){
                        this.setState({selected: contactIds});
                    }                    
                }
            }.bind(this)
        });
    },
    fillName: function(){
        var url = this.props.url;
        var key = this.props.apikey;
        var groupId = this.props.groupId;
        var token = localStorage.getItem('session_token');

        var params = 'filter=contact_group_id%3D' + groupId + '&fields=contact_id';

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group/' + groupId,
            data: null,
            cache:false,
            method:'GET',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                if (response.hasOwnProperty('name')) {
                    var groupName = response.name;

                    this.setState({
                        groupName: groupName
                    });
                }
            }.bind(this)
        });
    },
    _update() {
        var tableHeight = this.state.data.length*50+2;

        if(this.state.filteredData.length) {
            tableHeight = this.state.filteredData.length*50+2;
        }
        
        this.setState({
            tableWidth  : group_search.offsetWidth,
            tableHeight : tableHeight
        });
    },
    handleChange: function (name, e) {
      var change = {};
      change[name] = e.target.value;
      this.setState(change);
    },
    _onSaveClick: function() {
        this.updateGroupName();
    },
    updateGroupName: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var groupId = this.props.groupId;
        var token = localStorage.getItem('session_token');

        var param = JSON.stringify({name: this.state.groupName});

        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            url: url + '/api/v2/db/_table/contact_group/' + groupId,
            data: param,
            cache:false,
            method:'PATCH',
            headers: {
                "X-DreamFactory-API-Key": key,
                "X-DreamFactory-Session-Token": token
            },
            success:function (response) {
                this.removeGroupRelations();
            }.bind(this)
        });
    },
    removeGroupRelations: function() {
        var url = this.props.url;
        var key = this.props.apikey;
        var groupId = this.props.groupId;
        var token = localStorage.getItem('session_token');

        var params = 'filter=contact_group_id%3D' + groupId;

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
                this.saveGroupRelations()
            }.bind(this)
        });
    },
    saveGroupRelations: function(){
        var url = this.props.url;
        var key = this.props.apikey;
        var token = localStorage.getItem('session_token');
        var groupId = this.props.groupId;
        var contacts = this.state.selected;

        for(var i = 0; i < contacts.length; i++) {
            var obj = {};

            obj['contact_group_id'] = groupId;
            obj['contact_id'] = contacts[i];

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

                }
            });
        }

        hashHistory.push('/group/' + groupId);
    },
    render: function() {
        return (
            <div>
                <div className="row vert-offset-top-30"></div>
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <form className="form-inline">
                      <div className="form-group">
                        <input type="text" 
                            className="form-control" 
                            id="groupName" 
                            placeholder="Group Name"
                             value={this.state.groupName} 
                             onChange={this.handleChange.bind(this, 'groupName')}  
                        />
                      </div>
                      &nbsp;&nbsp;&nbsp;
                      <button className="btn btn-default" onClick={this._onSaveClick}>Update</button>
                    </form>
                    <div className="row vert-offset-top-25"></div>
                    <div className="input-group" id="group_search">
                        <div className="input-group-addon">
                            <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                        </div>
                        <input type="text" id="table_groups_search" className="form-control" placeholder="Search for groups" onChange={this._onFilterChange} />
                    </div>
                    <Table
                        rowsCount={this.state.filteredData.length}
                        rowHeight={50}
                        headerHeight={0}
                        width={this.state.tableWidth}
                        height={this.state.tableHeight}
                        {...this.props}>
                        <Column
                            header={<Cell>Name</Cell>}
                            cell={props => (
                                <Cell {...props}>
                                    {this.state.filteredData[props.rowIndex].first_name} {this.state.filteredData[props.rowIndex].last_name}
                                </Cell>
                            )}
                            flexGrow={1}
                            width={100}
                            height={50}
                            isResizable={true}
                        />
                        <Column
                            header={<Cell>Name</Cell>}
                            cell={props => (
                                <Cell {...props}>
                                    <input type="checkbox" 
                                        name={'checkbox_' + this.state.filteredData[props.rowIndex].id} 
                                        value={this.state.filteredData[props.rowIndex].id}
                                        onChange={this.handleClick}
                                        checked={function(){
                                            if(this.state.selected.indexOf(parseInt(this.state.filteredData[props.rowIndex].id)) > -1){
                                                return "checked" 
                                            }
                                            else
                                                return ""
                                            }.call(this)
                                        }
                                    />
                                </Cell>
                            )}
                            width={35}
                            height={50}
                        /> 
                    </Table>
                </div>
                <div className="col-md-2"></div>
            </div>
        );
    }
});

var GroupEdit = React.createClass({
    render: function() {
        var { url, apikey, groupId } = this.props;

        return (
            <div>
                <HeaderGroupEdit groupId={groupId} />
                <div className="container">
                    <div className="row">
                        <div className="center-block trim">
                            <GroupEditTable url={url} apikey={apikey} groupId={groupId} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


//--------------------------------------------------------------------------
//  Module Exports
//--------------------------------------------------------------------------
module.exports = {
        Group: Group, 
        Groups: Groups, 
        GroupCreate: GroupCreate, 
        GroupDelete: GroupDelete, 
        GroupEdit: GroupEdit
};


