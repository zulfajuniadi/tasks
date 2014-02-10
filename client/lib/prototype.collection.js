Meteor.Collection.prototype.save = function(data, callback) {
	if(data._id === undefined) {
		data._id = this._makeNewID();
	}
	var entry = this.findOne(data._id);
	if(entry) {
		this.update(data._id, data, function(err){
			if(callback) {
				callback.call(window, err, { oper : 'update', data : data})
			}
		});
	} else {
		this.insert(data, function(err){
			if(callback) {
				callback.call(window, err, { oper : 'insert', data : data})
			}
		});
	}
}

Meteor.Collection.prototype.purge = function() {
	var self = this;
	self.find().fetch().forEach(function(record){
		self.remove({_id : record._id});
	});
}