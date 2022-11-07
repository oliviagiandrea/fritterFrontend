<!-- Default page that also displays freets -->

<template>
  <main>
    <div class="homeContainer">
      <div class="row">
        <div class="col menuCol">
          <div class="menu">
            <h2>
              Menu
            </h2>
            <router-link to="/">
              Home
            </router-link>
            <router-link v-if="$store.state.username" to="/account">
              Account
            </router-link>
            <router-link v-else to="/login">
              Login
            </router-link>
            <router-link to="/feed">
              Personal Feed
            </router-link>
          </div>
        </div>
        <div class="col freetsCol">
          <div class="freets">
            <section v-if="$store.state.username">
              <header>
                <h2>Welcome @{{ $store.state.username }}</h2>
              </header>
              <CreateFreetForm />
            </section>
            <section v-else>
              <header>
                <h2>Welcome to Fritter!</h2>
              </header>
              <article>
                <h3>
                  <router-link to="/login"> Sign in </router-link>
                  to create, edit, and delete freets.
                </h3>
              </article>
            </section>
            <section>
              <header>
                <div class="left">
                  <h2>
                    Viewing all freets
                    <span v-if="$store.state.filter">
                      by @{{ $store.state.filter }}
                    </span>
                  </h2>
                </div>
                <div class="right">
                  <GetFreetsForm ref="getFreetsForm" value="author" placeholder="🔍 Filter by author (optional)"
                    button="🔄 Get freets" />
                </div>
              </header>
              <section v-if="$store.state.freets.length">
                <div v-for="freet in $store.state.freets">
                  <FreetComponent :key="freet.id" :freet="freet" />
                </div>
              </section>
              <article v-else>
                <h3>No freets found.</h3>
              </article>
            </section>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";
import GetFreetsForm from "@/components/Freet/GetFreetsForm.vue";
import BookmarkComponent from "@/components/Bookmark/BookmarkComponent.vue";

export default {
  name: "FreetPage",
  components: {
    FreetComponent,
    GetFreetsForm,
    CreateFreetForm,
    BookmarkComponent,
  },
  mounted() {
    this.$refs.getFreetsForm.submit();
  },
};
</script>

<style scoped>
main {
  background-color: #F8F4E3;
}

h2 {
  color: #433633;
}

.homeContainer {
  display: flex;
  min-width: 100%;
  justify-content: center;
}

.row {
  display: flex;
  flex-direction: row;
  min-width: 100%;
  justify-content: center;
}

.col {
  display: flex;
  flex-direction: column !important;
}

.menuCol {
  min-width: 15%;
  margin-right: 3rem;
}

.menu {
  border: 1px solid #433633;
  border-radius: 2px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 1rem;
}

.menu h2 {
  font-size: 1.5rem;
  color: #433633;
  font-family: Georgia, 'Times New Roman', Times, serif;
  text-align: center;
  margin-top: 0px;
}

.menu a {
  margin-left: 5px;
  text-decoration: none;
  color: #433633;
  padding-bottom: 0.5rem;
}

.menu a:hover {
  text-decoration: underline;
}

.freetsCol {
  min-width: 60%;
}

section {
  display: flex;
  flex-direction: column;
}

header,
header>* {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
