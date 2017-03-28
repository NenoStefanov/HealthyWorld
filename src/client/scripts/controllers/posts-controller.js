/* globals $ */

export class PostsController {
    constructor({ postsService }, { templatesLoader }) {
        this._postsService = postsService;
        this._templatesLoader = templatesLoader;
    }

    get _categories() {
        return {
            sport: {
                name: 'Sport',
                desc: 'Sport description'
            },
            food: {
                name: 'Food',
                desc: 'Food description'
            },
            health: {
                name: 'Health',
                desc: 'Health description'
            }
        };
    }

    get(context) {
        let template;
        this._templatesLoader.get('post')
            .flatMap(temp => {
                template = temp;
                return this._postsService.findPostByKey(context.params.id);
            })
            .map(post => {
                context.$element().html(template(post));
            })
            .subscribe(() => {
                let $recentPosts = $('.sidebar .recent-posts'),
                    $archives = $('.sidebar .archives');

                $recentPosts.append(window.$recentPosts);
                $archives.append(window.$archives);
            });
    }

    getByCategory(context) {
        const categoryName = context.params.category,
            postsPerPage = 3,
            currentPage = context.params.page;

        let template,
            postsKeys;

        this._templatesLoader.get('category')
            .flatMap(temp => {
                template = temp;
                return this._postsService.findPostsKeysByCategory(categoryName);
            })
            .flatMap(keys => {
                postsKeys = keys;
                let currentPostsKeys = postsKeys.slice((currentPage - 1) * 3, currentPage * 3);
                currentPostsKeys.filter(p => !!p);
                return this._postsService.findPostsByKeys(currentPostsKeys);
            })
            .map(posts => {
                let category = {
                        title: this._categories[categoryName].name,
                        description: this._categories[categoryName].desc
                    },
                    pageCount = Math.ceil(postsKeys.length / postsPerPage),
                    pagination = {
                        page: currentPage,
                        pageCount
                    };

                context.$element().html(template({ category, categoryName, posts, pagination }));
            })
            .subscribe(() => {
                $('.pagination').on('click', '.button', function() {
                    $('.pagination .button').removeClass('active');
                    $(this).addClass('active');

                    window.location.reload();
                });

                let $recentPosts = $('.sidebar .recent-posts'),
                    $archives = $('.sidebar .archives');

                $recentPosts.append(window.$recentPosts);
                $archives.append(window.$archives);
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