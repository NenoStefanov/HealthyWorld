/* globals Sammy */

export const router = Sammy('#content', function() {
    this.get('#/', function(context) {
        context.$element().html('App Works');
    });
});