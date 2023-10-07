<template>
  <button :id="id" :style="style" @click="$emit('click')">
    <slot />
  </button>
</template>

<script lang="ts" setup>
  import { computed, onBeforeMount, inject } from "vue";
  import { v4 as uuid } from "uuid";

  import type { ParentMenu } from "./types";
  import { ParentMenuKey } from "./keys";

  export interface MenuItemProps {
    id?: string;
  }

  const props = withDefaults(defineProps<MenuItemProps>(), {
    id: () => uuid(),
  });

  const emit = defineEmits<{
    click: [];
  }>();

  const menu = inject<ParentMenu | undefined>(ParentMenuKey, undefined);

  onBeforeMount(() => {
    menu?.addItem({
      id: props.id,
      onClick: () => emit("click"),
    });
  });

  const style = computed(() => {
    if (!menu?.activeItem.value) {
      return "";
    }

    if (menu.activeItem.value === props.id) {
      return "background-color: red !important";
    }

    if (menu.activePath.value.includes(props.id)) {
      return "background-color: #dedede";
    }

    return "";
  });
</script>
