export class UsersService {
    constructor(dataService) {
        this._dataService = dataService;
        this._usersUrl = 'users';
    }

    createUser(uid, user) {
        let url = `${this._usersUrl}/${uid}`,
            dataToSave = {};

        dataToSave[url] = user;
        return this._dataService.update(dataToSave);
    }

    updateUser(uid, user) {
        let url = `${this._usersUrl}/${uid}`,
            dataToSave = {};

        dataToSave[url] = user;
        return this._dataService.update(dataToSave);
    }

    getAllUsers(query) {
        return this._dataService.getList(this._usersUrl, query);
    }

    getUserByKey(userKey) {
        let url = `${this._usersUrl}/${userKey}`;
        return this._dataService.getObject(url);
    }
}