Template.taskDetails.events({
    'click #toggleTaskForm': function(e) {
        Session.set('newTaskForm', !Session.get('newTaskForm'));
    },
    'keyup #newComment': function(e) {
        var input = document.getElementById('newComment');
        var value = input.value;
        if (e.keyCode === 13 && value.length > 0) {
            var task = Tasks.findOne(Session.get('activeTask'));
            input.value = '';
            Tasks.update({
                _id: task._id
            }, {
                $push: {
                    activities: {
                        _id: Utils.makeId(),
                        user: Meteor.user().profile.username,
                        message: value,
                        createdAt: new Date(),
                        type: 'message'
                    }
                }
            });
        }
    },
    'click .deleteActivity': function(e) {
        var task = Tasks.findOne(Session.get('activeTask'));
        var self = this;
        bootbox.confirm('Are you sure you want to remove ' + this.message + ' from ' + task.name + '?', function(res) {
            if (res) {
                Tasks.update({
                    _id: task._id
                }, {
                    $pull: {
                        activities: self
                    }
                });
            }
        })
    },
    'keyup #newSubtask': function(e) {
        if (e.keyCode === 13) {
            var task = Tasks.findOne(Session.get('activeTask'));
            var input = document.getElementById('newSubtask');
            var value = input.value;
            input.value = '';
            Tasks.update({
                _id: task._id
            }, {
                $push: {
                    subtasks: {
                        _id: Utils.makeId(),
                        user: Meteor.userId(),
                        name: value,
                        createdAt: new Date(),
                        done: false
                    }
                }
            });
        }
    },
    // 'click .subtask-undone': function() {
    //     var doneTask = this;
    //     var task = Tasks.findOne(Session.get('activeTask'));
    //     task.subtasks = task.subtasks.map(function(subtask) {
    //         if (subtask._id === doneTask._id)
    //             subtask.done = true;
    //         return subtask;
    //     });
    //     Tasks.update({
    //         _id: task._id
    //     }, {
    //         $set: {
    //             subtasks: task.subtasks
    //         }
    //     });
    // },
    'click .subtask-remove': function() {
        var removeTask = this;
        bootbox.confirm('Are you sure you want to remove the ' + this.name + ' subtask?', function(res) {
            if (res) {
                var task = Tasks.findOne(Session.get('activeTask'));
                task.subtasks = task.subtasks.filter(function(subtask) {
                    if (subtask._id === removeTask._id)
                        return false;
                    return true;
                });
                Tasks.update({
                    _id: task._id
                }, {
                    $set: {
                        subtasks: task.subtasks
                    }
                });
            }
        });
    },
    // 'click .subtask-done': function() {
    //     var undoneTask = this;
    //     var task = Tasks.findOne(Session.get('activeTask'));
    //     task.subtasks = task.subtasks.map(function(subtask) {
    //         if (subtask._id === undoneTask._id)
    //             subtask.done = false;
    //         return subtask;
    //     });
    //     Tasks.update({
    //         _id: task._id
    //     }, {
    //         $set: {
    //             subtasks: task.subtasks
    //         }
    //     });
    // },
    'click .subtaskLink': function() {
        Session.set('activeTask', this._id);
    },
    'click #rescheduleStartDate': function() {
        var task = this;
        var project = Projects.findOne({
            _id: task.projectId
        });
        $("#rescheduleSDInput").datepicker({
            changeMonth: true,
            dateFormat: 'yy-mm-dd',
            minDate: moment(project.startDate).toDate(),
            maxDate: moment(task.endDate).toDate(),
            numberOfMonths: 1,
            onSelect: function() {
                var value = $("#rescheduleSDInput").val();
                bootbox.confirm('Are you sure you want to reschedule the start date of this task to ' + value + '?', function(res) {
                    if (res) {
                        Tasks.update({
                            _id: task._id
                        }, {
                            $set: {
                                startDate: value
                            }
                        })
                    }
                });

            },
            beforeShow: function() {
                setTimeout(function() {
                    $('.ui-datepicker').css('z-index', 1050);
                }, 0);
            }
        });
    },
    'click #rescheduleEndDate': function() {
        var task = this;
        var project = Projects.findOne({
            _id: task.projectId
        });
        $("#rescheduleEDInput").datepicker({
            changeMonth: true,
            dateFormat: 'yy-mm-dd',
            minDate: moment(task.startDate).toDate(),
            maxDate: moment(project.endDate).toDate(),
            numberOfMonths: 1,
            onSelect: function() {
                var value = $("#rescheduleEDInput").val();
                bootbox.confirm('Are you sure you want to reschedule the end date of this task to ' + value + '?', function(res) {
                    if (res) {
                        Tasks.update({
                            _id: task._id
                        }, {
                            $set: {
                                endDate: value
                            }
                        });
                    }
                });
            },
            beforeShow: function() {
                setTimeout(function() {
                    $('.ui-datepicker').css('z-index', 1050);
                }, 0);
            }
        });
    },
    'click .unlinkTask': function() {
        var data = this;
        bootbox.confirm('Are you sure you want to remove ' + this.name + '?', function(res) {
            if (res) {
                Tasks.remove({
                    _id: data._id
                }, function(err) {
                    if (err) return;
                    APIRequest('remove', 'tasks', data);
                });
                $('#task-details-modal').modal('hide');
            }
        })
    },
    'click #unshare': function(e) {
        var user = this;
        var taskId = $(e.currentTarget).data('taskid');
        if (taskId) {
            bootbox.confirm('Are you sure you want to unassign ' + user.profile.username + ' from this task?', function(res) {
                if (res) {
                    var task = Tasks.findOne({
                        _id: taskId
                    });
                    task.assigned = _.without(task.assigned, user.profile.username);
                    Tasks.update(task._id, {
                        $set: {
                            assigned: task.assigned
                        }
                    });
                }
            })
        }
    },
    'submit #addAssigned': function(e) {
        var project = Projects.findOne({
            _id: Session.get('activeProject')
        });
        var email = $('#addAssignedInput').val(),
            task = this;
        bootbox.confirm('Are you sure you want to add ' + email + ' to this task', function(res) {
            if (res) {
                if (project.sharedWith.indexOf(email) === -1) {
                    Projects.update(project._id, {
                        $push: {
                            sharedWith: email
                        }
                    });
                }
                if (task.assigned.indexOf(email) === -1) {
                    task.assigned = _.uniq(task.assigned);
                    Tasks.update(task._id, {
                        $push: {
                            assigned: email
                        }
                    });
                }
            }
        })
        e.preventDefault();
        return false;
    }
});

Template.taskDetails.newTaskForm = function() {
    return Session.get('newTaskForm');
}

Template.taskDetails.project = function() {
    var activeTask = Session.get('activeTask');
    var task = Tasks.findOne({
        _id: activeTask
    });
    if (task) {
        return Projects.findOne({
            _id: task.projectId
        });
    }
};

Template.taskDetails.task = function() {
    var activeTask = Session.get('activeTask');
    var task = Tasks.findOne(activeTask);
    if (task) {
        task.assignedTo = task.assigned.map(getUserByEmail);
        if (task.parent) {
            task.parent = Tasks.findOne({
                _id: task.parent
            });
        }
        task.subtasks = function() {
            return Tasks.find({
                parent: task._id
            }).fetch();
        };
        task.activities = task.activities.map(function(activity) {
            activity.user = Meteor.users.findOne(activity.user);
            return activity;
        }).sort(function(a, b) {
            return moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf();
        });
        return task;
    }
};

Template.taskDetails.user = function() {
    return Meteor.user();
};

Template.taskDetails.rendered = function() {
    // $('.task-info .title:first').trigger('click');
    $('#newComment').focus();
    $('[rel=popover]').popover();
}