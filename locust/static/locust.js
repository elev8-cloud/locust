
var slaveList = [];
var editingLine;

function editSched(id) {
    editingLine = getScheduleById(id);

    $("#update-id").html('Editing: ' + editingLine.id);
    $("#update-textarea").val(csvToTextArea(editingLine.schedule));

    $('#edit-sched-div').show();
}

function updateSched() {
    var newSchedule = textAreaToArray($('#update-textarea').val());

    $.ajax('./updateSched', {
        data : JSON.stringify({'id': editingLine.id, 'newSchedule': newSchedule}),
        contentType : 'application/json',
        type : 'POST'
    });

    editingLine = undefined;
    $('#edit-sched-div').hide();
}

function getScheduleById(id) {
    return slaveList.filter(function(slave) {
        return slave.id == id;
    })[0];
}

function textAreaToArray(text) {
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

