FlowRouter.route('/', {
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