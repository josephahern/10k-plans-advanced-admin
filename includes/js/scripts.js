$(function () {
    $(".dropdown-menu > li > a.trigger").on("click", function (e) {
        var current = $(this).next();
        var grandparent = $(this).parent().parent();
        if ($(this).hasClass('left-caret') || $(this).hasClass('right-caret'))
            $(this).toggleClass('right-caret left-caret');
        grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
        grandparent.find(".sub-menu:visible").not(current).hide();
        current.toggle();
        e.stopPropagation();
    });
    $(".dropdown-menu > li > a:not(.trigger)").on("click", function () {
        var root = $(this).closest('.dropdown');
        root.find('.left-caret').toggleClass('right-caret left-caret');
        root.find('.sub-menu:visible').hide();
    });

    $('.employee-list, .employee-bucket-list').on('click', 'li', function () {
        var employeeId = $(this).attr('id');
        var employeeName = $(this).text();
        console.log("Click function -" + employeeId + " " + employeeName);
        toggleToEmployeeBucket(employeeId, employeeName);
    });

});

function selectAllCheckboxes(source) {
    checkboxes = document.getElementsByName('assignee');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = source.checked;
    }
}

function toggleToEmployeeBucket(employeeId, employeeName) {

    if ($(".employee-bucket-list #" + employeeId).length) {
        $(".employee-bucket-list #" + employeeId).remove();
        $(".employee-list").append("<li id=\"" + employeeId + "\"><span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\"></span> " + employeeName + "</li>");
    } else {
        $(".employee-bucket-list").append("<li id=\"" + employeeId + "\"><span class=\"glyphicon glyphicon-remove-sign\" aria-hidden=\"true\"></span> " + employeeName + "</li>");
        $(".employee-list #" + employeeId).remove();
    }

    if ($(".employee-bucket-list").length > 0) {
        $("#employee-search-bucket").toggleClass("hidden", false);
    }
    else if ($(".employee-bucket-list").length == 0) {
        $("#employee-search-bucket").toggleClass("hidden", true);
    }
}

$(document).ready(function () {
    $('#employee-search').hideseek({
        hidden_mode: true
    });
});
