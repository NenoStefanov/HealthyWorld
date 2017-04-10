/* globals Rx */

export class DataService {
    constructor(firebaseApp) {
        this._databaseRef = firebaseApp.database().ref();
        this._storageRef = firebaseApp.storage().ref();
    }

    _setQuery(firebaseRef, query) {
        // sort data
        if (query.orderByKey) {
            firebaseRef = firebaseRef.orderByKey();
        } else if (query.orderByValue) {
            firebaseRef = firebaseRef.orderByValue();
        } else if (query.orderByChild) {
            firebaseRef = firebaseRef.orderByChild(query.orderByChild);
        }

        // filter data
        if (query.startAt || query.endAt) {
            firebaseRef = query.startAt ? firebaseRef.startAt(query.startAt) : firebaseRef;
            firebaseRef = query.endAt ? firebaseRef.endAt(query.endAt) : firebaseRef;
        } else if (query.equalTo) {
            firebaseRef = firebaseRef.equalTo(query.equalTo);
        }

        // limit data
        if (query.limitToFirst) {
            firebaseRef = firebaseRef.limitToFirst(query.limitToFirst);
        } else if (query.limitToLast) {
            firebaseRef = firebaseRef.limitToLast(query.limitToLast);
        }

        return firebaseRef;
    }

    getObject(url, query) {
        let firebaseRef = this._databaseRef.child(url);
        firebaseRef = query ? this._setQuery(firebaseRef, query) : firebaseRef;

        return Rx.Observable.create(observer => {
            try {
                firebaseRef
                    .on('value', snapshot => {
                        let value = snapshot.val();

                        if (!value) {
                            observer.next(null);
                        } else {
                            value.key = snapshot.key;
                            observer.next(value);
                        }
                    });
            } catch (err) {
                observer.error(err);
            }
        });
    }

    getList(url, query) {
        return this.getObject(url, query)
            .map(result => {
                if (!result) {
                    return [];
                }

                // delete the collecton key
                delete result.key;

                // map the result object to array
                return Object.keys(result)
                    .map(key => {
                        let value = result[key];

                        if (value === true) {
                            return key;
                        } else if (typeof(value) === 'string') {
                            return { value, key };
                        }

                        value.key = key;
                        return value;
                    });
            });
    }

    save(url, data) {
        return Rx.Observable.fromPromise(this._databaseRef.child(url).push(data));
    }

    update(url, data) {
        let dataToSave = {};
        dataToSave[url] = data || true;

        return Rx.Observable.fromPromise(this._databaseRef.update(dataToSave));
    }


    // storage

    getStorageItemRef(name) {
        return Rx.Observable.fromPromise(this._storageRef.child(name));
    }

    saveStorageItem(fileKey, file) {
        this.getStorageItemRef(fileKey)
            .map(fileRef => fileRef.put(file));
    }
}