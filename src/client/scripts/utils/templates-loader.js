/* globals $ */

export class TemplatesLoader {
    constructor() {
        this._handlebars = window.handlebars || window.Handlebars;
        this._cache = {};
    }

    get(name) {
        var promise = new Promise((resolve, reject) => {
            if (this._cache[name]) {
                resolve(this._cache[name]);
                return;
            }
            
            var url = `templates/${name}.handlebars`;
            $.get(url, (html) => {
                    var template = this._handlebars.compile(html);
                    this._cache[name] = template;
                    resolve(template);
                })
                .fail(() => reject('Cannot load the template'));
        });
        return promise;
    }
}