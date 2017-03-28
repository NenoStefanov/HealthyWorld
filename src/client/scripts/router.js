/* globals Sammy */

export class Router {
    constructor({
        authController,
        mainController,
        postsController,
        usersController
    }) {
        this._router = Sammy('main', function() {
            this.get('#/', function() {
                this.redirect('#/home');
            });
            this.get('#/home', context => mainController.getHome(context));

            // User
            this.get('#/user/profile', context => usersController.getProfile(context));
            this.get('#/user/posts', context => usersController.getPosts(context));

            // Auth
            this.get('#/auth/register', context => authController.register(context));
            this.get('#/auth/login', context => authController.login(context));
            this.get('#/auth/logout', context => authController.logout(context));

            // Posts
            this.get('#/posts', context => postsController.getByTitle(context));
            this.get('#/posts/all', context => postsController.getAll(context));
            this.get('#/posts/add', context => postsController.add(context));
            this.get('#/posts/update', context => postsController.update(context));
            this.get('#/posts/:id', context => postsController.get(context));

            // Cagetory
            this.get('#/categories/:category/:page', context => postsController.getByCategory(context));
        });
    }

    run(url) {
        this._router.run(url);
    }
}