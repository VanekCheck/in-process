import { FC, useEffect, useMemo, useRef } from "react";
// full calendar plugins
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import dayViewPlugin from "./DayCalendar/DayCalendarPlugin";

import moment from "moment";
import { useNavigate } from "react-router";

// styles
import "./calendar.styles.scss";
import cn from "classnames";

import { getAllBookings } from "store";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  bookingActions,
  closePopover,
  selectBooking,
} from "store/slices/booking.slice";

import { colorFromString } from "utils";

import { TimeSlot } from "./Grid";
import { buildEvents } from "./FullCalendarComponents/BuildEvent";
import { PopoverWrapper } from "./Events";
import { Loading } from "components";

const Calendar: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const calendarRef = useRef<null | any>(null);

  const {
    isSideBarOpen,
    isBookingLoading,
    bookings,
    isPopoverOpen,
    currentBooking,
    own,
  } = useAppSelector(selectBooking);

  const fullCalendarBookings = useMemo(
    () =>
      bookings.map((book) => {
        const {
          name,
          start,
          end,
          description,
          room,
          id,
          users,
          creator,
          schedule,
        } = book;

        return {
          id: id.toString(),
          title: name,
          start,
          end,
          extendedProps: {
            description: description,
            room: room,
            users: users,
            color: colorFromString(name ?? ""),
            creator,
            schedule,
          },
        };
      }),
    [ bookings ]
  );

  const getRangeOfBookings = (start: string, end: string, newOwn: boolean) => {
    dispatch(
      getAllBookings({
        startDate: start,
        endDate: end,
        officeId: 2,
        own: newOwn,
      })
    );
  };

  useEffect(() => {
    dispatch(closePopover());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      calendarRef?.current?.getApi?.().updateSize();
    }, 1200);
  }, [isSideBarOpen]);

  return (
    <div className={cn("full-calendar", { "calendar-own": own })}>
      {isBookingLoading && (
        <div className='loading-wrapper'>
          <Loading />
        </div>
      )}
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          dayViewPlugin,
          listPlugin,
        ]}
        ref={calendarRef}
        timeZone='local'
        initialView={"dayGridMonth"}
        locale={"en-GB"}
        allDaySlot={false}
        // slot
        slotLabelInterval={"01:00"}
        slotDuration={"01:00"}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          omitZeroMinute: false,
        }}
        slotLabelContent={(props) => (
          <TimeSlot hour={+props.text.split(":")[0]} />
        )}
        // header
        headerToolbar={{
          left: "addBooking today",
          center: "prev,title,next",
          right: "showOwn day,timeGridWeek,dayGridMonth,listWeek",
        }}
        selectable={false}
        selectMirror={false}
        dayMaxEvents={true}
        nowIndicator={true}
        navLinks={true}
        // weekends={false}

        // event
        events={fullCalendarBookings}
        eventContent={buildEvents}
        // buttons
        customButtons={{
          addBooking: {
            text: "Book",
            click: () => {
              const { currentDate } =
                calendarRef?.current?.getApi?.().currentDataManager.data;
              const date = moment(currentDate).add(-2, "hours").toISOString();
              dispatch(bookingActions.resetEditingId());
              navigate(`/dashboard/booking-form?date=${date}&isCalendar=true`);
            },
          },
          showOwn: {
            text: " ",
            click: () => {
              const { renderRange } =
                calendarRef?.current?.getApi?.().currentDataManager.state
                  .dateProfile;

              const { start, end } = renderRange;

              getRangeOfBookings(
                moment(start).toISOString(),
                moment(end).toISOString(),
                !own
              );
              dispatch(bookingActions.toggleOwn());
            },
          },
        }}
        datesSet={(params) => {
          const { endStr, startStr } = params;
          getRangeOfBookings(
            moment(startStr).toISOString(),
            moment(endStr).toISOString(),
            own
          );
        }}
      />

      {isPopoverOpen && currentBooking && (
        <PopoverWrapper event={currentBooking} />
      )}
    </div>
  );
};

export { Calendar };
