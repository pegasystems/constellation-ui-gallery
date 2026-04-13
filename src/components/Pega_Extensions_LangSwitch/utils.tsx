export type LocaleConfiguration = {
  locale: string;
  name: string;
};

const runtime = globalThis as typeof globalThis & {
  PCore?: any;
};

const intlRuntime = Intl as typeof Intl & {
  supportedValuesOf?: (key: string) => string[];
};

export const parseConfiguration = (configuration: string): LocaleConfiguration[] => {
  if (!configuration.trim()) {
    return [];
  }

  const parsedConfig = JSON.parse(configuration);
  if (!Array.isArray(parsedConfig)) {
    return [];
  }

  return parsedConfig.filter((entry: unknown): entry is LocaleConfiguration => {
    return Boolean(
      entry &&
      typeof entry === 'object' &&
      typeof (entry as LocaleConfiguration).name === 'string' &&
      typeof (entry as LocaleConfiguration).locale === 'string' &&
      (entry as LocaleConfiguration).name.trim() &&
      (entry as LocaleConfiguration).locale.trim(),
    );
  });
};

const normalizeLocaleTag = (locale: string) => {
  return locale.replaceAll('_', '-');
};

const normalizeLocaleKey = (locale: string) => {
  return normalizeLocaleTag(locale).trim().toLowerCase();
};

export const localesMatch = (leftLocale: string, rightLocale: string) => {
  if (!leftLocale || !rightLocale) {
    return false;
  }

  return normalizeLocaleKey(leftLocale) === normalizeLocaleKey(rightLocale);
};

export const resolveConfiguredLocale = (locale: string, languages: LocaleConfiguration[]) => {
  return languages.find((language) => localesMatch(language.locale, locale))?.locale ?? locale;
};

export const getCurrentLocale = () => {
  return runtime.PCore?.getEnvironmentInfo?.()?.getUseLocale?.() ?? '';
};

export const getCurrentTimezone = () => {
  return runtime.PCore?.getEnvironmentInfo?.()?.getTimeZone?.() ?? '';
};

export const getBrowserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
};

export const formatLocaleLabel = (locale: string, fallbackName = '') => {
  if (!locale) {
    return fallbackName;
  }

  if (fallbackName) {
    return fallbackName;
  }

  try {
    const normalizedLocale = normalizeLocaleTag(locale);
    const languageCode = normalizedLocale.split('-')[0];
    const languageDisplay = new Intl.DisplayNames([normalizedLocale], { type: 'language' }).of(languageCode);

    return languageDisplay ?? locale;
  } catch {
    return locale;
  }
};

export const formatLocaleOptionLabel = (locale: string, fallbackName = '', showLocaleCode = false) => {
  const friendlyName = formatLocaleLabel(locale, fallbackName);

  if (!friendlyName) {
    return locale;
  }

  if (!showLocaleCode || !locale) {
    return friendlyName;
  }

  return `${friendlyName} (${locale})`;
};

export const formatLocaleCompactLabel = (locale: string) => {
  if (!locale) {
    return '';
  }

  const normalizedLocale = normalizeLocaleTag(locale);
  const languageCode = normalizedLocale.split('-')[0]?.trim();

  return languageCode ? languageCode.toUpperCase() : locale.trim().toUpperCase();
};

const getFriendlyTimezoneName = (timezone: string) => {
  if (!timezone) {
    return '';
  }

  const timezoneParts = timezone.split('/').filter(Boolean);
  const displayName = timezoneParts.at(-1) ?? timezone;

  return displayName.replaceAll('_', ' ');
};

const getTimezoneOffsetLabel = (timezone: string, referenceDate = new Date()) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    });
    const offsetName = formatter.formatToParts(referenceDate).find((part) => part.type === 'timeZoneName')?.value;

    if (!offsetName) {
      return '';
    }

    if (offsetName === 'GMT') {
      return 'UTC+00:00';
    }

    return offsetName.replace(/^GMT/, 'UTC');
  } catch {
    return '';
  }
};

const getTimezoneOffsetMinutes = (timezone: string, referenceDate = new Date()) => {
  const offsetLabel = getTimezoneOffsetLabel(timezone, referenceDate);
  const offsetMatch = /^UTC([+-])(\d{2}):(\d{2})$/.exec(offsetLabel);

  if (!offsetMatch) {
    return Number.POSITIVE_INFINITY;
  }

  const [, sign, hourValue, minuteValue] = offsetMatch;
  const absoluteMinutes = Number(hourValue) * 60 + Number(minuteValue);

  return sign === '-' ? -absoluteMinutes : absoluteMinutes;
};

const sortTimezones = (left: string, right: string, referenceDate = new Date()) => {
  const leftOffsetMinutes = getTimezoneOffsetMinutes(left, referenceDate);
  const rightOffsetMinutes = getTimezoneOffsetMinutes(right, referenceDate);

  if (leftOffsetMinutes !== rightOffsetMinutes) {
    return leftOffsetMinutes - rightOffsetMinutes;
  }

  const friendlyNameComparison = getFriendlyTimezoneName(left).localeCompare(getFriendlyTimezoneName(right));

  if (friendlyNameComparison !== 0) {
    return friendlyNameComparison;
  }

  return left.localeCompare(right);
};

export const getAvailableTimezones = (currentTimezone: string, referenceDate = new Date()) => {
  const supportedTimezones = intlRuntime.supportedValuesOf?.('timeZone') ?? [];
  const browserTimezone = getBrowserTimezone();
  const timezoneSet = new Set<string>(supportedTimezones);

  if (browserTimezone) {
    timezoneSet.add(browserTimezone);
  }

  if (currentTimezone) {
    timezoneSet.add(currentTimezone);
  }

  return Array.from(timezoneSet).sort((left, right) => sortTimezones(left, right, referenceDate));
};

export const formatTimezoneLabel = (timezone: string, referenceDate = new Date()) => {
  const friendlyName = getFriendlyTimezoneName(timezone);
  const offsetLabel = getTimezoneOffsetLabel(timezone, referenceDate);

  if (!friendlyName) {
    return timezone;
  }

  if (!offsetLabel) {
    return friendlyName;
  }

  return `(${offsetLabel}) - ${friendlyName}`;
};

export const formatTimezoneSummary = (timezone: string, referenceDate = new Date()) => {
  if (!timezone) {
    return '';
  }

  const friendlyName = getFriendlyTimezoneName(timezone);
  const offsetLabel = getTimezoneOffsetLabel(timezone, referenceDate);

  if (!friendlyName) {
    return timezone;
  }

  if (!offsetLabel) {
    return friendlyName;
  }

  return `${friendlyName} (${offsetLabel})`;
};

export const prioritizeTimezones = (
  timezones: string[],
  currentTimezone: string,
  browserTimezone: string,
  prioritizeBrowserTimezone = true,
) => {
  const priority = prioritizeBrowserTimezone ? [browserTimezone, currentTimezone] : [currentTimezone, browserTimezone];
  const normalizedPriority = priority.filter((timezone, index) => {
    return Boolean(timezone) && priority.indexOf(timezone) === index;
  });

  const prioritySet = new Set(normalizedPriority);
  const prioritized = normalizedPriority.filter((timezone) => timezones.includes(timezone));
  const remaining = timezones.filter((timezone) => !prioritySet.has(timezone));

  return [...prioritized, ...remaining];
};

export const langSwitchRuntime = {
  runtime,
  reloadPage: (locale = '') => {
    const resolvedLocale = locale.trim() || getCurrentLocale().trim();

    if (!resolvedLocale) {
      globalThis.location.reload();
      return;
    }

    try {
      const currentUrl = new URL(globalThis.location.href);
      currentUrl.searchParams.set('locale', resolvedLocale);
      globalThis.location.assign(currentUrl.toString());
    } catch {
      globalThis.location.reload();
    }
  },
};
