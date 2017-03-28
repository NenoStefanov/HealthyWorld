/* globals $ Rx */

import * as paginate from '../../bower_components/handlebars-paginate/index';

export class TemplatesLoader {
    constructor() {
        this._handlebars = window.Handlebars;
        this._cache = {};

        this._handlebars.registerHelper('paginate', paginate.default);
    }

    get(name) {
        return Rx.Observable.create(observer => {
            if (this._cache[name]) {
                observer.next(this._cache[name]);
            } else {
                var url = `templates/${name}.handlebars`;
                $.get(url, (html) => {
                        var template = this._handlebars.compile(html);
                        this._cache[name] = template;
                        observer.next(template);
                    })
                    .fail(() => console.log('err'));
            }
        });
    }
}