function checkLogin(loggedIn, loggedOut) {
	Meteor.call('isLoggedIn', function(err, res){
		if(res) {
			if(loggedIn !== undefined) {
				routie(loggedIn);
			}
			return;
		}
		if(loggedOut !== undefined) {
			routie(loggedOut);
		}
	});
}

Meteor.startup(function(){
	if(window.location.toString().indexOf('/#') === -1) {
		window.location = '/#';
	}

	var routes = {
		'/login' : function(){
			checkLogin('#/projects');
			Session.set('route', 'login');
		},
		'/logout' : function() {
			Meteor.logout(function() {
				window.location = '#/login';
			});
		},
		'/tasks' : function() {
			checkLogin(undefined, '#/login');
			Session.set('activeProject', '##__ALL__##');
			Session.set('route', 'mytask');
		},
		'/projects' : function() {
			checkLogin(undefined, '#/login');
			Session.set('route', 'projects');
		},
		'/reports' : function() {
			checkLogin(undefined, '#/login');
			Session.set('route', 'reports');
		},
		'/project/:projectId/tasks' : function(projectId) {
			checkLogin(undefined, '#/login');
			Session.set('activeProject', projectId);
			Session.set('route', 'tasks');

		},
		'/gantt/:projectId' : function(projectId) {
			checkLogin(undefined, '#/login');
			Session.set('activeProject', projectId);
			Session.set('route', 'gantt');
		},
		'/calendar/:projectId' : function(projectId) {
			checkLogin(undefined, '#/login');
			Session.set('activeProject', projectId);
			Session.set('route', 'calendar');
		},
		'/calendar' : function() {
			checkLogin(undefined, '#/login');
			Session.set('route', 'calendar');
		},
		'*' : function(){
			console.log('404');
			checkLogin('#/projects', '#/login');
		}
	}
	routie(routes);
	checkLogin(null, '#/login');
});


Template.outlet._session = function() {
	return Session.get('route');
}