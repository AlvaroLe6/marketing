<script setup>

import { ref, onMounted, computed  } from "vue";
import useAsesores from '@/composables/useAsesores'

import axios from "axios";
import * as XLSX from 'xlsx';


const {

  regAsesor,
  dialogState,
  dialogEdit,
  stateItem,
  stateItemConfirm,
  editedItem,
  buscarRegistrosAser,
  editItem,
  updateItem,

} = useAsesores();

const headers = ref([
 
  { title:'Nombre', text: 'Nombre', value: 'nombre' },
  { title:'Ci', text: 'Ci', value: 'ci' },
  { title:'Extensión', text: 'Extensión', value: 'extension' },
  { title:'Correo electrónico', text: 'Correo electrónico', value: 'correo_electronico' },
  { title:'Fecha de nacimiento', text: 'Fecha de nacimiento', value: 'fecha_nac' },
  { title:'Ciudad de Residencia', text: 'Ciudad de Residencia', value: 'ciudad_rec' },
  { title:'Fecha de ingreso a ESAM', text: 'Fecha de ingreso a ESAM', value: 'fecha_ingreso' },
  { title:'Numero de celular ESAM', text: 'Numero de celular ESAM', value: 'num_celular' },
  { title:'Equipo', text: 'Equipo', value: 'equipo' },
  { title: 'Estado', text: 'Estado', value: 'estado' },
  { title: 'Cargo', text: 'Cargo', value: 'cargo' },
  { title: 'Sistema', text: 'Sistema', value: 'acceso_sis' },
  { title: 'Opciones', key: 'options', sortable: false },
]); 
//const regAsesor = ref([]);
const filtroCargo = ref(null);
const filtroEstado = ref(null);


const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("");

// Inicializar registros y verificar certificados
onMounted(() => {
  buscarRegistrosAser();
});
// Función para actualizar la tabla
const initialize = async () => {
  await buscarRegistrosAser();
};
// exportar excel
const exportToExcel = () => {
  if (!regAsesor.value.length) {
    console.error('No hay datos para exportar.');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(regAsesor.value.map(item => ({
    ID: item.Cod_Programa,
    Nombres: item.Nombre,
  })));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registros");
  XLSX.writeFile(wb, "Registros.xlsx");
};

const registrosFiltrados = computed(() => {
  return regAsesor.value.filter(registro => {
    const cargoMatch = ! filtroCargo.value || registro.cargo === filtroCargo.value;
    const estadoMatch = filtroEstado.value === null || registro.estado === filtroEstado.value;

    return cargoMatch && estadoMatch;

  })
})
function aplicarFiltros() {
  // Este método se llama cuando se cambian los filtros
}

  // Funcion para limpiar los filtros 
function limpiarFiltros() {
  filtroCargo.value = null;
  filtroEstado.value = null;
}
// Obtener las Cargo para el filtrado
const itemCargo = computed(() => {
  const Cargo = regAsesor.value.map(item => item.cargo);
  return [...new Set(Cargo)];
});
// Obtener los estado para el filtrado
const itemEstado = computed(() => {
  const estado = regAsesor.value.map(item => item.estado);
  return [...new Set(estado)];
});

const itemEstadoNuev = computed(() => {
  return itemEstado.value.map(value => ({
    value,
    text: value === 1 ? 'Activo' : 'Inactivo'
  }));
});

const openStateDialog = (item) => {
  stateItem(item);
  dialogState.value = true;
};
const openEditDialog = (item) => {
  editItem(item);
  dialogEdit.value = true;
};
</script>

<template>
  <v-btn color="blue" variant="flat" :to="{ name: 'admin-reg-asesor' }">Registrar nuevo asesor</v-btn>

  <h2 class="text-center text-h4 font-weight-bold">Asesores La Paz Central</h2>

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
          v-model="filtroEstado"
          :items="itemEstadoNuev"
          item-title="text"
          item-value="value"
          label="Estado"
          variant="outlined"
          @change="aplicarFiltros"
        ></v-select>
        <v-select
          class="select-fase"
          v-model=" filtroCargo"
          :items="itemCargo"
          label="Cargo"
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
<template v-slot:item.estado="{ item }">
  <v-chip
        :color="item.estado ? 'green' : 'red'"
        :text="item.estado ? 'Activo' : 'Inactivo'"
        class="text-uppercase"
        size="small"
        label
      ></v-chip>
</template>
<template v-slot:item.acceso_sis="{ item }">
  <v-chip
        :color="item.acceso_sis ? 'green' : 'red'"
        :text="item.acceso_sis ? 'Ok' : 'No'"
        class="text-uppercase"
        size="small"
        label
      ></v-chip>
</template>
<template v-slot:item.options="{ item }">
  <div class="options-container">
  <v-icon 
      v-tooltip="'Editar'"
      color="green"
      size="small" 
      class="mr-2" 
      @click="openEditDialog(item)"
      >mdi-account-edit</v-icon>
      <v-icon 
      v-tooltip="'Estado'"
      color="blue-darken-4"
      size="small" 
      class="mr-2" 
       @click="openStateDialog(item)"
      >mdi-autorenew</v-icon>
    </div>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reiniciar
      </v-btn>
    </template>
  </v-data-table> 
 <!-- Diálogo para editar la información del asesor -->
 <v-dialog v-model="dialogEdit" max-width="600px">
    <v-card>
      <v-card-title>Editar Asesor</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field label="Nombre" v-model="editedItem.nombre"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Correo Electrónico" v-model="editedItem.correo_electronico"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="CI" v-model="editedItem.ci"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Extensión" v-model="editedItem.extension"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Fecha de Nacimiento" v-model="editedItem.fecha_nac"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Domicilio" v-model="editedItem.domicilio"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Ciudad de Residencia" v-model="editedItem.ciudad_rec"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Fecha de Ingreso" v-model="editedItem.fecha_ingreso"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Entidad Financiera" v-model="editedItem.entidad_financiera"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Número de Celular" v-model="editedItem.num_celular"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Número de Celular Personal" v-model="editedItem.num_celular_P"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Equipo" v-model="editedItem.equipo"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Tipo de Contrato" v-model="editedItem.tipo_contrato"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="updateItem">Guardar</v-btn>
        <v-btn color="red" @click="dialogEdit = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
 <!-- Snackbar para mostrar el mensaje de actualización -->
 <v-snackbar v-model="snackbar" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:options>
      <v-btn color="white" variant="text" @click="snackbar = false">
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>

  <!-- Diálogo para confirmar el cambio de estado -->
  <v-dialog v-model="dialogState" max-width="500px">
    <v-card>
      <v-card-title>Cambiar Estado</v-card-title>
      <v-card-text>¿Estás seguro de que deseas cambiar el estado de este asesor?</v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="stateItemConfirm">Confirmar</v-btn>
        <v-btn color="red" @click="dialogState = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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