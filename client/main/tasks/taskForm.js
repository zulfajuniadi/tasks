Template.taskFormContents.rendered = function() {
    var projectId = Session.get('activeProject');
    var taskId = Session.get('activeTask');
    var project = Projects.findOne(projectId);
    var task = Tasks.findOne(taskId);
    if (project) {
        var users = getProjectUsers(project._id).map(function(data) {
            return {
                id: data.profile.username,
                text: data.profile.name + ' (' + data.profile.username + ')'
            }
        });
        $('.taskForm .assigned').select2({
            tags: users,
            multiple: true,
        });

        if (task) {
            $(".taskForm .startDate").datepicker({
                defaultDate: "+1w",
                dateFormat: 'yy-mm-dd',
                minDate: task.startDate,
                maxDate: task.endDate,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function(selectedDate) {
                    $(".endDate").datepicker("option", "minDate", selectedDate);
                }
            });
            $(".taskForm .endDate").datepicker({
                defaultDate: "+1w",
                dateFormat: 'yy-mm-dd',
                minDate: task.startDate,
                maxDate: task.endDate,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function(selectedDate) {
                    $(".startDate").datepicker("option", "maxDate", selectedDate);
                }
            });
        } else {
            $(".taskForm .startDate").datepicker({
                defaultDate: "+1w",
                dateFormat: 'yy-mm-dd',
                minDate: project.startDate,
                maxDate: project.endDate,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function(selectedDate) {
                    $(".endDate").datepicker("option", "minDate", selectedDate);
                }
            });
            $(".taskForm .endDate").datepicker({
                defaultDate: "+1w",
                dateFormat: 'yy-mm-dd',
                minDate: project.startDate,
                maxDate: project.endDate,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function(selectedDate) {
                    $(".startDate").datepicker("option", "maxDate", selectedDate);
                }
            });
        }
    }
};

Template.taskFormContents.users = function() {
    return Meteor.users.find().fetch();
};
Template.taskFormContents.project = function() {
    return Projects.findOne(Session.get('activeProject'));
};

Template.taskFormContents.task = function() {
    return Tasks.findOne(Session.get('activeTask'));
}

Template.taskFormContents.events({
    'submit .taskForm': function(e) {
        var data = $(e.target).serializeJSON();
        var project = Projects.findOne({
            _id: Session.get('activeProject')
        });
        var userId = Meteor.userId();
        data.assigned = data.assigned.split(',').filter(function(userId) {
            return (userId.trim());
        });
        var diff = _.difference(data.assigned, project.sharedWith);
        diff.forEach(function(email) {
            if (!confirm(email + ' is not in the project shared with list. Do you want to add ' + email + '?')) {
                data.assigned = _.without(data.assigned, email);
                diff = _.without(diff, email);
            }
        });
        if (diff.length > 0) {
            project.sharedWith = _.uniq(project.sharedWith.concat(diff));
            Projects.update(project._id, {
                $set: {
                    sharedWith: sharedWith
                }
            });
        }
        data.activities = [{
            _id: Utils.makeId(),
            type: 'message',
            user: Meteor.user().profile.username,
            message: 'created this task.',
            createdAt: new Date()
        }];
        data.state = 'new';
        data.projectId = project._id;
        Tasks.insert(data);
        e.target.reset();
        $('#task-form').modal('hide');

        return false;
    }
});