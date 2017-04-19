/* globals Rx */

export class PostsService {
    constructor({ authService, dataService, usersService }, { keyGenerator }) {
        this.postsUrl = 'posts';
        this._authService = authService;
        this._dataService = dataService;
        this._usersService = usersService;
        this._keyGenerator = keyGenerator;
    }

    _findPostsKeysByUserKey(userKey) {
        let url = `${this.postsUrl}PerUser/${userKey}`;

        return this._dataService.getList(url);
    }

    _savePost(post) {
        let userId = this._authService.userId,
            currentDate = new Date().toString();

        return this._usersService.getUserByKey(userId)
            .first()
            // set post info
            .map(user => {
                post.userId = userId;
                post.username = user.name;
                post.added = currentDate;
            })
            // save the post
            .map(() => {
                return this._dataService.save(this.postsUrl, post);
            })
            // add postKey in postsPerCategory collection
            .map(newPost => {
                let newPostKey = newPost.key,
                    postPerCategory = `${this.postsUrl}PerCategory/${post.category}/${newPostKey}`;

                this._dataService.update(postPerCategory);

                return newPostKey;
            })
            // add postKey in postsPerUser collection
            .map(newPostKey => {
                let postPerUser = `${this.postsUrl}PerUser/${userId}/${newPostKey}`;
                this._dataService.update(postPerUser);

                return newPostKey;
            })
            // add post in recentPosts collection
            .map(newPostKey => {
                let recentPost = `recentPosts/${newPostKey}`;

                this._dataService.update(recentPost, post.title);

                return newPostKey;
            })
            // add post media in media collection
            .map(newPostKey => {
                if (post.imageUrl) {
                    let mediaUrl = `media/${newPostKey}`;

                    let media = {
                        type: 'img',
                        desc: post.desc,
                        url: post.imageUrl
                    };

                    this._dataService.update(mediaUrl, media);
                }

                return newPostKey;
            });
    }

    _savePostImage(image) {
        let imageKey = this._keyGenerator.generate();

        return this._dataService.saveStorageItem(imageKey, image)
            .map(dbImage => dbImage.downloadURL);
    }

    createPost(post, image) {
        if (image) {
            return this._savePostImage(image)
                .map(imageUrl => { post.imageUrl = imageUrl; })
                .map(() => this._savePost(post));
        }

        return this._savePost(post);
    }

    updatePost(post, newData, newImage) {
        let url = post.key;

        // here will delete old image

        if (newImage) {
            return this._savePostImage(newImage)
                .map(imageUrl => { newData.imageUrl = imageUrl; })
                .map(() => this._dataService.update(url, newData));
        }

        // delete newData.image; // only if is necessary
        return this._dataService.update(url, newData);
    }

    findPostByKey(postKey) {
        let url = `${this.postsUrl}/${postKey}`;
        return this._dataService.getObject(url);
    }

    findPostsByKeys(postsKeys$) {
        if (Array.isArray(postsKeys$)) {
            if (!postsKeys$.length) {
                return Rx.Observable.of([]);
            }

            postsKeys$ = Rx.Observable.of(postsKeys$);
        }

        return postsKeys$
            .map(keys => keys.map(key => this.findPostByKey(key)))
            .flatMap(fbojs => Rx.Observable.combineLatest(fbojs));
    }

    findAllPosts(limit) {
        if (limit) {
            let query = {
                limitToLast: limit
            };

            return this._dataService.getList(this.postsUrl, query);
        }

        return this._dataService.getList(this.postsUrl);
    }

    findPostsKeysByTitle(str) {
        return this._dataService.getList('recentPosts')
            .map(posts => {
                return posts
                    .filter(p => p.value.toLowerCase().indexOf(str) > -1)
                    .map(p => p.key);
            });
    }

    findFirstPosts(count = 6) {
        let query = {
            limitToFirst: count
        };

        return this._dataService.getList('recentPosts', query);
    }

    findLastPosts(count = 6) {
        let query = {
            limitToLast: count
        };

        return this._dataService.getList('recentPosts', query);
    }

    findAllPostsKeys() {
        return this._dataService.getList('recentPosts');
    }

    findPostsKeysByCategory(category) {
        let url = `${this.postsUrl}PerCategory/${category}`;

        return this._dataService.getList(url);
    }

    findPostsByUserKey(userKey) {
        return this.findPostsByKeys(this._findPostsKeysByUserKey(userKey));
    }
}