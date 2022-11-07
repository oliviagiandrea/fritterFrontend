<template>
  <article class="bookmark">
    <header>
      <div v-if="$store.state.username !== null" class="actions">
        <button @click="bookmarkFreet">Bookmark</button>
        <button style="margin-left: 1rem;" @click="unbookmarkFreet">Unbookmark</button>
      </div>
    </header>
    <section class="alerts">
      <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

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
        body: JSON.stringify({ freetId: this.freet._id }),
        callback: () => {
          this.$set(this.alerts, 'Successfully unbookmarked freet!', 'success');
          setTimeout(() => this.$delete(this.alerts, 'Successfully unbookmarked freet!'), 3000);
        },
      };
      console.log(this);
      this.request(params);
    },
    bookmarkFreet() {
      /**
       * Bookmarks this freet.
       */
      console.log(this);
      const params = {
        method: "POST",
        body: JSON.stringify({ freetId: this.freet._id }),
        callback: () => {
          this.$set(this.alerts, 'Successfully bookmarked freet!', 'success');
          setTimeout(() => this.$delete(this.alerts, 'Successfully bookmarked freet!'), 3000);
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
        console.log(params.body);
        options.body = params.body;
      }
      try {
        const r = await fetch(
          `/api/bookmarks`,
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

button {
  background-color: #433633;
  color: white;
  border-radius: 5px;
  border-color: #433633;
  border-width: 1px;
  padding: 0.4rem 0.7rem;
}

button:hover {
  background-color: #594844;
  border-color: #594844;
  border-width: 1px;  
  cursor: pointer;
}
</style>
