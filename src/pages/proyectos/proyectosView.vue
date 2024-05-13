<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <card class="strpied-tabled-with-hover">
                        <template slot="header">
                            <h4 class="card-title">Lista de Proyectos</h4>
                            <button class="btn btn-success align-right" @click="crear()">Agregar</button>
                        </template>
                        <div class="table-responsive">
                            <table class="table table-hover table-striped">
                                <thead>
                                    <slot name="columns">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Nombre Del Proyectos</th>
                                            <th scope="col">Cliente</th>
                                            <th scope="col">Acciones</th>
                                        </tr>
                                    </slot>
                                </thead>
                                <tbody>
                                    <tr v-for="(proyecto, index) in paginatedProyecto" :key="proyecto.id">
                                        <!-- Cálculo del número de fila -->
                                        <th scope="row">{{ (currentPage - 1) * pageSize + index + 1 }}</th>
                                        <td>{{ proyecto.nombreP }}</td>
                                        <td>{{ proyecto.cliente ? proyecto.cliente.nombreC : 'N/A' }}</td>
                                        <td>
                                        <button class="btn btn-danger separado" @click="confirmDelete(proyecto.id)">Eliminar</button>
                                        <button class="btn btn-primary separado" @click="editar(proyecto.id)">Editar</button>
                                        
                                    </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Botón para descargar -->
                      <!--   <button class="btn btn-primary" @click="downloadTxt">Descargar como TXT</button> -->
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
            proyectos: [],
            currentPage: 1, // Página actual
            pageSize: 10 // Número de registros por página
        };
    },
    computed: {
        // Método  para calcular registros paginados
        paginatedProyecto() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.proyectos.slice(startIndex, endIndex);
        },
        // Método  para calcular el número total de páginas
        totalPages() {
            return Math.ceil(this.proyectos.length / this.pageSize);
        }
    },
    mounted() {
        // Método que se ejecuta al montar el componente
        this.fetchproyectos();
    },
    methods: {
        // Método para obtener clientes de la API
        async fetchproyectos() {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/pro/proyectos/");
                if (!response.ok) {
                    throw new Error("Error al obtener los datos.");
                }
                const data = await response.json();
                this.proyectos = data;
            } catch (error) {
                console.error("Error:", error);
            }
        },
        crear(){
            this.$router.push('proyectosAdd');
        },
        confirmDelete(proyectoId){
            if(confirm("¿Estas Seguro de eliminar el proyecto? ")){
                this.deleteProyecto(proyectoId);
            }
        },

        async deleteProyecto(proyectoId){
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/pro/proyectos/${proyectoId}/`, {
                    method: 'DELETE'
                });
                if (!response.ok){
                    console.error("Error al eliminar los datos");
                }
                //actualiza la tabla
                this.fetchproyectos();
            }catch(error){
                console.error("Error", error);
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
        },
        
    }
};
</script>

<style>
.align-right {
  float: right;
}
</style>
