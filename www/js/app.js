angular.module('app', ['ionic', 'app.controllers', 'app.services', 'ngStorage'])

.run(function ($state, $ionicPlatform, Preferencias) {
    $ionicPlatform.ready(function () {

        var preferencias = Preferencias.Get();
        if (parseInt(preferencias.DefaultListId) > 0) {
            $state.go('home').then(function () {
                $state.go('lista', {
                    "Id": preferencias.DefaultListId
                });
            });
        }

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }
    });
})

.config(function ($cordovaAppRateProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    document.addEventListener("deviceready", function () {
        var prefs = {
            language: 'pt',
            appName: 'Teslo ToDo',
            androidURL: 'market://details?id=br.com.teslo.teslo_todo'
        };
        $cordovaAppRateProvider.setPreferences(prefs)
    }, false);

    $ionicConfigProvider.backButton.text('').previousTitleText(false);

    $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: 'index.html',
        })

    .state('home', {
        url: '/',
        cache: false,
        controller: "HomeCtrl",
        templateUrl: 'templates/home.html',
    })

    .state('lista', {
        url: '/lista/:Id',
        cache: false,
        controller: "ListaCtrl",
        templateUrl: 'templates/lista.html',
    })

    .state('preferencias', {
        url: '/preferencias',
        cache: false,
        controller: "PreferenciasCtrl",
        templateUrl: 'templates/preferencias.html',
    })

    .state('sobre', {
        url: '/sobre',
        cache: false,
        controller: "SobreCtrl",
        templateUrl: 'templates/sobre.html',
    })

    $urlRouterProvider.otherwise('/');
});
