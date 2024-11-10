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
      <Text style={styles.title}>
        quick<Text style={styles.titleAccent}>cal</Text>
      </Text>

      <Menu
        title={selectedCalendar ? "Change Calendar" : "Select a calendar"}
        options={calendars.map((cal) => cal.title)}
        onChange={setSelectedCalendar}
        selected={selectedCalendar || ""}
      />

      {selectedCalendar && (
        <Text style={styles.selectedCalendar}>{selectedCalendar}</Text>
      )}

      <TextInput
        value={eventText}
        onChangeText={setEventText}
        multiline
        placeholder="Describe your event..."
        placeholderTextColor="#666"
        style={styles.input}
      />

      <Pressable
        style={[styles.button, !selectedCalendar && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!selectedCalendar || loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Add Event</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    padding: 20,
    gap: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: "200",
    marginTop: 60,
    color: "#fff",
    letterSpacing: -1,
  },
  titleAccent: {
    fontWeight: "600",
  },
  selectedCalendar: {
    fontSize: 15,
    color: "#888",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    minHeight: 120,
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    minWidth: 140,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#333",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
