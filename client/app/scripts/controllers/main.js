'use strict';

/**
 * @ngdoc function
 * @name slamApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the slamApp
 */
angular.module('slamApp')
.controller('MainCtrl', function ($scope, $rootScope, $http, $sce, $timeout, api_host, Region, Account) {
	$rootScope.home_page = true;

    $scope.summary = $rootScope.region_summary;

    $scope.random_participants = [];

    $scope.newlines = function(text) {
        return text.replace(/\n/g, '<br/>');
    };

    $scope.setup_components = function() {
        setTimeout(function() {
            jQuery("#home_slider_2").carousel({
                interval:7e3
            });

            jQuery('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover'
		    });

            jQuery('#carousel-torneos').carousel({
                interval: 1000,
                wrap: false
            });

            jQuery("#preloader").fadeOut("fast",function(){
                jQuery(this).remove()
            });

        }, 1000);
        if($scope.summary) {
            $scope.random_participants = _.shuffle($scope.summary.participants);
        }

    };

    $scope.setup_components();



    $rootScope.$on("region_summary", function(event, summary) {
        $scope.summary = summary;
        $scope.random_participants = _.shuffle($scope.summary.participants);
    });

    $scope.getYoutubeSrc = function(video) {
        return $sce.trustAsResourceUrl("http://www.youtube.com/embed/"+video.name);
    };

    $scope.participate = function(competition) {
        $http.post(api_host+'/api/competition/'+competition.id+'/participate', {})
        .success(function(data) {
            $scope.refresh();
        })
        .error(function(error) {

        });
    };


})
.controller('slider-controller', function ($scope, $auth, $timeout, Slider) {
    $scope.sliders = [];
    Slider.query(function(sliders) {
        $scope.sliders = sliders;
        $timeout(function() {
            jQuery("#home_slider_main").carousel({
                interval:7e3
            });
        });
    });


})
.controller('site-controller', function ($scope, $rootScope, $http, $auth, $location, $anchorScroll, $timeout, Region, Account) {
    /*
    $scope.current_region = {};

    Account.listenRegion(function(region) {
        $scope.current_region = region;
    });
    */
    $scope.refresh = function() {
        Account.fetchRegionSummary();
    };

    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    $scope.goPresentacion = function() {
        $location.path('/');
        $timeout(function() {
            $scope.scrollTo('acerca_de_posicion');
        }, 1000);
    };

    $scope.goApoyos = function() {
        $location.path('/');
        $timeout(function() {
            $scope.scrollTo('sec_apoyo');
        }, 1000);
    };

    $scope.goContacto = function() {
        $location.path('/');
        $timeout(function() {
            $scope.scrollTo('contact_menu');
        }, 1000);
    };

    $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
   }


})
.controller('sessionBar', function ($scope, $rootScope, $http, $route, $location, Region, Account) {
    $scope.regions = [];
    $scope.region = {};
    $scope.summary = $rootScope.region_summary;

    $scope.is_authenticated = false;
    $scope.account = false;
    $scope.profile = false;

    Region.query(function(regions) {
        $scope.regions = regions;
        if(_.isEmpty($scope.current_region)) {
            Account.setCurrentRegion(_.first($scope.regions));
        }
    });

    Account.getProfile(function(data) {
        $scope.profile = data;
    });

    $scope.changeCurrentRegion = function(region) {
        Account.setCurrentRegion(region);
    };

    $rootScope.$on("account", function(event, profile) {
        if(profile) {
            $scope.account = profile;
        }
    });

    $scope.logout = function() {
        Account.logout();
        $route.reload();
        $scope.refresh();
        window.scrollTo(0, 0);
    };

    $scope.goProfile = function() {
        $location.path('/invitado/'+Account.profile.id);
    };


})
.controller('video-list', function ($scope, $rootScope, $http, $sce, api_host, Region, Account) {

	$rootScope.home_page = false;

	$scope.predicate = 'lastname';
	$scope.reverse = false;

    $scope.direction = function(direction) {
        $scope.reverse = direction;
    };

    $scope.sort = function(field) {
        if(field === 'date') {
            $scope.predicate = 'id';
        }
        if(field === 'ranking') {
            $scope.predicate = 'competitions';
        }
    };

    $scope.videos = [];

    $rootScope.$on("region_summary", function(event, summary) {
        $scope.processSummary();
    });

    $scope.processSummary = function() {
        if($rootScope.region_summary) {
            $scope.summary = $rootScope.region_summary;
            $scope.videos = $scope.summary.videos;
            $scope.competitions = $scope.summary.competitions;
        }

        jQuery("#preloader").fadeOut("fast",function(){
            jQuery(this).remove()
        });
    };

    $scope.search_term = '';

    $scope.doSearch = function() {
        if($scope.search_term.trim() == '') {
            $scope.participants = $scope.summary.participants;
            return;
        }
        var pattern = new RegExp($scope.search_term, "gi");
        $scope.videos = _.filter($scope.summary.videos, function(model) {
            return pattern.test(JSON.stringify(model));
        });
    };

    $scope.getYoutubeSrc = function(video) {
        return $sce.trustAsResourceUrl("http://www.youtube.com/embed/"+video.name);
    };

    $scope.processSummary();

})
.controller('invitado-list', function ($scope, $rootScope, $http, api_host, Region, Account) {

    $scope.summary = $rootScope.region_summary;
	$rootScope.home_page = false;

	$scope.predicate = 'lastname';
	$scope.reverse = false;

    $scope.direction = function(direction) {
        $scope.reverse = direction;
    };

    $scope.newlines = function(text) {
        return text.replace(/\n/g, '<br/>');
    };

    $scope.sort = function(field) {

    };

    $scope.participants = [];

    $rootScope.$on("region_summary", function(event, summary) {
        $scope.processSummary();
    });

    $scope.processSummary = function() {
        if($rootScope.region_summary) {
            $scope.summary = $rootScope.region_summary;
            $scope.participants = $scope.summary.participants;
        }
        jQuery("#preloader").fadeOut("fast",function(){
            jQuery(this).remove()
        });

    };

    $scope.search_term = '';

    $scope.doSearch = function() {
        if($scope.search_term.trim() == '') {
            $scope.participants = $scope.summary.participants;
            return;
        }
        var pattern = new RegExp($scope.search_term, "gi");
        $scope.participants = _.filter($scope.summary.participants, function(model) {
            return pattern.test(JSON.stringify(model));
        });
    };

    $scope.processSummary();


})
.controller('LoginCtrl', function($scope, $rootScope, $auth, $location, $state, $stateParams, $route, Account) {

    $scope.backUrl = $stateParams.backUrl;

    $scope.login = function() {
        $auth.login({ email: $scope.email, password: $scope.password })
        .then(function(response) {
            Account.getProfile(function(profile) {
                $scope.account = profile;
                $route.reload();
                $scope.refresh();
                window.scrollTo(0, 0);
            });
        })
        .catch(function(response) {
            //text: 'Los datos ingresados no son correctos', 
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
            //text: 'Se ha autenticado el usuario', 
        })
        .catch(function(response) {
            //text: response.message, 
        });
    };

})
.controller('SignupCtrl', function($scope, $auth, $state, $location, $route, Account) {

    $scope.signup = function() {
        $auth.signup({
            username: $scope.username,
            email: $scope.email,
            password: $scope.password,
            language_code: 'ES' //ToDo: Obtener del sitio
        })
        .then(function() {
            $auth.login({ email: $scope.email, password: $scope.password })
            .then(function(response) {
                Account.getProfile(function(profile) {
                    $scope.account = profile;
                    $route.reload();
                    $scope.refresh();
                    window.scrollTo(0, 0);
                });
            });

        })
        .catch(function(response) {
            //text: 'Los datos no son correctos', 
        });
    };

    $scope.authenticate = function(provider) {
        $auth.authenticate(provider)
        .then(function() {
           // $state.go('select-profile'); 
            Account.getProfile(function(profile) {
                $scope.user_data = profile;
            });
        })
        .catch(function(response) {
            //text: response.message, 
        });
    };


})
.controller('invitado-view', function ($scope, $rootScope, $routeParams, $http, $sce, api_host, Participant) {
	$rootScope.home_page = false;
    
    $scope.participant = {};

    $scope.getYoutubeSrc = function(video) {
        return $sce.trustAsResourceUrl("http://www.youtube.com/embed/"+video.name);
    };

    Participant.get({
        id: $routeParams.id
    }, function(participant ) {
        $scope.participant = participant;
        jQuery("#preloader").fadeOut("fast",function(){
            jQuery(this).remove()
        });
    });


})
.controller('revista-view', function ($scope, $rootScope) {
	$rootScope.home_page = false;
    jQuery("#preloader").fadeOut("fast",function(){
        jQuery(this).remove()
    });

})
.controller('actividad-view', function ($scope, $rootScope, $routeParams, $http, $sce, api_host, Competition) {
	$rootScope.home_page = false;
    
    $scope.competition = {};

    $scope.getMapSrc = function() {
        console.log('getMapSrc');
        //return $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/view?center='+$scope.competition.location.latitude+','+$scope.competition.location.longitude+'&zoom=18&maptype=satellite');
        if(_.isEmpty($scope.competition)) {
            return '';
        }
        console.log('https://www.google.com/maps/embed?center='+$scope.competition.location.latitude+','+$scope.competition.location.longitude+'&zoom=13');
        //return $sce.trustAsResourceUrl('https://www.google.com/maps/embed?center='+$scope.competition.location.latitude+','+$scope.competition.location.longitude+'&zoom=13');
        return $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?q=place_id:'+$scope.competition.location.place_id+'&zoom=13');
    };

    Competition.get({
        id: $routeParams.id
    }, function(competition) {
        $scope.competition = competition;
        jQuery("#preloader").fadeOut("fast",function(){
            jQuery(this).remove()
        });
    });

    $scope.participate = function(competition) {
        $http.post(api_host+'/api/competition/'+competition.id+'/participate', {})
        .success(function(data) {
            $scope.refresh();
        })
        .error(function(error) {
            console.log(error);
        });
    };



})

.controller('actividad-list', function ($scope, $rootScope, $http, api_host, Region, Account) {
	$rootScope.home_page = false;

    $rootScope.$on("region_summary", function(event, summary) {
        $scope.processSummary();
    });

    $scope.competitions = [];
    $scope.espacios = [];
    $scope.fechas = [];


    $scope.processSummary = function() {
        if($rootScope.region_summary) {
            $scope.summary = $rootScope.region_summary;
            $scope.competitions = $scope.summary.competitions;
            $scope.espacios  = $scope.summary.espacios;
            jQuery("#preloader").fadeOut("fast",function(){
                jQuery(this).remove()
            });
            $scope.processFechas();
        }
    };

    $scope.processFechas = function() {
        $scope.fechas = [];
        var fechas_map = {};
        _.each($scope.summary.competitions, function(model) {
            var fecha_moment = moment(model.event_date),
                code = 'd'+fecha_moment.format('DDDD');
            if(!fechas_map[code]) {
                $scope.fechas.push({
                    code: code,
                    formatted: fecha_moment.format('ddd D')
                });
                fechas_map[code] = true;
            }
        });
        
    };

    $scope.doFilterFecha = function(fecha) {
        $scope.current_espacio = false;
        if(fecha) {
            $scope.current_fecha = fecha.code;
            $scope.competitions = _.filter($scope.summary.competitions, function(model) {
                return 'd'+moment(model.event_date).format('DDDD') == fecha.code;
            });
        } else {
            $scope.current_fecha = false;
            $scope.competitions = $scope.summary.competitions;
        }
    };


    $scope.doFilter = function(espacio) {
        $scope.current_fecha = false;
        if(espacio) {
            $scope.current_espacio = espacio.code;
            $scope.competitions = _.filter($scope.summary.competitions, function(model) {
                return model.region_id == espacio.id;
            });
        } else {
            $scope.current_espacio = false;
            $scope.competitions = $scope.summary.competitions;
        }
    };

    $scope.processSummary();

	$scope.predicate = 'title';
	$scope.reverse = false;

    $scope.direction = function(direction) {
        $scope.reverse = direction;
    };

    $scope.sort = function(field) {
        if(field === 'date') {
            $scope.predicate = 'id';
        }
        if(field === 'ranking') {
            $scope.predicate = 'competitions';
        }
    };

    $scope.search_term = '';

    $scope.competitions = [];

    $scope.doSearch = function() {
        if($scope.search_term.trim() == '') {
            $scope.competitions = $scope.summary.competitions;
            return;
        }
        var pattern = new RegExp($scope.search_term, "gi");
        $scope.competitions = _.filter($scope.summary.competitions, function(model) {
            return pattern.test(JSON.stringify(model));
        });
    };


})




.controller('user-signup', function ($scope, $rootScope) {
	$rootScope.home_page = false;
})

.controller('foro-view', function ($scope, $rootScope) {
	$rootScope.home_page = false;

})
.controller('profile-view', function ($scope, $rootScope) {
	$rootScope.home_page = false;

})

;
