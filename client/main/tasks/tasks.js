Template.tasks.project = function() {
	if (Session.equals('activeProject', '##__ALL__##')) {
		return {
			name: 'All Tasks'
		}
	}
	return Projects.findOne(Session.get('activeProject'));
};

Template.tasks.tasks = function() {
	if(Meteor.user()) {
		if (Session.equals('activeProject', '##__ALL__##')) {
			return _.groupBy(Tasks.find({
					projectId: {
						$in: _.pluck(getProjects(), '_id')
					},
					assigned : Meteor.user().profile.username
				}).fetch().map(function(task) {
					task.assigned = task.assigned.map(getUserByEmail);
					task.projectName = Projects.findOne({_id : task.projectId}).name;
					return task;
				}
			), 'state');
		}
		var projectId = Session.get('activeProject');
		var tasks = Tasks.find({
			projectId: projectId
		}).fetch().map(function(task) {
			task.assigned = task.assigned.map(getUserByEmail);
			return task;
		});
		if (tasks.length > 0) {
			return _.groupBy(tasks, 'state');
		} else {
			return {
				'new' : [],
				'doing' : [],
				'done' : []
			};
		}
	} else {
		return {};
	}
};

Template.tasks.events({
	'click #newTask': function() {
		Session.set('activeTask', null);
		var projectId = Session.get('activeProject');
		var project = Projects.findOne(projectId);
		$('#task-form').modal('show');
	}
});