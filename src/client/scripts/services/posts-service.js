/* globals Rx */

export class PostsService {
    constructor({authService, dataService, usersService}, {keyGenerator}) {
        this.postsUrl = 'posts';
        this._authService = authService;
        this._dataService = dataService;
        this._usersService = usersService;
        this._keyGenerator = keyGenerator;
    }

    _findPostsByKeys(postsKeys$) {
        return postsKeys$
            .map(keys => keys.map(key => this.findPostByKey(key)))
            .flatMap(fbojs => Rx.Observable.combineLatest(fbojs));
    }

    _findPostKeysByUserKey(userKey) {
        let url = `${this.postsUrl}PerUser/${userKey}`;

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
                return this._dataService.save(this.postsUrl, post);
            })
            .map(newPost => {
                let userPostsUrl = `${this.postsUrl}PerUser/${userId}`,
                    newPostKey = newPost.key,
                    postPerUser = {};

                postPerUser[newPostKey] = true;
                this._dataService.update(userPostsUrl, postPerUser);
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

        return this._savePost(this.postsUrl, post);
    }

    updatePost(post, newData, newImage) {
        let url = post.key;

        // here will delete old image

        if (newImage) {
            return this._savePostImage(newImage)
                .then(imageUrl => { newData.image = imageUrl; })
                .then(() => this._dataService.update(url, newData));
        }

        // delete newData.image; // only if is necessary
        return this._dataService.update(url, newData);
    }

    findPostByKey(postKey) {
        let url = `${this.postsUrl}/${postKey}`;
        return this._dataService.getObject(url);
    }

    findAllPosts() {
        return this._dataService.getList(this.postsUrl);
    }

    findLastestsPosts(count = 12) {
        let query = {
            limitToLast: count
        };

        return this._dataService.getList(this.postsUrl, query);
    }

    findPostByCategory(category) {
        let url = `${this.postsUrl}PerCategory/${category}`;

        return this._dataService.getList(url)
            .map(keys => keys.map(keyObj => keyObj.$key));
    }

    findPostsByUserKey(userKey) {
        return this._findPostsByKeys(this._findPostKeysByUserKey(userKey));
    }
}