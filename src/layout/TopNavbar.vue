<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Panel De Control</a>
      <button type="button"
              class="navbar-toggler navbar-toggler-right"
              :class="{toggled: $sidebar.showSidebar}"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
              @click="toggleSidebar">
 
      </button>
      
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="nav navbar-nav mr-auto">
          <li class="nav-item">
            
          </li>
        </ul>

        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a href="#" class="nav-link">
              Log out
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  export default {
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    data () {
      return {
        activeNotifications: false
      }
    },
    methods: {
      //Capitaliza la primera letra de una cadena.
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      //Cambia el estado de activeNotifications para mostrar u ocultar las notificaciones.
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      // cierra el dropdown de notificaciones.
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        //llama a una función displaySidebar que parece ser proporcionada por otro componente ($sidebar) para mostrar u ocultar la barra lateral.
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        //se utiliza para ocultar la barra lateral.
        this.$sidebar.displaySidebar(false)
      }
    }
  }

</script>
<style>

</style>
