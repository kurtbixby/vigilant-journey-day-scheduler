// [First, last] hours of the interval in 24-hr time
const START_HOUR = 9;
const END_HOUR = 17;

const mainElement = $('#schedule-section');
const timerTextEl = $('header h2 span');

const ROW_CLASS = 'schedule-row';
const TIME_CLASS = 'time-block';
const TASK_CLASS = 'task-area';
const SAVE_CLASS = 'save-block';
const ROW_ID_BASE = 'hour-row-';

const DATA_HOUR_STR = 'hour';

const PAST_CLASS = 'past-hour';
const PRESENT_CLASS = 'present-hour';
const FUTURE_CLASS = 'future-hour';

const PAST_HOUR_COLOR = 'lightgrey';
const CURRENT_HOUR_COLOR = 'red';
const FUTURE_HOUR_COLOR = 'green';

// Local storage key used to store hours
const STORAGE_KEY_PREFIX = 'saved-task-';

function init() {
    createScheduleSection();
    mainElement.on('click', '.save-block', saveTaskHandler);
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    let timeString = moment().format('hh:mm:ss A');
    timerTextEl.text(timeString);
}

function createScheduleSection() {
    for (let i = START_HOUR; i <= END_HOUR; i++) {
        let retrievedTask = loadHour(i);
        let element = createHourRow();
        populateHourRow(element, i, retrievedTask);
        mainElement.append(element);
    }
    colorBackgrounds();
}

function createHourRow() {
    let rowElement = $('<div>').addClass('row').addClass(ROW_CLASS);

    let hourElement = $('<div>').addClass('col-2 col-md-1 time-block');
    let taskArea = $('<div>').addClass('col-8 col-md-10 task-area').attr('contenteditable', 'true');
    let saveElement = $('<div>').addClass('col-2 col-md-1 save-block d-flex justify-content-center');
    let saveIcon = $('<img>').attr('src', './assets/images/save_icon.png');
    saveElement.append(saveIcon);

    rowElement.append(hourElement,
        taskArea,
        saveElement);
    
    return rowElement;
}

function populateHourRow(rowElement, hour, taskString) {
    let convertedTime = moment(hour, 'HH').format('hA');
    let timeBlock = rowElement.children('.' + TIME_CLASS);

    timeBlock.text(convertedTime);

    rowElement.children('.' + TASK_CLASS).text(taskString);

    let idString = ROW_ID_BASE + hour;
    rowElement.attr('id', idString).data(DATA_HOUR_STR, hour);
}

function colorBackgrounds() {
    let currentHour = moment().hour();

    let rows = mainElement.find('.' + ROW_CLASS);
    rows.each((index, row) => {
        let rowHour = $(row).data(DATA_HOUR_STR);
        let taskArea = $(row).children('.' + TASK_CLASS)
        if (rowHour < currentHour) {
            taskArea.removeClass(PRESENT_CLASS + ' ' + FUTURE_CLASS).addClass(PAST_CLASS);
        } else if (rowHour == currentHour) {
            taskArea.removeClass(PAST_CLASS + ' ' + FUTURE_CLASS).addClass(PRESENT_CLASS);
        } else {
            taskArea.removeClass(PAST_CLASS + ' ' + PRESENT_CLASS).addClass(FUTURE_CLASS);
        }
    });
}

function saveTaskHandler(event) {
    let row = $(event.currentTarget).parent();
    let rowHour = row.data(DATA_HOUR_STR);
    let taskString = row.children('.' + TASK_CLASS).text();
    saveHour(rowHour, taskString);
}

/* Functions relating to the saving and loading of scheduled tasks */
// Returns an array of every task's text
function loadAllHours() {
    let tasks = [];
    for (let i = START_HOUR; i <= END_HOUR; i++) {
        tasks.push(loadHour(i));
    }

    return tasks;
}

// Input: An hour in 24-hr format
// Output: Returns the stored string or empty string if no stored task
function loadHour(hourNumber) {
    let storageKey = createStorageKey(hourNumber);
    let retrievedValue = localStorage.getItem(storageKey);
    if (retrievedValue === null) {
        return "";
    } else {
        return retrievedValue;
    }
}

// Input: An array of strings that are task descriptions
// Output: Saves strings to localstorage
function saveAllHours(tasks) {
    for (let i = 9; i <= 18; i++) {
        let taskString = tasks[i];
        saveHour(i, taskString);
    }
}

function saveHour(hourNumber, taskData) {
    let storageKey = createStorageKey(hourNumber);
    localStorage.setItem(storageKey, taskData);
}

function createStorageKey(hourNumber) {
    return STORAGE_KEY_PREFIX + hourNumber;
}

init();