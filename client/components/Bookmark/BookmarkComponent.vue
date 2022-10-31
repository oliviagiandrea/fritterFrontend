<template>
  <article
    class="bookmark"
  >
    <header>
        <h3> Bookmarks for Freet</h3>
        <div
        v-if="$store.state.username !== null"
        class="actions"
      >
       <button
        @click="bookmarkFreet"
       >
       ❤️ Bookmark
      </button>
      <button
        @click="unbookmarkFreet"
       >
       🤍 Unbookmark
      </button>
      </div>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
      <button
        @click="hideBookmarks"
    >
        Hide Bookmarks from Public
    </button>
    <button
        @click="unhideBookmarks"
    >
        Unhide Bookmarks from Public
    </button>
      </div>
    </header>
    <p class="info">
      {{ this.bookmarks }}
    </p>
    <div
        v-if="$store.state.username !== null"
        class="actions"
      >
    <button
        v-if="!showing"
        @click="showBookmarkers"
    >
        Show Bookmarkers
    </button>
    <button
        v-if="showing"
        @click="quitBookmarkers"
    >
        Unexpand Bookmarkers
    </button>
    <section v-if="showing">
    <p>{{ this.bookmarkers }}</p>
    </section>
    </div>
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
    <p
      class="content"
    >
      Number of Bookmarks: {{ this.bookmarks }}
    </p>
</div>
</template> -->

<script>
export default {
  name: 'BookmarkComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showing: false, // Whether or not to see the list of users who bookmarked the freet
      bookmarkers: '',
      bookmarks: '',
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  watch: {
    freet : function(value) {
        // Whenever the prop freet changes, then get the bookmarks again
        this.getBookmarks();
        this.getBookmarkers();
      }
    },
  // watch: {
  //   '$store.state.list': {
  //     handler() {
  //       this.getTodo();
  //     },
  //     immediate: true
  //   } 
  // },
  created() {
      this.getBookmarks();
      this.getBookmarkers();
  },
  methods: {
    async getBookmarks() {
       /**
       * Get the number of bookmarks for a freet.
       */
      const url = `/api/bookmarks/bookmarkcount/${this.freet._id}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        this.bookmarks = res['message']; 
        // const res = await r.json();
        // if (!r.ok) {
        //   throw new Error(res.error);
        // }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async getBookmarkers() {
       /**
       * Get the users who bookmarked a freet.
       */
      const url = `/api/bookmarks/bookmarkusers/${this.freet._id}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        this.bookmarkers = res['names'] ? res['names'] : res['message']; 
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    showBookmarkers() {
      this.showing = true; 
    },
    quitBookmarkers() {
      this.showing = false; 
    },
    async hideBookmarks() {
       /**
       * Hide the bookmark metrics for a freet. 
       */
       const requestOptions = {
            method: 'PUT'
        };
      const url = `/api/bookmarks/hide/${this.freet._id}`;
      try {
        const r = await fetch(url, requestOptions);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.getBookmarks();
        this.getBookmarkers();
        this.$store.commit('alert', {
            message: 'Successfully hid bookmarks!', status: 'success'
          });
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async unhideBookmarks() {
       /**
       * Unhide the bookmark metrics for a freet. 
       */
       const requestOptions = {
            method: 'PUT'
        };
      const url = `/api/bookmarks/unhide/${this.freet._id}`;
      try {
        const r = await fetch(url, requestOptions);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.getBookmarks();
        this.getBookmarkers();
        this.$store.commit('alert', {
            message: 'Successfully unhid bookmarks!', status: 'success'
          });
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    unbookmarkFreet() {
      /**
       * Unbookmarks this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully unbookmarked freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    bookmarkFreet() {
      /**
       * Bookmarks this freet.
       */
      const params = {
        method: 'PUT',
        // message: 'Successfully bookmarked freet!',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully bookmarked freet!', status: 'success'
          });
        }
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
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }
      try {
        const r = await fetch(`/api/bookmarks/bookmark/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.getBookmarks();
        this.getBookmarkers();
        // this.editing = false;
        // this.$store.commit('refreshFreets');
        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.bookmark {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>