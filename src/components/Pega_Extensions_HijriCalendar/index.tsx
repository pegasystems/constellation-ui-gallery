import { useState, useEffect, useMemo, useRef, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  withConfiguration,
  FormControl,
  FormField,
  Flex,
  Button,
  Input,
  Icon,
  defaultThemeProp,
  registerIcon
} from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';


// @ts-ignore
import * as calendarIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/calendar.icon';
// @ts-ignore
import * as caretLeftIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-left.icon';
// @ts-ignore
import * as caretRightIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-right.icon';
// @ts-ignore
import * as caretDownIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-down.icon';

registerIcon(calendarIcon, caretLeftIcon, caretRightIcon, caretDownIcon);


interface HijriDateParts {
  day: number;
  month: number;
  year: number;
  key: string;
}

/**
 * Interface for the Day object within the calendar grid.
 */
interface CalendarDay {
  gDate: Date;
  hDay: number;
  hKey: string;
}

/**
 * Props for the HijriCalendar Component.
 * These descriptions are picked up by Storybook's Docs table.
 */
export interface HijriCalendarProps {
  /** PConnect object provided by Pega */
  getPConnect: () => any;
  /** The current value of the field (ISO string or DD/MM/YYYY) */
  value?: string;
  /** Label for the input field */
  label?: string;
  /** Test ID for automated testing */
  testId?: string;
  /** If true, the label is visually hidden */
  hideLabel?: boolean;
  /** Minimum selectable Hijri year */
  minYear?: number;
  /** Maximum selectable Hijri year */
  maxYear?: number;
  /** Disables the field */
  disabled?: boolean;
  /** Sets the field to read-only */
  readOnly?: boolean;
  /** Marks the field as required */
  required?: boolean;
  /** Error message to display */
  validatemessage?: string;
  /** Helper text for the field */
  helperText?: string;
  /** If true, saves the date in Hijri format. If false, saves as Gregorian ISO. */
  storeAsHijri?: boolean;
}

/* ================= LOCALIZATION ASSETS ================= */
const HIJRI_MONTHS_EN = ['Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Awwal", "Jumada al-Thani", 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'];
const HIJRI_MONTHS_AR = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
const WEEKDAYS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS_AR = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];

/* ================= STYLED COMPONENTS ================= */

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  direction: inherit;
`;

const DayCell = styled.button<{ $isSelected?: boolean; $isToday?: boolean; theme?: any }>(
  ({ theme, $isSelected, $isToday }) => css`
    width: 2.25rem;
    height: 2.25rem;
    cursor: pointer;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0.0625rem solid transparent;
    font-size: 0.875rem;
    color: ${theme.base.palette['foreground-color']};

    ${$isToday &&
    css`
      border: 0.0625rem solid ${theme.base.palette['brand-primary']} !important;
      font-weight: bold;
      color: ${theme.base.palette['brand-primary']};
    `}

    ${$isSelected &&
    css`
      background: ${theme.base.palette['brand-primary']} !important;
      color: ${theme.base.palette['primary-background']} !important;
      font-weight: bold;
    `}

    &:hover:not(:disabled) {
      background: ${theme.base.palette['app-background']};
    }
  `
);
DayCell.defaultProps = defaultThemeProp;

const PegaStyleSelect = styled.select<{ $maxWidth?: string; theme?: any }>(
  ({ theme, $maxWidth }) => css`
    appearance: none;
    background: ${theme.base.palette['app-background']};
    border: 0.0625rem solid ${theme.base.palette['border-line']};
    border-radius: 0.25rem;
    padding-inline-start: 0.5rem;
    padding-inline-end: 1.75rem;
    padding-block: 0.25rem;
    font-size: 0.875rem;
    font-weight: bold;
    color: ${theme.base.palette['foreground-color']};
    cursor: pointer;
    max-width: ${$maxWidth || 'none'};

    &:hover {
      border-color: ${theme.base.palette['brand-primary']};
    }
  `
);
PegaStyleSelect.defaultProps = defaultThemeProp;

const CalendarPortalContainer = styled.div<{ theme?: any }>(
  ({ theme }) => css`
    padding: 1rem;
    border-radius: 0.5rem;
    border: 0.0625rem solid ${theme.base.palette['border-line']};
    background: ${theme.base.palette['primary-background']};
    position: absolute;
    z-index: 10000;
    /* Accessing theme shadow via any to bypass strict type mismatch while maintaining theme functionality */
    box-shadow: ${(theme.base as any).shadow?.high || '0 0.125rem 1.5rem rgba(0,0,0,0.3)'};
    width: 18.5rem;
    user-select: none;
    direction: inherit;
  `
);
CalendarPortalContainer.defaultProps = defaultThemeProp;

/* ================= HIJRI UTILS ================= */

const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric'
});

function getHijriParts(date: Date): HijriDateParts {
  const parts = hijriFormatter.formatToParts(date);
  const obj = { day: 1, month: 1, year: 1445, key: '' };
  parts.forEach((p) => {
    if (p.type === 'day') obj.day = parseInt(p.value, 10);
    if (p.type === 'month') obj.month = parseInt(p.value, 10);
    if (p.type === 'year') obj.year = parseInt(p.value, 10);
  });
  obj.key = `${obj.year}${String(obj.month).padStart(2, '0')}${String(obj.day).padStart(2, '0')}`;
  return obj;
}

function hijriToApproxGregorian(hYear: number, hMonth: number): Date {
  const totalHijriDays = (hYear - 1) * 354.367 + (hMonth - 1) * 29.53;
  return new Date(new Date(622, 3, 19).getTime() + totalHijriDays * 86400000);
}

/* ================= MAIN COMPONENT ================= */


export function HijriCalendar(props: HijriCalendarProps) {
  const {
    getPConnect,
    value,
    label,
    testId,
    hideLabel,
    minYear = 1400,
    maxYear = 1500,
    disabled,
    readOnly,
    required,
    validatemessage,
    helperText,
    storeAsHijri = true
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;

  const containerRef = useRef<HTMLDivElement>(null);
  const isManualChange = useRef(false);
  const nowHijri = useMemo(() => getHijriParts(new Date()), []);

  const [inputValue, setInputValue] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [hMonth, setHMonth] = useState(nowHijri.month);
  const [hYear, setHYear] = useState(nowHijri.year);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const yearRange = useMemo(
    () => Array.from({ length: Number(maxYear) - Number(minYear) + 1 }, (_, i) => Number(minYear) + i),
    [minYear, maxYear]
  );

  const isRTL = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.getComputedStyle(document.body).direction === 'rtl';
  }, []);

  const localizedMonths = isRTL ? HIJRI_MONTHS_AR : HIJRI_MONTHS_EN;
  const localizedWeekdays = isRTL ? WEEKDAYS_AR : WEEKDAYS_EN;

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (show && !containerRef.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest('.hijri-calendar-portal')) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, [show]);

  useEffect(() => {
    if (value && value !== inputValue && !isManualChange.current) {
      if (value.includes('/')) {
        setInputValue(value);
        const p = value.split('/');
        setHMonth(Number(p[1]));
        setHYear(Number(p[2]));
        setSelectedKey(`${p[2]}${p[1].padStart(2, '0')}${p[0].padStart(2, '0')}`);
      } else if (value.includes('-')) {
        const gDate = new Date(value);
        if (!isNaN(gDate.getTime())) {
          const h = getHijriParts(gDate);
          const hStr = `${String(h.day).padStart(2, '0')}/${String(h.month).padStart(2, '0')}/${h.year}`;
          setInputValue(hStr);
          setHMonth(h.month);
          setHYear(h.year);
          setSelectedKey(h.key);
        }
      }
    }
    isManualChange.current = false;
  }, [value, inputValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    isManualChange.current = true;
    let val = e.target.value.replace(/\D/g, '').substring(0, 8);
    if (val.length >= 2 && parseInt(val.substring(0, 2), 10) > 30) val = `30${val.substring(2)}`;
    if (val.length >= 4 && parseInt(val.substring(2, 4), 10) > 12) val = `${val.substring(0, 2)}12${val.substring(4)}`;

    let formatted = val;
    if (val.length > 2) formatted = `${val.substring(0, 2)}/${val.substring(2)}`;
    if (val.length > 4) formatted = `${formatted.substring(0, 5)}/${formatted.substring(5)}`;

    setInputValue(formatted);

    if (formatted.length === 10) {
      const p = formatted.split('/');
      const yNum = Number(p[2]);
      if (yNum < Number(minYear) || yNum > Number(maxYear)) {
        setRangeError(`Year must be ${minYear}-${maxYear}`);
        return;
      }
      setRangeError(null);
      setHMonth(Number(p[1]));
      setHYear(yNum);
      setSelectedKey(`${p[2]}${p[1].padStart(2, '0')}${p[0].padStart(2, '0')}`);
      const approxG = hijriToApproxGregorian(yNum, Number(p[1]));
      approxG.setDate(approxG.getDate() + (Number(p[0]) - 1));
      actions.updateFieldValue(propName, storeAsHijri ? formatted : approxG.toISOString().split('T')[0]);
    } else {
      setRangeError(null);
    }
  };

  const toggleCalendar = () => {
    if (disabled || readOnly) return;
    if (!show && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
      if (inputValue.length === 10 && !rangeError) {
        const p = inputValue.split('/');
        setHMonth(Number(p[1]));
        setHYear(Number(p[2]));
      }
    }
    setShow(!show);
  };

  const days = useMemo(() => {
    const dList: CalendarDay[] = [];
    const d = hijriToApproxGregorian(hYear, hMonth);
    let safety = 0;
    while (safety < 100) {
      const h = getHijriParts(d);
      if (h.month === hMonth && h.year === hYear) {
        if (h.day === 1) break;
        d.setDate(d.getDate() - (h.day - 1));
        if (getHijriParts(d).day === 1) break;
      }
      d.setDate(d.getDate() + 1);
      safety++;
    }
    safety = 0;
    while (safety < 32) {
      const h = getHijriParts(d);
      if (h.month !== hMonth || h.year !== hYear) break;
      dList.push({ gDate: new Date(d), hDay: h.day, hKey: h.key });
      d.setDate(d.getDate() + 1);
      safety++;
    }
    return dList;
  }, [hMonth, hYear]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <FormField
        label={label}
        labelHidden={hideLabel}
        required={required}
        info={helperText}
        testId={testId}
        status={validatemessage || rangeError ? 'error' : undefined}
        errorText={rangeError || validatemessage}
      >
        <FormControl>
          <InputWrapper>
            <Input
              value={inputValue}
              disabled={disabled}
              readOnly={readOnly}
              placeholder="DD/MM/YYYY"
              onChange={handleInputChange}
              style={{ flex: 1, paddingInlineEnd: '2.5rem' }}
            />
            <div
              onClick={toggleCalendar}
              role="button"
              tabIndex={disabled || readOnly ? -1 : 0}
              aria-label="Toggle Hijri Calendar"
              style={{
                position: 'absolute',
                insetInlineEnd: '0.75rem',
                cursor: 'pointer',
                zIndex: 10,
                opacity: disabled || readOnly ? 0.3 : 1,
                pointerEvents: disabled || readOnly ? 'none' : 'auto',
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                width: '1.25rem'
              }}
            >
              <Icon name="calendar" />
            </div>
          </InputWrapper>
        </FormControl>
      </FormField>

      {show &&
        createPortal(
          <CalendarPortalContainer className="hijri-calendar-portal" style={{ top: coords.top, left: coords.left }} role="dialog" aria-modal="true">
            <Flex container alignItems="center" justifyContent="between" style={{ marginBottom: '1rem', direction: 'inherit' }}>
              <Button
                variant="simple"
                aria-label="Previous month"
                onClick={() => (hMonth === 1 ? (setHMonth(12), setHYear(hYear - 1)) : setHMonth(hMonth - 1))}
                disabled={hMonth === 1 && hYear <= Number(minYear)}
                style={{ width: '2.5rem', display: 'flex', justifyContent: 'center' }}
              >
                <div style={{ width: '1rem', height: '1rem', display: 'flex' }}>
                  <Icon name={isRTL ? 'caret-right' : 'caret-left'} />
                </div>
              </Button>

              <Flex container gap={0.25} alignItems="center">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <PegaStyleSelect
                    value={hMonth}
                    $maxWidth={isRTL ? '7.5rem' : '8.5rem'}
                    aria-label="Select Hijri month"
                    onChange={(e) => {
                      isManualChange.current = false;
                      setHMonth(Number(e.target.value));
                    }}
                  >
                    {localizedMonths.map((m, i) => (
                      <option key={m} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </PegaStyleSelect>
                  <div
                    style={{
                      position: 'absolute',
                      insetInlineEnd: '0.375rem',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      width: '0.75rem'
                    }}
                  >
                    <Icon name="caret-down" />
                  </div>
                </div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <PegaStyleSelect
                    value={hYear}
                    aria-label="Select Hijri year"
                    onChange={(e) => {
                      isManualChange.current = false;
                      setHYear(Number(e.target.value));
                    }}
                  >
                    {yearRange.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </PegaStyleSelect>
                  <div
                    style={{
                      position: 'absolute',
                      insetInlineEnd: '0.375rem',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      width: '0.75rem'
                    }}
                  >
                    <Icon name="caret-down" />
                  </div>
                </div>
              </Flex>

              <Button
                variant="simple"
                aria-label="Next month"
                onClick={() => (hMonth === 12 ? (setHMonth(1), setHYear(hYear + 1)) : setHMonth(hMonth + 1))}
                disabled={hMonth === 12 && hYear >= Number(maxYear)}
                style={{ width: '2.5rem', display: 'flex', justifyContent: 'center' }}
              >
                <div style={{ width: '1rem', height: '1rem', display: 'flex' }}>
                  <Icon name={isRTL ? 'caret-left' : 'caret-right'} />
                </div>
              </Button>
            </Flex>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                opacity: 0.5,
                marginBottom: '0.5rem'
              }}
            >
              {localizedWeekdays.map((d) => (
                <div key={d} aria-hidden="true">
                  {d}
                </div>
              ))}
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '8.75rem' }}
              role="grid"
              aria-label="Hijri Calendar Days"
            >
              {Array(days[0]?.gDate.getDay() ?? 0)
                .fill(null)
                .map((_, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`empty-${i}`} />
                ))}
              {days.map((d) => {
                const str = `${String(d.hDay).padStart(2, '0')}/${String(hMonth).padStart(2, '0')}/${hYear}`;
                return (
                  <DayCell
                    key={d.hKey}
                    $isSelected={d.hKey === selectedKey}
                    $isToday={d.hKey === nowHijri.key}
                    aria-label={str}
                    aria-pressed={d.hKey === selectedKey}
                    onClick={() => {
                      isManualChange.current = false;
                      setInputValue(str);
                      setSelectedKey(d.hKey);
                      setShow(false);
                      actions.updateFieldValue(propName, storeAsHijri ? str : d.gDate.toISOString().split('T')[0]);
                    }}
                  >
                    {d.hDay}
                  </DayCell>
                );
              })}
            </div>
          </CalendarPortalContainer>,
          document.body
        )}
    </div>
  );
}

export default withConfiguration(HijriCalendar);
