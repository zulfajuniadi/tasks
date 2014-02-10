Template.taskEntries.events({
    'click .taskDetails': function() {
        Session.set('activeTask', this._id);
        $('#task-details-modal-title').text('Manage : ' + this.name);
        $('#task-details-modal').modal('show');
    }
});

Template.taskEntries.rendered = function() {
    $(".tasks").sortable({
        connectWith: ".tasks",
        update: function(e, ui) {
            var ul = $(this);
            var li = ui.item;

            if (ul.has(li).length > 0) {
                var state = ul.data('state');
                var dataObj = {
                    state: state
                };
                if (state === 'new') {
                    dataObj.doingDate = null;
                    dataObj.doneDate = null;
                } else if (state === 'doing') {
                    dataObj.doingDate = moment().format('YYYY-MM-DD');
                    dataObj.doneDate = null;

                } else if (state === 'done') {
                    dataObj.doneDate = moment().format('YYYY-MM-DD');
                }
                Tasks.update({
                    _id: li.data('taskid')
                }, {
                    $set: dataObj
                }, function(err) {
                    if (err) return;
                    var task = Tasks.findOne({
                        _id: li.data('taskid')
                    });
                    if (task.id) {
                        APIRequest('insert', 'tasks', task);
                    }
                });
            }
        }
    }).disableSelection();

    // $('.taskDetails:first').click();
}