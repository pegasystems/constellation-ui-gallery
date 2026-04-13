import { createContext, useContext, type ChangeEvent, type ReactNode } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  ComboBox,
  Flex,
  Modal,
  type MenuItemProps,
  Option,
  Popover,
  Select,
  Text,
  useElement,
  useOuterEvent,
} from '@pega/cosmos-react-core';
import {
  formatLocaleCompactLabel,
  formatLocaleLabel,
  formatLocaleOptionLabel,
  formatTimezoneLabel,
  type LocaleConfiguration,
} from './utils';
import {
  StyledCompactMenuChevron,
  StyledCompactMenuCode,
  StyledCompactMenuItem,
  StyledCompactMenuList,
  StyledCompactMenuPrimary,
  StyledCompactMenuSecondary,
  StyledCompactMenuSurface,
  StyledCompactMenuText,
  StyledCompactMenuTrigger,
  StyledCompactMenuTriggerLabel,
  StyledCompactSelectContainer,
  StyledSection,
  StyledSectionHeader,
  StyledSectionLabel,
  StyledSectionMeta,
  StyledStatusMessage,
  StyledStatusText,
  StyledSummaryGrid,
  StyledSummaryItem,
  StyledSummaryLabel,
  StyledSummaryMeta,
  StyledSummaryValue,
  StyledTimezoneAction,
  StyledTimezoneControls,
  StyledTimezonePicker,
} from './styles';

type LocalizeFn = (value: string) => string;

type LangSwitchPresentationContextValue = {
  localize: LocalizeFn;
  compactView: boolean;
  showLocaleCode: boolean;
  changeTimezone: boolean;
  currentLocale: string;
  currentLanguageLabel: string;
  currentTimezone: string;
  currentTimezoneLabel: string;
  browserTimezone: string;
  browserTimezoneLabel: string;
  languages: LocaleConfiguration[];
  selectedLocale: string;
  handleLocaleSelection: (nextLocale: string) => Promise<void>;
  handleLocaleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  availableTimezones: string[];
  selectedTimezone: string;
  isTimezoneApplyEnabled: boolean;
  timezoneFilter: string;
  setTimezoneFilter: (value: string) => void;
  filteredTimezoneItems: MenuItemProps[];
  isSwitching: boolean;
  isTimezoneConfirmationOpen: boolean;
  handleTimezoneChange: (nextTimezone: string) => void;
  handleTimezoneApply: () => Promise<void>;
  closeTimezoneConfirmation: () => void;
};

type LangSwitchPresentationProviderProps = LangSwitchPresentationContextValue & {
  children: ReactNode;
};

const LangSwitchPresentationContext = createContext<LangSwitchPresentationContextValue | null>(null);

function useLangSwitchPresentationContext() {
  const context = useContext(LangSwitchPresentationContext);

  if (!context) {
    throw new Error('LangSwitch presentation context is not available.');
  }

  return context;
}

export function LangSwitchPresentationProvider(props: Readonly<LangSwitchPresentationProviderProps>) {
  const { children, ...value } = props;

  return <LangSwitchPresentationContext.Provider value={value}>{children}</LangSwitchPresentationContext.Provider>;
}

export const DEFAULT_HEADING = 'Language & Region';
export const DEFAULT_HELPER_TEXT = 'Choose the language and timezone you want to use across the experience.';
export const DEFAULT_INVALID_CONFIGURATION_MESSAGE = 'Provide a valid JSON array with name and locale values.';
export const DEFAULT_SWITCHING_LANGUAGE_MESSAGE = 'Switching language...';
export const DEFAULT_SWITCHING_TIMEZONE_MESSAGE = 'Saving timezone...';
export const DEFAULT_LANGUAGE_ERROR_MESSAGE = 'Unable to switch language.';
export const DEFAULT_TIMEZONE_ERROR_MESSAGE = 'Unable to switch timezone.';
export const DEFAULT_APPLY_BUTTON_LABEL = 'Apply';
export const DEFAULT_TIMEZONE_CONFIRMATION_HEADING = 'Timezone preference saved';
export const DEFAULT_TIMEZONE_CONFIRMATION_MESSAGE = 'Your timezone change will apply the next time you log in.';
export const DEFAULT_TIMEZONE_CONFIRMATION_OK = 'OK';

const DEFAULT_SELECT_LABEL = 'Select language';
const DEFAULT_TIMEZONE_SELECT_LABEL = 'Search timezone';
const DEFAULT_CURRENT_LANGUAGE_LABEL = 'Current language';
const DEFAULT_CURRENT_TIMEZONE_LABEL = 'Current timezone';
const DEFAULT_LANGUAGE_PREFERENCE_LABEL = 'Language preference';
const DEFAULT_LANGUAGE_PREFERENCE_HELPER = 'Language changes refresh the page to apply translated content.';
const DEFAULT_TIMEZONE_PREFERENCE_LABEL = 'Timezone preference';
const DEFAULT_TIMEZONE_PREFERENCE_HELPER = 'Search for a city or UTC offset to find the timezone you want.';
const DEFAULT_DEVICE_TIMEZONE_LABEL = 'Detected from your device';
const DEFAULT_REFRESH_NOTE =
  'Apply to save your timezone preference. The change takes effect the next time you log in.';
const DEFAULT_NO_OPTIONS_MESSAGE = 'No languages are available.';
const DEFAULT_NO_TIMEZONES_MESSAGE = 'No timezones are available.';
const DEFAULT_NO_TIMEZONES_FOUND_MESSAGE = 'No matching timezones were found.';

export function StatusNotice(props: Readonly<{ message: string; tone: 'info' | 'urgent'; role: 'status' | 'alert' }>) {
  const { message, tone, role } = props;

  return (
    <StyledStatusMessage tone={tone} role={role} aria-live={role === 'alert' ? 'assertive' : 'polite'}>
      <StyledStatusText tone={tone}>{message}</StyledStatusText>
    </StyledStatusMessage>
  );
}

export function SummaryPanel() {
  const {
    localize,
    showLocaleCode,
    changeTimezone,
    currentLocale,
    currentLanguageLabel,
    currentTimezone,
    currentTimezoneLabel,
    browserTimezone,
    browserTimezoneLabel,
  } = useLangSwitchPresentationContext();

  return (
    <StyledSummaryGrid>
      <StyledSummaryItem>
        <StyledSummaryLabel>{localize(DEFAULT_CURRENT_LANGUAGE_LABEL)}</StyledSummaryLabel>
        <StyledSummaryValue>{currentLanguageLabel}</StyledSummaryValue>
        {showLocaleCode && currentLocale ? <StyledSummaryMeta>{currentLocale}</StyledSummaryMeta> : null}
      </StyledSummaryItem>
      {changeTimezone ? (
        <StyledSummaryItem>
          <StyledSummaryLabel>{localize(DEFAULT_CURRENT_TIMEZONE_LABEL)}</StyledSummaryLabel>
          <StyledSummaryValue>{currentTimezoneLabel}</StyledSummaryValue>
          {browserTimezone && browserTimezone !== currentTimezone ? (
            <StyledSummaryMeta>
              {localize(DEFAULT_DEVICE_TIMEZONE_LABEL)}: {browserTimezoneLabel}
            </StyledSummaryMeta>
          ) : null}
        </StyledSummaryItem>
      ) : null}
    </StyledSummaryGrid>
  );
}

export function LanguageSection() {
  const {
    localize,
    compactView,
    languages,
    selectedLocale,
    handleLocaleSelection,
    handleLocaleChange,
    isSwitching,
    showLocaleCode,
  } = useLangSwitchPresentationContext();

  const [popoverTarget, setPopoverTarget] = useElement<HTMLElement>(null);
  const [popoverEl, setPopoverRef] = useElement<HTMLElement>();

  useOuterEvent('mousedown', [popoverEl, popoverTarget], () => {
    if (popoverTarget) {
      setPopoverTarget(null);
    }
  });

  const select =
    languages.length > 0 ? (
      <Select
        aria-label={localize(DEFAULT_SELECT_LABEL)}
        value={selectedLocale}
        onChange={handleLocaleChange}
        disabled={isSwitching}
      >
        {languages.map((language) => {
          const optionLabel = compactView
            ? formatLocaleCompactLabel(language.locale)
            : formatLocaleOptionLabel(language.locale, localize(language.name), showLocaleCode);

          return (
            <Option key={language.locale} value={language.locale}>
              {optionLabel}
            </Option>
          );
        })}
      </Select>
    ) : (
      <Text>{localize(DEFAULT_NO_OPTIONS_MESSAGE)}</Text>
    );

  if (compactView) {
    const compactLabel = formatLocaleCompactLabel(selectedLocale);

    return (
      <StyledCompactSelectContainer>
        <StyledCompactMenuTrigger
          type='button'
          aria-label={localize(DEFAULT_SELECT_LABEL)}
          aria-haspopup='listbox'
          aria-expanded={Boolean(popoverTarget)}
          onClick={(event) => {
            setPopoverTarget(popoverTarget ? null : event.currentTarget);
          }}
          disabled={isSwitching || languages.length === 0}
        >
          <StyledCompactMenuTriggerLabel>{compactLabel}</StyledCompactMenuTriggerLabel>
          <StyledCompactMenuChevron $isOpen={Boolean(popoverTarget)} />
        </StyledCompactMenuTrigger>
        {popoverTarget ? (
          <Popover arrow target={popoverTarget} show ref={setPopoverRef} onClose={() => setPopoverTarget(null)}>
            <StyledCompactMenuSurface>
              <StyledCompactMenuList role='listbox' aria-label={localize(DEFAULT_SELECT_LABEL)}>
                {languages.map((language) => {
                  const compactOptionLabel = formatLocaleCompactLabel(language.locale);
                  const primaryLabel = localize(language.name) || formatLocaleLabel(language.locale, language.name);

                  return (
                    <StyledCompactMenuItem
                      key={language.locale}
                      type='button'
                      role='option'
                      aria-selected={selectedLocale === language.locale}
                      $selected={selectedLocale === language.locale}
                      onClick={() => {
                        void handleLocaleSelection(language.locale);
                        setPopoverTarget(null);
                      }}
                    >
                      <StyledCompactMenuCode>{compactOptionLabel}</StyledCompactMenuCode>
                      <StyledCompactMenuText>
                        <StyledCompactMenuPrimary>{primaryLabel}</StyledCompactMenuPrimary>
                        <StyledCompactMenuSecondary>{language.locale}</StyledCompactMenuSecondary>
                      </StyledCompactMenuText>
                    </StyledCompactMenuItem>
                  );
                })}
              </StyledCompactMenuList>
            </StyledCompactMenuSurface>
          </Popover>
        ) : null}
      </StyledCompactSelectContainer>
    );
  }

  return (
    <StyledSection>
      <StyledSectionHeader>
        <StyledSectionLabel>{localize(DEFAULT_LANGUAGE_PREFERENCE_LABEL)}</StyledSectionLabel>
        <StyledSectionMeta>{localize(DEFAULT_LANGUAGE_PREFERENCE_HELPER)}</StyledSectionMeta>
      </StyledSectionHeader>
      {select}
    </StyledSection>
  );
}

export function TimezoneSection() {
  const {
    localize,
    availableTimezones,
    selectedTimezone,
    isTimezoneApplyEnabled,
    timezoneFilter,
    setTimezoneFilter,
    filteredTimezoneItems,
    isSwitching,
    isTimezoneConfirmationOpen,
    handleTimezoneChange,
    handleTimezoneApply,
    closeTimezoneConfirmation,
  } = useLangSwitchPresentationContext();

  return (
    <StyledSection>
      <StyledSectionHeader>
        <StyledSectionLabel>{localize(DEFAULT_TIMEZONE_PREFERENCE_LABEL)}</StyledSectionLabel>
        <StyledSectionMeta>{localize(DEFAULT_TIMEZONE_PREFERENCE_HELPER)}</StyledSectionMeta>
      </StyledSectionHeader>
      {availableTimezones.length > 0 ? (
        <>
          <StyledTimezoneControls>
            <StyledTimezonePicker>
              <ComboBox
                aria-label={localize(DEFAULT_TIMEZONE_SELECT_LABEL)}
                selected={{
                  items: selectedTimezone
                    ? {
                        id: selectedTimezone,
                        text: formatTimezoneLabel(selectedTimezone),
                      }
                    : undefined,
                }}
                value={timezoneFilter}
                onChange={(event) => {
                  setTimezoneFilter(event.target.value);
                }}
                onBlur={() => {
                  setTimezoneFilter('');
                }}
                disabled={isSwitching}
                info={localize(DEFAULT_REFRESH_NOTE)}
                menu={{
                  items: filteredTimezoneItems,
                  mode: 'single-select',
                  role: 'listbox',
                  scrollAt: 8,
                  emptyText: localize(DEFAULT_NO_TIMEZONES_FOUND_MESSAGE),
                  onItemClick: (id) => {
                    handleTimezoneChange(id);
                  },
                }}
              />
            </StyledTimezonePicker>
            <StyledTimezoneAction>
              <Button variant='primary' onClick={() => void handleTimezoneApply()} disabled={!isTimezoneApplyEnabled}>
                {localize(DEFAULT_APPLY_BUTTON_LABEL)}
              </Button>
            </StyledTimezoneAction>
          </StyledTimezoneControls>
          {isTimezoneConfirmationOpen ? (
            <Modal heading={localize(DEFAULT_TIMEZONE_CONFIRMATION_HEADING)}>
              <Flex container={{ direction: 'column', gap: 1.5 }}>
                <Text>{localize(DEFAULT_TIMEZONE_CONFIRMATION_MESSAGE)}</Text>
                <Flex container={{ justify: 'end' }}>
                  <Button variant='primary' onClick={closeTimezoneConfirmation}>
                    {localize(DEFAULT_TIMEZONE_CONFIRMATION_OK)}
                  </Button>
                </Flex>
              </Flex>
            </Modal>
          ) : null}
        </>
      ) : (
        <Text>{localize(DEFAULT_NO_TIMEZONES_MESSAGE)}</Text>
      )}
    </StyledSection>
  );
}

export function LangSwitchInvalidConfiguration(props: Readonly<{ localize: LocalizeFn; heading: string }>) {
  const { localize, heading } = props;

  return (
    <Card>
      <CardHeader>
        <Text variant='h2'>{localize(heading)}</Text>
      </CardHeader>
      <CardContent>
        <Text>{localize(DEFAULT_INVALID_CONFIGURATION_MESSAGE)}</Text>
      </CardContent>
    </Card>
  );
}
