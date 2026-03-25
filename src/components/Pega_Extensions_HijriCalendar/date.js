import dayjs from 'dayjs';

const relativeTime = require('dayjs/plugin/relativeTime');
const utc = require('dayjs/plugin/utc');

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const datetimedisplayformatter = (formatter) => {
  const objectvalues = {};
  switch (formatter) {
    case "DateTime-Long": {
      objectvalues.variantVal = "datetime";
      objectvalues.formatVal = "long";
      break;
    }
    case "DateTime-Short": {
      objectvalues.variantVal = "date";
      objectvalues.formatVal = "short";
      break;
    }
    case "DateTime-Since": {
      objectvalues.variantVal = "relative";
      break;
    }
    case "Time-Only": {
      objectvalues.variantVal = "time";
      objectvalues.formatVal = "short";
      break;
    }
    // no default
  }
  return objectvalues;
};

export const formatExists = (formatterVal) => {
  const formatterValues = [
    "DateTime-Long",
    "DateTime-Short",
    "DateTime-Since",
    "Time-Only"
  ];
  let isformatter = false;
  if (formatterValues.includes(formatterVal)) {
    isformatter = true;
  }
  return isformatter;
};



/**
 * Return relative time in fromNow for the given datetime
 * @description Convert and return the given datetime in dayJSObject
 *
 * @param {string} text datetime
 * @returns {object} datetime as a dayjs object
 */
export const getDayJSObject = (text) => {
  const momObj = dayjs(text);
  if (momObj.isValid()) return momObj;
  const timeStamp = text;
  const isDateTime = timeStamp.indexOf("GMT") !== -1;
  const year = parseInt(timeStamp.substr(0, 4), 10);
  const month = parseInt(timeStamp.substr(4, 2), 10) - 1;
  const day = parseInt(timeStamp.substr(6, 2), 10);

  const CurrentTz = PCore.getLocaleUtils().getTimeZoneInUse();

  let mom = new Date();

  mom.setUTCDate(day);
  mom.setUTCMonth(month);
  mom.setUTCFullYear(year);

  /* istanbul ignore else */
  if (isDateTime) {
    const hours = parseInt(timeStamp.substr(9, 2), 10);
    const minutes = parseInt(timeStamp.substr(11, 2), 10);
    const seconds = parseInt(timeStamp.substr(13, 2), 10);
    const ms = parseInt(timeStamp.substr(16, 3), 10);
    mom.setUTCHours(hours);
    mom.setUTCMinutes(minutes);
    mom.setUTCSeconds(seconds);
    mom.setUTCMilliseconds(ms);
  }

  mom = dayjs(
    mom.toLocaleString("en-US", {
      timeZone: CurrentTz
    })
  );

  return mom;
};

/**
 * Return relative time in fromNow for the given datetime
 *
 * @param {string} time datetime
 * @returns {object} relative time from now
 */
export const getRelativeTime = (time) => {
  let relativetime = "";
  if (dayjs(time).isUTC()) {
    relativetime = dayjs(time).fromNow();
  } else {
    const dayjstime = getDayJSObject(time);
    relativetime = dayjs(dayjstime).fromNow();
  }
  return relativetime;
};

/**
 * Return year for the date passed
 *
 * @param {string} value from which Year needs to be taken out
 * @returns {number} year for the date passed
 */
export const getFullYear = (value) =>
  value ? new Date(value).getFullYear() : new Date().getFullYear();

/**
 * Return maxDate for the date passed
 *
 * @param {number} nextYears next number of years
 * @param {number} currentYear current year
 * @param {number} yearFromValue year set on value in redux
 *
 * @returns {string} maxDate calculated based on inputs
 */
export const getMaxDate = (nextYears, currentYear, yearFromValue) => {
  if (Number.isNaN(nextYears)) {
    nextYears = 20;
  }
  let maxYear = currentYear + nextYears;
  if (yearFromValue > maxYear) {
    maxYear = yearFromValue;
  }
  return `${maxYear}-01-01`;
};

/**
 * Return minDate for the date passed
 *
 * @param {number} previousYears previous number of years
 * @param {number} currentYear current year
 * @param {number} yearFromValue year set on value in redux
 *
 * @returns {string} minDate calculated based on inputs
 */
export const getMinDate = (previousYears, currentYear, yearFromValue) => {
  if (Number.isNaN(previousYears)) {
    previousYears = 100;
  }
  let minYear = currentYear - previousYears;
  if (yearFromValue < minYear) {
    minYear = yearFromValue;
  }
  return `${minYear}-12-31`;
};

/**
 * Return clockFormat after parsing
 *
 * @param {number | string} clockFormat chosen by user
 *
 * @returns {number} clockFormat
 */
export const parseClockFormat = (clockFormat) =>
  typeof clockFormat === "string" ? parseInt(clockFormat, 10) : clockFormat;

/**
 * Return datetime value string off to seconds
 *
 * @param {string} datetime in ISO format
 * @param {boolean} withSeconds to specify if seconds is needed or not
 *
 * @returns {string} datetime after stripping of ms and seconds if selected to
 */
export const correctDateTimeToSeconds = (datetime, withSeconds) => {
  if (withSeconds) {
    return `${datetime.substring(0, datetime.indexOf("Z"))}.000Z`;
  }
  return `${datetime.substring(0, datetime.lastIndexOf(":"))}:00.000Z`;
};

/**
 * Return time value string off to seconds
 *
 * @param {string} datetime in ISO format
 * @param {boolean} withSeconds to specify if seconds is needed or not
 *
 * @returns {string} just time after stripping of ms and seconds if selected to
 */
export const timeCorrectedToSeconds = (datetime, withSeconds) => {
  if (withSeconds) {
    return datetime.substring(datetime.indexOf("T") + 1, datetime.indexOf("."));
  }
  return `${datetime.substring(
    datetime.indexOf("T") + 1,
    datetime.lastIndexOf(":")
  )}:00`;
};

/**
 * This function handles the cosmos blur handler of DateTime components
 *
 * @param {string | undefined} errorState for the selected datetime value
 * @param {string} actualValue present in redux
 * @param {string} formattedValue retrieved by trimming ISO to just Date/Time, also applying timezone if DateTime
 * @param {object} actions object which has fire and blur callbacks
 * @param {string} propName name of the property bound
 * @param {object} pConn component's PConnect object which is useful to invoke validationApi
 *
 * @returns {void}
 */
export const datetimeFireChangeBlurEvents = (
  errorState,
  actualValue,
  formattedValue,
  actions,
  propName,
  pConn
) => {

  // TODO - clean up, we should not rely on timestamp from cosmos to check InComplete validation
  // above triggerFieldChange should have validated this
  if (errorState) {
    pConn.getValidationApi().validate(errorState);
  }
  // BUG-640834 In errorState presist old values avoiding store update & re-render.
  else{
    if (formattedValue !== actualValue) {
      actions.updateFieldValue(propName, formattedValue);
    }
    actions.triggerFieldChange(propName, formattedValue);
  }
};

/**
 * Return Date format for the locale passed
 *
 * @param {string} locale locale string
 * @param {object} options options for format string
 * @returns {string} dateformat for the locale
 * Example : getDateFormat("pl-PL") returns "DD.MM.YYYY"
 */
export const getDateFormat = (locale, options) => {
  return new Intl.DateTimeFormat(locale, options)
    .formatToParts()
    .map(({ type, value }) => {
      switch (type) {
        case "day":
          return "DD";
        case "month":
          return "MM";
        case "year":
          return "YYYY";
        case "hour":
          return "hh";
        case "minute":
          return "mm";
        case "second":
          return "ss";
        case "dayPeriod":
          return "A";
        case "literal":
          return value;
        default:
          return "";
      }
    })
    .join("");
};

/**
 * Return boolean for the locale passed to specify if locale uses 12 hour format
 *
 * @param {string} locale locale string
 * @returns {boolean} True or False for the locale
 * Example : getDateFormat("pl-PL") returns false
 */
export const is12HClockFormat = (locale) => {
  const meridiem = new Intl.DateTimeFormat(locale, {
    hour: "numeric"
  })
    .formatToParts()
    .find(({ type }) => type === "dayPeriod");
  return !!(meridiem === null || meridiem === undefined
    ? undefined
    : meridiem.value);
};

/**
 * Return Option object for Time formatting
 *
 * @param {boolean} withSeconds true or false depending on seconds to be included
 * @param {boolean} is12h 12 hour format
 * @returns {object} options object time formatting
 * Example : getTimeOptions(false, true) returns {hour: 'numeric',minute: 'numeric',hour12: true}
 */
export const getTimeOptions = (withSeconds, is12h = false) => {
  return {
    hour: "numeric",
    minute: "numeric",
    ...(withSeconds && { second: "numeric" }),
    hour12: is12h
  };
};

/**
 * Return Option object for Datetime formatting
 *
 * @param {boolean} withSeconds true or false depending on seconds to be included
 * @param {boolean} is12h 12 hour format
 * @returns {object} options object datetime formatting
 * Example : getDateTimeOptions(false, true) returns {year: 'numeric',month: 'numeric',day: 'numeric',hour: 'numeric',minute: 'numeric',hour12: true}
 */
export const getDateTimeOptions = (withSeconds, is12h = false) => {
  return {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    ...getTimeOptions(withSeconds, is12h)
  };
};
