
import { Text, StyleSheet } from "react-native";
import { Calendar } from "expo-calendar";
import { Menu } from "./Menu";

interface CalendarSelectorProps {
  selectedCalendar: string | null;
  setSelectedCalendar: (calendar: string) => void;
  calendars: Calendar[];
}

export const CalendarSelector = ({
  selectedCalendar,
  setSelectedCalendar,
  calendars,
}: CalendarSelectorProps) => (
  <>
    <Menu
      title={selectedCalendar ? "Change Calendar" : "Select a calendar"}
      options={calendars.map((cal) => cal.title)}
      onChange={setSelectedCalendar}
      selected={selectedCalendar || ""}
    />
    {selectedCalendar && (
      <Text style={styles.selectedCalendar}>{selectedCalendar}</Text>
    )}
  </>
);

const styles = StyleSheet.create({
  selectedCalendar: {
    fontSize: 15,
    color: "#888",
    fontWeight: "500",
  },
});