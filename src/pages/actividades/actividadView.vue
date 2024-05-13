<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <card class="strpied-tabled-with-hover">
                        <template slot="header">
                            <h4 class="card-title">Bitacora de actividades</h4>
                            <button class="btn btn-success align-right" @click="crear()" >Agregar</button>
                            <button class="btn btn-primary separado align-right" >Descargar como Excel</button>
                        </template>
                        <div class="table-responsive">
                            <table class="table table-hover table-striped">
                                <thead>
                                    <slot name="columns">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Lider</th>
                                            <th scope="col">Consultor</th>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Proyecto</th>
                                            <th scope="col">Actividad</th>
                                            <th scope="col">Fase</th>
                                            <th scope="col">Etapa</th>
                                            <th scope="col">Descripcion</th>
                                            <th scope="col">Horas</th>
                                        </tr>
                                    </slot>
                                </thead>
                                <tbody>
                                    <tr v-for="(actividad, index) in paginatedActividad" :key="actividad.id">
                                        <!-- Cálculo del número de fila -->
                                        <th scope="row">{{ (currentPage - 1) * pageSize + index + 1 }}</th>
                                        <td>{{ actividad.lider }}</td>
                                        <td>{{ actividad.user ? actividad.user.username : 'N/A' }}</td>
                                        <td>{{ actividad.created_at }}</td>
                                        <td>{{ actividad.proyecto ? actividad.proyecto.nombreP : 'N/A' }}</td>
                                        <td>{{ actividad.actividad  }}</td>
                                        <td>{{ actividad.fase ? actividad.fase.nombreF : 'N/A' }}</td>
                                        <td>{{ actividad.etapa ? actividad.etapa.nombreE : 'N/A' }}</td>
                                        <td>{{ actividad.descripcion }}</td>
                                        <td>{{ actividad.hora }}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="9" class="text-end">Total Horas:</th>
                                        <td>{{ totalHoras }}</td>
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
            actividades: [],
            totalHoras: 0,
            currentPage: 1, // Página actual
            pageSize: 10 // Número de registros por página
        };
    },
    computed: {
        // Método  para calcular registros paginados
        paginatedActividad() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.actividades.slice(startIndex, endIndex);
        }, 
        // Método  para calcular el número total de páginas
        totalPages() {
            return Math.ceil(this.actividades.length / this.pageSize);
        }
    },
    mounted() {
        // Método que se ejecuta al montar el componente
        this.fetchActividad();
    },
    methods: {

        crear(){
            this.$router.push('actividadAdd');
        },
        // Método para obtener clientes de la API
        async fetchActividad() {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/act/actividad/");
                if (!response.ok) {
                    throw new Error("Error al obtener los datos.");
                }
                const data = await response.json();
                this.actividades = data;
                this.totalHoras = this.calcularTotalHoras(data);
               
            } catch (error) {
                console.error("Error:", error);
            }
        },
        // calcular las horas 
        calcularTotalHoras(actividades) {
            return actividades.reduce((total, actividad) => total + parseFloat(actividad.hora), 0);
        },

        //para descargar el archvio en Excel
        
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
.separado {
    margin-right: 20px; /* Ajusta el margen derecho para separar los botones */
    margin-bottom: 10px;
}
</style>
