(function () {
    angular
        .module('LibraryApp')
        .service('svc', svc);

    svc.$inject = ['$http', '$q'];

    function svc($http, $q) {

        var self = this;

        self.bookList = list;
        self.bookDetails = details;

        //function to search db
        function list(params) {
            if(!params) {
                params = {
                    title: "",
                    author:"",
                    limit: 10,
                    offset: 0
                }
            }
            var defer = $q.defer();

            $http.get("/api/books/" ,{params: params})
                .then(function (results) {

                    defer.resolve(results);
                }).catch(function (err) {
                defer.reject(err);
            });
            return (defer.promise);
        }

        //function to retrieve one single book
        function details(bookId) {
            var defer = $q.defer();
            $http.get("/api/book/" + bookId)
                .then(function (result) {
                    defer.resolve(result.data);
                }).catch(function (error) {
                defer.reject(error);
            });
            return (defer.promise);
        }

    }

})();

