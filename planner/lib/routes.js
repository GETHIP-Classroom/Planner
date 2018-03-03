FlowRouter.route('/', {
    action: function(params, queryParams) {
        BlazeLayout.render("layout", {content: 'carousel'});
    }
});

FlowRouter.route('/home', {
    action: function(params, queryParams) {
        BlazeLayout.render("layout", {content: 'carousel'});
    }
});

FlowRouter.route('/profile', {
    action: function(params, queryParams) {
        BlazeLayout.render("layout", {content: 'profile'});
    }
});

FlowRouter.route('/clubs', {
    action: function(params, queryParams) {
        BlazeLayout.render("layout", {content: 'clubs'});
    }
});

FlowRouter.route('/club2', {
    action: function(params, queryParams) {
        BlazeLayout.render("layout", {content: 'clubTemplate'});
    }
});

FlowRouter.route('/survey', {
    action: function(params, queryParams) {
        BlazeLayout.render("survey");
    }
});