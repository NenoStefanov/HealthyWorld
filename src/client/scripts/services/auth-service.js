import 'firebase/auth';

export class AuthService {
    constructor(firebaseApp) {
        this._firebaseAuth = firebaseApp.auth();
        this._firebaseAuth.onAuthStateChanged(state => {
            this._authState = state;
        });
    }

    get isAuthenticated() {
        return !!this._authState;
    }

    get userId() {
        return this.isAuthenticated ? this._authState.uid : '';
    }

    signUpUser(email, password) {
        return this._firebaseAuth.createUserWithEmailAndPassword(email, password);
    }

    signInUser(email, password) {
        return this._firebaseAuth.signInWithEmailAndPassword(email, password);
    }

    signInWithFacebook() {
        let provider = new this._firebaseAuth.app.I.auth.FacebookAuthProvider();
        return this._firebaseAuth.signInWithPopup(provider);
    }

    signOut() {
        return this._firebaseAuth.signOut();
    }
}