_.each({
	debug: function(optionalValue) {
		console.log("Current Context");
		console.log("====================");
		console.log(this);

		if (optionalValue) {
			console.log("Value");
			console.log("====================");
			console.log(optionalValue);
		}
	},
	loginAction: function(test, options) {
		if (Session.equals('loginAction', test))
			return options.fn(this)
		return options.inverse(this);
	},
	nextInt : function(val) {
		if(val !== undefined) {
			val = parseInt(val, 10) + 1;
			return val;
		}
		return '0';
	},
	routeHas: function(value, options) {
		if (typeof value !== 'obbject') {
			if (Session.get('route')) {
				if (Session.get('route').indexOf(value) > -1)
					return options.fn(this);
			}
		}
		return options.inverse(this);
	},



	/* date functions */

	'date': function(date, options) {
		if (date)
			return moment(date).format('Do MMM YYYY');
	},
	'dateTime': function(date, options) {
		if (date)
			return moment(date).format('Do MMM YYYY, h:mm:ss a');
	},
	'dateFromNow': function(date, options) {
		if (date)
			return moment(date).diff(moment(), 'days');
		return 0;
	},
	'dateWeek' : function(date) {
		if(date)
			return moment(date).format('w');
	},
	'dateFromNowPassed': function(date, options) {
		if (moment(date).diff(moment(), 'days') < 0) {
			return options.fn(this);
		}
		return options.inverse(this);
	},
	'checkStartDate' : function(obj, options) {
		if(obj.startDate && obj.doingDate) {
			return options.fn(this);
		}
		return options.inverse(this);
	},
	'checkEndDate' : function(obj, options) {
		if(obj.endDate && obj.doneDate && new Date(obj.doneDate) <= new Date(obj.endDate)) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	/* end of date function */


	/* relational */

	'withUser' : function(email, options) {
		var user = Meteor.users.findOne({'profile.username' : email});
		if(user) {
			return options.fn.call(this, user);
		}
	},



	// and: function(testA, testB, options) {
	// 	if (testA && testB) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// gt: function(value, test, options) {
	// 	if (Utils.isArray(value)) {
	// 		value = value.length;
	// 	}
	// 	if (value > test) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// gte: function(value, test, options) {
	// 	if (Utils.isArray(value)) {
	// 		value = value.length;
	// 	}
	// 	if (value >= test) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// is: function(value, test, options) {
	// 	console.log(arguments);
	// 	if (value === test) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// isnt: function(value, test, options) {
	// 	if (value !== test) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// lt: function(value, test, options) {
	// 	if (Utils.isArray(value)) {
	// 		value = value.length;
	// 	}
	// 	if (value < test) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// lte: function(value, test, options) {
	// 	if (Utils.isArray(value)) {
	// 		value = value.length;
	// 	}
	// 	if (value <= test) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// or: function(testA, testB, options) {
	// 	if (testA || testB) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	length: function(items) {
		if (items) {
			if (items.length !== undefined) {
				return items.length || 0;
			} else {
				var length = 0,
					key;
				for (key in items) {
					if (items.hasOwnProperty(key)) length++;
				}
				return length || 0;
			}
		}
		return 0;
	},
	// if_eq: function(context, options) {
	// 	if (context === options.hash.compare) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// unless_eq: function(context, options) {
	// 	if (context === options.hash.compare) {
	// 		return options.inverse(this);
	// 	}
	// 	return options.fn(this);
	// },
	// if_gt: function(context, options) {
	// 	if (context > options.hash.compare) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// unless_gt: function(context, options) {
	// 	if (context > options.hash.compare) {
	// 		return options.inverse(this);
	// 	}
	// 	return options.fn(this);
	// },
	// if_lt: function(context, options) {
	// 	if (context < options.hash.compare) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// unless_lt: function(context, options) {
	// 	if (context < options.hash.compare) {
	// 		return options.inverse(this);
	// 	}
	// 	return options.fn(this);
	// },
	// if_gteq: function(context, options) {
	// 	if (context >= options.hash.compare) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// unless_gteq: function(context, options) {
	// 	if (context >= options.hash.compare) {
	// 		return options.inverse(this);
	// 	}
	// 	return options.fn(this);
	// },
	// if_lteq: function(context, options) {
	// 	if (context <= options.hash.compare) {
	// 		return options.fn(this);
	// 	}
	// 	return options.inverse(this);
	// },
	// unless_lteq: function(context, options) {
	// 	if (context <= options.hash.compare) {
	// 		return options.inverse(this);
	// 	}
	// 	return options.fn(this);
	// },
	// ifAny: function() {
	// 	var argLength, content, i, success;
	// 	argLength = arguments.length - 2;
	// 	content = arguments[argLength + 1];
	// 	success = true;
	// 	i = 0;
	// 	while (i < argLength) {
	// 		if (!arguments[i]) {
	// 			success = false;
	// 			break;
	// 		}
	// 		i += 1;
	// 	}
	// 	if (success) {
	// 		return content(this);
	// 	} else {
	// 		return content.inverse(this);
	// 	}
	// },
	// numberFormat: function(amount) {
	// 	if (amount)
	// 		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	// 	else
	// 		return '';
	// },

	// /* async */

	// asyncMethod: function(fn, options) {
	// 	var _id = Utils.genId();
	// 	var fn = fn.split('.') || null;

	// 	if (fn && app.Methods[fn]) {
	// 		var self = this;

	// 		app.Methods[fn].apply(window, [
	// 			function() {
	// 				var a = $('#' + _id);
	// 				a.after(options.fn(this));
	// 				a.remove();
	// 			},
	// 			this, app, options.data
	// 		]);

	// 		var inverse = document.createElement('span');
	// 		inverse.innerHTML = options.inverse(this);
	// 		inverse.id = _id;
	// 		var tmp = document.createElement("div");
	// 		tmp.appendChild(inverse);

	// 		return tmp.innerHTML;

	// 	}
	// 	console.error('method not found');
	// 	return 'method not found';
	// }


}, function(fn, name) {
	Handlebars.registerHelper(name, fn);
});