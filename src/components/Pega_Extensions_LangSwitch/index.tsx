import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, type MenuItemProps, Text, withConfiguration } from '@pega/cosmos-react-core';
import '../shared/create-nonce';
import {
  DEFAULT_HEADING,
  DEFAULT_HELPER_TEXT,
  DEFAULT_LANGUAGE_ERROR_MESSAGE,
  DEFAULT_SWITCHING_LANGUAGE_MESSAGE,
  DEFAULT_SWITCHING_TIMEZONE_MESSAGE,
  DEFAULT_TIMEZONE_CONFIRMATION_HEADING,
  DEFAULT_TIMEZONE_CONFIRMATION_MESSAGE,
  DEFAULT_TIMEZONE_ERROR_MESSAGE,
  LanguageSection,
  LangSwitchInvalidConfiguration,
  LangSwitchPresentationProvider,
  StatusNotice,
  SummaryPanel,
  TimezoneSection,
} from './Presentation';
import { StyledCompactPanel, StyledHeaderBlock, StyledHelperText, StyledPanel } from './styles';
import {
  type LocaleConfiguration,
  formatLocaleLabel,
  formatTimezoneLabel,
  formatTimezoneSummary,
  getAvailableTimezones,
  getBrowserTimezone,
  getCurrentLocale,
  getCurrentTimezone,
  langSwitchRuntime,
  localesMatch,
  parseConfiguration,
  prioritizeTimezones,
  resolveConfiguredLocale,
} from './utils';

type LangSwitchProps = {
  Configuration?: string;
  changeTimezone?: boolean;
  compactView?: boolean;
  heading?: string;
  helperText?: string;
  persistChanges?: boolean;
  showLocaleCode?: boolean;
  showCurrentSummary?: boolean;
  prioritizeBrowserTimezone?: boolean;
  getPConnect?: any;
};

const didTimezonePreferenceSaveSucceed = (response: unknown) => {
  if (!response || typeof response !== 'object') {
    return true;
  }

  const status = 'status' in response ? (response as { status?: unknown }).status : undefined;

  if (typeof status === 'number') {
    return status >= 200 && status < 300;
  }

  return !('error' in response) && !('errors' in response);
};

export const PegaExtensionsLangSwitch = (props: LangSwitchProps) => {
  const {
    Configuration = '',
    changeTimezone = false,
    compactView = false,
    getPConnect,
    heading = DEFAULT_HEADING,
    helperText = DEFAULT_HELPER_TEXT,
    persistChanges = false,
    showLocaleCode = false,
    showCurrentSummary = true,
    prioritizeBrowserTimezone: shouldPrioritizeBrowserTimezone = true,
  } = props;
  let languages: LocaleConfiguration[] = [];
  let hasInvalidConfiguration = false;

  try {
    languages = parseConfiguration(Configuration);
  } catch {
    hasInvalidConfiguration = true;
  }

  const localize = (value: string) => {
    return getPConnect?.()?.getLocalizedValue?.(value) ?? value;
  };

  const currentLocale = getCurrentLocale();
  const currentTimezone = getCurrentTimezone();
  const browserTimezone = getBrowserTimezone();
  const allowTimezoneSelection = changeTimezone && !compactView;
  const resolvedCurrentLocale = resolveConfiguredLocale(currentLocale, languages);
  const [selectedLocale, setSelectedLocale] = useState(resolvedCurrentLocale);
  const [selectedTimezone, setSelectedTimezone] = useState(getCurrentTimezone());
  const [persistedTimezone, setPersistedTimezone] = useState(currentTimezone);
  const [isSwitchingLocale, setIsSwitchingLocale] = useState(false);
  const [isSwitchingTimezone, setIsSwitchingTimezone] = useState(false);
  const [isTimezoneConfirmationOpen, setIsTimezoneConfirmationOpen] = useState(false);
  const [timezoneFilter, setTimezoneFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const availableTimezones = allowTimezoneSelection
    ? prioritizeTimezones(
        getAvailableTimezones(currentTimezone),
        currentTimezone,
        browserTimezone,
        shouldPrioritizeBrowserTimezone,
      )
    : [];
  const isSwitching = isSwitchingLocale || isSwitchingTimezone;

  useEffect(() => {
    setSelectedLocale(resolvedCurrentLocale);
  }, [resolvedCurrentLocale]);

  useEffect(() => {
    setSelectedTimezone(currentTimezone);
  }, [currentTimezone]);

  useEffect(() => {
    setPersistedTimezone(currentTimezone);
  }, [currentTimezone]);

  const currentLanguageConfig = languages.find((language) => localesMatch(language.locale, currentLocale));
  const displayLocale = currentLanguageConfig?.locale ?? resolvedCurrentLocale;
  const currentLanguageLabel =
    formatLocaleLabel(currentLocale, localize(currentLanguageConfig?.name ?? '')) || currentLocale || '-';
  const currentTimezoneLabel = formatTimezoneSummary(currentTimezone) || currentTimezone || '-';
  const browserTimezoneLabel = formatTimezoneSummary(browserTimezone) || browserTimezone;

  const timezoneMenuItems: MenuItemProps[] = useMemo(() => {
    return availableTimezones.map((timezone) => ({
      id: timezone,
      primary: formatTimezoneLabel(timezone),
      selected: timezone === selectedTimezone,
      role: 'option',
    }));
  }, [availableTimezones, selectedTimezone]);

  const filteredTimezoneItems = useMemo(() => {
    const normalizedFilter = timezoneFilter.trim().toLowerCase();

    if (!normalizedFilter) {
      return timezoneMenuItems;
    }

    return timezoneMenuItems.filter((item) => {
      return item.primary.toLowerCase().includes(normalizedFilter) || item.id.toLowerCase().includes(normalizedFilter);
    });
  }, [timezoneFilter, timezoneMenuItems]);

  const handleLocaleSelection = async (nextLocale: string) => {
    setSelectedLocale(nextLocale);
    setErrorMessage('');

    if (!nextLocale || localesMatch(nextLocale, currentLocale)) {
      return;
    }

    if (!persistChanges) {
      langSwitchRuntime.reloadPage(nextLocale);
      return;
    }

    setIsSwitchingLocale(true);

    try {
      const context = getPConnect?.()?.getContextName?.() ?? '';
      await langSwitchRuntime.runtime.PCore?.getDataPageUtils?.()?.getPageDataAsync(
        'D_SetLocale',
        context,
        { useLocale: nextLocale },
        { invalidateCache: true },
      );

      langSwitchRuntime.reloadPage(nextLocale);
    } catch {
      setErrorMessage(localize(DEFAULT_LANGUAGE_ERROR_MESSAGE));
    } finally {
      setIsSwitchingLocale(false);
    }
  };

  const handleLocaleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    await handleLocaleSelection(event.target.value);
  };

  const handleTimezoneChange = (nextTimezone: string) => {
    setSelectedTimezone(nextTimezone);
    setTimezoneFilter('');
    setIsTimezoneConfirmationOpen(false);
    setErrorMessage('');
  };

  const handleTimezoneApply = async () => {
    if (!selectedTimezone || selectedTimezone === persistedTimezone) {
      return;
    }

    setIsTimezoneConfirmationOpen(false);
    setErrorMessage('');
    setIsSwitchingTimezone(true);

    try {
      const context = getPConnect?.()?.getContextName?.() ?? '';
      const response = await langSwitchRuntime.runtime.PCore?.getDataPageUtils?.()?.getPageDataAsync(
        'D_SetLocale',
        context,
        { useTimeZone: selectedTimezone },
        { invalidateCache: true },
      );

      if (!didTimezonePreferenceSaveSucceed(response)) {
        throw new Error('Unable to persist timezone preference.');
      }

      setPersistedTimezone(selectedTimezone);
      setIsTimezoneConfirmationOpen(true);
    } catch {
      setErrorMessage(localize(DEFAULT_TIMEZONE_ERROR_MESSAGE));
    } finally {
      setIsSwitchingTimezone(false);
    }
  };

  if (hasInvalidConfiguration) {
    return <LangSwitchInvalidConfiguration localize={localize} heading={heading} />;
  }

  const presentationProps = {
    localize,
    compactView,
    showLocaleCode,
    changeTimezone: allowTimezoneSelection,
    currentLocale: displayLocale,
    currentLanguageLabel,
    currentTimezone,
    currentTimezoneLabel,
    browserTimezone,
    browserTimezoneLabel,
    languages,
    selectedLocale,
    handleLocaleSelection,
    handleLocaleChange,
    availableTimezones,
    selectedTimezone,
    isTimezoneApplyEnabled: Boolean(selectedTimezone) && selectedTimezone !== persistedTimezone && !isSwitchingTimezone,
    timezoneFilter,
    setTimezoneFilter,
    filteredTimezoneItems,
    isSwitching,
    isTimezoneConfirmationOpen,
    handleTimezoneChange,
    handleTimezoneApply,
  };

  if (compactView) {
    return (
      <LangSwitchPresentationProvider {...presentationProps}>
        <StyledCompactPanel>
          <LanguageSection />
        </StyledCompactPanel>
      </LangSwitchPresentationProvider>
    );
  }

  return (
    <Card>
      <CardHeader>
        <StyledHeaderBlock>
          <Text variant='h2'>{localize(heading)}</Text>
          <StyledHelperText>{localize(helperText)}</StyledHelperText>
        </StyledHeaderBlock>
      </CardHeader>
      <CardContent>
        <LangSwitchPresentationProvider {...presentationProps}>
          <StyledPanel>
            {showCurrentSummary ? <SummaryPanel /> : null}
            <LanguageSection />
            {allowTimezoneSelection ? <TimezoneSection /> : null}
            {isSwitchingLocale ? (
              <StatusNotice message={localize(DEFAULT_SWITCHING_LANGUAGE_MESSAGE)} tone='info' role='status' />
            ) : null}
            {allowTimezoneSelection && isSwitchingTimezone ? (
              <StatusNotice message={localize(DEFAULT_SWITCHING_TIMEZONE_MESSAGE)} tone='info' role='status' />
            ) : null}
            {allowTimezoneSelection && isTimezoneConfirmationOpen ? (
              <StatusNotice
                message={`${localize(DEFAULT_TIMEZONE_CONFIRMATION_HEADING)}. ${localize(DEFAULT_TIMEZONE_CONFIRMATION_MESSAGE)}`}
                tone='info'
                role='alert'
              />
            ) : null}
            {errorMessage ? <StatusNotice message={errorMessage} tone='urgent' role='alert' /> : null}
          </StyledPanel>
        </LangSwitchPresentationProvider>
      </CardContent>
    </Card>
  );
};
export default withConfiguration(PegaExtensionsLangSwitch);
