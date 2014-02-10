Projects = new Meteor.Collection('Projects');
Tasks = new Meteor.Collection('Tasks');
if (Meteor.isClient) {
    Projects.setRelationship({
        collection: Tasks,
        primaryKey: '_id',
        foreignKey: 'projectId',
        type: 'one-many'
    });
    Tasks.setRelationship({
        collection: Meteor.users,
        primaryKey: 'assigned',
        foreignKey: 'profile.username',
        type: 'many-many'
    });
} else {
    var allow = function() {
        return true;
    }
    var deny = function() {
        return false;
    }

    Tasks.allow({
        'insert': allow,
        'update': allow,
        'remove': allow
    });
    Projects.allow({
        'insert': allow,
        'update': allow,
        'remove': allow
    });
}