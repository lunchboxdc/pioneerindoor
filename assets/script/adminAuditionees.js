var auditioneeTemplate;
$.get('/assets/template/auditioneeTemplate.html', function(data) {
    auditioneeTemplate = Handlebars.compile(data);
});

var reminderEmailTemplate;
$.get('/admin/email/auditionReminder', function(data) {
    reminderEmailTemplate = Handlebars.compile(data);
});

Handlebars.registerHelper('notEmpty', function(val, options) {
    if (typeof val !== 'undefined' && val !== null && val.length > 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('equals', function(a, b, options) {
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('formatDate', function(val) {
    if (val && val.length > 0) {
        return moment(val).format('MMMM Do YYYY, h:mm a');
    } else {
        return;
    }
});
Handlebars.registerHelper('getAge', function(val) {
    if (val && val.length > 0) {
        return moment().diff(moment(val), 'years');
    } else {
        return;
    }
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
    $('#reminderEmailModal .email-template').html(reminderEmailTemplate({firstName: '{First Name}'}));
    $('#sendReminderEmails').show();
    $('#actionsMessage').hide();
    $('#reminderEmailModal').bPopup();
}

function sendReminderEmails() {
    $.post('/admin/email/sendAuditioneeReminder', function() {
        $('#actionsMessage').html('Successfully queued reminder emails.');
        $('#sendReminderEmails').hide();
        $('#actionsMessage').show();
    })
    .fail(function() {
        $('#actionsMessage').html('Error! Failed to queue reminder emails.');
        $('#sendReminderEmails').hide();
        $('#actionsMessage').show();
    });
}