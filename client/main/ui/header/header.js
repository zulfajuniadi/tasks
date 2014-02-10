Template.header.user = function(){
	return Meteor.user();
};

Template.header.rendered = function(){
	$('[rel=popover]').popover();
};