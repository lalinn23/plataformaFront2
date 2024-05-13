<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card class="strpied-tabled-with-hover">
            <template slot="header">
              <form action="">
                <div class="form-group ">
                  <label for="nombreC">Ingresa Nuevo Cliente</label>
                  <input type="text" class="form-control" id="nombreC" placeholder="Nombre del cliente" required
                    v-model="form.nombreC">

                </div>
                <div class="d-grid gap-2 mb-2">
                  <button type="button" class="btn btn-primary  separado" @click="fetchClientesAdd">Crear</button>

                </div>
              </form>
              <h2 class="card-title">Listado de clientes</h2>
            </template>


            <div class="table-responsive">
              <table class="table table-hover table-striped">
                <thead>
                  <slot name="columns">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Fecha de Creación</th>
                      <th scope="col">Publicado</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </slot>
                </thead>
                <tbody>
                  <tr v-for="(cliente, index) in paginatedClientes" :key="cliente.id">
                    <!-- Cálculo del número de fila -->
                    <th scope="row">{{ (currentPage - 1) * pageSize + index + 1 }}</th>
                    <td>{{ cliente.nombreC }}</td>
                    <td>{{ cliente.created_at }}</td>
                    <td>{{ cliente.published ? 'Sí' : 'No' }}</td>
                    <td>
                      <button class="btn btn-danger separado" @click="confirmDelete(cliente.id)">Eliminar</button>
                      <button class="btn btn-primary separado" @click="editar(cliente.id)">Editar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Paginación -->
            <nav aria-label="Pagination">
              <ul class="pagination justify-content-end">
                <!-- Botón de página anterior -->
                <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                  <a class="page-link" href="#" @click="previousPage">Back</a>
                </li>
                <!-- Iteración sobre números de página -->
                <li class="page-item" v-for="pageNumber in totalPages" :key="pageNumber"
                  :class="{ 'active': pageNumber === currentPage }">
                  <a class="page-link" href="#" @click="changePage(pageNumber)">{{ pageNumber }}</a>
                </li>
                <!-- Botón de página siguiente -->
                <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                  <a class="page-link" href="#" @click="nextPage">Next</a>
                </li>
              </ul>
            </nav>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from 'src/components/Cards/Card.vue'
export default {
  components: {
    Card
  },
  data() {
    return {
      clientes: [],
      currentPage: 1, // Página actual
      pageSize: 10, // Número de registros por página
      form: {

        "nombreC": ""
      }
    };

  },
  computed: {
    // Método  para calcular registros paginados
    paginatedClientes() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.clientes.slice(startIndex, endIndex);
    },
    // Método  para calcular el número total de páginas
    totalPages() {
      return Math.ceil(this.clientes.length / this.pageSize);
    }
  },
  mounted() {
    // Método que se ejecuta al montar el componente
    this.fetchClientes();
  },
  methods: {
    // Método para obtener clientes de la API
    async fetchClientes() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/cliente/clientes/");
        if (!response.ok) {
          throw new Error("Error al obtener los datos.");
        }
        const data = await response.json();
        this.clientes = data;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    // Método para agrega "POST"
    async fetchClientesAdd() {
      try {
        const token = localStorage.getItem('token'); //pbtener token
        const response = await fetch("http://127.0.0.1:8000/api/cliente/clientes/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Incluir el token en el encabezado
          },
          body: JSON.stringify(this.form),
        });
        if (!response.ok) {
          console.error("error al enviar los datos");
        }
        //actualizar la losta de clientes al agregar un nuevo registro
        this.fetchClientes();

        //limpiamos el formulario despues de hacer el post
        this.form.nombreC = "";

      } catch (error) {
        console.error("Error:", error)
      }
    },

    //Metodo para eliminar
    confirmDelete(clienteId){
      if(confirm("¿Estas seguro de eliminar el cliente?")){
        this.deleteCliente(clienteId);
        }
      },

      async deleteCliente(clienteId){
        try {
          const token = localStorage.getItem('token'); //pbtener token
          const response = await fetch(`http://127.0.0.1:8000/api/cliente/clientes/${clienteId}/`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Incluir el token en el encabezado
          },
          });
          if (!response.ok){
            console.error("error al eliminar los datos");
          }
          //actualiza la tabla
          this.fetchClientes();

        }catch(error){
          console.error("Error:", error);
        }
    },
    editar(id){
      this.$router.push('/clientesEditar/'+ id);
    },
    // Método para ir a la página anterior
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // Método para ir a la página siguiente
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    // Método para cambiar a una página específica
    changePage(pageNumber) {
      this.currentPage = pageNumber;
    }
  }
};
</script>

<style>
.separado {
    margin-right: 10px; /* Ajusta el margen derecho para separar los botones */
}
</style>


