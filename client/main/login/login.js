Template.login.events({
  'click .tabs dt': function(e) {
    $('.tabs dt').removeClass('active');
    $(e.target).addClass('active');
  },
  'submit #register': function(e) {
    e.preventDefault();
    var formData = $('#register').serializeJSON();
    formData = $.each(formData, function(key, value) {
      if (key === 'username') {
        console.log(key)
        value = value.toLowerCase();
      }
      formData[key] = value.trim();
    });
    if (formData.password === formData.cpassword) {
      var userData = {
        username: formData.username,
        email: formData.username,
        password: formData.password,
        profile: {
          username: formData.username,
          name: formData.name,
          gravatar: ' http://www.gravatar.com/avatar/' + md5(formData.username) + '?s=200'
        }
      };
      Accounts.createUser(userData, function() {
        Meteor.loginWithPassword(userData.username, userData.password, function() {
          routie('projects');
        });
      })
    }
    return false;
  },
  'submit #login': function(e) {
    e.preventDefault();
    var formData = $('#login').serializeJSON();
    formData = $.each(formData, function(key, value) {
      if (key === 'username') {
        value = value.toLowerCase();
      }
      formData[key] = value.trim();
    });
    Meteor.loginWithPassword(formData.username, formData.password, function() {
      routie('#/projects');
    });
    return false;
  },
  'click .googleLogin': function(e) {
    Meteor.loginWithGoogle({
        requestPermissions: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.google.com/m8/feeds/',
          'https://www.googleapis.com/auth/drive'
        ],
        requestOfflineToken: true
      },
      function() {
        var user = Meteor.user();
        Meteor.call('googledetails', function(err) {
          routie('#/projects');
        });
      });
  }
});