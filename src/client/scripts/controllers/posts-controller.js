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
                    categoryName = this._categories[post.category].name,
                    recentPosts = res[2],
                    archives = res[3];

                context.$element().html(template({ post, categoryName, recentPosts, archives }));
            });
    }

    getByCategory(context) {
        const categoryName = context.params.category,
            currentPage = context.params.page,
            postsPerPage = 3;

        let template,
            postsKeys,
            recentPosts,
            archives;

        Rx.Observable.combineLatest([
                this._templatesLoader.get('category'),
                this._postsService.findPostsKeysByCategory(categoryName),
                window.recentPosts$,
                window.archives$
            ])
            .flatMap(res => {
                template = res[0];
                postsKeys = res[1];
                recentPosts = res[2];
                archives = res[3];

                let currentPostsKeys = postsKeys.slice((currentPage - 1) * 3, currentPage * 3);
                currentPostsKeys.filter(p => !!p);

                return this._postsService.findPostsByKeys(currentPostsKeys);
            })
            .subscribe(posts => {
                let category = {
                        title: this._categories[categoryName].name,
                        description: this._categories[categoryName].desc
                    },
                    pageCount = Math.ceil(postsKeys.length / postsPerPage),
                    pagination = {
                        page: currentPage,
                        pageCount
                    };

                context.$element().html(template({ category, categoryName, posts, pagination, recentPosts, archives }));

                $('.pagination').on('click', '.button', function() {
                    $('.pagination .button').removeClass('active');
                    $(this).addClass('active');

                    window.location.reload();
                });
            });
    }

    getByUser() {

    }

    getByTitle() {

    }

    getAll() {

    }

    add() {

    }

    update() {

    }
}