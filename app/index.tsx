import { Menu } from "@/components/Menu";
import { useCalendar } from "@/hooks/useCalendar";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

// import OpenAI from "openai";
// const openai = new OpenAI({
//   baseURL: "https://api.x.ai/v1",
// });

// const completion = await openai.chat.completions.create({
//   model: "grok-beta",
//   messages: [
//     { role: "system", content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy." },
//     {
//       role: "user",
//       content: "What is the meaning of life, the universe, and everything?",
//     },
//   ],
// });

// console.log(completion.choices[0].message);

export default function App() {
  const { calendars } = useCalendar();
  const calendarNames = calendars.map((calendar) => calendar.title);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);

  const textInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Menu options={calendarNames} onChange={setSelectedCalendar} />
      {selectedCalendar && (
        <Text style={{ fontSize: 16 }}>
          Selected calendar: {selectedCalendar}
        </Text>
      )}
      <Text style={{ fontSize: 24, flexWrap: "wrap" }}>
        What calendar event would you like to create? ✨
      </Text>
      <TextInput
        ref={textInputRef}
        multiline
        style={{ borderWidth: 2, fontSize: 28, width: 300 }}
        onChangeText={console.log}
      />
      <Button onPress={console.log} title="Submit" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "space-around",
    gap: 20,
  },
});
