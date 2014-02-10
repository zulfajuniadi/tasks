Template.gantt.events = function(){
	return Projects.findOne({_id : Session.get('activeProject')});
}

Template.gantt.tasks = function(){
	return Tasks.find({projectId : Session.get('activeProject')}).fetch();
}

Template.gantt.rendered = function(){

	function getHeirarchy(items) {
		items = items.map(function(item){
			item.children = getHeirarchy(Tasks.find({parent : item._id}).fetch());
			return item;
		});
		return items;
	}

	var project = Projects.findOne({_id : Session.get('activeProject')});

	if(project) {
		project.tasks = getHeirarchy(Tasks.find({projectId : project._id, level : '0'}, {sort : {endDate : 1}}).fetch());

		$("#gantt").gantt({
			project : project,
			projectStartDate : 'startDate',
			projectEndDate : 'endDate',
			tasks : 'tasks',
			taskId : '_id',
			taskChild : 'children', // optional
			taskTitle : 'name',
			taskClass : 'state', // optional
			taskStartDate : 'startDate',
			taskEndDate : 'endDate',
			taskLevel : 'level', // optional,
			taskOrder : 'order',
			titleCellCallback : function (data, cell) {

			},
			onClick : function(event, data, element) {
				// console.log(event, data, element);
			},
			onMove : function(event, newData, oldData, element, revert) {
				return Tasks.update({_id : newData._id}, {$set : {startDate : moment(newData.startDate).format('YYYY-MM-DD'), endDate : moment(newData.endDate).format('YYYY-MM-DD')}});
			},
			onResize : function(event, newData, oldData, element, revert) {
				return Tasks.update({_id : newData._id}, {$set : {endDate : moment(newData.endDate).format('YYYY-MM-DD')}});
			}
		});
	}

	// $("#gantt").popover({
	// 	selector: ".bar",
	// 	title: "I'm a popover",
	// 	content: "And I'm the content of said popover.",
	// 	trigger: "hover"
	// });
}