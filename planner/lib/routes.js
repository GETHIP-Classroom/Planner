FlowRouter.route('/', {
    action: function(params, queryParams) {
        BlazeLayout.render("signIn");
    }
});

FlowRouter.route('/home', {
    action: function(params, queryParams) {
        BlazeLayout.render("home");
    }
});

FlowRouter.route('/profile', {
    action: function(params, queryParams) {
        BlazeLayout.render("profile");
    }
});

FlowRouter.route('/clubs', {
    action: function(params, queryParams) {
        BlazeLayout.render("clubs");
    }
});