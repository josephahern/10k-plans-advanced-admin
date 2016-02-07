$(function () {

    //
    // Basic site functionality and different library initializations
    //

    // Generates success messages
    function alertMessage(message) {
        $(".alertMessage").text(message);
        $(".alertMessage").fadeIn("slow", function () { $(this).delay(4000).fadeOut("slow"); });
    }

    // Project Index page, table sorting initialization
    $("#project-list").tablesorter();
    
    // Project Index page, clickable rows...
    $("#project-list tbody tr").click(function () {
        window.location.href = "/project/" + $(this).attr("data-project-id");
    });

    // Date Picker Initialization
    $('.input-group.date').datepicker({
        format: "mm/dd/yyyy",
        orientation: "bottom left"
    });

    // Initialize "Batch Add Users" search results 
    $('#employee-search').hideseek({
        hidden_mode: true
    });

    // Multi-tier dropdown menu
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

    //
    // Batch Add Users
    //

    // Click function for adding a Resource from "Batch Add Users" search result into 
    $('.employee-list, .employee-bucket-list').on('click', 'li', function () {
        var userId = $(this).attr('data-user-id');
        var userFullName = $(this).text();
        toggleToEmployeeBucket(userId, userFullName);
    });

    // Takes employeeId and employeeName
    function toggleToEmployeeBucket(userId, userFullName) {
        if ($('.employee-bucket-list li[data-user-id="' + userId + '"]').length) {
            $('.employee-bucket-list li[data-user-id="' + userId + '"]').remove();
            $('.tb-assigned-modal-list li[data-user-id="' + userId + '"]').remove();
            $(".employee-list").append("<li data-user-id=\"" + userId + "\"><span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\"></span> " + userFullName + "</li>");
        } else {
            $(".employee-bucket-list").append("<li data-user-id=\"" + userId + "\"><span class=\"glyphicon glyphicon-minus-sign\" aria-hidden=\"true\"></span>" + userFullName + "</li>");
            $(".tb-assigned-modal-list").append("<li data-user-id=\"" + userId + "\">" + userFullName + "</li>");
            $('.employee-list li[data-user-id="' + userId + '"]').remove();
        }

        if ($(".employee-bucket-list").length > 0) {
            $("#employee-search-bucket").toggleClass("hidden", false);
        }
        else if ($(".employee-bucket-list").length == 0) {
            $("#employee-search-bucket").toggleClass("hidden", true);
        }
    }

    $(".selectAllAssigned").click(function (e) {
        $('input:checkbox.currentlyAssigned').prop('checked', true);
        $('.edit-assignment-modal-list').empty();
        $('input[type=checkbox]:checked').each(function () {
            var assignmentID = $(this).attr("data-id");
            var data = $(this).data();
            toggleToEditAssignmentList(assignmentID, data);
        });
        countAssignmentCheckbox();
        e.preventDefault();
    });

    $(".selectNoneAssigned").click(function (e) {
        $('input:checkbox.currentlyAssigned').prop('checked', false);
        $('.edit-assignment-modal-list').empty();
        countAssignmentCheckbox();
        e.preventDefault();
    });

    $("input:checkbox.currentlyAssigned").click(function (e) {
        var assignmentID = $(this).attr("data-id");
        var data = $(this).data();
        toggleToEditAssignmentList(assignmentID, data);
        countAssignmentCheckbox();
    });

    // When a checkbox is selected besides a resource, this action runs
    function toggleToEditAssignmentList(assignmentId, data) {
        if ($('.edit-assignment-modal-list li[data-id="' + assignmentId + '"]').length) {
            $('.edit-assignment-modal-list li[data-id="' + assignmentId + '"]').remove();
            buildEditAssignmentHiddenValue();
        } else {
            $(".edit-assignment-modal-list").append('<li data-id="' + assignmentId + '">Assignment ID: ' + assignmentId + '</li>');
            for (var i in data) {
                $('.edit-assignment-modal-list li[data-id="' + assignmentId + '"]').attr("data-" + i, data[i]);
            }
            // Prepends the name in the modal to allow the user a quick glance at what user's assignment is being edited.
            $('.edit-assignment-modal-list li[data-id="' + assignmentId + '"]').prepend("<b>" + $('.edit-assignment-modal-list li[data-id="' + assignmentId + '"]').attr("data-name") + "</b> | ");
        }
        buildEditAssignmentHiddenValues();
    }

    // The dynamic buttons that count selected boxes in the "Currently Assigned" partial
    function countAssignmentCheckbox() {

        var button = $(".batchEditButton");
        var numberOfChecked = $('input:checkbox.currentlyAssigned:checked').length;

        if (numberOfChecked > 0) {
            button.removeClass("btn-disabled").addClass("btn-primary");
            button.html(numberOfChecked.toString() + ' Selected');
            button.prop("disabled", false);
        }
        else {
            button.removeClass("btn-primary").addClass("btn-disabled");
            button.html('None Selected');
            button.prop("disabled", true);
        }
    }

    function buildEditAssignmentHiddenValues() {
        var users = new Array();
        var assignments = new Array();

        $(".edit-assignment-modal-list li").each(function (index) {
            users.push($(this).attr("data-user-id"));
            assignments.push($this).attr("data-id");
        });

        $("#batch-edit-modal input[name='users']").val(users.join);
        $("#batch-edit-modal input[name='assignments']").val(users.join);
    }

    //Batch Edit Users Modal Allocation Mode Module
    $("#edit-percent, #edit-hours-per-day, #edit-fixed").change(function () {
        $("#edit-amount-percent, #edit-amount-hours-per-day, #edit-amount-fixed").val("").attr("readonly", true);
        $("#edit-amount-percent, #edit-amount-hours-per-day, #edit-amount-fixed").prop("disabled", true);
        if ($("#edit-percent").is(":checked")) {
            $("#edit-amount-percent").removeAttr("readonly");
            $("#edit-amount-percent").prop("disabled", false);
            $("#edit-amount-percent").focus();
        }
        else if ($("#edit-hours-per-day").is(":checked")) {
            $("#edit-amount-hours-per-day").removeAttr("readonly");
            $("#edit-amount-hours-per-day").prop("disabled", false);
            $("#edit-amount-hours-per-day").focus();
        }
        else if ($("#edit-fixed").is(":checked")) {
            $("#edit-amount-fixed").removeAttr("readonly");
            $("#edit-amount-fixed").prop("disabled", false);
            $("#edit-amount-fixed").focus();
        }
    });

    //Batch Add Users Modal Allocation Mode Module
    $("#add-percent, #add-hours-per-day, #add-fixed").change(function () {
        $("#add-amount-percent, #add-amount-hours-per-day, #add-amount-fixed").val("").attr("readonly", true);
        $("#add-amount-percent, #add-amount-hours-per-day, #add-amount-fixed").prop("disabled", true);
        if ($("#add-percent").is(":checked")) {
            $("#add-amount-percent").removeAttr("readonly");
            $("#add-amount-percent").prop("disabled", false);
            $("#add-amount-percent").focus();
        }
        else if ($("#add-hours-per-day").is(":checked")) {
            $("#add-amount-hours-per-day").removeAttr("readonly");
            $("#add-amount-hours-per-day").prop("disabled", false);
            $("#add-amount-hours-per-day").focus();
        }
        else if ($("#add-fixed").is(":checked")) {
            $("#add-amount-fixed").removeAttr("readonly");
            $("#add-amount-fixed").prop("disabled", false);
            $("#add-amount-fixed").focus();
        }
    });

    // Batch Add User Modal Button
    $("#add-user-trigger").click(function () {
        $('#batch-add-modal').modal('show');
    });
});
