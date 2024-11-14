import { Menu } from "@/components/Menu";
import { useCalendar } from "@/hooks/useCalendar";
import { parseEventText } from "@/services/ai";
import { CalendarDialogResultActions } from "expo-calendar";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
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
      const { action } = await createEvent(calendar.id, eventDetails);

      setEventText("");
      if (
        Platform.OS === "ios" &&
        action === CalendarDialogResultActions.done
      ) {
        alert("Event created successfully!");
      }
    } catch (error) {
      // @ts-ignore
      alert("Failed to create event: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <Text style={styles.title}>
          quick<Text style={styles.titleAccent}>cal</Text>
        </Text>
        <Image
          source={require("../assets/images/bolt.png")}
          style={{
            width: 28,
            height: 45,
            resizeMode: "contain",
          }}
        />
      </View>

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
    </SafeAreaView>
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
