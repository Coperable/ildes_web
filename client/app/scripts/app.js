'use strict';

angular
.module('slamApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'config',
    'ngTouch',
    'ui.router',
    //'ui.bootstrap',
    'satellizer'
])
.config(function($routeProvider, $authProvider, $locationProvider) {
    $routeProvider
    .when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
    })
    .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
    })
    .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'profile-view'
    })
    .when('/foro', {
        templateUrl: 'views/foro.html',
        controller: 'foro-view'
    })
    .when('/revista', {
        templateUrl: 'views/revista.html',
        controller: 'revista-view'
    })
    .when('/actividad/:id', {
        templateUrl: 'views/actividad.html',
        controller: 'actividad-view'
    })
    .when('/invitado/:id', {
        templateUrl: 'views/invitado.html',
        controller: 'invitado-view'
    })
    .when('/invitados', {
        templateUrl: 'views/invitados.html',
        controller: 'invitado-list'
    })
    .when('/actividades', {
        templateUrl: 'views/actividades.html',
        controller: 'actividad-list'
    })
    .when('/videos', {
        templateUrl: 'views/videos.html',
        controller: 'video-list'
    })
    .when('/registro', {
        templateUrl: 'views/registro.html',
        controller: 'user-signup'
    })
    .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
    })
    .otherwise({
        redirectTo: '/'
    });

    //$locationProvider.html5Mode(true);


    function skipIfLoggedIn($q, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.reject();
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.resolve();
        } else {
            $location.path('/login');
        }
        return deferred.promise;
    }



})
.config(function ($authProvider, api_host) {

    $authProvider.baseUrl = api_host+'/';
    $authProvider.httpInterceptor = true;
    $authProvider.signupRedirect = null;

    $authProvider.facebook({
        url: '/auth/social/facebook',
        clientId: '295482087249664',
        scope: 'email,public_profile'
    });

    $authProvider.google({
        url: '/auth/social/google',
        clientId: '313110710680-p22p1s5brqn7tfaqj9v16u67bic5smqk.apps.googleusercontent.com'
    });

    $authProvider.twitter({
        url: '/auth/social/twitter'
    });

})
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})
.run(function($rootScope, $location, $anchorScroll) {
    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
        if($location.hash()) {
            $anchorScroll();
        } else {
            window.scrollTo(0, 0);

        }
    });
});

;
