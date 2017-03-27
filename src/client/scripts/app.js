/* globals firebase  $ */

import { ControllersFactory } from './controllers';
import { firebaseConfig } from './environments/firebase-config';
import { Router } from './router';
import { ServicesFactory } from './services';
import { UtilsFactory } from './utils';

export class App {
    constructor() {
        this._firebaseApp = firebase.initializeApp(firebaseConfig);
        this._utils = new UtilsFactory().getAll();
        this._services = new ServicesFactory(this._firebaseApp, this._utils).getAll();
        this._controllers = new ControllersFactory(this._services, this._utils).getAll();
        this._router = new Router(this._controllers);
}

    initialize() {
        this._utils.templatesLoader.get('home')
            .then(template => {
                $('main').html(template());
            });

        this._router.run('#/home');
    }
}
