Template.projects.events({
	'click .new-widget' : function(){
		$('#project-form').modal('show');
	}
});

Template.projects.projects = function() {
	if(Meteor.userId())
		return getProjects().map(function(project){
			project.users = getProjectUsers(project._id);
			project.tasks = _.groupBy(Tasks.find({projectId : project._id}).fetch(), 'state');
			return project;
		});
}