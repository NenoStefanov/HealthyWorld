/* globals firebase  $ */

import { ControllersFactory } from './controllers';
import { firebaseConfig } from './environments/firebase-config';
import { Router } from './router';
import { ServicesFactory } from './services';
import { UtilsFactory } from './utils';

export class App {
    constructor() {
        this._firebaseApp = firebase.initializeApp(firebaseConfig);
        this._utils = new UtilsFactory().getAll();
        this._services = new ServicesFactory(this._firebaseApp, this._utils).getAll();
        this._controllers = new ControllersFactory(this._services, this._utils).getAll();
        this._router = new Router(this._controllers);
    }

    initialize() {
        this.setNavigation();
        this.setRelatedLinks();
        this.addEventListeners();
        this._router.run('#/home');
    }

    setNavigation() {
        let $authButtons = $('.btn-auth'),
            $userNav = $('#user-nav'),
            $mobileUserNav = $('#mobile-user-nav');


        this._services.authService.isAuthenticated()
            .subscribe(isAuthenticated => {
                if (isAuthenticated) {
                    $authButtons.hide();
                    $userNav.show();
                    $mobileUserNav.show();
                } else {
                    $authButtons.show();
                    $userNav.hide();
                    $mobileUserNav.hide();
                }
            });
    }

    setRelatedLinks() {
        let $recentPosts = $('.recent-posts'),
            $archives = $('.archives');

        this._services.postsService.findLastPosts()
            .map(posts => createRelatedItems(posts))
            .subscribe(items => $recentPosts.append(items));

        this._services.postsService.findFirstPosts()
            .map(posts => createRelatedItems(posts))
            .subscribe(items => $archives.append(items));

        function createRelatedItems(posts) {
            let $documentFragment = $(document.createDocumentFragment());

            for (let i = 0; i < posts.length; i += 1) {
                const post = posts[i],
                    $item = $(document.createElement('li')),
                    $link = $(document.createElement('a'));

                $link.attr('href', `#/posts/${post.$key}`);
                $link.html(post.val);
                $link.appendTo($item);

                $documentFragment.append($item);
            }

            return $documentFragment;
        }
    }

    addEventListeners() {
        let $tbSearch = $('#tb-search'),
            $btnSearch = $('#btn-search'),
            $mainNav = $('#main-nav'),
            $mainNavLinks = $mainNav.find('a'),
            $mobileNav = $('#mobile-nav'),
            $btnMobileNav = $mobileNav.children('#btn-mobile-nav'),
            $mobileNavList = $mobileNav.children('ul'),
            $mobileNavLinks = $mobileNavList.find('a');

        $tbSearch.keypress(e => {
            if (e.which === 13) {
                window.location.href = `#/posts?s=${$tbSearch.val()}`;
            }
        });

        $btnSearch.on('click', () => {
            window.location.href = `#/posts?s=${$tbSearch.val()}`;
        });

        $mainNav.click(e => {
            $mainNavLinks.removeClass('selected');
            $(e.target).addClass('selected');
        });

        $btnMobileNav.click(e => {
            $mobileNavList.toggle();
            e.preventDefault();
            return false;
        });

        $mobileNavLinks.click(e => {
            $mobileNavLinks.removeClass('selected');
            e.target.addClass('selected');
        });
    }
}