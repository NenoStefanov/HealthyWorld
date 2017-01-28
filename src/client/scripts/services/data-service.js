import { Observable } from 'rxjs/Observable';

import 'firebase/storage';
import 'firebase/database';
import 'rxjs/add/operator/map';

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

        return Observable.create(observer => {
            try {
                firebaseRef
                    .on('value', snapshot => {
                        observer.next(snapshot.val());
                    });
            } catch (err) {
                observer.error(err);
            }
        });
    }

    getList(url, query) {
        return this.getObject(url, query)
            .map(result => {
                return result ? Object.values(result) : null;
            });
    }

    save(url, data) {
        return this._databaseRef.child(url).push(data);
    }

    update(url, data) {
        let dataToSave = {};
        dataToSave[url] = data || true;

        return this._databaseRef.update(dataToSave);
    }


    // storage

    getStorageItemRef(name) {
        return this._storageRef.child(name);
    }

    saveStorageItem(fileRef, file) {
        fileRef = this.getStorageItemRef(fileRef);
        return fileRef.put(file);
    }
}