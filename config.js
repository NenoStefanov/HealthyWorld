(function(global) {
    SystemJS.config({
        'transpiler': 'plugin-babel',

        'paths': {
            'npm:': 'node_modules/'
        },

        'map': {
            // setup
            'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
            'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js',

            // App files
            'app': './public/scripts/app.js',
            'router': './public/scripts/router.js',
        }
    });
})(this);