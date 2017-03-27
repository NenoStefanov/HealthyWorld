import { AuthService } from './auth-service';
import { DataService } from './data-service';
import { PostsService } from './posts-service';
import { UsersService } from './users-service';

export class ServicesFactory {
    constructor(app, utils) {
        this._app = app;
        this._utils = utils;
    }

    getAll() {
        let dataService = new DataService(this._app);
        let authService = new AuthService(this._app);
        let usersService = new UsersService(dataService);
        let postsService = new PostsService({authService, dataService, usersService}, this._utils);

        return {
            authService,
            dataService,
            postsService,
            usersService
        };
    }
}