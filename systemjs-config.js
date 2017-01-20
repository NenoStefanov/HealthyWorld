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
            'firebase-config': './public/scripts/environments/firebase-config.js',
            'data-service': './public/scripts/services/data-service.js',


            // libraries
            'rxjs': 'npm:rxjs',
            'firebase': 'npm:firebase',
            'jquery': './public/bower_components/jquery/dist/jquery.js',
            'sammy': './public/bower_components/sammy/lib/sammy.js',
            'bootstrap': './public/bower_components/bootstrap/dist/js/bootstrap.js'
        },
        packages: {
            'rxjs': { defaultExtension: 'js' }, // and added this to packages
            'firebase': { defaultExtension: 'js' }
        }
    });
})(this);