<script setup>

import { ref, onMounted, computed} from "vue";
import axios from "axios";
import * as XLSX from 'xlsx';
import { storeToRefs } from 'pinia';
import { useAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const { userProfile } = storeToRefs(authStore);
const router = useRouter();

const headers = ref([
  { title:'Programa', text: 'Programa', value: 'Nombre' },
  { title:'Área', text: 'Área', value: 'Area' },
  { title:'Estado', text: 'Estado', value: 'Estado' },
  { title:'Nro. inscritos', text: 'Nro. inscritos', value: 'num_inscritos' },
  { title: 'Opciones', key: 'options', sortable: false },
]); 
const registrosProgramas = ref([]);
const filtroArea = ref(null);
const filtroPrograma = ref(null);


const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("");

const buscarRegistrosPro = async () => {
  try {
    const response = await axios.get('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/programas');

    /*const response = await axios.get(
      `http://localhost:3000/api/programas`
    );*/
    if (response.data) {
      const programas = response.data;
      const inscritosPorPrograma = await numInscritos();
      programas.forEach(programa => {
        const inscritos = inscritosPorPrograma.find(insc => insc.cod_programa === programa.Cod_Programa);
        programa.num_inscritos = inscritos ? inscritos.num_inscritos : 0;
      });
      registrosProgramas.value = response.data;

      // Asegúrate de que la respuesta incluya el campo 'nombre'
    } else {
      nombrePersona.value = "Persona no encontrada";
    }
  } catch (error) {
    console.error("Error al buscar persona:", error);
    nombrePersona.value = "Error en la búsqueda";
  }
};

const numInscritos = async () => {
  try {
    const response = await axios.get('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/inscritos_por_programa');
    const inscritosPorPrograma = response.data;
    return inscritosPorPrograma;
  } catch (error) {
    console.error('Error al obtener los inscritos:', error);
    return [];
  }
};

// Inicializar registros y verificar certificados
onMounted(() => {
  buscarRegistrosPro();
});


// Función para actualizar la tabla
const initialize = async () => {
  await buscarRegistrosPro();
};
// exportar excel
const exportToExcel = () => {
  if (!registrosProgramas.value.length) {
    console.error('No hay datos para exportar.');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(registrosProgramas.value.map(item => ({
    ID: item.Cod_Programa,
    Nombres: item.Nombre,
  })));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registros");
  XLSX.writeFile(wb, "Registros.xlsx");
};

const registrosFiltrados = computed(() => {
  return registrosProgramas.value.filter(registro => {
    const AreaMatch = !filtroArea.value || registro.Area === filtroArea.value;
    const programaMatch = !filtroPrograma.value || registro.Nombre === filtroPrograma.value;

    return AreaMatch && programaMatch;

  })
})
function aplicarFiltros() {
  // Este método se llama cuando se cambian los filtros
  console.log('Aplicando filtros:', { Area: filtroArea.value })
}

  // Funcion para limpiar los filtros 
function limpiarFiltros() {
  //rangoFecha.value = [];
  filtroArea.value = null;
  filtroPrograma.value = null;
}
// Obtener las Areas para el filtrado
const itemArea = computed(() => {
  const Areas = registrosProgramas.value.map(item => item.Area);
  return [...new Set(Areas)];
});
// Obtener los programas para el filtrado
const itemPrograma = computed(() => {
  const programas = registrosProgramas.value.map(item => item.Nombre);
  return [...new Set(programas)];
});

const generateCustomUrl = async (Cod_Programa, Nombre, codAsesor) => {
  try {
    const response = await axios.post('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/generar-url-pers', {
      codPrograma: Cod_Programa,
      nombre: Nombre,
      codAsesor: codAsesor
    });
    return response.data.shortUrl;
  } catch (error) {
    console.error("Error al generar la URL corta:", error);
    return null;
  }
};

const openFormularioInsc = async (item) => {
  const codAsesor = userProfile.value?.cod_asesor;
  if (codAsesor) {
    try {
      const response = await axios.post('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/generar-url-pers', {
        codPrograma: item.Cod_Programa,
        nombre: item.Nombre,
        codAsesor
      });
      const shortUrl = response.data.shortUrl;
      const shortId = shortUrl.split('/').pop();
      const formUrl = `https://mktlapaz.esam.edu.bo/formulario-inscripcion?k=${shortId}`;
      window.open(formUrl, '_blank');
    } catch (error) {
      console.error("Error al generar la URL corta:", error);
    }
  } else {
    console.error("ID de asesor no disponible");
  }
};

const openListaInscPrograma = (item) => {
  const url = `/admin/list-insc-programa?Cod_Programa=${item.Cod_Programa}&Nombre=${item.Nombre}`;
  window.open(url, '_blank');
};

const getColorEstado = (estado) => {
  switch (estado) {
    case 'Nuevo':
      return 'blue';
    case 'Portal Esam':
      return 'green';
    case 'En Venta':
      return 'purple';
    default:
      return 'grey';
  }
};

</script>

<template>
  <v-btn color="blue" variant="flat" :to="{ name: 'admin-reg-programa' }">Registrar Programa</v-btn>

  <h2 class="text-center text-h4 font-weight-bold">Programas</h2>

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
          v-model="filtroPrograma"
          :items="itemPrograma"
          label="Programa"
          variant="outlined"
          @change="aplicarFiltros"
        ></v-select>
        <v-select
          class="select-fase"
          v-model="filtroArea"
          :items="itemArea"
          label="Area"
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
<template v-slot:item.Estado="{ item }">
      <v-chip
        :color="getColorEstado(item.Estado)"
        class="text-uppercase"
        size="small"
        label
      > <!-- smaller -->
        {{ item.Estado }}
      </v-chip>
    </template>
<template v-slot:item.options="{ item }">
  <div class="options-container">
  <v-icon 
      v-tooltip="'Enlace de preinscripción'"
      color="blue-darken-4"
      size="small" 
      class="mr-2" 
       @click="openFormularioInsc(item)"
      >mdi-link-variant</v-icon>
      <v-icon 
      v-tooltip="'Inscritos'"
      color="blue-darken-4"
      size="small" 
      class="mr-2" 
       @click="openListaInscPrograma(item)"

      >mdi-table-large</v-icon>
      <v-icon 
      v-tooltip="'Estado'"
      color="green-darken-4"
      size="small" 
      class="mr-2" 
      
      >mdi-autorenew</v-icon>
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

.data-table{
  padding: 2px;
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
  font-size: 10;
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
 }
 .data-table thead td, .data-table thead th {
  background-color:#BBDEFB;
  padding: 5px;
 }
.data-table th, .data-table td {
  padding: 5px;
  border-bottom: 1px solid #162D4B; /* Añade una línea en la parte inferior de las celdas */
  border-right: 1px solid #162D4B; /* Añade una línea a la derecha de las celdas */
  border-left: 1px solid #162D4B; /* Añade una línea a la izquierda de las celdas */
  border-top: 1px solid #162D4B; /* Añade una línea en la parte superior de las celdas */

  /* Sobrescribir padding inline específico */
  padding-right: 5px !important; /* Ajusta el padding derecho */
  padding-left: 5px !important; /* Ajusta el padding izquierdo */
}

</style> 