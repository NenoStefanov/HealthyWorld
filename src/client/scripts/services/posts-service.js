import { Observable } from 'rxjs/Observable';

export class PostsService {
    constructor(authService, dataService, usersService, keyGenerator) {
        this._authService = authService;
        this._dataService = dataService;
        this._usersService = usersService;
        this._keyGenerator = keyGenerator;
    }

    _findPostsByKeys(postsKeys$) {
        return postsKeys$
            .map(keys => {
                keys.map(key => this.findPostByKey(key))
            })
            .flatMap(fbojs => Observable.combineLatest(fbojs));
    }

    _findPostKeysByUserKey(userKey) {
        let url = `postsPerUser/${userKey}`;

        return this._dataService.getList(url)
            .map(keys => keys.map(keyObj => keyObj.$key));
    }

    _savePost(post) {
        let userId = this._authService.userId,
            currentDate = new Date().toString();

        return this._usersService.getUserByKey(userId)
            .first()
            .map(user => user.name)
            .map(username => {
                post.userId = userId;
                post.username = username;
                post.added = currentDate;
            })
            .map(() => {
                let url = 'posts';
                return this._dataService.save(url, post);
            })
            .map(newPost => {
                let url = `postsPerUser/${userId}`,
                    newPostKey = newPost.key,
                    postPerUser = {};

                postPerUser[newPostKey] = true;
                this._dataService.update(url, postPerUser);
            })
            .toPromise();
    }

    _savePostImage(image) {
        let imageKey = this._keyGenerator.generate();

        return this._dataService.saveStorageItem(imageKey, image)
            .then(dbImage => dbImage.downloadURL);
    }

    createPost(post, image) {
        if (image) {
            return this._savePostImage(image)
                .then(imageUrl => { post.imageUrl = imageUrl; })
                .then(() => this._savePost(post));
        }

        return this._savePost(post);
    }

    updatePost(post, newData, newImage) {
        let url = post.key;

        if (newImage) { // delete old image
            return this._savePostImage(newImage)
                .then(imageUrl => { newData.image = imageUrl; })
                .then(() => this._dataService.update(post, newData));
        }

        // delete newData.image; // only if is necessary
        return this._dataService.update(url, newData);
    }

    findPostByKey(postKey) {
        let url = `posts/${postKey}`;
        return this._dataService.getObject(url);
    }

    findAllPosts() {
        let url = 'posts';
        return this._dataService.getList(url);
    }

    findLastestsPosts(count = 12) {
        let url = 'posts',
            query = {
                limitToLast: count
            };

        return this._dataService.getList(url, query);
    }

    findPostsByUserKey(userKey) {
        return this._findPostsByKeys(this._findPostKeysByUserKey(userKey));
    }
}