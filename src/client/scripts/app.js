import * as firebase from 'firebase/app';

import { AuthService } from './services/auth-service';
import { DataService } from './services/data-service';
import { firebaseConfig } from './environments/firebase-config';
import { router } from './router';


const firebaseApp = firebase.initializeApp(firebaseConfig),
    dataService = new DataService(firebaseApp),
    authService = new AuthService(firebaseApp);

router.run('#/');