(function () {
    angular
        .module('LibraryApp')
        .controller('formCtrl', formCtrl)
        .controller('detailsCtrl', detailsCtrl);

    formCtrl.$inject = ['$state', 'svc'];

    function formCtrl($state, svc) {

        var vm = this;
        vm.books = {};


        vm.search = function () {
            svc
                .bookList({
                    title: vm.title,
                    author: vm.author,
                    limit: 10,
                    offset: 0
                })
                .then(function (results) {
                    vm.books = results.data;
                    console.log(vm.books);
                });

        };


        vm.edit = function () {
            $state.go()
        }
        vm.getDetails = function (bookId) {
            console.info(bookId);
            $state.go("details", {'bookId': bookId});
        };



    }

    detailsCtrl.$inject = ['$state', '$stateParams', 'svc'];

    function detailsCtrl($state, $stateParams, svc) {
        var vm = this;
        vm.book={};

        vm.backToSearch = function () {
            $state.go("form");
        };
        svc
            .bookDetails($stateParams.bookId)
            .then(function (book) {
                vm.book = book;
            });


    }

})();
