function pg1AddressToggle(e) {
    if(e.checked) {
        $('#pg1AddressFields').addClass('hidden');
        $('#pg1AddressSameAsAuditionee').val('true');
    } else {
        $('#pg1AddressFields').removeClass('hidden');
        $('#pg1AddressSameAsAuditionee').val('false');
    }
}

function pg2AddressToggle(e) {
    if(e.checked) {
        $('#pg2AddressFields').addClass('hidden');
        $('#pg2AddressSameAsAuditionee').val('true');
    } else {
        $('#pg2AddressFields').removeClass('hidden');
        $('#pg2AddressSameAsAuditionee').val('false');
    }
}

function referralChange(e) {
    if(e.value.toLowerCase()==='other') {
        $('#referralOtherRow').removeClass('hidden');
    } else {
        $('#referralOtherRow').addClass('hidden');
    }
}

function togglePG(showPG) {
    if(showPG) {
        $('#hasPg2').val('true');
        $('#altPG').removeClass('hidden');
        $('#addPGbutton').addClass('hidden');
    } else {
        $('#hasPg2').val('false');
        $('#altPG').addClass('hidden');
        $('#addPGbutton').removeClass('hidden');
    }
}

$(function() {
    var cutoffYear = parseInt($('#season').val()) - 23;
    var cutoffDate = moment('04/01/' + cutoffYear, 'MM/DD/YYYY');

    window.Parsley.addValidator('maxbirthdate', {
        validateString: function(value) {
            try {
                var dob = moment(value, 'MM/DD/YYYY');
                console.log('dob:    ' + dob.toString());
                console.log('cutoff: ' + cutoffDate.toString());

                return dob.isBefore(cutoffDate);
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        messages: {
            en: 'Birthdate must be before ' + cutoffDate.format('MM/DD/YYYY')
        }
    });

    window.Parsley.on('form:submit', function() {
//        $('.hidden, .hidden *').prop("disabled",true);
//        $('#submitButton').prop("disabled",true);
//        $('#submitButton').val("Please wait...");

        return false;
    });

    $('.audition-form').parsley({
        excluded: '.hidden *'
    });

    $('#dob').mask('00/00/0000');
    $('#phone, #pg1Phone1, #pg1Phone2, #pg2Phone1, #pg2Phone2').mask('000-000-0000');
    $('#zip, #pg1Zip, #pg2Zip').mask('00000');

    if(!$('#pg1AddressSameAsAuditioneeCheckbox')[0].checked) {
        $('#pg1AddressFields').removeClass('hidden');
    }

    if(!$('#pg2AddressSameAsAuditioneeCheckbox')[0].checked) {
        $('#pg2AddressFields').removeClass('hidden');
    }

    if($('#hasPg2').val()=='true') {
        $('#hasPg2').val('true');
        $('#altPG').removeClass('hidden');
        $('#addPGbutton').addClass('hidden');
    }

    if($('#referral').val().toLowerCase()==='other') {
        $('#referralOtherRow').removeClass('hidden');
    }
});