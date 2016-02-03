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

function toggleToEmployeeBucket(employeeId, employeeName) {

    if ($(".employee-bucket-list #" + employeeId).length) {
        $(".employee-bucket-list #" + employeeId).remove();
        $(".tb-assigned-modal-list #" + employeeId).remove();
        $(".employee-list").append("<li id=\"" + employeeId + "\"><span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\"></span> " + employeeName + "</li>");
    } else {
        $(".employee-bucket-list, .tb-assigned-modal-list").append("<li id=\"" + employeeId + "\">" + employeeName + "</li>");
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

    var message = getParameterByName('message');
    console.log(message);
    if (message == "add-success") {
        alertMessage("You have successfully added new resources to this project.");
        console.log("Add Success");
    }
    if (message == "edit-success") {
        alertMessage("You have successfully edited existing resources of this project.");
        console.log("Edit Success");
    }

    $('#employee-search').hideseek({
        hidden_mode: true
    });
    $(".panel").hover(function () { // Mouse over
        $(this).siblings().stop().fadeTo(300, 0.6);
        $(this).parent().siblings().stop().fadeTo(300, 0.3);
    }, function () { // Mouse out
        $(this).siblings().stop().fadeTo(300, 1);
        $(this).parent().siblings().stop().fadeTo(300, 1);
    });

    // Currently Assigned Partial
    $(".selectAllAssigned").click(function (e) {
        $('input:checkbox.currentlyAssigned').prop('checked', true);
        $('.assigned-modal-list').empty();
        $('input[type=checkbox]:checked').each(function () {
            var assignmentID = $(this).attr("data-id");
            var data = $(this).data();
            toggleToAssignedBucket(assignmentID, data);
        });
        countAssignmentCheckbox();
        e.preventDefault();
    });
    $(".selectNoneAssigned").click(function (e) {
        $('input:checkbox.currentlyAssigned').prop('checked', false);
        $('.assigned-modal-list').empty();
        countAssignmentCheckbox();
        e.preventDefault();
    });
    $("input:checkbox.currentlyAssigned").click(function (e) {
        var assignmentID = $(this).attr("data-id");
        var data = $(this).data();
        toggleToAssignedBucket(assignmentID, data);
        countAssignmentCheckbox();
    });

    //Batch Add Users Modal
    $('input[name=allocationMode]').click(function () {
        console.log("Allocation Mode Selected!");
        var selectedValue = $('input[name=allocationMode]:checked').val();
        $('#allocationModeSelect input[type=text]').attr('disabled', "disabled");
        $("input[name=" + selectedValue + "]").removeAttr("disabled");
    });

});

// The dynamic buttons that count selected boxes in the "Currently Assigned" partial
function countAssignmentCheckbox() {
    var numberOfChecked = $('input:checkbox.currentlyAssigned:checked').length;
    if (numberOfChecked > 0) {
        $(".batchEditButton").removeClass("btn-disabled").addClass("btn-primary");
        $(".batchEditButton").html(numberOfChecked.toString() + ' Selected');
        $(".batchEditButton").prop("disabled", false);
    }
    else {
        $(".batchEditButton").removeClass("btn-primary").addClass("btn-disabled");
        $(".batchEditButton").html('None Selected');
        $(".batchEditButton").prop("disabled", true);
    }
}

// Swaps from one ul,li to another

function toggleToAssignedBucket(assignmentId, data) {
    if ($(".assigned-modal-list #" + assignmentId).length) {
        $(".assigned-modal-list #" + assignmentId).remove();
    } else {
        $(".assigned-modal-list").append("<li id=\"" + assignmentId + "\">Assignment ID: " + assignmentId + "</li>");
        for (var i in data) {
            $('#' + assignmentId).attr("data-" + i, data[i]);
        }
        $('.assigned-modal-list #' + assignmentId).prepend("<b>" + $('.assigned-modal-list #' + assignmentId).attr("data-name") + "</b> | ");
    }
}

// Batch Add User Modal Button

$("#add-user-trigger").click(function () {
    $('#batch-add-modal').modal('show');
});

// Batch Add Modal - Commit Button Actions

$("#add-commit-submit").click(function () {

    console.log("Batch Add Commit Submit Clicked!");
    var users = [];

    $('.tb-assigned-modal-list li').each(function () {
        users.push($(this).attr('id'));
    });
    
    var allocationMode = $('#batch-add-modal input[name=allocationMode]:checked').val();

    if (allocationMode == "fixed") {
        allocationAmount = $('#batch-add-modal input[name=fixed]').val();
    } else if (allocationMode == "hours_per_day") {
        allocationAmount = $('#batch-add-modal input[name=hours_per_day]').val();
    } else {
        allocationAmount = ($('#batch-add-modal input[name=percent]').val()) / 100;
    }
    var projectId = $('#batchAdd-projectId').text();
    var startTime = $('.add-start-time').val();
    var endTime = $('.add-end-time').val();

    var data = {
        users: users,
        project_id: projectId,
        allocation_mode: allocationMode,
        allocation_amount: allocationAmount,
        start_time: startTime,
        end_time: endTime
    }

    console.log("Data being sent to controller: ");
    console.log(data);

    $.ajax({
            url: '/User/AddUsersToProject',
            type: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                $('#batch-add-modal').modal('hide');
                console.log(data);
                window.location = "?message=add-success";
            }
        });
});

// Batch Edit Modal - Commit Button Actions

$("#edit-commit-submit").click(function () {

    console.log("Batch Edit Commit Submit Clicked!");
    var users = [];
    var assignments = [];

    $('.assigned-modal-list li').each(function () {
        users.push($(this).attr('data-userid'));
        assignments.push($(this).attr('data-id'));
    });

    var allocationMode = $('#batch-edit-modal input[name=allocationMode]:checked').val();

    if (allocationMode == "fixed") {
        allocationAmount = $('#batch-edit-modal input[name=fixed]').val();
    } else if (allocationMode == "hours_per_day") {
        allocationAmount = $('#batch-edit-modal input[name=hours_per_day]').val();
    } else {
        allocationAmount = ($('#batch-edit-modal input[name=percent]').val()) / 100;
    }
    var projectId = $('#batchAdd-projectId').text();
    var startTime = $('.edit-start-time').val();
    var endTime = $('.edit-end-time').val();

    var data = {
        users: users,
        assignments: assignments,
        allocation_mode: allocationMode,
        allocation_amount: allocationAmount,
        start_time: startTime,
        end_time: endTime
    }

    console.log("Data being sent to controller: ");
    console.log(data);

    $.ajax({
        url: '/User/EditUsersOnProject',
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            $('#batch-edit-modal').modal('hide');
            console.log(data);
            window.location = "?message=edit-success";
        }
    });
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function alertMessage(message) {
    $(".alertMessage").text(message);
    $(".alertMessage").fadeIn("slow", function () { $(this).delay(4000).fadeOut("slow"); });
}

