import { Pressable, StyleSheet, Text } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";

export function Menu({
  options,
  onChange,
  selected,
}: {
  options: string[];
  onChange: (value: string) => void;
  selected: string;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Pressable style={styles.trigger}>
          <Text style={styles.triggerText}>Select Calendar</Text>
        </Pressable>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content style={styles.content}>
        {options.map((option) => (
          // @ts-ignore: ts complains if placeholder, onPointerEnterCapture,
          // and onPointerLeaveCapture are not passed
          <DropdownMenu.CheckboxItem
            key={option}
            value={selected === option ? "on" : "off"}
            onValueChange={() => onChange(option)}
            style={styles.item}
          >
            <DropdownMenu.ItemIndicator />
            <DropdownMenu.ItemTitle style={styles.itemTitle}>
              {option}
            </DropdownMenu.ItemTitle>
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 160,
    alignItems: "center",
  },
  triggerText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  content: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 8,
    marginTop: 8,
  },
  item: {
    padding: 12,
  },
  itemTitle: {
    color: "#fff",
    fontSize: 15,
  },
});
