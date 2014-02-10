var Utils = window.Utils = {};

Utils.makeId = function() {
    function S4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

getUserByEmail = function(email) {
	var user = Meteor.users.findOne({'profile.username' : email});
	return (user) ? user : { profile : {name : email, username : email, gravatar : 'http://www.gravatar.com/avatar/' + md5(email.trim().toLowerCase()) + '?s=200'} };
}

getProjects = function() {
	if(Meteor.user()) {
		return Projects.find({
			sharedWith : Meteor.user().profile.username
		}).fetch();
	}
	return [];
}

getProjectUsers = function(projectId) {
	var project = Projects.findOne(projectId);
	if(project) {
		return project.sharedWith.map(getUserByEmail);
	}
	return [];
}

getRelationships = function() {
	var relationships = getProjects().map(function(project){
		var users = project.sharedWith.map(getUserByEmail);
		return _.flatten(users);
	});
	if(Meteor.user())
		relationships.push(Meteor.user());
	return _.uniq(_.flatten(relationships));
}