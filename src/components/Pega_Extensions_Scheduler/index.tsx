import { useEffect, useState, useRef, type MouseEvent } from 'react';
import { withConfiguration, FormControl, Flex, FormField, Link, useTheme, ErrorState } from '@pega/cosmos-react-core';
import { type EventContentArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { StyledCardContent, MainCard, GlobalStyle } from './styles';
import '../shared/create-nonce';

export type PegaExtensionsSchedulerProps = {
  getPConnect: any;
  value: string;
  hideLabel: boolean;
  testId?: string;
  label?: string;
};

type Event = {
  id: string;
  title: string;
  start: Date | undefined;
  end: Date | undefined;
  item: any;
};

/**
 * convert a timestamp like '20200210T170100' or '20200210' into a valid Date object
 */
export const convertDate = (v: string) => {
  if (v?.length === 8) {
    return new Date(`${v.substring(0, 4)}-${v.substring(4, 6)}-${v.substring(6, 8)}T00:00:00`);
  }
  if (v?.length === 15) {
    return new Date(
      `${v.substring(0, 4)}-${v.substring(4, 6)}-${v.substring(6, 8)}T${v.substring(9, 11)}:${v.substring(11, 13)}:${v.substring(13, 15)}`,
    );
  }
  return undefined;
};

export const convertTime = (v: string) => {
  if (v?.length === 6) {
    return `${v.substring(0, 2)}:${v.substring(2, 4)}`;
  }
  return undefined;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsScheduler = (props: PegaExtensionsSchedulerProps) => {
  const { getPConnect, label, hideLabel = false, testId, value } = props;
  const [events, setEvents] = useState<Array<Event>>([]);
  const calendarRef = useRef<FullCalendar | null>(null);
  const theme = useTheme();
  const [isValidEventDate, setIsValidEventDate] = useState<boolean>(false);
  const [initialDate, setInitialDate] = useState<string | undefined>();

  const renderEventContent = (eventInfo: EventContentArg) => {
    const obj = eventInfo.event._def.extendedProps.item;
    const linkURL = (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
      (window as any).PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
      { caseClassName: obj.ObjClass },
      { workID: obj.ID },
    );
    if (obj.Name) {
      const description = `Event ${eventInfo.event.title} for ${obj.Name} from ${convertTime(obj.StartTime)} to from ${convertTime(obj.EndTime)}`;
      return (
        <Link
          href={linkURL}
          previewable
          aria-label={description}
          style={{
            wordBreak: 'break-all',
            color: '#FFFFFF',
            fontSize: '1rem',
          }}
          onPreview={() => {
            getPConnect().getActionsApi().showCasePreview(encodeURI(obj.InsKey), {
              caseClassName: obj.ObjClass,
            });
          }}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              getPConnect().getActionsApi().openWorkByHandle(obj.InsKey, obj.ObjClass);
            }
          }}
        >
          {`${eventInfo.event.title} - ${obj.Name}`}
        </Link>
      );
    }
    return <StyledCardContent>{eventInfo.event.title}</StyledCardContent>;
  };

  useEffect(() => {
    try {
      const data: any = JSON.parse(value);
      const tmpEvents: Array<Event> = [];
      const pConn = getPConnect();
      const CaseInstanceKey = pConn.getValue('caseInfo.businessID');
      const newEvent = {
        ID: CaseInstanceKey,
        Label: pConn.getValue('caseInfo.name'),
        StartTime: data.StartTime,
        EndTime: data.EndTime,
      };
      tmpEvents.push({
        id: newEvent.ID,
        title: newEvent.Label,
        start: convertDate(`${data.EventDate}T${newEvent.StartTime}`),
        end: convertDate(`${data.EventDate}T${newEvent.EndTime}`),
        item: newEvent,
      });
      tmpEvents.push();
      if (data.Events) {
        data.Events.forEach((item: any) => {
          tmpEvents.push({
            id: item.ID,
            title: item.Label,
            start: convertDate(`${data.EventDate}T${item.StartTime}`),
            end: convertDate(`${data.EventDate}T${item.EndTime}`),
            item,
          });
        });
      }

      setEvents(tmpEvents);
      setIsValidEventDate(false);
      if (data.EventDate) {
        const newDateStr = `${data.EventDate.substring(0, 4)}${data.EventDate.substring(4, 6)}${data.EventDate.substring(6, 8)}`;
        const newDate = convertDate(newDateStr);
        if (newDateStr.length === 8 && newDate instanceof Date && !Number.isNaN(newDate)) {
          setIsValidEventDate(true);
          if (calendarRef.current) {
            calendarRef.current.getApi().gotoDate(newDate);
          } else {
            setInitialDate(newDateStr);
          }
        }
      }
    } catch {
      /* empty */
    }
  }, [getPConnect, value]);

  return (
    <>
      <GlobalStyle />
      <Flex container={{ direction: 'column' }}>
        <FormField label={label} labelHidden={hideLabel} testId={testId}>
          <FormControl ariaLabel={label}>
            <MainCard theme={theme}>
              {isValidEventDate ? (
                <FullCalendar
                  ref={calendarRef}
                  timeZone='local'
                  headerToolbar={{
                    left: '',
                    center: 'title',
                    right: '',
                  }}
                  plugins={[timeGridPlugin]}
                  initialView='timeGridDay'
                  selectable
                  nowIndicator={false}
                  weekends
                  allDayText='All day'
                  slotMinTime='07:00:00'
                  slotMaxTime='19:00:00'
                  height={650}
                  slotEventOverlap={false}
                  events={events}
                  initialDate={initialDate}
                  eventContent={renderEventContent}
                  slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                />
              ) : (
                <ErrorState message='Invalid event Date' />
              )}
            </MainCard>
          </FormControl>
        </FormField>
      </Flex>
    </>
  );
};

export default withConfiguration(PegaExtensionsScheduler);
