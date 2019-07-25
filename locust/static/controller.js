app.controller('MainController', ['$scope', '$http', '$timeout', 'ModalService', function($scope, $http, $timeout, ModalService) {
    var stats_tpl = $('#stats-template');
    var errors_tpl = $('#errors-template');
    var exceptions_tpl = $('#exceptions-template');
    var slaves_tpl = $('#slave-template');

    $scope.errors = [];

    var sortBy = function(field, reverse, primer){
        reverse = (reverse) ? -1 : 1;
        return function(a,b){
            a = a[field];
            b = b[field];
        if (typeof(primer) != 'undefined'){
            a = primer(a);
            b = primer(b);
        }
        if (a<b) return reverse * -1;
        if (a>b) return reverse * 1;
        return 0;
        };
    };

    // Sorting by column
    var sortAttribute = "name";
    var slaveSortAttribute = "id";
    var desc = false;


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
        },
        {
            'id': 'exceptions',
            'title': 'Exceptions'
        },
        {
            'id': 'download-data',
            'title': 'Download Data'
        },
        {
            'id': 'slaves',
            'title': 'Slaves'
        }
    ];
    $scope.selectedTab = $scope.tabs[0];
    $scope.selectTab = function(newTab) {
        $scope.selectedTab = newTab;
        
        if (newTab.id == 'charts') {
            rpsChart.resize();
            responseTimeChart.resize();
            usersChart.resize();
        }
    };

    $scope.startSwarming = function() {
        $http.post('/swarm');
    };


    $scope.slaveList = [];

    function updateStats() {
        $http.get('stats/requests').then(function (res) {
            var report  = res.data;

            $("#total_rps").html(Math.round(report.total_rps*100)/100);
            //$("#fail_ratio").html(Math.round(report.fail_ratio*10000)/100);
            $("#fail_ratio").html(Math.round(report.fail_ratio*100));
            $("#status_text").html(report.state);
            $("#userCount").html(report.user_count);
    
            if (report.slaves) {
                slaves = (report.slaves).sort(sortBy(slaveSortAttribute, desc));
                $scope.slaveList = slaves;
            }
    
            totalRow = report.stats.pop();
            sortedStats = (report.stats).sort(sortBy(sortAttribute, desc));
            sortedStats.push(totalRow);
            // $('#stats tbody').jqoteapp(stats_tpl, sortedStats);
            // $('#errors tbody').jqoteapp(errors_tpl, (report.errors).sort(sortBy(sortAttribute, desc)));

            $scope.stats = sortedStats;
            $scope.errors = report.errors;
    
            if (report.state !== "stopped"){
                // get total stats row
                var total = report.stats[report.stats.length-1];
                // update charts
                rpsChart.addValue([total.current_rps]);
                responseTimeChart.addValue([report.current_response_time_percentile_50, report.current_response_time_percentile_95]);
                usersChart.addValue([report.user_count]);
            }
    
            $timeout(updateStats, 2000);
        });
    }
    updateStats();

    function updateExceptions() {
        $http.get('exceptions').then(function(res) {
            var data = res.data;

            $('#exceptions tbody').empty();
            $('#exceptions tbody').jqoteapp(exceptions_tpl, data.exceptions);
            $timeout(updateExceptions, 5000);
        });
    }
    updateExceptions();

    $scope.editingSlave = {};
    $scope.editSlaveSchedule = function(slave) {
        $scope.editingSlave = slave;
        $scope.editingSlave.textSchedule = csvToTextArea(slave.schedule);

        ModalService.Open('custom-modal-1');
    };

    $scope.saveEditedSlave = function() {
        ModalService.Close('custom-modal-1');

        var newSchedule = textToArray($scope.editingSlave.textSchedule);

        $.ajax('./updateSched', {
            data : JSON.stringify({'id': $scope.editingSlave.id, 'newSchedule': newSchedule}),
            contentType : 'application/json',
            type : 'POST'
        });

        $scope.editingSlave = {};
    };

    function textToArray(text) {
        var lines = text.split('\n');
        var arr = [];

        for (var i = 0; i < lines.length; i++) {
            arr.push(lines[i].split(','));
        }

        return arr;
    }

    function csvToTextArea(csv) {
        var str = '';

        for (var i = 0; i < csv.length; i++) {
            str += csv[i].join(',');
            if (i != csv.length - 1) {
                str += '\n';
            }
        }
        return str;
    }
}]);