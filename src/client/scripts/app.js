import * as firebase from 'firebase/app';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/combineLatest';

import { AuthService } from './services/auth-service';
import { DataService } from './services/data-service';
import { firebaseConfig } from './environments/firebase-config';
import { KeyGenerator } from './utils/key-generator';
import { PostsService } from './services/posts-service';
import { router } from './router';
import { UsersService } from './services/users-service';


const firebaseApp = firebase.initializeApp(firebaseConfig),
    dataService = new DataService(firebaseApp),
    authService = new AuthService(firebaseApp),
    usersService = new UsersService(dataService),
    keyGenerator = new KeyGenerator(),
    postsService = new PostsService(authService, dataService, usersService, keyGenerator);



router.run('#/');