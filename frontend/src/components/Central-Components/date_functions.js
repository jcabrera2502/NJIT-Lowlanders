var monthDayYear = true;
var twevle = true;

const date = new Date();
var month = (date.getMonth() + 1);
var day = date.getDate();
var year = date.getFullYear();
var dateFormatted;
if (monthDayYear) {
    dateFormatted = month + "/" + day + "/" + year;
} else /*DayMonthYear*/ {
    dateFormatted = day + "/" + month + "/" + year;
}
var time;
var mins = date.getMinutes();
if (mins < 10) {
    mins = "0" + mins;
}
if (twevle) {
    if (date.getHours() > 12) {
        time = (date.getHours() - 12) + ":" + mins + " pm"; 
    }
    else if (date.getHours() === 12) {
        time = date.getHours() + ":" + mins + " pm";
    }
    else if (date.getHours() === 0) {
        time = "12:" + mins + " am";
    }
    else {
        time = date.getHours() + ":" + mins + " am";
    }
} else /*TwentyFour*/ {
    time = date.getHours() + ":" + date.getMinutes();
}

export function getCurrentMonth() {
    return month;
}
export function getCurrentDay() {
    return day;
}
export function getCurrentYear() {
    return year;
}
export function printDate() {
    return dateFormatted;
}
export function printThisDate(month, day, year) {
    if (monthDayYear /*MonthDayYear*/) {
        return month + "/" + day + "/" + year;
    } else /*DayMonthYear*/ {
        return day + "/" + month + "/" + year;
    }
}
export function printTime() {
    return time;
}
export function printThis24Time(hour, min) {
    if (min > 9) {
        return hour + ":" + min;
    }
    else {
        return hour + ":0" + min;
    }
}
export function printThis12Time(hour, min, pm) {
    var mins = min;
    if (mins < 10) {
        mins = "0" + mins;
    }
    if (pm) {
        return hour + ":" + min + " pm";
    }
    else {
        return hour + ":" + min + " am";
    }
}