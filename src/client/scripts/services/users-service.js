export class UsersService {
    constructor(dataService) {
        this._dataService = dataService;
    }

    createUser(uid, user) {
        let url = `users/${uid}`,
            dataToSave = {};

        dataToSave[url] = user;
        return this._dataService.update(dataToSave);
    }

    updateUser(uid, user) {
        let url = `users/${uid}`,
            dataToSave = {};

        dataToSave[url] = user;
        return this._dataService.update(dataToSave);
    }

    getAllUsers(query) {
        let url = 'users';
        return this._dataService.getList(url, query);
    }

    getUserByKey(userKey) {
        let url = `users/${userKey}`;
        return this._dataService.getObject(url);
    }
}