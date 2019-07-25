var alternate = true;
var rpsChart = new LocustLineChart($(".charts-container"), "Total Requests per Second", ["RPS"], "reqs/s");
var responseTimeChart = new LocustLineChart($(".charts-container"), "Response Times (ms)", ["Median Response Time", "95% percentile"], "ms");
var usersChart = new LocustLineChart($(".charts-container"), "Number of Users", ["Users"], "users");

var app = angular.module('locust', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[{');
    $interpolateProvider.endSymbol('}]');
});