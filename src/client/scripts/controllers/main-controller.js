/* globals $ Rx */

export class MainController {
    constructor({ dataService, postsService }, { templatesLoader }) {
        this._dataService = dataService;
        this._postsService = postsService;
        this._templatesLoader = templatesLoader;
    }

    getHome(context) {
        const postsCount = 3;

        Rx.Observable.combineLatest([
                this._templatesLoader.get('home'),
                this._postsService.findAllPosts(postsCount),
                this._dataService.getList('media', { limitToFirst: 7 }),
                window.recentPosts$
            ])
            .subscribe(res => {
                let template = res[0],
                    posts = res[1],
                    media = res[2],
                    recentPosts = res[3];

                context.$element().html(template({ posts, media, recentPosts }));

                let $slides = $('.slide');
                $slides.hide();
                $slides.first().show();
            });
    }
}