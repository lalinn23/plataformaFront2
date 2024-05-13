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
                   v-model="form.nombreE" >

                </div>
                <div class="d-grid gap-2 mb-2">
                  <button type="button" class="btn btn-primary  separado" @click="fecthEtapasAdd">Crear</button>

                </div>
              </form>
              <h2 class="card-title">Catalogo de Etapas</h2>
            </template>


            <div class="table-responsive">
              <table class="table table-hover table-striped">
                <thead>
                  <slot name="columns">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </slot>
                </thead>
                <tbody>
                  <tr v-for="(etapa, index) in paginatedEtapas" :key="etapa.id">
                    <!-- Cálculo del número de fila -->
                    <th scope="row">{{ (currentPage - 1) * pageSize + index + 1 }}</th>
                    <td>{{ etapa.nombreE }}</td>
                    <td>
                      <button class="btn btn-danger separado" @click="confirmDelete(etapa.id)">Eliminar</button>
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
                <li class="page-item" v-for="pageNumber in totalPages" :key="pageNumber" :class="{ 'active': pageNumber === currentPage }">
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
      etapas: [],
      currentPage: 1, // Página actual
      pageSize: 10, // Número de registros por página
      form: {
        "nombreE": ""
      }
    };
  },
  computed:{
   // Método  para calcular registros paginados
   paginatedEtapas() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.etapas.slice(startIndex, endIndex);
    },
    // Método  para calcular el número total de páginas
    totalPages() {
      return Math.ceil(this.etapas.length / this.pageSize);
    }
  },
  mounted(){
    this.fetchEtapas();
  },
  methods:{
    async fetchEtapas(){
      try {
        const response = await fetch("http://127.0.0.1:8000/api/etapa/etapas/");
        if(!response.ok){
          throw new Error("Error al obtener los datos.");
        }
        const data = await response.json();
        this.etapas = data;
      } catch (error){
        console.error("error:", error);
      }
    },
    //Agregar
    async fecthEtapasAdd(){
      try{
        const response = await fetch("http://127.0.0.1:8000/api/etapa/etapas/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify(this.form),
        });
        if (!response.ok) {
          console.error("Error al enviar los datos");
        }
        //actualizamos la lista
        this.fetchEtapas();

        //LIMPIAMOS EL FORMULARIO
        this.form.nombreE = "";

      } catch(error){
        console.log("Error:", error)
      }
    },
    confirmDelete(etapaId){
      if(confirm("Estas Seguro de eliminar una etapa")){
        this.deleteEtapa(etapaId);
      }
    },

    async deleteEtapa(etapaId){
      try{
        const response = await fetch(`http://127.0.0.1:8000/api/etapa/etapas/${etapaId}/`, {
          method: 'DELETE'
        });
        if(!response.ok){
          console.error("error al eliminar los datos");
        }
        //actualiza la tabla
        this.fetchEtapas();
      }catch(error){
        console.error("Error:", error);

      }

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

</style>