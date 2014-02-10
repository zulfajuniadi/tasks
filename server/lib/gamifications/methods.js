(function(root) {
  Meteor.methods({
    googledetails : function() {
      var google;
      if(Meteor.user() && Meteor.user().services && (google = Meteor.user().services.google)) {
        Meteor.users.update({
          _id: Meteor.userId()
        }, {
          $set: {
            'profile.username': google.email,
            'profile.name': google.given_name,
            'profile.gravatar': google.picture
          }
        });
      }
      return null;
    }
  })

})(this);