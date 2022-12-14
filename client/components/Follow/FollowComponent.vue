<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="follow">
    <header>
      <h3 class="user">@{{ user.username }}</h3>
    </header>
    <p class="info">Followers: {{ this.followers }}</p>
    <p class="info">Following: {{ this.following }}</p>
    <div
      v-if="
        $store.state.username !== null &&
        $store.state.username !== user.username
      "
      class="actions"
    >
      <button @click="followUser">Follow</button>
      <button @click="unfollowUser">Unfollow</button>
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

<script>
export default {
  name: "FollowComponent",
  props: {
    // Data from the stored user
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      followers: "",
      following: "",
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  created() {
    this.getFollowers();
    this.getFollowing();
  },
  methods: {
    async getFollowers() {
      /**
       * Get the followers for a user
       */
      const url = `/api/follow/follows/${this.user.username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        this.followers = res["response"]; 
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async getFollowing() {
      /**
       * Get accounts being followed by a user
       */
      const url = `/api/follow/following/${this.user.username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        this.following = res["response"]; 
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async unfollowUser() {
      /**
       * Logged in user unfollows another user
       */
      const requestOptions = {
        method: "DELETE",
      };
      const url = `/api/follow/followuser/${this.user.username}`;
      try {
        const r = await fetch(url, requestOptions);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.getFollowers();
        this.getFollowing();
        this.$store.commit("alert", {
          message: `Successfully unfollowed ${this.user.username}!`,
          status: "success",
        });
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async followUser() {
      /**
       * Logged in user follows another user
       */
      const requestOptions = {
        method: "PUT",
      };
      const url = `/api/follow/followuser/${this.user.username}`;
      try {
        const r = await fetch(url, requestOptions);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.getFollowers();
        this.getFollowing();
        this.$store.commit("alert", {
          message: `Successfully followed ${this.user.username}!`,
          status: "success",
        });
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  },
};
</script>

<style scoped>
.follow {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
</style>
