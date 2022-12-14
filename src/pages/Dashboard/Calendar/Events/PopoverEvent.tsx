import { FC, useCallback, useMemo, useState } from "react";

import { getAllOwnBookings, oneTimeDelete, recDelete, selectUser } from "store";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  bookingActions,
  selectBooking,
  togglePopover,
} from "store/slices/booking.slice";

import cn from "classnames";
import scss from "./events.module.scss";

import {
  creator as creatorIcon,
  details,
  edit,
  exit,
  location,
  people,
  room as roomIcon,
  trash,
} from "assets/images/icons";
import {
  getFullDateRange,
  getParamsFromObject,
  PAGE_SIDEBAR_LIMIT,
} from "utils";
import { ExtendedSingleBooking } from "models";
import { useNavigate } from "react-router";
import { DeletePopover } from "components";

type PopoverEventProps = {
  event: ExtendedSingleBooking;
};

const PopoverEvent: FC<PopoverEventProps> = ({ event }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector(selectUser);
  const { page } = useAppSelector(selectBooking);
  const {
    name,
    description,
    start,
    end,
    color,
    users,
    id,
    creator,
    room,
    schedule,
  } = event;

  const handleEdit = () => {
    dispatch(bookingActions.setEditingId(id));

    const url = getParamsFromObject({
      name,
      description,
      end: end.toISOString(),
      date: start.toISOString(),
      users: users.map((user) => user.email).join(","),
      roomId: room.id,
    });
    navigate(`/dashboard/booking-form?${url}`);
  };

  const handleClose = useCallback(() => {
    dispatch(togglePopover());
  }, [dispatch]);

  const showControlIcons: boolean =
    user?.role === "admin" || creator.email === user?.email;

  const usersEmails = useMemo(() => users.map((user) => user.email), [users]);

  // delete popup
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCancelDelete = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(
    async (deleteAllType: boolean = false) => {
      handleClose();
      setIsOpen(false);
      if (schedule && deleteAllType) {
        await dispatch(recDelete({ scheduleId: schedule.id }));
      } else {
        await dispatch(oneTimeDelete({ bookingId: id }));
      }
      await dispatch(getAllOwnBookings({ page, limit: PAGE_SIDEBAR_LIMIT, showSkeleton: true }));
    },
    [dispatch, handleClose, id, page, schedule]
  );

  return (
    <div className={scss["event-popover"]}>
      <header className={scss["tools-bar"]}>
        {showControlIcons && (
          <div className={scss["tools-wrapper"]}>
            <img
              src={edit}
              alt='edit'
              className={scss["edit-icon"]}
              onClick={handleEdit}
            />
            <img
              src={trash}
              alt='trash'
              className={scss["trash-icon"]}
              onClick={() => setIsOpen(true)}
            />
          </div>
        )}
        <div className={scss["exit-wrapper"]}>
          <img
            src={exit}
            alt='exit'
            className={scss["exit-icon"]}
            onClick={handleClose}
          />
        </div>
      </header>

      <main className={scss["body-container"]}>
        <div className={scss["body"]}>
          <h3 className={cn(scss["title"])} style={{ wordBreak: "break-all" }}>
            {name}
          </h3>
          <p className={scss["date-information"]}>
            {getFullDateRange(start, end)}
          </p>
          <div className={scss["content-wrapper"]}>
            {!!description && (
              <ContentWithIcon
                className='content-text'
                icon={details}
                text={description}
              />
            )}
            {usersEmails.length > 0 && (
              <ContentWithIcon
                className='user-emails'
                icon={people}
                text={usersEmails.join(", ")}
              />
            )}
            <ContentWithIcon
              icon={creatorIcon}
              text={creator.email}
              className={"align-center"}
            />
            <ContentWithIcon
              icon={roomIcon}
              text={`${room.name}/${room.floor}`}
              className={"align-center"}
            />
            <ContentWithIcon
              icon={location}
              text={"Lviv, st. Bohdan Khmelnytskyi, 116A"}
              className={"align-center"}
            />
          </div>
        </div>
      </main>
      <div
        className={scss["event__colored-line"]}
        style={{ background: color }}
      />
      <DeletePopover
        isOpen={isOpen}
        isSchedule={!!schedule}
        handleCancel={handleCancelDelete}
        handleConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export { PopoverEvent };

interface ContentWithIconProps {
  icon: string;
  text: string;
  className?: string;
}

const ContentWithIcon: FC<ContentWithIconProps> = ({
  icon,
  text,
  className,
}) => {
  return (
    <div className={cn(scss["content-with-icon"], scss[`${className}`])}>
      <img src={icon} className={scss["content-icon"]} alt='icon' />
      <p className={scss["content-text"]}>{text}</p>
    </div>
  );
};
