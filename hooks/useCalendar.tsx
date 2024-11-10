import * as Calendar from "expo-calendar";
import { useEffect, useState } from "react";

export function useCalendar() {
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        setCalendars(calendars);
      }
    })();
  }, []);

  const createEvent = async (
    calendarId: string,
    eventDetails: Partial<Calendar.Event>
  ) => {
    try {
      // Ensure dates are proper Date objects
      const startDate = new Date(eventDetails.startDate || "");
      const endDate = new Date(eventDetails.endDate || startDate);

      const eventDetailsWithDefaults = {
        calendarId,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        alarms: [
          {
            relativeOffset: -15, // 15 minutes before
          },
        ],
        availability: Calendar.Availability.BUSY,
        status: Calendar.EventStatus.CONFIRMED,
        ...eventDetails,
        startDate,
        endDate,
      };

      const eventId = await Calendar.createEventInCalendarAsync(
        eventDetailsWithDefaults
      );

      return eventId;
    } catch (error) {
      console.error("Failed to create event:", error);
      throw error;
    }
  };

  return { calendars, createEvent };
}
