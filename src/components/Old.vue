<template>
  <pre v-if="isRoot">  {{ items.map(filter) }}</pre>
  <Popover
    :position="isRoot ? 'bottom-middle' : 'right-start'"
    @keydown="onKeyDown">
    <slot />

    <template #popover>
      <div v-show="show">
        <slot name="menu" />
      </div>
    </template>
  </Popover>
</template>

<script lang="ts" setup>
  import { computed, inject, onMounted, provide, ref, watch } from "vue";

  import { v4 as uuid } from "uuid";

  import type { MenuContext, MenuItem } from "./types";

  import Popover from "../Popover.vue";

  export interface MenuProps {
    id?: string;
  }

  const props = withDefaults(defineProps<MenuProps>(), {
    id: () => uuid(),
  });

  const filter = (item: any): any => {
    return {
      ...item,
      button: item.button?.textContent,
      items: item.items?.map(filter),
    };
  };

  const context = inject<MenuContext | undefined>("menu-context", undefined);

  const isRoot = computed(() => !context);

  const items = ref<MenuItem[]>([]);

  const button = ref<HTMLButtonElement>();

  const active = ref<string>();

  const getById = (items: MenuItem[], id?: string): MenuItem | undefined => {
    if (!id) {
      return;
    }

    for (const item of items) {
      if (item.id === id) {
        return item;
      }

      if (!item.items) {
        return;
      }

      return getById(item.items, id);
    }
  };

  const getListById = (
    items: MenuItem[],
    id?: string
  ): MenuItem[] | undefined => {
    if (!id) {
      return;
    }

    for (const item of items) {
      if (item.id === id) {
        return items;
      }

      if (!item.items) {
        return;
      }

      const list = getListById(item.items, id);

      if (list) {
        return list;
      }
    }
  };

  const activeItems = computed<MenuItem[] | undefined>(() => {
    return getListById(items.value, active.value);
  });

  const activeIndex = computed(() => {
    return activeItems.value?.findIndex(({ id }) => id === active.value) ?? -1;
  });

  const activeItem = computed(() => {
    return getById(items.value, active.value);
  });

  const show = ref(false);

  provide<MenuContext>("menu-context", {
    isRoot,

    active: context?.active ?? active,

    id: props.id,

    items,

    addItem(item: MenuItem) {
      items.value.push(item);
    },

    setButton(buttonInput?: HTMLButtonElement) {
      button.value = buttonInput;
    },

    open() {
      show.value = true;
    },

    close() {
      show.value = false;
    },

    toggle() {
      show.value = !show.value;
    },
  });

  watch(button, () => {
    context?.addItem({
      id: props.id,
      button: button.value,
      items: items.value,
      show: (val: boolean) => {
        show.value = val;
      },
    });
  });

  onMounted(() => {
    if (isRoot.value) {
      active.value = items.value[0]?.id;
    }
  });

  // const mapButtonContent = (item: MenuItem): any => {
  //   return {
  //     ...item,
  //     button: item.button?.textContent,
  //     items: item.items?.map(mapButtonContent),
  //   };
  // };

  const onKeyDown = (event: KeyboardEvent) => {
    console.log("activeItems", activeItems.value);
    console.log("activeItem", activeItem.value);
    console.log("index", activeIndex.value);

    const getRelativeActiveItem = (relativeIndex: number) => {
      if (activeIndex.value < 0) {
        console.log("no active index");
        return;
      }

      console.log(
        "getting from active items, index:",
        activeIndex.value + relativeIndex
      );

      return activeItems.value?.[activeIndex.value + relativeIndex];
    };

    if (event.key === "ArrowDown") {
      active.value = getRelativeActiveItem(1)?.id ?? active.value;
    }

    if (event.key === "ArrowUp") {
      active.value = getRelativeActiveItem(-1)?.id ?? active.value;
    }

    if (event.key === "ArrowRight") {
      if (activeItem.value?.items) {
        activeItem.value.show?.(true);

        active.value = activeItem.value.items[0]!.id;
      }
    }
  };
</script>

<style lang="scss">
  pre {
    background-color: #17171c;
    color: #f2f2f2;
    padding: 0.5rem;
    font-size: 0.8rem;
  }
</style>

<!-- 
  item 1
  item 2
  item 3
  SUB
      - item 4
      - item 5
      - SUBSUB
          - item 6
          - item 7
 -->
