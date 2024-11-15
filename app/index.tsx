import { Header } from "@/components/Header";
import { CalendarSelector } from "@/components/CalendarSelector";
import { EventInput } from "@/components/EventInput";
import { RemainingRequests } from "@/components/RemainingRequests";
import { useCalendar } from "@/hooks/useCalendar";
import { useRequestsLimit } from "@/hooks/useRequestsLimit";
import { parseEventText } from "@/services/ai";
import { CalendarDialogResultActions } from "expo-calendar";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

export default function App() {
  const { calendars, createEvent } = useCalendar();
  const { remainingRequests, decrementRequests } = useRequestsLimit();
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [eventText, setEventText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCalendar || !eventText || remainingRequests === 0) return;

    setLoading(true);
    try {
      const calendar = calendars.find((cal) => cal.title === selectedCalendar);
      if (!calendar) throw new Error("Calendar not found");

      const eventDetails = await parseEventText(eventText);
      const { action } = await createEvent(calendar.id, eventDetails);

      decrementRequests();
      setEventText("");

      if (
        Platform.OS === "ios" &&
        action === CalendarDialogResultActions.done
      ) {
        alert("Event created successfully!");
      }
    } catch (error) {
      if (error instanceof Error)
        alert("Failed to create event: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ gap: 24, alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <Header />
          <CalendarSelector
            selectedCalendar={selectedCalendar}
            setSelectedCalendar={setSelectedCalendar}
            calendars={calendars}
          />
          <EventInput eventText={eventText} setEventText={setEventText} />
          <Pressable
            style={[
              styles.button,
              (!selectedCalendar || remainingRequests === 0) &&
                styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!selectedCalendar || loading || remainingRequests === 0}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>
                {remainingRequests === 0 ? "Upgrade to Continue" : "Add Event"}
              </Text>
            )}
          </Pressable>
        </ScrollView>

        <RemainingRequests remainingRequests={remainingRequests} />
      </KeyboardAvoidingView>
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
