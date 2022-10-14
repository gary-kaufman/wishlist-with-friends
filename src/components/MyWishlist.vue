<template>
  <main class="container mx-auto max-w-3xl flex flex-col">
    <h1 class="text-xl">My Wishlist</h1>
    <section id="AddItemForm">
      <form class="container flex flex-col m-2">
        <input type="text" placeholder="Item Title" />
        <input type="text" placeholder="Item URL" />
        <button class="bg-green-400 w-24 ml-auto">Add Item</button>
      </form>
    </section>
    <section id="ItemList">
      <ul>
        <li class="flex flex-col">
          <h2 class="text-lg">Item Title</h2>
          <a>Item URL</a>
          <button class="bg-blue-400 w-24 ml-auto">Mark as Purchased</button>
        </li>
        <li class="flex flex-col" s>
          <h2 class="text-lg">Item 2 Title</h2>
          <a>Item URL</a>
          <button class="bg-blue-400 w-24 ml-auto">Mark as Purchased</button>
        </li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts">
export default {
  name: "MyWishlist",
};
</script>

<style>
li {
  margin-top: 0.5em;
  margin-bottom: 1em;
}
</style>
