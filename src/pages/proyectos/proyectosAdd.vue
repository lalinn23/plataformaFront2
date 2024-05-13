<template>
  <div class="content">
      <div class="container-fluid">
          <div class="row">
              <div class="col-md-6 offset-md-3">
                  <card class="strpied-tabled-with-hover shadow">
                      <div class="card-body">
                          <h1 class="card-title">Agregar <span class="resaltado">Proyecto</span></h1>
                          <br>
                          <!-- Formulario para agregar un nuevo proyecto -->
                          <form @submit.prevent="crearProyecto">
                              <div class="form-group">
                                  <label for="nombre">Nombre del Proyecto:</label>
                                  <input type="text" id="nombre" v-model="nombreProyecto" class="form-control">
                              </div>
                              <div class="form-group">
                                  <label for="cliente">Cliente:</label>
                                  <select v-model="clienteSeleccionado" class="form-control" required>
                                      <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">{{ cliente.nombreC }}</option>
                                  </select>
                              </div>
                              <br>
                              <div class="d-grid gap-2 mb-2">
                                  <button type="submit" class="btn btn-primary separado">Crear Proyecto</button>
                                  <button type="button" class="btn btn-success separado" v-on:click="salir()">Atrás</button>
                              </div>
                              <!-- Mostrar mensaje de error si lo hay -->
                              <div v-if="error" class="alert alert-danger" role="alert">
                                  {{ error }}
                              </div>
                          </form>
                      </div>
                  </card>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Card from 'src/components/Cards/Card.vue' 
import axios from 'axios'; 
export default {
  components: {
      Card
  },
  data() {
      return {
          nombreProyecto: '', 
          clienteSeleccionado: null, 
          clientes: [], 
          error: '' 
      };
  },

  mounted() {
      this.fetchClientes();
  },

  methods: {
      // Método para obtener clientes
      fetchClientes() {
          axios.get('http://127.0.0.1:8000/api/cliente/clientes/')
              .then(response => {
                  // Asignar los clientes obtenidos al array 'clientes'
                  this.clientes = response.data;
                  console.log(response.data);
              })
              .catch(error => {
                  // Manejar errores si no se pueden obtener los clientes
                  console.error('Error al obtener clientes: ', error);
              });
      },
    
      salir() {
          this.$router.push('/admin/proyectosView');
      },
      // Método para crear un nuevo proyecto
      crearProyecto() {
          // Verificar si se proporciona el nombre del proyecto
          if (!this.nombreProyecto.trim()) {
              this.error = 'Por favor, ingresa un nombre para el proyecto.';
              return;
          }

          // Crear objeto proyecto con nombre del proyecto e ID del cliente seleccionado
          const proyecto = {
              nombreP: this.nombreProyecto,
              cliente_id: this.clienteSeleccionado
          };
          axios.post('http://127.0.0.1:8000/api/pro/proyectos/', proyecto)
              .then(response => {
                  // Redirigir a la vista de proyectos después de la creación exitosa del proyecto
                  console.log('Proyecto creado:', response.data);
                  this.$router.push("/admin/proyectosView");
              })
              .catch(error => {
                  // Manejar errores si no se puede crear el proyecto
                  console.error('Error al crear proyecto: ', error);
              });
      }
  }
};
</script>

<style scoped>
h1 {
  font-family: fantasy; 
}
.titulo {
  color: black; 
}

.resaltado {
  color: #2bbb2f; 
}
.separado {
  margin-right: 20px; 
  margin-bottom: 10px; 
}
</style>
