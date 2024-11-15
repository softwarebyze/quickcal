import { Menu } from "@/components/Menu";
import { useCalendar } from "@/hooks/useCalendar";
import { useRequestsLimit } from "@/hooks/useRequestsLimit";
import { parseEventText } from "@/services/ai";
import { Calendar, CalendarDialogResultActions } from "expo-calendar";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface CalendarSelectorProps {
  selectedCalendar: string | null;
  setSelectedCalendar: (calendar: string) => void;
  calendars: Calendar[];
}

interface EventInputProps {
  eventText: string;
  setEventText: (text: string) => void;
}

interface RemainingRequestsProps {
  remainingRequests: number;
}

const Header = () => (
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
      style={{ width: 28, height: 45, resizeMode: "contain" }}
    />
  </View>
);

const CalendarSelector = ({
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

const EventInput = ({ eventText, setEventText }: EventInputProps) => (
  <TextInput
    value={eventText}
    onChangeText={setEventText}
    multiline
    placeholder="Describe your event..."
    placeholderTextColor="#666"
    style={styles.input}
  />
);

const RemainingRequests = ({ remainingRequests }: RemainingRequestsProps) => {
  if (remainingRequests > 3) return null;

  return (
    <View style={styles.warningContainer}>
      <Text style={styles.warningText} numberOfLines={1}>
        {remainingRequests === 0
          ? "No requests remaining"
          : `${remainingRequests} ${
              remainingRequests === 1 ? "request" : "requests"
            } remaining`}
      </Text>
      <Pressable style={styles.upgradeButton}>
        <Text style={styles.upgradeButtonText}>
          {remainingRequests === 0 ? "Upgrade Now" : "Upgrade"}
        </Text>
      </Pressable>
    </View>
  );
};

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
    position: "absolute",
    bottom: Platform.OS === "ios" ? 120 : 80,
    alignSelf: "center",
    width: 320,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  warningText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexShrink: 0,
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
