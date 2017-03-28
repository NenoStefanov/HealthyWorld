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
            this.get('#/home', mainController.getHome);

            // User
            this.get('#/user/profile', usersController.getProfile);
            this.get('#/user/posts', usersController.getPosts);

            // Auth
            this.get('#/auth/register', authController.register);
            this.get('#/auth/login', authController.login);
            this.get('#/auth/logout', authController.logout);

            // Posts
            this.get('#/posts', postsController.getByTitle);
            this.get('#/posts/all', postsController.getAll);
            this.get('#/posts/add', postsController.add);
            this.get('#/posts/update', postsController.update);
            this.get('#/posts/:id', postsController.get);

            // Cagetory
            this.get('#/categories/:category', postsController.getByCategory);
        });
    }

    run(url) {
        this._router.run(url);
    }
}