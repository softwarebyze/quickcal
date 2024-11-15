import { Menu } from "@/components/Menu";
import { useCalendar } from "@/hooks/useCalendar";
import { useRequestsLimit } from "@/hooks/useRequestsLimit";
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

      {remainingRequests !== null &&
        remainingRequests <= 3 &&
        remainingRequests > 0 && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              {remainingRequests}{" "}
              {remainingRequests === 1 ? "request" : "requests"} remaining
            </Text>
            <Pressable style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </Pressable>
          </View>
        )}

      {remainingRequests === 0 && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>No requests remaining</Text>
          <Pressable style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </Pressable>
        </View>
      )}
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
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    position: "absolute",
    bottom: 40,
  },
  warningText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  upgradeButton: {
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
