import type { Ref } from "vue";
import type { Tree } from "~/tree";

export type Menu = Tree<{
  open(): void;
  close(): void;
  toggle(): void;

  navigate(direction: "up" | "down"): void;
  openSubmenu(): void;
  closeSubmenu(goUp?: boolean): void;
  click(): void;
}>;

export interface MenuContext {
  id: string;

  addMenu(menu: Menu, parent?: string): void;
  setActiveMenu(id: string): void;
}

export interface MenuItem {
  id: string;
  hasChildren?: boolean;
  onClick?(): void;
}

export interface ParentMenu extends Menu {
  id: string;
  root: boolean;

  activeItem: Ref<string | undefined>;

  activePath: Ref<string[]>;

  addItem(item: MenuItem): void;
}
