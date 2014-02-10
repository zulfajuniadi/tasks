Template.projectForm.events({
    'submit #projectForm': function(e) {
        var data = $('#projectForm').serializeJSON();
        data.sharedWith = data.sharedWith.split(',');
        data.sharedWith.push(Meteor.user().profile.username);
        data.sharedWith = _.uniq(data.sharedWith);
        Projects.insert(data);
        $('#projectForm')[0].reset();
        $('#project-form').modal('hide');
        return false;
    }
});

Template.projectForm.sharedWith = function() {
    return getRelationships();
};

Template.projectForm.rendered = function() {
    $('[name="sharedWith"]').select2({
        tags: getRelationships().map(function(data) {
            return {
                id: data.profile.username,
                text: data.profile.name + ' (' + data.profile.username + ')'
            }
        }),
        multiple: true,
    });
    $("#startDate").datepicker({
        defaultDate: "+1w",
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        numberOfMonths: 1,
        onClose: function(selectedDate) {
            $("#endDate").datepicker("option", "minDate", selectedDate);
        }
    });
    $("#endDate").datepicker({
        defaultDate: "+1w",
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        numberOfMonths: 1,
        onClose: function(selectedDate) {
            $("#startDate").datepicker("option", "maxDate", selectedDate);
        }
    });
}