<script setup>

import { ref, onMounted, computed  } from "vue";
import axios from "axios";
import * as XLSX from 'xlsx';
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.Cod_Estudiante) {
    certificadosGenerados.value[data.Cod_Estudiante] = true;
  }
};
const headers = ref([
  { title: 'Nro. Carnet',text: 'Nro. Carnet',align: 'start',
          sortable: false,
          key: 'num_doc' },
  { title:'Nombre', text: 'Nombre', value: 'Nombre' },
  { title: 'Opciones', key: 'options', sortable: false },
]); 
const registrosEstudiantes = ref([]);
const filtroArea = ref(null);
const filtroPrograma = ref(null);

const subirArchivo = ref(null);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("");

// Maneja los certificados generados
const certificadosGenerados = ref({}); 

const buscarRegistrosPro = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/programas`
    );
    if (response.data) {
      registrosEstudiantes.value = response.data;
      // Llama a la función para verificar el estados de los certificados
      await verificarCertificados(); 
      console.log("los datos de los clientes: ",registrosEstudiantes.value)
     
      // Asegúrate de que la respuesta incluya el campo 'nombre'
    } else {
      nombrePersona.value = "Persona no encontrada";
    }
  } catch (error) {
    console.error("Error al buscar persona:", error);
    nombrePersona.value = "Error en la búsqueda";
  }
};
// Inicializar registros y verificar certificados
onMounted(() => {
  buscarRegistrosPro();
  verificarCertificados();

});
// Función para actualizar la tabla
const initialize = async () => {
  await buscarRegistrosPro();
  await verificarCertificados();
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
    Area_tramite: item.Area_tramite,
    tipo: item.tipo,
    programa: item.programa,
    sede:item.sede,
    fechaInscripcion:item.fechaInscripcion,

  })));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registros");
  XLSX.writeFile(wb, "Registros.xlsx");
};

const registrosFiltrados = computed(() => {
  return registrosEstudiantes.value.filter(registro => {
    const AreaMatch = !filtroArea.value || registro.Area_tramite === filtroArea.value;
    const programaMatch = !filtroPrograma.value || registro.programa === filtroPrograma.value;

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
  const Areas = registrosEstudiantes.value.map(item => item.Area_tramite);
  return [...new Set(Areas)];
});
// Obtener los programas para el filtrado
const itemPrograma = computed(() => {
  const programas = registrosEstudiantes.value.map(item => item.programa);
  return [...new Set(programas)];
});

const openFormularioInsc = (item) => {
    const url = `/formulario-inscripcion?Cod_Programa=${item.Cod_Programa}&Nombre=${item.Nombre}`;
    window.open(url, '_blank');
};
const openCertificadoDesarrollo = (item) => {
  const url = `/admin/certificado-desarrollo?num_doc=${item.num_doc}&nombre=${item.nombre}&apellido=${item.apellidoPersona}&ci=${item.ci}&tipo=${item.tipo}&programa=${item.programa}&sede=${item.sede}&fecha=${item.fecha}`;
  window.open(url, '_blank');
};

// Permite seleccionar un archivo
const triggerSubirArchivo = () => {
  subirArchivo.value.click();
};

//Cargar los archivos en la base de datos
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('fondo', file);

  try {
    const response = await axios.post('http://localhost:3000/api/fondo_certificados', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Archivo subido:', response.data);
    snackbarText.value = "Fondo del certificado actualizado";
    snackbar.value = true;
    snackbarColor.value = "green";
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    snackbarText.value = "Error al subir el archivo";
    snackbar.value = true;
    snackbarColor.value = "red";
  }
};

// Verifica los certificados generados
const verificarCertificados = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/buscar-estudiante-certificado-conclusion`);
    if (response.data) {
      const certificados = response.data;
      certificados.forEach(cert => {
        certificadosGenerados.value[cert.Cod_Estudiante] = true;
      });
    } else {
      console.error("No se encontraron certificados.");
    }
  } catch (error) {
    console.error("Error al verificar certificados:", error);
  }
};


</script>

<template>
  <v-btn color="blue" variant="flat" :to="{ name: 'nuevo-reg-contabilidad' }">Subir archivo</v-btn>

  <h2 class="text-center text-h3 my-5 font-weight-bold">Programas</h2>

  <v-data-table 
  class="data-table"   
  v-if="registrosEstudiantes.length" 
  :headers="headers" 
  :items="registrosFiltrados"
  :items-per-page="10"
  :sort-by="[{ key: 'num_doc', order: 'asc' }]">
    
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
      <v-icon
        class="icon-camera"
        @click="triggerSubirArchivo"
        color="cyan-accent-4"
        v-tooltip="'Fondo del certificado'"
        large>
        mdi-camera
      </v-icon>
      <input 
        ref="subirArchivo"
        type="file" 
        accept="image/png, image/jpeg, image/bmp"
        style="display: none;"
        @change="handleFileUpload">
       <div>
        <v-row>
          <v-col clos="12">
            <v-row class="status-row">
              <span 
              class="point-text-generado">
              </span>
              <span>Generado</span>
            </v-row>
            <v-row class="status-row">
              <span 
              class="point-text-no-generado">
              </span>
              <span>Sin generar</span>  
            </v-row>
          </v-col>
        </v-row>
       </div> 
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
      v-tooltip="'Enlace de preinscripción'"
      color="deep-purple-darken-1"
      size="small" 
      class="mr-2" 
       @click="!certificadosGenerados[item.cod_estudiante] && openFormularioInsc(item)"
      :disabled="certificadosGenerados[item.cod_estudiante]"
      :class="{'disabled-icon': certificadosGenerados[item.cod_estudiante]}"
      >mdi-link-variant</v-icon>
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
.options-container {
  display: flex;
  align-items: center;
}
.status-row {
  display: flex;
  align-items: center;
}
.point-text-generado {
  margin-right: 3px;
  background-color: green; /* Color del punto */
  width: 9px; /* Tamaño del punto */
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}
.point-text-no-generado {
  margin-right: 3px;
  background-color: red; /* Color del punto */
  width: 9px; /* Tamaño del punto */
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}
.disabled-icon {
  opacity: 0.5;
  pointer-events: none; /* Deshabilita los clics en el icono */
}
.data-table{
  padding: 10px;
  border-collapse: collapse; /* Las líneas de la tabla no tienen espacios */
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
  background-color: #D1C4E9;
  padding: 10px;
 }
.data-table th, .data-table td {
  padding: 10px;
  border-bottom: 1px solid #162D4B; /* Añade una línea en la parte inferior de las celdas */
  border-right: 1px solid #162D4B; /* Añade una línea a la derecha de las celdas */
  border-left: 1px solid #162D4B; /* Añade una línea a la izquierda de las celdas */
  border-top: 1px solid #162D4B; /* Añade una línea en la parte superior de las celdas */

}

</style> 