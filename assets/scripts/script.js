// [First, last] hours of the interval in 24-hr time
const START_HOUR = 9;
const END_HOUR = 17;

// Main section that will hold the schedule
const mainElement = $('#schedule-section');
// Timer text element for updating
const timerTextEl = $('header h2 span');

// Classes of the elements of the rows
const ROW_CLASS = 'schedule-row';
const TIME_CLASS = 'time-block';
const TASK_CLASS = 'task-area';
const SAVE_CLASS = 'save-block';
const ROW_ID_BASE = 'hour-row-';

// String used to store hour number in the row
const DATA_HOUR_STR = 'hour';

// Classes of the past/present/hour task areas
// Used for styling
const PAST_CLASS = 'past-hour';
const PRESENT_CLASS = 'present-hour';
const FUTURE_CLASS = 'future-hour';

// Local storage key used to store hours
const STORAGE_KEY_PREFIX = 'saved-task-';

function init() {
    createScheduleSection();
    $('.' + SAVE_CLASS).on('click', saveTaskHandler);
    updateClock();
    setInterval(updateClock, 1000);
}

// Updates the clock at the time and recolors the backgrounds at the top of the hour
function updateClock() {
    let timeString = moment().format('hh:mm:ss A');
    timerTextEl.text(timeString);
    let minSecs = moment().format('mmss');
    if (minSecs === '0000') {
        colorBackgrounds();
    }
}

// Builds the schedule rows
function createScheduleSection() {
    for (let i = START_HOUR; i <= END_HOUR; i++) {
        let retrievedTask = loadHour(i);
        let element = createHourRow();
        populateHourRow(element, i, retrievedTask);
        mainElement.append(element);
    }
    colorBackgrounds();
}

// Creates a new hour row for the schedule
// Output: An empty hour row element
function createHourRow() {
    let rowElement = $('<div>').addClass('row').addClass(ROW_CLASS);

    let hourElement = $('<div>').addClass('col-2 col-md-1 time-block');
    let taskArea = $('<div>').addClass('col-8 col-md-10 task-area').attr('contenteditable', 'true');
    let saveElement = $('<div>').addClass('col-2 col-md-1 save-block d-flex justify-content-center');
    let saveIcon = $('<img>').attr('src', './assets/images/save-icon.png');
    saveElement.append(saveIcon);

    rowElement.append(hourElement,
        taskArea,
        saveElement);
    
    return rowElement;
}

// Fills in a created hour row with the hour and saved task entry
function populateHourRow(rowElement, hour, taskString) {
    let convertedTime = moment(hour, 'HH').format('hA');
    let timeBlock = rowElement.children('.' + TIME_CLASS);

    timeBlock.text(convertedTime);

    rowElement.children('.' + TASK_CLASS).text(taskString);

    let idString = ROW_ID_BASE + hour;
    rowElement.attr('id', idString).data(DATA_HOUR_STR, hour);
}

// Adds classes to the task areas based on whether the given area is in the past, present, or future
// Side Effects: Adds classes to task areas
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

// Handler for the save action. Gathers data required for a save.
// Output: N/A
// Side effects: Stores a value using the saveHour function
function saveTaskHandler(event) {
    let row = $(event.currentTarget).parent();
    let rowHour = row.data(DATA_HOUR_STR);
    let taskString = row.children('.' + TASK_CLASS).text();
    saveHour(rowHour, taskString);
}

/* Functions relating to the saving and loading of scheduled tasks */
// Output: an array of every task's text
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

// Saves task data string to local storage using an hourNumber-based key
// Output: N/A
// Side effects: Saves taskData to local storage
function saveHour(hourNumber, taskData) {
    let storageKey = createStorageKey(hourNumber);
    localStorage.setItem(storageKey, taskData);
}

// Output: LocalStorage key used to store values for a certain hour
function createStorageKey(hourNumber) {
    return STORAGE_KEY_PREFIX + hourNumber;
}

init();