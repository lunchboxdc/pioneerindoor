var auditioneeTemplate;
$.get('/assets/template/auditioneeTemplate.html', function(data) {
    auditioneeTemplate = Handlebars.compile(data);
});

var reminderEmailTemplate;
$.get('/admin/email/auditionReminder', function(data) {
    reminderEmailTemplate = Handlebars.compile(data);
});

function deleteAuditionee(firstName, lastName, id, e) {
    e.stopPropagation();
    if(confirm('Are you sure you want to delete auditionee, ' + firstName + ' ' + lastName + '?')) {
        var form = $("<form></form>")
            .attr({method: 'post', action: '/admin/auditionees/delete', style: 'display:none;'})
            .append($('<input>').attr({type: 'hidden', name: 'auditioneeId', value: id}));
        $('body').append(form);
        form.submit();
    }
}

function showModal(id) {
    var auditionee = auditionees.filter(function(obj) {
        return obj._id == id;
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

$(function() {
    for (var helper in handlebarsHelpers) {
        if (handlebarsHelpers.hasOwnProperty(helper)) {
            Handlebars.registerHelper(helper, handlebarsHelpers[helper]);
        }
    }
});