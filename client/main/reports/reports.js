Template.reports.tasks = function() {
	return _.flatten(getProjects().map(function(project){
		return Tasks.find({projectId : project._id}).fetch().map(function(task){
			task.projectName = project.name;
			task.users = task.assigned.map(getUserByEmail);
			return task;
		});
	}));
}