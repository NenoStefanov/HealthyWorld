/* globals $ */

export class MainController {
    constructor({ dataService, postsService }, { templatesLoader }) {
        this._dataService = dataService;
        this._postsService = postsService;
        this._templatesLoader = templatesLoader;
    }

    getHome(context) {
        let template,
            posts;

        this._templatesLoader.get('home')
            .flatMap(temp => {
                template = temp;
                return this._postsService.findAllPosts(3);
            })
            .flatMap(res => {
                posts = res.map(p => p.val);
                return this._dataService.getList('media', { limitToFirst: 7 });
            })
            .map(media => {
                context.$element().html(template({ posts, media }));
            })
            .subscribe(() => {
                let $slides = $('.slide');
                $slides.hide();
                $slides.first().show();

                let $recentPosts = $('.home-aside .recent-posts');
                $recentPosts.append(window.$recentPosts);
            });
    }
}