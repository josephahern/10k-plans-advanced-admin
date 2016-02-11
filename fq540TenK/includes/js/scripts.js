$(function () {

    //
    // Basic site functionality and different library initializations
    //

    // Generates success messages
    function alertMessage(message) {
        $(".alertMessage").text(message);
        $(".alertMessage").fadeIn("slow", function () { $(this).delay(4000).fadeOut("slow"); });
    }

    // Initialize Table Search
    $('#project-list').filterTable();

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
    $('#resource-search').hideseek({
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
    // Add Assignments
    //

    // Click function for adding a Resource from "Batch Add Users" search result into 
    $('.resource-list, .resource-bucket-list').on('click', 'li', function () {
        var userId = $(this).attr('data-user-id');
        var userFullName = $(this).text();
        toggleToEmployeeBucket(userId, userFullName);
    });

    // Takes employeeId and employeeName
    function toggleToEmployeeBucket(userId, userFullName) {
        if ($('.resource-bucket-list li[data-user-id="' + userId + '"]').length) {
            $('.resource-bucket-list li[data-user-id="' + userId + '"]').remove();
            $('.add-assignment-modal-list li[data-user-id="' + userId + '"]').remove();
            $(".resource-list").append("<li data-user-id=\"" + userId + "\"><span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\"></span> " + userFullName + "</li>");
        } else {
            $(".resource-bucket-list").append("<li data-user-id=\"" + userId + "\"><span class=\"glyphicon glyphicon-minus-sign\" aria-hidden=\"true\"></span>" + userFullName + "</li>");
            $(".add-assignment-modal-list").append("<li data-user-id=\"" + userId + "\">" + userFullName + "</li>");
            $('.resource-list li[data-user-id="' + userId + '"]').remove();
        }

        if ($(".resource-bucket-list").length > 0) {
            $("#resource-search-bucket").toggleClass("hidden", false);
        }
        else if ($(".resource-bucket-list").length == 0) {
            $("#resource-search-bucket").toggleClass("hidden", true);
        }
        buildAddAssignmentHiddenValues();
    }

    function buildAddAssignmentHiddenValues() {
        var users = new Array();
        var assignments = new Array();

        $("ul.add-assignment-modal-list li").each(function (index) {
            var userId = $(this).attr('data-user-id');
            users.push(userId);
        });

        $("#batch-add-modal input[name='users']").val(users.join(','));
    }

    $(".align_start, .align_end").click(function (e) {
        var modalType = $(this).attr("id");
        var alignType = $(this).attr("class");
        var startTime = $(".parent-start-time").attr("data-time");
        var endTime = $(".parent-end-time").attr("data-time");

        if (modalType == "add-modal") {
            if (alignType == "align_start"){
                $("input.add-start-time").val(startTime);
            } else {
                $("input.add-end-time").val(endTime);
            }
        } else {
            if (alignType == "align_start") {
                $("input.edit-start-time").val(startTime);
            } else {
                $("input.edit-end-time").val(endTime);
            }
        }
        e.preventDefault();
    });

    $('.add_allocation_input, .edit_allocation_input').on('input', function () {
        var modalType = $(this).attr("class");
        if (modalType == "add_allocation_input") {
            $('input#add_allocation_amount').val($(this).val());
        } else {
            $('input#edit_allocation_amount').val($(this).val());
        }
        
    }).trigger('input');

    //
    // Edit Assignments
    //

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

        $("ul.edit-assignment-modal-list li").each(function (index) {
            var userId = $(this).attr('data-userid');
            var assignmentId = $(this).attr('data-id');
            users.push(userId);
            assignments.push(assignmentId);
        });

        $("#batch-edit-modal input[name='users']").val(users.join(','));
        $("#batch-edit-modal input[name='assignments']").val(assignments.join(','));
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

    // Delete Assignment Button
    $(".delete-resource-x").flip(
        {
            axis: 'x',
            trigger: 'manual',
            autoSize: false
        }
    );

    $(".delete-resource-x .front").click(function () {
        var assignmentId = $(this).closest('.delete-resource-x').attr("data-assignment-id");
        $(".delete-resource-x[data-assignment-id=" + assignmentId + "]").flip(true);
        setTimeout(function () {
            $(".delete-resource-x[data-assignment-id=" + assignmentId + "]").flip(false);
            $(".delete-resource-x[data-assignment-id=" + assignmentId + "] .back").css({ "background-color": "orange", "color": "white" });
        }, 2000);
        setTimeout(function () {
            $(".delete-resource-x[data-assignment-id=" + assignmentId + "] .back a").html('<span class="glyphicon glyphicon-question-sign"></span>');
        }, 2100);
    })

    $(".delete-resource-x .back").click(function () {
        $(this).css({ "background-color": "green", "color": "white" });
        $('a', this).html('<span class="glyphicon glyphicon-ok"></span>');
    })

    

});
