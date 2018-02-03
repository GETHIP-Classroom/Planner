FlowRouter.route('/home', {
    action: function(params, queryParams) {
        BlazeLayout.render("home");
    }
});