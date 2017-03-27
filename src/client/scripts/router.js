/* globals Sammy */

export class Router {
    constructor({
        authController,
        categoriesController,
        mainController,
        postsController,
        usersController
    }) {
        this._router = Sammy('main', function() {
            this.get('#/', function() {
                this.redirect('#/home');
            });
            this.get('#/home', function(context) {
                // context.$element().html('App Works');
            });
        });
    }

    run(url) {
        this._router.run(url);
    }
}