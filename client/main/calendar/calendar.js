Template.calendar.events = function(){
	return Projects.find({
		sharedWith : Meteor.userId()
	}).fetch();
}

Template.calendar.rendered = function(){
	var calendarWrapper = $('#calendar');
	var events = Projects.find({
		sharedWith : Meteor.userId()
	}).fetch().map(function(project){
		return {
			title : project.name,
			start : project.startDate,
			end : project.endDate,
			url : '/#/project/' + project._id + '/tasks'
		}
	});
	console.log(events)
	// calendarWrapper.height(0.6 * calendarWrapper.width());
	calendarWrapper.fullCalendar({
		editable : true,
		events : events,
		dayRender : function(date, cell) {
			// console.log(date);
		},
		dayClick : function(){
			console.log(this);
		}
	});
}