<template>
  <article class="sources">
    <header>
      <h3>Sources for Freet</h3>

      <div v-if="$store.state.username !== null" class="actions">
        <p>Add a new source:</p>
        <input v-model="toAdd" />
        <button @click="addSource">Add Source</button>
      </div>

      <div v-if="$store.state.username === freet.author" class="actions">
        <p>Remove an existing source:</p>
        <input v-model="toDelete" />
        <button @click="removeSource">Remove Source</button>
      </div>
    </header>
    <section>
      <p class="info">
        <!-- Sources: {{ this.sources }} -->
        <li v-for="item in this.sources">
          {{ item }}
        </li>
      </p>
    </section>
    <section class="alerts">
      <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>


<script>
export default {
  name: 'SourceComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showing: false,
      sources: [],
      toAdd: '',
      toDelete: '',
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  watch: {
    freet: function (value) {
      // Whenever the prop freet changes, then get its sources again
      this.getSources();
    }
  },
  created() {
    this.getSources();
  },
  methods: {
    isValidUrl(str) {
      let url;
      try {
        url = new URL(str);
      } catch (_) {
        return false;
      }
      return true;
    },

    async getSources() {
      /**
      * Get the sources for a freet.
      */
      const url = `/api/source/${this.freet._id}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        this.sources = res;
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async addSource() {
      /**
      * Add a source to a freet.
      */
      if (!this.isValidUrl(this.toAdd)) {
        const error = 'Error: Entered source should be a valid website url.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ source: this.toAdd })
      };
      const url = `/api/source/${this.freet._id}`;
      try {
        const r = await fetch(url, requestOptions);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.getSources();
        this.$set(this.alerts, 'Successfully added your source!', 'success');
        setTimeout(() => this.$delete(this.alerts, 'Successfully added your source!'), 3000);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async removeSource() {
      /**
      * Remove a source from a freet. 
      */
      if (!this.toDelete.length) {
        const error = 'Error: Entered source should not be empty.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ source: this.toDelete })
      };
      const url = `/api/source/${this.freet._id}`;
      try {
        const r = await fetch(url, requestOptions);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.getSources();
        this.$set(this.alerts, 'Successfully removed a source!', 'success');
        setTimeout(() => this.$delete(this.alerts, 'Successfully removed a source!'), 3000);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.sources {
  border: 1px solid #000;
  padding: 10px;
  position: relative;
}
</style>