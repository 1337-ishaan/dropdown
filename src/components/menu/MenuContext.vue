<template>
  <div :id="id" @keydown="onKeyDown">
    <slot />
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide, watch } from "vue";
  import { v4 as uuid } from "uuid";

  import { TreeStructure } from "../../TreeStructure";

  import type { MenuContext, Menu, MenuItem } from "./types";
  import { MenuContextKey } from "./keys";

  export interface MenuContextProps {
    id?: string;
  }

  const props = withDefaults(defineProps<MenuContextProps>(), {
    id: () => uuid(),
  });

  const tree = ref(
    new TreeStructure<Menu | MenuItem>({
      id: props.id,
      children: [],
      /* eslint-disable @typescript-eslint/no-empty-function */
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
        activeMenu.value = found?.tree;
      }
    },
  });

  const onKeyDown = (event: KeyboardEvent) => {
    if (!activeMenu.value) {
      return;
    }

    if (event.key === "ArrowRight") {
      activeMenu.value.openSubmenu();
    }

    if (event.key === "ArrowLeft") {
      activeMenu.value.closeSubmenu(true);
    }

    if (event.key === "ArrowDown") {
      activeMenu.value.navigate("down");
    }

    if (event.key === "ArrowUp") {
      activeMenu.value.navigate("up");
    }

    if (["Enter", " "].includes(event.key)) {
      activeMenu.value.click();
    }
  };
</script>
