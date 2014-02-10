;(function(b){"use strict";var a=window;var c=function(a){return new c.Instance(a)};c.SUPPORT="wheel",c.ADD_EVENT="addEventListener",c.REMOVE_EVENT="removeEventListener",c.PREFIX="",c.READY=!1,c.Instance=function(a){return c.READY||(c.normalise.browser(),c.READY=!0),this.element=a,this.handlers=[],this},c.Instance.prototype={wheel:function(a,b){return c.event.add(this,c.SUPPORT,a,b),"DOMMouseScroll"===c.SUPPORT&&c.event.add(this,"MozMousePixelScroll",a,b),this},unwheel:function(a,b){return void 0===a&&(a=this.handlers.slice(-1)[0])&&(a=a.original),c.event.remove(this,c.SUPPORT,a,b),"DOMMouseScroll"===c.SUPPORT&&c.event.remove(this,"MozMousePixelScroll",a,b),this}},c.event={add:function(b,d,e,f){var g=e;e=function(b){b||(b=a.event);var d=c.normalise.event(b),e=c.normalise.delta(b);return g(d,e[0],e[1],e[2])},b.element[c.ADD_EVENT](c.PREFIX+d,e,f||!1),b.handlers.push({original:g,normalised:e})},remove:function(a,b,d,e){for(var h,f=d,g={},i=0,j=a.handlers.length;j>i;++i)g[a.handlers[i].original]=a.handlers[i];h=g[f],d=h.normalised,a.element[c.REMOVE_EVENT](c.PREFIX+b,d,e||!1);for(var k in a.handlers)if(a.handlers[k]==h){a.handlers.splice(k,1);break}}};var d,e;c.normalise={browser:function(){"onwheel"in b||b.documentMode>=9||(c.SUPPORT=void 0!==b.onmousewheel?"mousewheel":"DOMMouseScroll"),a.addEventListener||(c.ADD_EVENT="attachEvent",c.REMOVE_EVENT="detachEvent",c.PREFIX="on")},event:function(a){var b="wheel"===c.SUPPORT?a:{originalEvent:a,target:a.target||a.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"===a.type?0:1,deltaX:0,delatZ:0,preventDefault:function(){a.preventDefault?a.preventDefault():a.returnValue=!1},stopPropagation:function(){a.stopPropagation?a.stopPropagation():a.cancelBubble=!1}};return a.wheelDelta&&(b.deltaY=-1/40*a.wheelDelta),a.wheelDeltaX&&(b.deltaX=-1/40*a.wheelDeltaX),a.detail&&(b.deltaY=a.detail),b},delta:function(a){var i,b=0,c=0,f=0,g=0,h=0;return a.deltaY&&(f=-1*a.deltaY,b=f),a.deltaX&&(c=a.deltaX,b=-1*c),a.wheelDelta&&(b=a.wheelDelta),a.wheelDeltaY&&(f=a.wheelDeltaY),a.wheelDeltaX&&(c=-1*a.wheelDeltaX),a.detail&&(b=-1*a.detail),g=Math.abs(b),(!d||d>g)&&(d=g),h=Math.max(Math.abs(f),Math.abs(c)),(!e||e>h)&&(e=h),i=b>0?"floor":"ceil",b=Math[i](b/d),c=Math[i](c/e),f=Math[i](f/e),[b,c,f]}},a.Hamster=c,"function"==typeof a.define&&a.define.amd&&a.define("hamster",[],function(){return c})}).call(window, window.document);


;(function(){
	var root = this;
	if (root.localStorage) {
		var l = root.localStorage;
		root.Store = {
			set : function(key, value) {
				l.setItem(key, JSON.stringify(value));
			},
			get : function(key) {
				var resp = l.getItem(key);
				if(resp) {
					return JSON.parse(resp);
				}
			}
		}
	}
}).call(this);

(function(){
	if(typeof jQuery === 'undefined') {
		throw 'jquery.gantt.js must be loaded after jquery';
	}
	var root = this;
	var $ = jQuery;

	var gantts = [];

	$.fn.gantt = function(config) {

		// console.log(config)

		var parent = this;
		var defaults = {};
		var config = config || {};
		var options = $.extend({}, defaults, config);

		var wrapper;

		if($('#jQuery_gantt').length > 0) {
			wrapper = $('#jQuery_gantt').empty();
		} else {
			wrapper = $('<div id="jQuery_gantt" />');
		}

		var months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sept',
			'Oct',
			'Nov',
			'Dec',
		];

		if(options.project) {

			var project = options.project;
			var tasks = project[options.tasks];
			var dateToday = (Math.round(new Date().getTime() / 86400000) * 86400000) / 1000;

			var table = document.createElement('table');

			var startDate = new Date(project[options.projectStartDate]).getTime() / 1000;
			var endDate = new Date(project[options.projectEndDate]).getTime() / 1000;

			var numCols = 0;

			if(startDate && endDate) {
				var thead = document.createElement('thead');
				var tr = document.createElement('tr');
				var monthtr = document.createElement('tr');
				var tbody = document.createElement('tbody');
				var th = document.createElement('th');
				var monthth = document.createElement('th');
				th.appendChild(document.createTextNode('Tasks'));
				tr.appendChild(th);
				monthtr.appendChild(monthth);
				thead.appendChild(monthtr);
				thead.appendChild(tr);
				table.appendChild(thead);
				table.appendChild(tbody);

				numCols = 1;
				var lastmonth = 0;
				var dayspassed = 1;
				var lastmonthth = monthth;
				var dates = [];

				function createRows(tasks) {
					tasks.forEach(function(task){
						var tr = document.createElement('tr');
						for(var i = 0; i < numCols; i = i + 1) {
							var td = document.createElement('td');
							if(i === 0) {

								var prependName = '';
								if(options.taskLevel) {
									for(j = 0; j < parseInt(task[options.taskLevel], 10); j++) {
										prependName = prependName + '-';
									}
								}
								td.appendChild(document.createTextNode(prependName + ' ' + task[options.taskTitle]));
								td.setAttribute('class', 'task_title');
							} else {
								td.dataset.date = dates[(i-1)];
								var nowDate = new Date(dates[(i-1)]).getTime() / 1000;
								if(nowDate === dateToday) {
									td.setAttribute('class', 'today');
								}
								tr.dataset[options.taskId] = task[options.taskId];
							}
							tr.appendChild(td);
						}
						tbody.appendChild(tr);
						createRows(task[options.taskChild]);
					});
				}

				for (var i = startDate; i <= endDate; i = i + 86400) {
					var th = document.createElement('th');
					var date = new Date((i * 1000));
					dates.push(date);
					var nowDate = date.getTime() / 1000;
					var month = date.getUTCMonth();
					var day = date.getUTCDate();
					if(lastmonth !== month) {
						var year = date.getFullYear();
						lastmonthth.setAttribute('colspan', dayspassed);
						dayspassed = 1;
						var monthth = document.createElement('th');
						monthth.appendChild(document.createTextNode( months[month] + ' \'' + year.toString().substring(2) ));
						lastmonthth = monthth;
						lastmonth = month;
						monthtr.appendChild(monthth);
					} else {
						dayspassed ++;
					}
					th.appendChild(document.createTextNode( day ));
					th.dataset.date = date;
					if(nowDate === dateToday) {
						th.setAttribute('class', 'today');
					}
					tr.appendChild(th);
					numCols ++;
					if(i === endDate) {
						lastmonthth.setAttribute('colspan', dayspassed);
					}
				};

				createRows(tasks);

				wrapper.append(table);
				parent.append(wrapper);
			}

			var $table = $(table);
			var tableMargin = (($table.outerWidth(true) - $table.width()) / 2);
			var titleWidth = $('.task_title').outerWidth();
			var tableWidth = $table.outerWidth() - titleWidth;
			var startTdPosition = {};
			var outerWrapper = $('<div class="outer_wrapper" />');

			function createDivs(tasks) {
				tasks.forEach(function(task){
					var taskDiv = $('<div class="task_items" />');
					var taskWrapper = $('<div class="task_wrapper" />');
					var resizeHandleRight = $('<div class="resize_handle_right ui-resizable-handle ui-resizable-e" />');
					taskDiv.append(task[options.taskTitle]);
					if(options.taskClass) {
						taskDiv.addClass(task[options.taskClass]);
					}
					var tr = $('tr[data-_id='+ task[options.taskId] +']', table);
					var startDate = task[options.taskStartDate] = new Date(task[options.taskStartDate]);
					var endDate = task[options.taskEndDate] = new Date(task[options.taskEndDate]);
					var startTd = $('td[data-date="'+ startDate +'"]', tr);
					var endTd = $('td[data-date="'+ endDate +'"]', tr);
					var endTdPosition;
					if(endTd.length === 0) {
						endTd = $('td:last', tr);
						endTdPosition = {
							left : endTd.offset().left - endTd.outerWidth() + 5
						}
					} else {
						endTdPosition = {
							left : endTd.offset().left - wrapper.offset().left,
						};
						endTdPosition.right = endTdPosition.left + endTd.outerWidth();
					}

					startTdPosition = {
						top : startTd.offset().top - wrapper.offset().top,
						left : startTd.offset().left - wrapper.offset().left - 1, // 1px border + 1px padding
						width : startTd.outerWidth(),
						height : startTd.outerHeight(),
					};



					/* taskwrapper */

					taskWrapper.height(startTdPosition.height);
					taskWrapper.css({
						top : startTdPosition.top,
						width : tableWidth,
						left : titleWidth + tableMargin,
					});

					resizeHandleRight.height(startTdPosition.height);

					/* taskdiv */

					taskDiv.css({
						width : endTdPosition.right - startTdPosition.left - 2, // 2px border + 1px padding
						'left' : startTdPosition.left - titleWidth,
					});

					/* append task data */

					taskDiv.data(task);

					/* append */

					taskDiv.append(resizeHandleRight);
					outerWrapper.append(taskWrapper);
					taskWrapper.append(taskDiv);
					createDivs(task[options.taskChild]);
				});
			}
			wrapper.append(outerWrapper);

			createDivs(tasks);

			var draggableStartDay;

			$('.task_items').draggable({
				axis : 'x',
				containment : 'parent',
				scroll: true,
				start : function(e, ui) {
					draggableStartDay = Math.round(ui.position.left / startTdPosition.width);
				},
				stop : function(e, ui) {
					ui.helper.css({
						left : Math.round(ui.position.left / startTdPosition.width) * startTdPosition.width
					});
					var element = this;
					var $element = $(element);
					var diffDays = Math.round(ui.position.left / startTdPosition.width) - draggableStartDay;
					var data = ui.helper.data();
					var oldData = $.extend({}, data);
					data[options.taskStartDate] = new Date(new Date(data[options.taskStartDate]).getTime() + (diffDays * 86400000));
					data[options.taskEndDate] = new Date(new Date(data[options.taskEndDate]).getTime() + (diffDays * 86400000));
					if(options.onMove) {
						data = $.extend({}, data);
						delete data.uiDraggable;
						delete data.uiResizable;
						var revert = function(){
							$element.data(oldData);
							$element.css({
								left : ui.originalPosition.left
							});
						}
						options.onMove.call(window, e, data, oldData, ui.helper[0], revert);
					}
				}
			});

			$('.task_items').resizable({
				handles : 'e',
				stop : function(e, ui) {
					ui.element.css({
						left : Math.round(ui.position.left / startTdPosition.width) * startTdPosition.width,
						width : Math.round(ui.size.width / startTdPosition.width) * startTdPosition.width
					});
					var element = this;
					var $element = $(element);
					var newDuration = Math.round((ui.size.width - startTdPosition.width) / startTdPosition.width);
					var data = ui.element.data();
					var oldData = $.extend({}, data);
					data[options.taskEndDate] = new Date(new Date(data[options.taskStartDate]).getTime() + (newDuration * 86400000));
					console.log(data[options.taskStartDate], data[options.taskEndDate])
					if(options.onResize) {
						data = $.extend({}, data);
						delete data.uiDraggable;
						delete data.uiResizable;
						var revert = function(){
							$element.data(oldData);
							$element.width(ui.originalSize.width);
						}
						options.onResize.call(window, e, data, oldData, element, revert);
					}
				}
			});

			var clickStart;
			var clickEl;

			$('.task_items').mousedown(function(){
				clickEl = this;
				clickStart = new Date().getTime();
			});

			wrapper.scroll(function(e){
				var left = wrapper.scrollLeft();
				Store.set('ganttLeft', left)
			});

			var ganttLeft = Store.get('ganttLeft');
			if(ganttLeft) {
				wrapper.scrollLeft(ganttLeft);
			}

			$('.task_items').mouseup(function(e){
				clickEnd = new Date().getTime();
				if(clickEnd - clickStart > 0 && clickEnd - clickStart < 320) {
					if(options.onClick) {
						var data = $.extend({}, $(this).data());
						delete data.uiDraggable;
						delete data.uiResizable;
						options.onClick.call(window, e, data, this);
					}
				}
			});

			$(tbody).sortable({
				axis : 'y',
				// containment : 'parent',
				scroll : true,
			})

			Hamster(wrapper[0]).wheel(function(e, delta){
				wrapper.scrollLeft(wrapper.scrollLeft() + (-1 * delta * 10));
			});
		}
	}
}).call(this);