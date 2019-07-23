var app = angular.module('locust', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[{');
    $interpolateProvider.endSymbol('}]');
});

app.controller('MainController', ['$scope', function($scope) {
    $scope.tabs = [
        {
            'id': 'statistics',
            'title': 'Statistics'
        },
        {
            'id': 'charts',
            'title': 'Charts'
        },
        {
            'id': 'failures',
            'title': 'Failures'
        }
    ];
    $scope.selectedTab = $scope.tabs[0];
    $scope.selectTab = function(newTab) {
        console.log(newTab);
        $scope.selectedTab = newTab;
    };
}]);