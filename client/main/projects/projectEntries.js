Template.projectEntries.events({
    'click .removeProject': function() {
        var self = this;
        bootbox.confirm('Are you sure you want to remove the ' + this.name + ' project?',
            function(res) {
                if (res) {
                    var data = self;
                    Tasks.find({
                        projectId: self._id
                    }).fetch().forEach(function(task) {
                        Tasks.remove(task._id);
                    });
                    Projects.remove({
                        _id: self._id
                    });
                }
            })
    },
    'click #unshare': function(e) {
        var projectId = $(e.currentTarget).data('projectid');
        var user = this;
        var tasks = Tasks.find({
            projectId: projectId,
            assigned: user.profile.username
        }).fetch();
        bootbox.confirm('Are you sure you want to unshare this project with ' + user.profile.username + '?', function(res) {
            if (res) {
                tasks.forEach(function(task) {
                    Tasks.update(task._id, {
                        $pull: {
                            assigned: user.profile.username
                        }
                    });
                });
                var project = Projects.findOne({
                    _id: projectId
                });
                Projects.update(project._id, {
                    $pull: {
                        sharedWith: user.profile.username
                    }
                });
            }
        })
    },
    'submit #shareProject': function(e) {
        var self = this;
        var email = $('#shareProjectInput').val(),
            project = Projects.findOne({
                _id: self._id
            });
        bootbox.confirm('Are you sure you want to add ' + email + ' to this project', function(res) {
            if (res) {
                project.sharedWith.push(email);
                project.sharedWith = _.uniq(project.sharedWith);
                Projects.update(project._id, {
                    $set: project.sharedWith
                });
            }
        })
        e.preventDefault();
        return false;
    },
    'submit #renameProject': function(e) {
        var name = $('#renameProjectInput').val(),
            project = Projects.findOne({
                _id: this._id
            });;
        bootbox.confirm('Are you sure you want to rename this project to ' + name + '?', function(res) {
            if (res) {
                Projects.update(project._id, {
                    $set: {
                        name: name
                    }
                });
            }
        })
        e.preventDefault();
        return false;
    },
    'click #rescheduleStartDate': function() {
        var project = Projects.findOne({
            _id: this._id
        });
        $("#rescheduleSDInput").datepicker({
            changeMonth: true,
            dateFormat: 'yy-mm-dd',
            maxDate: moment(project.endDate).toDate(),
            numberOfMonths: 1,
            onSelect: function() {
                var value = $("#rescheduleSDInput").val();
                bootbox.confirm('Are you sure you want to reschedule the start date of this project to ' + value + '?', function(res) {
                    if (res) {
                        Projects.update(project._id, {
                            $set: {
                                startDate: value
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
    'click #rescheduleEndDate': function() {
        var project = Projects.findOne({
            _id: this._id
        });
        $("#rescheduleEDInput").datepicker({
            changeMonth: true,
            dateFormat: 'yy-mm-dd',
            minDate: moment(project.startDate).toDate(),
            numberOfMonths: 1,
            onSelect: function() {
                var value = $("#rescheduleEDInput").val();
                bootbox.confirm('Are you sure you want to reschedule the end date of this project to ' + value + '?', function(res) {
                    if (res) {
                        Projects.update(project._id, {
                            $set: {
                                endDate: value
                            }
                        });
                    }
                })
            },
            beforeShow: function() {
                setTimeout(function() {
                    $('.ui-datepicker').css('z-index', 1050);
                }, 0);
            }
        });
    },
});

Template.projectEntries.rendered = function() {
    $('[rel=popover]').popover();
}