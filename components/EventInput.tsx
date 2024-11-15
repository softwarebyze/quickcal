
import { TextInput, StyleSheet } from "react-native";

interface EventInputProps {
  eventText: string;
  setEventText: (text: string) => void;
}

export const EventInput = ({ eventText, setEventText }: EventInputProps) => (
  <TextInput
    value={eventText}
    onChangeText={setEventText}
    multiline
    placeholder="Describe your event..."
    placeholderTextColor="#666"
    style={styles.input}
  />
);

const styles = StyleSheet.create({
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
});