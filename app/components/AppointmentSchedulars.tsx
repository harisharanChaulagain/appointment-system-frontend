import { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { isBefore, setHours, addHours } from "date-fns";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

interface Event {
  event_id: string;
  title: string;
  start: Date;
  end: Date;
}

const AppointmentSchedulers = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      event_id: uuidv4(),
      title: "Real Madrid vs Bayern Munich",
      start: setHours(new Date(), 10),
      end: addHours(setHours(new Date(), 10), 1),
    },
  ]);

  const showToast = (message: string, success: boolean) => {
    success ? toast.success(message) : toast.error(message);
  };

  const isOverlapping = (startDate: Date, endDate: Date, eventId?: string) => {
    return events.some((e) => {
      return (
        e.event_id !== eventId &&
        startDate < new Date(e.end) &&
        endDate > new Date(e.start)
      );
    });
  };

  const handleConfirm = async (
    event: Event,
    action: "create" | "edit"
  ): Promise<Event> => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    if (isBefore(startDate, new Date())) {
      showToast("Events cannot be created in the past", false);
      throw new Error("Invalid event time");
    }

    const duration =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    if (duration < 1) {
      showToast("Event duration must be at least 1 hour", false);
      throw new Error("Invalid event duration");
    }

    if (isOverlapping(startDate, endDate, event.event_id)) {
      showToast("Events cannot overlap with other events", false);
      throw new Error("Event overlap");
    }

    const existingEvent = events.find((e) => e.event_id === event.event_id);
    if (existingEvent && isBefore(new Date(existingEvent.start), new Date())) {
      showToast("Cannot edit past events", false);
      throw new Error("Cannot edit past events");
    }

    if (action === "create") {
      const newEvent: Event = {
        ...event,
        event_id: uuidv4(),
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      showToast("Event created successfully", true);
      return newEvent;
    } else if (action === "edit") {
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.event_id === event.event_id ? event : e))
      );
      showToast("Event updated successfully", true);
      return event;
    }

    throw new Error("Unknown action");
  };

  const handleDelete = async (deletedId: string): Promise<void> => {
    const eventToDelete = events.find((e) => e.event_id === deletedId);

    if (eventToDelete && isBefore(new Date(eventToDelete.start), new Date())) {
      showToast("Cannot delete past events", false);
      return;
    }

    setEvents((prevEvents) =>
      prevEvents.filter((e) => e.event_id !== deletedId)
    );
    showToast("Event deleted successfully", true);
  };

  return (
    <Scheduler
      view="week"
      events={events}
      onConfirm={handleConfirm}
      onDelete={handleDelete}
      hourFormat="24"
      week={{
        startHour: 9,
        endHour: 18,
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 1,
        step: 60,
      }}
      editable
    />
  );
};

export default AppointmentSchedulers;
