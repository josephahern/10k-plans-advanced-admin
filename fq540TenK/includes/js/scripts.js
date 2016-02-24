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

    $(".container").on('click', '.align_start, .align_end',(function (e) {
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
    }));

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

    $(".container").on('click', '.selectAllAssigned', (function (e) {
        $('input:checkbox.currentlyAssigned').prop('checked', true);
        $('.edit-assignment-modal-list').empty();
        $('input[type=checkbox]:checked').each(function () {
            var assignmentID = $(this).attr("data-id");
            var data = $(this).data();
            toggleToEditAssignmentList(assignmentID, data);
        });
        countAssignmentCheckbox();
        e.preventDefault();
    }));

    $(".container").on('click', '.selectNoneAssigned',(function (e) {
        $('input:checkbox.currentlyAssigned').prop('checked', false);
        $('.edit-assignment-modal-list').empty();
        countAssignmentCheckbox();
        e.preventDefault();
    }));

    $(".container").on('click', 'input:checkbox.currentlyAssigned',(function (e) {
        var assignmentID = $(this).attr("data-id");
        var data = $(this).data();
        toggleToEditAssignmentList(assignmentID, data);
        countAssignmentCheckbox();
        
    }));

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

    $(".container").on("click", ".delete-resource-x .front", (function () {
        var assignmentId = $(this).closest('.delete-resource-x').attr("data-assignment-id");
        $(".delete-resource-x[data-assignment-id=" + assignmentId + "]").flip(true);
        setTimeout(function () {
            $(".delete-resource-x[data-assignment-id=" + assignmentId + "]").flip(false);
            $(".delete-resource-x[data-assignment-id=" + assignmentId + "] .back").css({ "background-color": "orange", "color": "white" });
        }, 2000);
        setTimeout(function () {
            $(".delete-resource-x[data-assignment-id=" + assignmentId + "] .back a").html('<span class="glyphicon glyphicon-question-sign"></span>');
        }, 2100);
    }))

    $(".container").on("click", ".delete-resource-x .back", (function () {
        $(this).css({ "background-color": "green", "color": "white" });
        $('a', this).html('<span class="glyphicon glyphicon-ok"></span>');
        var form = $('#delete-' + $(this).closest(".delete-resource-x").attr("data-assignment-id"));
        var data = form.serialize();
        var content = $(this);
        var rowCount = $(this).closest('tbody').children('tr').length;
        console.log(rowCount);

        $.ajax({
            url: '/Assignment/DeleteAssignment/',
            type: 'POST',
            data: data,
            error: function (xhr) {
                alert('Error: ' + xhr.statusText);
                }
        });
        setTimeout(function () {
            if (rowCount > 1) {
                content.closest('tr').remove();
            } else {
                content.closest('.tableContentContainer').remove();
            }
            
        }, 1000);
        event.preventDefault();
    }))

    $("#add-phase-trigger").on("click",(function () {
        $('#add-phase-modal').modal();
    }))

    // Detect Changes In Batch Edit View

    var validateEditableTableCount = 0;

    $(".container").on('change', '.editabletable select, .editabletable input',(function () {
        if ($(this).val() == $(this).attr("data-default-value")) {
            $(this).closest('td').css('background-color', 'white');
            $(this).closest('td').removeClass('changed');
            validateEditableTableCount--;
            validateEditableTable();
        } else {
            if (!$(this).closest('td').hasClass('changed')) {
                $(this).closest('td').css('background-color', 'orange');
                $(this).closest('td').addClass('changed');
                validateEditableTableCount++;
                validateEditableTable();
            }
            
        }
    }));

    function validateEditableTable() {
        var button = $(".saveChangesButton");
        if (validateEditableTableCount > 0) {
            button.removeClass("btn-disabled").addClass("btn-warning");
            button.html('Save Changes');
            button.prop("disabled", false);
        }
        else {
            button.removeClass("btn-warning").addClass("btn-disabled");
            button.html('No Changes');
            button.prop("disabled", true);
        }
    }

    function getEditableTableValues() {
        var data = {};
        var assignments = [];
        $(".editabletable tbody tr").each(function () {
            item = {};
            item['user_id'] = $(this).find(".rowinfo input").attr("data-user-id");
            item['assignment_id'] = $(this).find(".assignmentId").html();
            item['allocation_mode'] = $(this).find(".allocationMode select").val();
            item['allocation_amount'] = $(this).find(".allocationInputAmount input").val();
            item['start_date'] = convertDateFormat(Date.parse($(this).find(".startDate").html()));
            item['end_date'] = convertDateFormat(Date.parse($(this).find(".endDate").html()));
            assignments.push(item);
        });
        data.phase_id = $('#inPageEditForm input[name="data"]').attr("data-phase-id");
        data.project_id = $('#inPageEditForm input[name="data"]').attr("data-project-id");
        data.assignments = assignments;
        console.log(data);
        return data;
    }

    $(".container").on('change', '.allocationMode select', (function () {
        var currentSelection = $(this).attr("data-current-selection");
        var newSelection = $(this).val();

        if (currentSelection == "fixed" && newSelection == "hours_per_day") {

        }
        if (currentSelection == "fixed" && newSelection == "percent") {

        }
        if (currentSelection == "hours_per_day" && newSelection == "percent") {

        }
        if (currentSelection == "hours_per_day" && newSelection == "fixed") {

        }
        if (currentSelection == "percent" && newSelection == "hours_per_day") {

        }
        if (currentSelection == "percent" && newSelection == "fixed") {

        }

    }));

    $(".container").on('click', '.saveChangesButton', (function () {
        var data = getEditableTableValues();
        var projectId = $('input[name="project_id"]').val();
        var phaseId = $('input[name="phase_id"]').val();

        $('.editAssignmentPartialContent').html('<div class="row"><hr /></div><div class="row" style="background-color: #f4f4f4; height: 200px;"><img src="/includes/img/gears.gif" style="position: relative; top: 75px; left:50%;" ></div>');
        $.ajax({
            url: '/Assignment/InPageEdit',
            type: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            error: function (xhr) {
                alert('Error: ' + xhr.statusText);
            },
            success: function (result) {
                $('.editAssignmentPartialContent').load('/Assignment/GetAssignmentsByProjectIdPartial/' + projectId + '/' + phaseId + '/ .row-content', function () {
                    $(".delete-resource-x").flip(
                        {
                            axis: 'x',
                            trigger: 'manual',
                            autoSize: false
                        }
                    );
                });
                validateEditableTableCount = 0;
            }
        });
    }))

    // Conversion Tools

    function convertDateFormat(date) {
        var d = new Date(date);
        var year = d.getFullYear(), month = (d.getMonth() + 1), day = d.getDate();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        var properlyFormatted = "" + year + "-" + month + "-" + day;
        return properlyFormatted;
    }

    function convertAllocationAmount(conversionType, originalAmount, startDate, endDate) {
        
        startDate = startDate || 0;
        endDate = endDate || 0;

        if (startDate != 0 && endDate != 0) {
            var workingDays = workingDaysBetweenDates(Date(startDate), Date(endDate));
        }

        var result = 0;

        switch (conversionType) {
            case 'fixedToHD':
                result = (originalAmount / workingDays);
                break;
            case 'fixedToPercent':
                result = (originalAmount / (workingDays * 8));
                break;
            case 'HDToPercent':
                result = ((originalAmount/8)*100);
                break;
            case 'HDToFixed':
                result = (originalAmount * workingDays);
                break;
            case 'percentToHD':
                result = ((originalAmount/100)*8);
                break;
            case 'percentToFixed':
                result = ((originalAmount / 100) * (workingDays *8));
                break;
            default: result = 0;
        }

        return result;
    }

    function workingDaysBetweenDates(startDate, endDate) {
  
        // Validate input
        if (endDate < startDate)
            return 0;
    
        // Calculate days between dates
        var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
        startDate.setHours(0,0,0,1);  // Start just after midnight
        endDate.setHours(23,59,59,999);  // End just before midnight
        var diff = endDate - startDate;  // Milliseconds between datetime objects    
        var days = Math.ceil(diff / millisecondsPerDay);
    
        // Subtract two weekend days for every week in between
        var weeks = Math.floor(days / 7);
        days = days - (weeks * 2);

        // Handle special cases
        var startDay = startDate.getDay();
        var endDay = endDate.getDay();
    
        // Remove weekend not previously removed.   
        if (startDay - endDay > 1)         
            days = days - 2;      
    
        // Remove start day if span starts on Sunday but ends before Saturday
        if (startDay == 0 && endDay != 6)
            days = days - 1  
            
        // Remove end day if span ends on Saturday but starts after Sunday
        if (endDay == 6 && startDay != 0)
            days = days - 1  
    
        return days;
    }

    // Partial Form Processing and Displaying

    $("#addAssignmentForm").on('submit',(function (event) {
        
        var projectId = $('input[name="project_id"]').val();
        var phaseId = $('input[name="phase_id"]').val();
        var data = $(this).serialize();

        $('#batch-add-modal').modal('toggle');
        $('.editAssignmentPartialContent').html('<div class="row"><hr /></div><div class="row" style="background-color: #f4f4f4; height: 200px;"><img src="/includes/img/gears.gif" style="position: relative; top: 75px; left:50%;" ></div>');
        $('.resource-bucket-list li').each(function () {
            $(this).find('span').remove();
            $(".resource-list").append("<li data-user-id=\"" + $(this).attr("data-user-id") + "\"><span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\"></span> " + $(this).html() + "</li>");
        });

        $('.resource-bucket-list').empty();
        $('.add-assignment-modal-list').empty();
        $('#resource-search').val('');
        $("#resource-search-bucket").toggleClass("hidden", true);
        $('.resource-list li').each(function () {
            if ($(this).css('display') !== 'none') {
                $(this).css('display', 'none');
            }
        });


        $.ajax({
            url: '/Assignment/Add/',
            type: 'POST',
            data: data,
            error: function (xhr) {
                alert('Error: ' + xhr.statusText);
            },
            success: function (result) {
                $('.editAssignmentPartialContent').load('/Assignment/GetAssignmentsByProjectIdPartial/' + projectId + '/' + phaseId + '/ .row-content', function () {
                    $(".delete-resource-x").flip(
                        {
                            axis: 'x',
                            trigger: 'manual',
                            autoSize: false
                        }
                    );
                });
            }
        });

        event.preventDefault();
        
    }));

});
