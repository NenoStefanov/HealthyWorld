import * as firebase from 'firebase/app';
import $ from 'jquery';

import 'bootstrap';

import { DataService } from 'data-service';
import { firebaseConfig } from 'firebase-config';
import { router } from 'router';


let firebaseApp = firebase.initializeApp(firebaseConfig);
let dataService = new DataService(firebaseApp);

router.run('#/');