(function(global) {
    SystemJS.config({
        'transpiler': 'plugin-babel',

        'paths': {
            'npm:': 'node_modules/',
            'bower:': 'public/bower_components/'
        },

        'map': {
            // setup
            'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
            'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js',

            // app files
            'app': './public/scripts/app.js',
            'router': './public/scripts/router.js',
            'firebase-config': './public/scripts/environments/firebase-config.js',
            'auth-service': './public/scripts/services/auth-service.js',
            'data-service': './public/scripts/services/data-service.js',


            // libraries
            'rxjs': 'npm:rxjs',
            'firebase': 'npm:firebase',
            'jquery': 'bower:jquery/dist/jquery.js',
            'sammy': 'bower:sammy/lib/sammy.js',
            'bootstrap': 'bower:bootstrap/dist/js/bootstrap.js'
        },

        packages: {
            'rxjs': { defaultExtension: 'js' },
            'firebase': { defaultExtension: 'js' }
        }
    });
})(this);