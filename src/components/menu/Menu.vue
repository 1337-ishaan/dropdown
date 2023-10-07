<template>
  <slot name="button" />

  <div v-show="show" :id="id" class="menu">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, provide, onBeforeMount, computed } from "vue";
  import { v4 as uuid } from "uuid";
  import { withDefaults, defineProps } from "vue";

  import type { MenuContext, ParentMenu, Menu, MenuItem } from "./types";
  import { MenuContextKey, ParentMenuKey } from "./keys";

  interface SubMenuProps {
    id?: string;
  }

  const props = withDefaults(defineProps<SubMenuProps>(), {
    id: () => uuid(),
  });

  const context = inject<MenuContext | undefined>(MenuContextKey, undefined);
  const parentMenu = inject<ParentMenu | undefined>(ParentMenuKey, undefined);
  const items = ref<(MenuItem | Menu)[]>([]);
  const show = ref(false);
  const activeItem = ref<string>();

  const activeIndex = computed(() => {
    if (!activeItem.value) {
      return -1;
    }

    return items.value.findIndex(it => it.id === activeItem.value);
  });

  const menu: Menu = {
    id: props.id,

    open() {
      if (!show.value) {
        show.value = true;
        const [firstItem] = items.value;

        if (firstItem) {
          activeItem.value = firstItem.id;
          context?.setActiveMenu(props.id);
        }
      }
    },

    close() {
      if (show.value) {
        show.value = false;
        activeItem.value = undefined;
      }
    },

    toggle() {
      if (show.value) {
        this.close();
      } else {
        this.open();
      }
    },

    navigate(direction) {
      const max = items.value.length - 1;
      const min = 0;

      switch (direction) {
        case "down":
          activeItem.value =
            items.value[Math.min(activeIndex.value + 1, max)]?.id;
          break;

        case "up":
          activeItem.value =
            items.value[Math.max(activeIndex.value - 1, min)]?.id;
          break;
      }
    },

    openSubmenu() {
      const item = items.value[activeIndex.value];

      if (item && "open" in item) {
        item.open();
      }
    },

    closeSubmenu(goUp?: boolean) {
      if (goUp) {
        parentMenu?.closeSubmenu();
      } else {
        const item = items.value[activeIndex.value];

        if (item && "close" in item) {
          item.close();
        }

        context?.setActiveMenu(props.id);
      }
    },

    click() {
      const item = items.value[activeIndex.value];

      if (item && "open" in item) {
        item.open();
      } else {
        item?.onClick?.();
      }
    },
  };

  provide<ParentMenu>(ParentMenuKey, {
    ...menu,
    root: !parentMenu,
    id: props.id,
    activeItem,
    activePath: computed(() => {
      const path = parentMenu?.activePath.value ?? [];

      if (activeItem.value) {
        path.push(activeItem.value);
      }

      return path.filter(
        item =>
          !items.value.find(it => it.id === item && it.id !== activeItem.value)
      );
    }),
    addItem(item) {
      if (item.hasChildren) {
        parentMenu?.addItem(item);
      } else {
        items.value.push(item);
      }
    },
  });

  onBeforeMount(() => {
    context?.addMenu(
      {
        ...menu,
        children: items.value as any,
      },
      parentMenu?.id
    );
  });
</script>

<style lang="scss" scoped>
  .menu {
    padding: 0.5rem;
    border: 1px solid #646464 !important;
    flex-direction: column;
    display: flex;
    gap: 0.5rem;
    box-shadow: none !important;
  }
</style>
