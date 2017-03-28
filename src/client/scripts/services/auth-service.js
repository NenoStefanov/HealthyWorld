/* globals Rx */

export class AuthService {
    constructor(firebaseApp) {
        this._firebaseAuth = firebaseApp.auth();
        this._firebaseAuth.onAuthStateChanged(state => {
            this._authState = state;
        });
    }

    get userId() {
        return this._authState ? this._authState.uid : '5w7o9b4Ad2UPIJLOZ9vUCF06gem1';
    }
    
    isAuthenticated() {
        return Rx.Observable.create(observer => {
            try {
                this._firebaseAuth.onAuthStateChanged(state => {
                    observer.next(!!state);
                });
            } catch (err) {
                observer.error(err);
            }
        });
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