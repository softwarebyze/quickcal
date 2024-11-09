import { Button } from "react-native";

import * as DropdownMenu from "zeego/dropdown-menu";

export function Menu({
  options,
  onChange,
}: {
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button title="Select Calendar" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {options.map((option) => (
          <DropdownMenu.Item key={option} onSelect={() => onChange(option)}>
            {option}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
