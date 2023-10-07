<template>
  <div class="container">
    <MenuContext id="root">
      <Menu id="menu-1">
        <template #button>
          <MenuButton>Menu</MenuButton>
        </template>

        <MenuItem id="0" @click="c('item 0')">Item 0</MenuItem>

        <Menu id="menu-nested">
          <template #button>
            <MenuButton>Submenu</MenuButton>
          </template>

          <MenuItem id="1" @click="c('item 1')">Item 1</MenuItem>
          <MenuItem id="2" @click="c('item 2')">Item 2</MenuItem>
        </Menu>

        <MenuItem id="3" @click="c('item 3')">Item 3</MenuItem>
      </Menu>
    </MenuContext>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import { Menu, MenuContext, MenuItem, MenuButton } from "./components/menu";

  const c = (msg: string) => console.log(msg);
</script>

<style lang="scss">
  .container {
    // display: grid;
    // place-content: center;
    padding: 5rem 15rem;
  }

  .menu {
    background-color: white;
    border-radius: 0.175rem;
    border: 1px solid rgb(237, 237, 237);
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    display: grid;
    min-width: 10rem;
    max-width: 14rem;

    button {
      border-radius: 0.175rem;
      padding: 0.5rem 1rem;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      width: 100%;

      &:hover {
        background-color: rgb(230, 230, 230);
      }
    }
  }

  .menu {
    // opacity: 0;
  }
</style>
./components/menu/index
