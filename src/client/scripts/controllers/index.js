import { AuthController } from './auth-controller';
import { MainController } from './main-controller';
import { PostsController } from './posts-controller';
import { UsersController } from './users-controller';

export class ControllersFactory {
    constructor(services, utils) {
        this._services = services;
        this._utils = utils;
    }

    getAll() {
        return {
            authController: new AuthController(this._services, this._utils),
            mainController: new MainController(this._services, this._utils),
            postsController: new PostsController(this._services, this._utils),
            usersController: new UsersController(this._services, this._utils)
        };
    }
}