import { Menu } from "@/components/Menu";
import { useCalendar } from "@/hooks/useCalendar";
import { parseEventText } from "@/services/ai";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function App() {
  const { calendars, createEvent } = useCalendar();
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [eventText, setEventText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCalendar || !eventText) return;

    setLoading(true);
    try {
      const calendar = calendars.find((cal) => cal.title === selectedCalendar);
      if (!calendar) throw new Error("Calendar not found");

      const eventDetails = await parseEventText(eventText);
      await createEvent(calendar.id, eventDetails);

      setEventText("");
      alert("Event created successfully!");
    } catch (error) {
      // @ts-ignore
      alert("Failed to create event: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuickCal</Text>

      <Menu
        options={calendars.map((cal) => cal.title)}
        onChange={setSelectedCalendar}
        selected={selectedCalendar || ""}
      />

      {selectedCalendar && (
        <Text style={styles.selectedCalendar}>
          Using calendar: {selectedCalendar}
        </Text>
      )}

      <TextInput
        value={eventText}
        onChangeText={setEventText}
        multiline
        placeholder="Describe your event..."
        style={styles.input}
      />

      <Pressable
        style={[styles.button, !selectedCalendar && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!selectedCalendar || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Event</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 40,
  },
  selectedCalendar: {
    fontSize: 16,
    color: "#666",
  },
  input: {
    width: "100%",
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
