<template>
  <article class="bookmark">
    <header>
      <div v-if="$store.state.username !== null" class="actions">
        <button @click="bookmarkFreet">Bookmark</button>
        <button @click="unbookmarkFreet">Unbookmark</button>
      </div>
    </header>
    <p class="info">
      {{ this.bookmarks }}
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<!-- <template>
    <div>
    <button
        v-if="bookmarked"
        @click="unbookmarkFreet"
    >
        Unbookmark
    </button>
    <button
        v-if="!bookmarked"
        @click="bookmarkFreet"
    >
        Bookmark
    </button>
</div>
</template> -->

<script>
export default {
  name: "BookmarkComponent",
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    unbookmarkFreet() {
      /**
       * Unbookmarks this freet.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully unbookmarked freet!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    bookmarkFreet() {
      /**
       * Bookmarks this freet.
       */
      const params = {
        method: "POST",
        // message: 'Successfully bookmarked freet!',
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully bookmarked freet!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the Bookmark object's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }
      try {
        const r = await fetch(
          `/api/bookmarks/${this.freet._id}`,
          options
        );
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.bookmark {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
</style>
