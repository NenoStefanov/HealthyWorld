/* globals $ Rx */

export class PostsController {
    constructor({ postsService }, { templatesLoader }) {
        this._postsService = postsService;
        this._templatesLoader = templatesLoader;
    }

    get _categories() {
        return {
            sport: {
                name: 'Sport',
                desc: 'All sport posts'
            },
            food: {
                name: 'Food',
                desc: 'All food posts'
            },
            health: {
                name: 'Health',
                desc: 'All health posts'
            }
        };
    }

    get(context) {
        const postId = context.params.id;

        Rx.Observable.combineLatest([
                this._templatesLoader.get('post'),
                this._postsService.findPostByKey(postId),
                window.recentPosts$,
                window.archives$
            ])
            .subscribe(res => {
                let template = res[0],
                    post = res[1],
                    recentPosts = res[2],
                    archives = res[3];

                context.$element().html(template({ post, recentPosts, archives }));
            });
    }

    getByCategory(context) {
        const categoryName = context.params.category,
            currentPage = context.params.page || 1,
            route = `categories/${categoryName}`,
            pageName = this._categories[categoryName].name,
            title = `${this._categories[categoryName].name} Category`,
            description = `${this._categories[categoryName].desc}`,
            postsPerPage = 3;

        let template,
            postsKeys,
            recentPosts,
            archives;

        Rx.Observable.combineLatest([
                this._templatesLoader.get('posts'),
                this._postsService.findPostsKeysByCategory(categoryName),
                window.recentPosts$,
                window.archives$
            ])
            .flatMap(res => {
                template = res[0];
                postsKeys = res[1];
                recentPosts = res[2];
                archives = res[3];

                let currentPostsKeys = postsKeys
                    .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                    .filter(p => !!p);

                return this._postsService.findPostsByKeys(currentPostsKeys);
            })
            .subscribe(posts => {
                let pageCount = Math.ceil(postsKeys.length / postsPerPage),
                    pagination = {
                        page: currentPage,
                        pageCount
                    };

                context.$element().html(template({
                    route,
                    pageName,
                    title,
                    description,
                    posts,
                    pagination,
                    recentPosts,
                    archives
                }));

                $('.pagination').on('click', '.button', function() {
                    $('.pagination .button').removeClass('active');
                    $(this).addClass('active');

                    window.location.reload();
                });
            });
    }

    getByUser() {

    }

    getByTitle(context) {
        const postsTitle = context.params.title || '',
            currentPage = context.params.page || 1,
            route = `posts?title=${postsTitle}&`,
            pageName = 'Search results',
            title = `Search results for "${postsTitle}"`,
            postsPerPage = 3;

        let template,
            postsKeys,
            recentPosts,
            archives;

        Rx.Observable.combineLatest([
                this._templatesLoader.get('posts'),
                this._postsService.findPostsKeysByTitle(postsTitle),
                window.recentPosts$,
                window.archives$
            ])
            .flatMap(res => {
                template = res[0];
                postsKeys = res[1];
                recentPosts = res[2];
                archives = res[3];

                let currentPostsKeys = postsKeys
                    .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                    .filter(p => !!p);

                return this._postsService.findPostsByKeys(currentPostsKeys);
            })
            .subscribe(posts => {
                let pageCount = Math.ceil(postsKeys.length / postsPerPage),
                    pagination = {
                        page: currentPage,
                        pageCount
                    };

                context.$element().html(template({
                    route,
                    pageName,
                    title,
                    posts,
                    pagination,
                    recentPosts,
                    archives
                }));

                $('.pagination').on('click', '.button', function() {
                    $('.pagination .button').removeClass('active');
                    $(this).addClass('active');

                    window.location.reload();
                });
            });
    }

    getAll(context) {
        const currentPage = context.params.page || 1,
            route = 'posts/all',
            pageName = 'Blog',
            title = 'Blog',
            description = 'Site blog posts',
            postsPerPage = 3;

        let template,
            allPosts,
            recentPosts,
            archives;

        Rx.Observable.combineLatest([
                this._templatesLoader.get('posts'),
                this._postsService.findAllPostsKeys(),
                window.recentPosts$,
                window.archives$
            ])
            .flatMap(res => {
                template = res[0];
                allPosts = res[1];
                recentPosts = res[2];
                archives = res[3];

                let currentPostsKeys = allPosts
                    .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                    .filter(p => !!p)
                    .map(p => p.key);

                return this._postsService.findPostsByKeys(currentPostsKeys);
            })
            .subscribe(posts => {
                let pageCount = Math.ceil(allPosts.length / postsPerPage),
                    pagination = {
                        page: currentPage,
                        pageCount
                    };

                context.$element().html(template({
                    pageName,
                    title,
                    description,
                    route,
                    posts,
                    pagination,
                    recentPosts,
                    archives
                }));

                $('.pagination').on('click', '.button', function() {
                    $('.pagination .button').removeClass('active');
                    $(this).addClass('active');

                    window.location.reload();
                });
            });
    }

    add() {

    }

    update() {

    }
}