<template>
  <div :id="id" @keydown="onKeyDown">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { ref, provide } from "vue";
  import { v4 as uuid } from "uuid";

  import { TreeStructure } from "../../TreeStructure";

  import type { MenuContext, Menu, MenuItem } from "./types";
  import { MenuContextKey } from "./keys";

  interface MenuContextProps {
    id?: string;
  }

  const props = defineProps<MenuContextProps>();

  const tree = ref(
    new TreeStructure<Menu | MenuItem>({
      id: props.id,
      children: [],
      open: () => {},
      close: () => {},
      toggle: () => {},
      navigate: () => {},
      openSubmenu: () => {},
    })
  );

  const activeMenu = ref<Menu>();

  provide<MenuContext>(MenuContextKey, {
    id: props.id,

    addMenu(menu, id = props.id) {
      tree.value.add(menu, id);
    },

    setActiveMenu(id) {
      const found = tree.value.find(id);

      if (found && "open" in found.tree) {
        activeMenu.value = found.tree;
      }
    },
  });

  const onKeyDown = (event: KeyboardEvent) => {
    if (!activeMenu.value) {
      return;
    }

    switch (event.key) {
      case "ArrowRight":
        activeMenu.value.openSubmenu();
        break;
      case "ArrowLeft":
        activeMenu.value.closeSubmenu(true);
        break;
      case "ArrowDown":
        activeMenu.value.navigate("down");
        break;
      case "ArrowUp":
        activeMenu.value.navigate("up");
        break;
      case "Enter":
      case " ":
        activeMenu.value.click();
        break;
    }
  };
</script>
