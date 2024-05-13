<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <card class="strpied-tabled-with-hover">
                        <template slot="header">
                            <form action="">
                                <div class="form-group">
                                    <label for="nombreF">Agregar Fase</label>
                                    <input type="text" class="form-control" id="nombreF" placeholder="Nombre de la fase" required 
                                    v-model="form.nombreF"/>
                                </div>
                                <div class="d-grid gap-2 mb-2">
                                    <button type="button" class="btn btn-primary separado" @click="fetchFasesAdd"> Crear</button>
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
                                            <th scope="col">Acciones</th>
                                        </tr>
                                    </slot>
                                </thead>
                                <tbody>
                                    <tr v-for="(fase, index) in paginatedFases" :key="fase.id">
                                        <!-- Cálculo del número de fila -->
                                        <th scope="row">
                                            {{ (currentPage - 1) * pageSize + index + 1 }}
                                        </th>
                                        <td>{{ fase.nombreF }}</td>
                                        <td>
                                            <button class="btn btn-danger separado" @click="confirmDelete(fase.id)">Eliminar</button>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Botón para descargar -->
                          <button class="btn btn-primary separado" @click="downloadTxt">Descargar como TXT</button>
                          <button class="btn btn-success separado" @click="downloadExcel">Descargar como excel</button>
                          <button class="btn btn-danger" @click="downloadPdf">Descargar como PDF</button>
                        <!-- Paginación -->
                        <nav aria-label="Pagination">
                            <ul class="pagination justify-content-end">
                                <!-- Botón de página anterior -->
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <a class="page-link" href="#" @click="previousPage">Back</a>
                                </li>
                                <!-- Iteración sobre números de página -->
                                <li class="page-item" v-for="pageNumber in totalPages" :key="pageNumber"
                                    :class="{ active: pageNumber === currentPage }">
                                    <a class="page-link" href="#" @click="changePage(pageNumber)">{{ pageNumber }}</a>
                                </li>
                                <!-- Botón de página siguiente -->
                                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
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
import Card from "src/components/Cards/Card.vue";
import * as XLSX from 'xlsx'; //formato en exel //formato en exel
import jsPDF from 'jspdf'
import 'jspdf-autotable';

export default {
    components: {
        Card,
    },
    data() {
        return {
            fases: [],
            currentPage: 1, // Página actual
            pageSize: 10, // Número de registros por página
            form: {
                "nombreF":""
            }
        };
    },
    computed: {
        // Método  para calcular registros paginados
        paginatedFases() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.fases.slice(startIndex, endIndex);
        },
        // Método  para calcular el número total de páginas
        totalPages() {
            return Math.ceil(this.fases.length / this.pageSize);
        },
    },
    mounted() {
        // Método que se ejecuta al montar el componente
        this.fetchFases();
    },
    methods: {
        // Método para obtener 
        async fetchFases() {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/fase/fases/");
                if (!response.ok) {
                    throw new Error("Error al obtener los datos.");
                }
                const data = await response.json();
                this.fases = data;
            } catch (error) {
                console.error("Error:", error);
            }
        },
        //metodo para agregar
        async fetchFasesAdd(){
            try {
                const response = await fetch("http://127.0.0.1:8000/api/fase/fases/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.form),
                });
                if (!response.ok){
                    console.error("error al enviar los datos");
                }
                //actulizamos la lista
                this.fetchFases();

                //limpiamos el formulario
                this.form.nombreF = "";
            }catch(error){
                console.error("ERROR:". error)
            }
        },
        
        // METODO PARA ELIMINAR

        confirmDelete(faseId){
            if(confirm("¿Estas seguro que deseas eliminar la fase?")){
                this.deleteFase(faseId);
            }
        },

        async deleteFase(faseId){
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/fase/fases/${faseId}/`, {
                    method: 'DELETE'
                });
                if(!response.ok){
                    console.error("Error al eliminar los datos");
                }
                //actualizar la tabla
                this.fetchFases();

            }catch(error){
                console.Console.error("Error:", error);
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
        downloadTxt() {
            // Obtener los encabezados de las columnas
            const headers = ["#", "Nombre"];

            // Obtener el contenido de las filas
            const rows = this.fases.map((fase, index) => [
                (this.currentPage - 1) * this.pageSize + index + 1,
                fase.nombreF,
            ]);

            // Unir los encabezados y las filas en un solo array
            const content = [headers, ...rows]
                .map((row) => row.join("\t"))
                .join("\n");

            // Crear el archivo de texto y descargarlo
            const element = document.createElement("a");
            const file = new Blob([content], { type: "text/plain" });
            element.href = URL.createObjectURL(file);
            element.download = "catalogo_fases.txt";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
        },

        //funcion para descargar en excel
        downloadExcel(){
            //creamos la hoja de exel
           const wb = XLSX.utils.book_new();

            //convierte los datos en una matris
            const wsData = [
                ["#", "Nombre"],
                ...this.fases.map((fase, index) => [
                    (this.currentPage - 1) * this.pageSize + index + 1,
                    fase.nombreF,
                ])
            ];

            //crear una hoja de trabajo
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // agregar la hoja de trabajo al libro
            XLSX.utils.book_append_sheet(wb, ws, "Fases");

            //convertir el archivo de excel en un archivo binario
            const wbBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

            // crear un blob a partir del archivo binario(para descargar)
            const blob = new Blob([s2ab(wbBinary)], { type: 'application/octet-stream'});

            //crear enlace para descargar el archivo
            const element = document.createElement('a');
            element.href = URL.createObjectURL(blob);
            element.download = 'catalago_fases.xlsx';
            element.click();

            // eliminar el enlace despues de descarga
            setTimeout(() => {
                if (document.body.contains(element)) {
                    document.body.removeChild(element);
                }
            }, 100);

            function s2ab(s){
                const buf = new ArrayBuffer(s.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i < s.length; i++) {
                    view[i] = s.charCodeAt(i) & 0xFF;
                }
                return buf;
            }
        },

        //METODO PARA DESCARGAR POR PDF
        downloadPdf(){
            // Obtiene la fecha actual
            const currentDate = new Date();
            
            // Formatea la fecha como "DD/MM/YYYY"
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            
            //crea un nuevo docuemnto
            const doc = new jsPDF();

            // Calcula la posición de la fecha en el lado derecho del documento
            const dateWidth = doc.getStringUnitWidth(formattedDate) * doc.internal.getFontSize(); // Ancho de la fecha
            const docWidth = doc.internal.pageSize.getWidth(); // Ancho del documento
            const dateX = docWidth - dateWidth - 10; // Posición X de la fecha

            //titulo
            doc.text("Catalogo de fases", 10, 10);
           
            
            // Fecha en el lado derecho
            doc.text(formattedDate, dateX, 10);

            // Línea divisoria
            doc.line(0, 12, docWidth, 12);

            // encabezados de la tabla
            const headers = ["#", "Nombre"];

            // obtener filas de la tabla
            const rows = this.paginatedFases.map((fase, index) => [
                (this.currentPage - 1) * this.pageSize + index + 1,
                fase.nombreF,
            ]);

            //configurar la tabla
            doc.autoTable({
                theme: 'grid',
                head: [headers],
                body: rows,
                starlY: 20, //posiscion inicial de la tabla
                
            });

            //guardar
            doc.save(`Catalogo_fases_${formattedDate}.pdf`);
        },

        
    },
    
};
</script>

<style>
/* Agrega estilos CSS según sea necesario */
</style>
