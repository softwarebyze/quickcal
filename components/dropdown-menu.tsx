// design-system/dropdown-menu.tsx
import * as DropdownMenu from "zeego/dropdown-menu";

export const DropdownMenuRoot = DropdownMenu.Root;
export const DropdownMenuTrigger = DropdownMenu.Trigger;
export const DropdownMenuContent = DropdownMenu.Content;

export const DropdownMenuItem = DropdownMenu.create(DropdownMenu.Item, "Item");
export const DropdownMenuItemTitle = DropdownMenu.create(DropdownMenu.ItemTitle, "ItemTitle");
// ...other primitives
