(function () {
    angular
        .module('LibraryApp')
        .config(LibraryConfig);

    LibraryConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function LibraryConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("form", {
                url: "/form",
                templateUrl: "form.html",
                controller: "formCtrl",
                controllerAs: "ctrl"
            })
            .state("details", {
                url: "/details/:bookId",
                templateUrl: "details.html",
                controller: "detailsCtrl",
                controllerAs: "ctrl"
            });

        $urlRouterProvider.otherwise("/form");
    }
})();
