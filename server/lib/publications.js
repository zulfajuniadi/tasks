// getUserRelationships = function(userEmail) {
//     // var projectUsers = _.flatten(Projects.find({
//     //     sharedWith: userEmail
//     // }, {
//     //     fields: {
//     //         sharedWith: 1
//     //     }
//     // }).fetch());
//     // console.log(projectUsers);
//     return Meteor.users.find({
//         'profile.username': userEmail
//     })
// }


Meteor.publish('userRelationships', function() {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        if (user) {
            var userProjects = _.uniq(_.flatten(_.pluck(Projects.find({
                sharedWith: user.profile.username
            }, {
                fields: {
                    sharedWith: 1
                }
            }).fetch(), 'sharedWith')));
            return Meteor.users.find({
                'profile.username': {
                    $in: userProjects
                }
            }, {
                fields: {
                    'profile.username': 1,
                    'profile.gravatar': 1,
                    'profile.gravatar': 1
                }
            })
        }
    }
})

Meteor.publish('userData', function() {
    var user = Meteor.users.findOne(this.userId);
    if (user) {
        return Meteor.users.find({
            'profile.username': user.profile.username
        }, {
            fields: {
                'services': 1,
            }
        })
    }
});

Meteor.publish('projects', function() {
    var user = Meteor.users.findOne(this.userId);
    if (user) {
        return Projects.find({
            sharedWith: user.profile.username
        });
    }
});

Meteor.publish('tasks', function() {
    var user = Meteor.users.findOne(this.userId);
    if (user) {
        var projects = Projects.find({
            sharedWith: user.profile.username
        }, {
            fields: {
                '_id': 1
            }
        }).fetch().map(function(project) {
            return project._id;
        });
        return Tasks.find({
            projectId: {
                $in: projects
            }
        });
    }
});