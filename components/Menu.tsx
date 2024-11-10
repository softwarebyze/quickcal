import { Button } from "react-native";
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
        <Button title="Select Calendar" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {options.map((option) => (
          // @ts-ignore: ts complains if placeholder, onPointerEnterCapture,
          // and onPointerLeaveCapture are not passed
          <DropdownMenu.CheckboxItem
            key={option}
            value={selected === option ? "on" : "off"}
            onValueChange={() => onChange(option)}
          >
            <DropdownMenu.ItemIndicator />
            <DropdownMenu.ItemTitle>{option}</DropdownMenu.ItemTitle>
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
