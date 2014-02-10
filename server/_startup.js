Meteor.startup(function(){
	Meteor.methods({
		isLoggedIn : function() {
			return (this.userId) ? true : false;
		},
		addShare : function(email, projectId) {
			console.log(email, projectId);
		}
	})
});