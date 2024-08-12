<script setup>

import { ref, onMounted, computed} from "vue";
import { useRoute, useRouter  } from "vue-router";
import axios from "axios";
import * as XLSX from 'xlsx';

const route = useRoute();
const router = useRouter();

const InscProgramaData = ref({
  Cod_Programa:route.query.Cod_Programa,
  Nombre: route.query.Nombre,
});

const headers = ref([
  { title: 'Documento de identidad',text: 'Documento de identidad',align: 'start',
          sortable: false,
          key: 'num_doc' },
  { title:'Nombres', text: 'Nombres', value: 'nombres' },
  { title:'Apellidos', text: 'Apellidos', value: 'apellidos' },
  { title:'Genero', text: 'Genero', value: 'genero' },
  { title:'Fecha Nacimiento', text: 'Fecha Nacimiento', value: 'fecha_nac' },
  { title:'Domicilio', text: 'Domicilio', value: 'domicilio' },
  { title:'Telefono', text: 'Telefono', value: 'telefono' },
  { title:'Correo', text: 'Correo', value: 'correo' },
  { title:'Ciudad', text: 'Nombres', value: 'ciudad_residencia' },
  { title:'Grado Academico', text: 'Genero', value: 'grado_academico' },
  { title:'Institucion egreso', text: 'Fecha Nacimiento', value: 'institucion_egreso' },
  { title:'Profesion', text: 'Domicilio', value: 'profesion' },
  { title:'Nombre asesor', text: 'Asesor', value: 'nombre' },
  { title:'Fecha reg.', text: 'Fecha reg.', value: 'fecha_reg' },
  { title: 'Opciones', key: 'options', sortable: false },
]); 
const registrosEstudiantes = ref([]);
const filtroProfesion = ref(null);
const filtroCiudadResidencia = ref(null);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("");

//Muestra las inscripciones por programa
const inscripcionesPrograma = async () => {
  try {
    const response = await axios.get('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/inscripciones_por_programa', {

   // const response = await axios.get('http://localhost:3000/api/inscripciones_por_programa', {
      params: { Cod_Programa: InscProgramaData.value.Cod_Programa }
    });
    registrosEstudiantes.value = response.data;
  } catch (error) {
    console.error('Eroor no se encontró la portada del programa', error);
  }
};
// Inicializar registros y verificar certificados
onMounted(() => {
  inscripcionesPrograma();
});
// Función para actualizar la tabla
const initialize = async () => {
  await inscripcionesPrograma();
};
// exportar excel
const exportToExcel = () => {
  if (!registrosEstudiantes.value.length) {
    console.error('No hay datos para exportar.');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(registrosEstudiantes.value.map(item => ({
    Nombres: item.nombre,
    Apellidos: item.apellidoPersona,
    Fecha_naciemiento: item.fecha_nacimiento,
    codigo_empaste:item.codigo_empaste,
    inicio_tramite:item.inicio_tramite,
    estado: item.estado,
    profesion: item.profesion,
    tipo: item.tipo,
    ciudad_residencia: item.ciudad_residencia,
    sede:item.sede,
    fechaInscripcion:item.fechaInscripcion,

  })));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registros");
  XLSX.writeFile(wb, "Registros.xlsx");
};

const registrosFiltrados = computed(() => {
  return registrosEstudiantes.value.filter(registro => {
    const ProfesionMatch = !filtroProfesion.value || registro.profesion === filtroProfesion.value;
    const ciudadResidenciaMatch = !filtroCiudadResidencia.value || registro.ciudad_residencia === filtroCiudadResidencia.value;

    return ProfesionMatch && ciudadResidenciaMatch;

  })
})
function aplicarFiltros() {
  // Este método se llama cuando se cambian los filtros
  console.log('Aplicando filtros:', { Area: filtroProfesion.value })
}

  // Funcion para limpiar los filtros 
function limpiarFiltros() {
  //rangoFecha.value = [];
  filtroProfesion.value = null;
  filtroCiudadResidencia.value = null;
}
// Obtener las Profesiones para el filtrado
const itemProfesion = computed(() => {
  const Profesiones = registrosEstudiantes.value.map(item => item.profesion);
  return [...new Set(Profesiones)];
});
// Obtener los ciudadResidencia para el filtrado
const itemCiudadResidencia = computed(() => {
  const ciudadResidencia = registrosEstudiantes.value.map(item => item.ciudad_residencia);
  return [...new Set(ciudadResidencia)];
});

// Descargar el formulario
const descargarFormulario = (item) => {
  // Suponiendo que el campo apellidos contiene ambos apellidos separados por un espacio
  const [apellidoPaterno, apellidoMaterno] = item.apellidos.split(' '); // Asumiendo que el formato es "ApellidoPaterno ApellidoMaterno"
  router.push({
    name: 'admin-formulario-ins',
    query: {
      num_doc: item.num_doc,
      nombres: item.nombres,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno: apellidoMaterno,
      genero: item.genero,
      fecha_nac: item.fecha_nac,
      domicilio: item.domicilio,
      telefono: item.telefono,
      correo: item.correo,
      ciudad_residencia: item.ciudad_residencia,
      grado_academico: item.grado_academico,
      institucion_egreso: item.institucion_egreso,
      profesion: item.profesion,
      programa:item.programa

    }
  });
};


</script>

<template>
  <v-btn color="blue" variant="flat" :to="{ name: 'admin-reg-programa' }">Registrar Programa</v-btn>

  <h2 class="text-center text-h5 font-weight-bold">{{ InscProgramaData.Nombre }}</h2>

  <v-data-table 
  class="data-table"   
  :headers="headers" 
  :items="registrosFiltrados"
  :items-per-page="10"
  :sort-by="[{ key: 'num_doc', order: 'asc' }]"
  dense
  >
  <template v-slot:top>
      <v-toolbar class="toolbar-tabla" flat>
        <div class="container-filtros">
          <v-text-field
          class="text-field-buscar"
          label="Buscar"
          clearable     
          variant="outlined"
          @change="aplicarFiltros"
        ></v-text-field>        
        <v-select
          class="select-fase"
          v-model="filtroCiudadResidencia"
          :items="itemCiudadResidencia"
          label="Ciudad"
          variant="outlined"
          @change="aplicarFiltros"
        ></v-select>
        <v-select
          class="select-fase"
          v-model="filtroProfesion"
          :items="itemProfesion"
          label="Profesion"
          variant="outlined"
          @change="aplicarFiltros"
        ></v-select>
        <v-btn 
        class="btn-limpiar-filtro"
        variant="outlined"
        @click="limpiarFiltros">
        Limpiar Filtros
      </v-btn>
        <v-btn 
        class="btn-actualizar"
        prepend-icon="mdi-cached"
        variant="outlined"
        color="primary" dark 
       @click="initialize">
          Actualizar
        </v-btn>
        <v-btn
        class="btn-descargar" 
        prepend-icon="mdi-download"
        variant="outlined"
        color="success" 
        @click="exportToExcel">
        Excel
      </v-btn>
    </div>
    <v-spacer></v-spacer>
    <v-checkbox
    class="checkbox-ver-detalles"
    label="Ver detalles adicionales"
    v-model="showExtraColumns"
    color="success"
    @change="toggleExtraColumns"
  ></v-checkbox>
</v-toolbar>
</template>
<template v-slot:item.options="{ item }">
  <div class="options-container">
  <v-icon 
      v-tooltip="'Descargar Formulario'"
      color="blue-darken-4"
      size="small" 
      class="mr-2" 
       @click="descargarFormulario(item)"
      >mdi-arrow-down-bold-circle</v-icon>

    </div>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reiniciar
      </v-btn>
    </template>
  </v-data-table>  

    <!-- Snackbar para mostrar el mensaje de certificado actualizado -->
    <v-snackbar v-model="snackbar" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:options>
      <v-btn color="white" variant="text" @click="snackbar = false">
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>
</template>
<style>
.text-center
{
  color: #162D4B;
  padding: 5px;
  margin: 0px;
}

.options-container {
  display: flex;
  align-items: center;
}
.status-row {
  display: flex;
  align-items: center;
}

.disabled-icon {
  opacity: 0.5;
  pointer-events: none; /* Deshabilita los clics en el icono */
}
.data-table{
  padding: 5px;
  border-collapse: collapse; /* Las líneas de la tabla no tienen espacios */
  font-size: 12px;
}
.toolbar-tabla {
  background-color: transparent;
  padding: 10px;
}
.container-filtros {
  display: flex;
  align-items: center;
  gap: 1rem;

}
.file-input-certificado,
.text-field-buscar,
.select-fase{
  max-width: 200px;
  width: 200px;
  height:40px;
}
.date-input-fecha
{
  max-width: 200px;
  width: 200px;
  height:40px;
  
}
.checkbox-ver-detalles{
  max-width: 220px;
  width: 220px;
  height:40px;
  font-size: 11;
}

/* Ajusta la altura del v-select y v-field */
.v-field__input {
  min-height: 0 !important; /* Sobrescribe el min-height */
  padding-bottom: 0 !important; 
  display: flex;
  align-items: center;
  height: 40px; /* Ajusta la altura*/
}
.v-input__control {
  min-height: 40px !important; /* Altura mínima*/
  display: flex;
  align-items: center;
}
.btn-descargar{
  padding: 10px 12px; 
  font-size: 12px; 
}
.btn-actualizar {
  padding: 10px 5px; 
  font-size: 12px; 
}
.btn-limpiar-filtro {
  padding: 10px 5px; 
  font-size: 12px; 
}
.btn-subir {
  padding: 10px 5px; 
  font-size: 12px; 
}
.data-table thead {
  background-color:#BBDEFB;
  padding: 5px;
  font-size: 12px; /* Ajusta el tamaño del texto del encabezado */

 }
 .data-table thead td, .data-table thead th {
  background-color:#BBDEFB;
  padding: 5px;
 }
.data-table th, .data-table td {
  padding:5px;
  border-bottom: 1px solid #162D4B; /* Añade una línea en la parte inferior de las celdas */
  border-right: 1px solid #162D4B; /* Añade una línea a la derecha de las celdas */
  border-left: 1px solid #162D4B; /* Añade una línea a la izquierda de las celdas */
  border-top: 1px solid #162D4B; /* Añade una línea en la parte superior de las celdas */
 
  /* Sobrescribir padding inline específico */
  padding-right: 5px !important; /* Ajusta el padding derecho */
  padding-left: 5px !important; /* Ajusta el padding izquierdo */
}
</style> 