(function() {

    function reduceIterator(obj, i) {
        return obj[i]
    }

    Meteor.Collection._relationships = [];

    Meteor.Collection.prototype.setRelationship = function(options) {
        var defaults = {
            primaryKey: '_id'
        }
        var options = _.extend(defaults, options);
        if (Meteor.Collection.prototype === options.collection.__proto__) {
            if (!Array.isArray(this._relationships)) {
                this._relationships = [];
            }
            if (!_.findWhere(this._relationships, {
                primaryKey: options.primaryKey
            })) {
                this._relationships.push(options);
            }
        }
        return this;
    }

    Meteor.Collection.prototype._find = Meteor.Collection.prototype.find;

    Meteor.Collection.prototype.find = function() {
        var args = _.toArray(arguments);
        var cursor = this._find.apply(this, arguments);
        var query = {};
        var done;
        if (args[1] && args[1].withRelationships) {
            // if (!Array.isArray(args[1].doneRelationships)) {
            // 	done = args[1].doneRelationships = [];
            // } else {
            // 	done = args[1].doneRelationships;
            // }
            cursor.db_objects = null;
            cursor.db_objects = cursor._getRawObjects(true);
            // if (done.indexOf(cursor.collection._name) > -1) {
            // 	return;
            // }
            if (!Array.isArray(this._relationships)) {
                this._relationships = [];
            }
            this._relationships.forEach(function(relationship) {
                if (relationship.type === 'one-many') {
                    _.each(cursor.db_objects, function(db_object, index) {
                        query[relationship.foreignKey] = db_object[relationship.primaryKey];
                        cursor.db_objects[index][relationship.collection._name] = relationship.collection.find(query, {
                            withRelationships: true
                        }).fetch();

                    });
                } else if (relationship.type === 'many-one') {
                    _.each(cursor.db_objects, function(db_object, index) {
                        query[relationship.foreignKey] = db_object[relationship.primaryKey];
                        cursor.db_objects[index][relationship.collection._name] = relationship.collection.findOne(query, {
                            withRelationships: true
                        }).fetch();
                    });
                } else if (relationship.type === 'many-many') {
                    _.each(cursor.db_objects, function(db_object, index) {
                        if (Array.isArray(db_object[relationship.primaryKey])) {
                            db_object[relationship.primaryKey].forEach(function(primaryKeyValue, index) {
                                query[relationship.foreignKey] = primaryKeyValue;
                                var defaultObject = {};
                                var results = relationship.collection.findOne(query, {
                                    withRelationships: true
                                }) || defaultObject;
                                db_object[relationship.primaryKey][index] = results;
                            })
                        }
                    });
                }
                // cursor.db_objects = null;
                // done.push(relationship.collection._name);
            });
        }
        return cursor;
    }




})(this);