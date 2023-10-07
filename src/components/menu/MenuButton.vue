<template>
  <button
    :id="menu?.id"
    :style="style"
    :tabindex="menu?.root ? 0 : -1"
    class="menu-button"
    @keydown="onKeyDown"
    @click="menu?.toggle()">
    <slot />
  </button>
</template>

<script lang="ts" setup>
  import { computed, onBeforeMount, inject } from "vue";

  import type { ParentMenu } from "./types";
  import { ParentMenuKey } from "./keys";

  const menu = inject<ParentMenu | undefined>(ParentMenuKey, undefined);

  onBeforeMount(() => {
    menu?.addItem({
      id: menu.id,
      hasChildren: true,
    });
  });

  const onKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    if (!menu?.root) {
      return;
    }

    if (["Enter", " ", "ArrowDown"].includes(event.key)) {
      menu?.open();
    }

    if (["Escape"].includes(event.key)) {
      menu?.close();
    }
  };

  const style = computed(() => {
    if (!menu) {
      return "";
    }

    const [lastActive] = menu.activePath.value.slice(-1);

    if (lastActive === menu?.id) {
      return "background-color: red !important";
    }

    if (menu.activePath.value.includes(menu?.id)) {
      return "background-color: #dedede";
    }

    return "";
  });
</script>

<style lang="scss" scoped>
  .menu-button {
    background-color: pink;
  }
</style>
