angular
    .module('app', [
        'ngRoute',
        'ngResource'
    ])
    .config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider){
        var authToken = $('meta[name="csrf-token"]').attr('content');
        $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = authToken; 
        // console.log($httpProvider.defaults.headers);
        $routeProvider
        // HOME
        .when('/', {
            templateUrl: '/templates/home/index.html',
            controller: 'HomeCtrl'
        })
        // ROUTE PRODUCT CREATE
        .when('/products/new', {
            templateUrl: '/templates/product/new.html',
            controller: 'ProductAddCtrl'
        })
        // ROUTE PRODUCT LIST
        .when('/products', {
            templateUrl: '/templates/product/list.html',
            controller: 'ProductListCtrl'
        })
        // ROUTE PRODUCT EDIT
        .when('/products/:id', {
            templateUrl: '/templates/product/edit.html',
            controller: 'ProductEditCtrl'
        })
    }])

    // HOME
    .controller('HomeCtrl', ['$scope', 'Home', function($scope, Home){
        $scope.name = '';

        $scope.name = Home.query().$promise.then(function(data){
            console.log(data.txt, data.name)
        });
    }])
    .factory('Home', ['$resource', function($resource){
        return $resource('/hello.json', {}, {
            query: { method: 'GET', isArray: false }
        })
    }])
    
    // PRODUCT CREATE
    .controller('ProductAddCtrl', ['$scope', 'Product', '$location', function($scope, Product, $location){
        $scope.create = function(data){
            Product.create({
                product: data
            }).$promise.then(function(data){
                console.log(data)
                $location.path("/products")
            })
        };
    }])
    // PRODUCT EDIT
    .controller('ProductEditCtrl', ['$scope', 'Product', '$routeParams', '$location', function($scope, Product, $routeParams, $location){
        $scope.product = Product.get({ id: $routeParams.id })
        
        $scope.update = function(){
            Product.update( { id: $scope.product.id } , { product: $scope.product } ).$promise.then(function(data){
                $location.path("/products")
            });  
        };
    }])
    // PRODUCTS LIST
    .controller('ProductListCtrl', ['$scope', 'Products', '$location', 'Product', function($scope, Products, $location, Product){
        $scope.products = []

        Products.query().$promise.then(function(data){
            $scope.products = data
        });

        $scope.remove = function(id){
            if(confirm("Are you sure?")){
                Product.delete({id:id}).$promise.then(function(data){
                    Products.query().$promise.then(function(products){
                        $scope.products = products
                    });
                });                
            }
        }  
        
        $scope.edit = function(id){
            return $location.path("products/" + id)
        } 
    }])
    // REQUEST CREATE AND LIST
    .factory('Products', ['$resource', function($resource){
        return $resource('/products.json', {}, {
            create: { method: 'POST' },
            query: { method: 'GET', isArray: true }
        })
    }])
    // REQUEST UPDATE AND DELETE
    .factory('Product', ['$resource', function($resource){
        return $resource('/products/:id.json', {}, {
            update: { method: 'PUT', params: { id: '@id' } },
            delete: { method: 'DELETE', params: { id: '@id' } }
        })
    }]);