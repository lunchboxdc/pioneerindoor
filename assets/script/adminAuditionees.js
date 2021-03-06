var auditioneeTemplate;
var reminderEmailTemplate;

function deleteAuditionee(firstName, lastName, studentId, e) {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete auditionee, ' + firstName + ' ' + lastName + '?')) {
        var form = $("<form></form>")
            .attr({method: 'post', action: '/admin/auditionees/delete', style: 'display:none;'})
            .append($('<input>').attr({type: 'hidden', name: 'studentId', value: studentId}));
        $('body').append(form);
        form.submit();
    }
}

function showModal(studentId) {
    var auditionee = auditionees.filter(function(obj) {
        return obj.studentId == studentId;
    });
    $('#auditioneeModal .modal-content').html(auditioneeTemplate(auditionee[0]));
    $('#auditioneeModal').bPopup();
}

function openSendReminderModal() {
    $('#reminderEmailModal .email-template').html(reminderEmailTemplate({firstName: '{First Name}', auditionDate: auditionDate}));
    $('#sendReminderEmails').show();
    $('#actionsMessage').hide();
    $('#reminderEmailModal').bPopup();
}

function sendReminderEmails() {
    $.post(
        '/admin/email/sendAuditioneeReminder',
        {season: $('#season').val()},
        function() {
            $('#actionsMessage').html('Successfully queued reminder emails.');
            $('#sendReminderEmails').hide();
            $('#actionsMessage').show();
        }
    )
    .fail(function() {
        $('#actionsMessage').html('Error! Failed to queue reminder emails.');
        $('#sendReminderEmails').hide();
        $('#actionsMessage').show();
    });
}

function downloadCsvExport() {
    window.location.href='/admin/auditionees/export?season=' + $('#season').val();
}

$(function() {
    for (var helper in handlebarsHelpers) {
        if (handlebarsHelpers.hasOwnProperty(helper)) {
            Handlebars.registerHelper(helper, handlebarsHelpers[helper]);
        }
    }

    $.get('/assets/template/auditioneeTemplate.html?v=' + assetsVersion, function(data) {
        auditioneeTemplate = Handlebars.compile(data);
    });

    $.get('/admin/email/auditionReminder?v=' + assetsVersion, function(data) {
        reminderEmailTemplate = Handlebars.compile(data);
    });
});