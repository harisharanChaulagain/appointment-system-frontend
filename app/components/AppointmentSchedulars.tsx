import { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { isBefore, setHours, addHours } from "date-fns";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const AppointmentSchedulers = () => {
  const [events, setEvents] = useState<any[]>([
    {
      event_id: uuidv4(),
      title: "Real Madrid vs Bayern Munich",
      start: setHours(new Date(), 10),
      end: addHours(setHours(new Date(), 10), 1),
    },
  ]);

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
    event: any,
    action: string
  ): Promise<any | boolean> => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    if (isBefore(startDate, new Date())) {
      toast.error("Events cannot be created in the past");
      return false;
    }

    const duration =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    if (duration < 1) {
      toast.error("Event duration must be at least 1 hour");
      return false;
    }

    if (isOverlapping(startDate, endDate, event.event_id)) {
      toast.error("Events cannot overlap with other events");
      return false;
    }

    const existingEvent = events.find((e) => e.event_id === event.event_id);
    if (existingEvent && isBefore(new Date(existingEvent.start), new Date())) {
      toast.error("Cannot edit past events");
      return false;
    }

    if (action === "create") {
      const newEvent = {
        ...event,
        event_id: uuidv4(),
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      toast.success("Event created successfully");
      return newEvent;
    } else if (action === "edit") {
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.event_id === event.event_id ? event : e))
      );
      toast.success("Event updated successfully");
      return event;
    }

    return false;
  };

  const handleDelete = async (deletedId: string): Promise<void> => {
    const eventToDelete = events.find((e) => e.event_id === deletedId);

    if (eventToDelete && isBefore(new Date(eventToDelete.start), new Date())) {
      toast.error("Cannot delete past events");
      return;
    }

    setEvents((prevEvents) =>
      prevEvents.filter((e) => e.event_id !== deletedId)
    );
    toast.success("Event deleted successfully");
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
