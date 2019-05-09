var slotSelectedID;
var urlbool;
var date = new Date();
var dateString;
$(document).ready(function () {
    getData("https://my.api.mockaroo.com/timeSlot.json?key=870fe2a0");
    urlbool = true;
    $('body').on('click', '.slot.active', function () {
        if (slotSelectedID == undefined) {
            slotSelectedID = $(this).attr("id");
            $(this).addClass("selected");
        }
        else {
            $("#" + slotSelectedID).removeClass("selected");
            slotSelectedID = $(this).attr("id");
            $(this).addClass("selected");
        }
        $("#continue").attr("disabled", false)
    });
    $(".more").click(function () {
         var moreElem = $(this);
        moreElem.toggleClass("active");
        if (moreElem.hasClass("active")) {
            moreElem.text("SEE LESS").siblings(".complete").show();
            $(".dots").hide()
        } else {
            moreElem.text("SEE MORE").siblings(".complete").hide();
            $(".dots").show();
        }
    });
    $(".btn.btn-default.Search").hover(function () {
        var moreElem = $(this);
        moreElem.toggleClass("active");
        if (moreElem.hasClass("active")) {
            $(".form-control.Search").animate({ 'width': '15.5625em' }, 300);
        } else {
            $(".form-control.Search").animate({ 'width': '0' }, 300);
        }
    });
    dateString = "Today (" + date.myDateString() + ")";
    $("#dateSlot").text(dateString);
    $("#rightDateClick").click(function () {
        getData(urlbool ? "https://my.api.mockaroo.com/TimeSlot1.json?key=870fe2a0" : "https://my.api.mockaroo.com/timeSlot.json?key=870fe2a0")
        date = date.addDays(1);
        var todayDate = new Date();
        todayDate = todayDate.addDays(1);
        if (todayDate.myDateString() == date.myDateString()) {
            dateString = "Tomorrow (" + date.myDateString() + ")";
        }
        else {
            dateString = date.myDateString();
        }
        $("#leftDateClick").attr("disabled", false);
        $("#dateSlot").text(dateString);
    });
    $("#leftDateClick").click(function () {
        getData(urlbool ? "https://my.api.mockaroo.com/TimeSlot1.json?key=870fe2a0" : "https://my.api.mockaroo.com/timeSlot.json?key=870fe2a0");
        date = date.subDays(1);
        var todayDate = new Date();
        if (todayDate.myDateString() == date.myDateString()) {
            dateString = "Today (" + date.toString().splice(3, 0, ",").substring(0, 11) + ")";
            $("#leftDateClick").attr("disabled", true);
        }
        else {
            todayDate = todayDate.addDays(1);
            if (todayDate.myDateString() == date.myDateString()) {
                dateString = "Tomorrow (" + date.myDateString() + ")";
            }
            else {
                dateString = date.myDateString();
            }
        }
        $("#dateSlot").text(dateString);
    });
    $("#continue").click(function () {
        var slotbooked = "Slot Booked!!! For: " + dateString + " @ " + $(".slot.active.selected").text().replace('Slot is available', '');
        alert(slotbooked);
    });
});
String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
Date.prototype.subDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}
Date.prototype.myDateString = function () {
    var date = new Date(this.valueOf());
    var dd = date.getDate().toString();
    var datecov = date.toString().substring(0, 3) + ", " + (dd >= 10 ? dd : "0" + dd) + date.toString().substring(8, 3);
    return datecov;
}

function getData(URL) {
    $(".slot").removeClass("notactive");
    $(".slot").removeClass("active");
    $(".slot").removeClass("break");
    $("span").remove(".tooltiptext");
    urlbool = urlbool ? false : true;
    $.ajax({
        type: 'GET',
        url: URL,
        dataType: 'json',
        success: function (result) {
            var i;
            for (i = 0; i < result.length; i++) {
                var temp = "#" + result[i].T.replace(/\s/g, '').replace(':', '');
                if (result[i].S == false) {
                    $(temp).addClass("notactive");
                }
                else {
                    if (result[i].S == true) {
                        $(temp).addClass("active");
                        $(temp).append("<span class='tooltiptext'>Slot is available</span>");
                    }
                    else {
                        $(temp).addClass("break");
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Oops!! somthing went wrong. Please contact administrator.")
            $(".slot").addClass("notactive");
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

