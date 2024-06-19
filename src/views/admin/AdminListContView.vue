<script setup>

import { ref, computed, onMounted} from 'vue';
import useContabilidad from '@/composables/useContabilidad'
import * as XLSX from 'xlsx';

const {
  contabilidadFecha,
  dialog,
  dialogDelete,
  editedItem,
  editedIndex,
  editItem,
  deleteItem,
  deleteItemConfirm,
  save,
  dialogFase,
  openFaseDialog,
  modificarFase
} = useContabilidad();

const rangoFecha = ref([]);
const filtroFase = ref(null);

const tipo = ["Recibo", "Factura"];
const tipo1 = ["REGISTRADO", "Entrevista"];

function initialize() {
  // Tu código para inicializar o recargar los datos
}

const formTitle = computed(() => {
  return editecontabilidadFechadIndex.value === -1 ? 'Nuevo Registro' : 'Editar Registro';
});

const Phase = {
  REGISTRADO: 1,
  ENTREVISTA: 2,
  CAPACITACION: 3,
  CONTRATADO: 4,
  RECHAZADO: 5
};

function getChipProperties(fase) { 
  const fases = {
    [Phase.REGISTRADO]: { text: 'Registrado', color: 'green' },
    [Phase.ENTREVISTA]: { text: 'Entrevista', color: 'light-blue-accent-2' },
    [Phase.CAPACITACION]: { text: 'Capacitación', color: 'light-blue-darken-4' },
    [Phase.CONTRATADO]: { text: 'Contratado', color: 'teal-accent-4' },
    [Phase.RECHAZADO]: { text: 'Rechazado', color: 'red' }
  };
  return fases[fase] || { text: 'Desconocido', color: 'black' };
}

// Métodos para abrir los diálogos
const openEditDialog = (item) => {
  editItem(item);
  dialog.value = true;
};

const openDeleteDialog = (item) => {
  deleteItem(item);
  dialogDelete.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editedItem.value = {};
  editedIndex.value = -1;
};

const closeDeleteDialog = () => {
  dialogDelete.value = false;
  editedItem.value = {};
  editedIndex.value = -1;
};
const saveItem = () => {
  save();
  dialog.value = false;
};
const deleteItemConfirmDialog = () => {
  deleteItemConfirm();
  dialogDelete.value = false;
};

// exportar excel
const exportToExcel = () => {
  if (!contabilidadFecha.value.length) {
    console.error('No hay datos para exportar.');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(contabilidadFecha.value.map(item => ({
    Nombres: item.nombre,
    Apellidos: item.apellido,
    "Documento de Identidad": item.nroCarnet,
    Celular: item.celular,
    Profesión: item.profesion,
    Ciudad: item.ciudadR,
    Fase: item.fase,
    Estado: item.estado
  })));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registros");
  XLSX.writeFile(wb, "Registros.xlsx");
};

const fasesDisponibles = [
  { value: 1, title: 'Registrado' },
  { value: 2, title: 'Entrevista' },
  { value: 3, title: 'Capacitación' },
  { value: 4, title: 'Contratado' },
  { value: 5, title: 'Rechazado' }
];

const registrosFiltrados = computed(() => {
  return contabilidadFecha.value.filter(registro => {
    const faseMatch = !filtroFase.value || registro.fase === filtroFase.value
    const fechaMatch =
      !rangoFecha.value.length ||
      (new Date(registro.fecha) >= new Date(rangoFecha.value[0]) &&
        new Date(registro.fecha) <= new Date(rangoFecha.value[1]))
    return faseMatch && fechaMatch
  })
})
function aplicarFiltros() {
  // Este método se llama cuando se cambian los filtros
  console.log('Aplicando filtros:', { fase: filtroFase.value, rangoFecha: rangoFecha.value })
}

function limpiarFiltros() {
  rangoFecha.value = [];
  filtroFase.value = null;
}
onMounted(() => {
  // Asegúrate de que todos los datos necesarios estén inicializados
  if (!contabilidadFecha.value) contabilidadFecha.value = [];
});
</script>

<script>

export default {
  data() {
    return {

      //Componentes de la tabla 
      dialog: false,
      dialogDelete: false,

      //estado de la columnas extra
      showExtraColumns: false,



      headers: [
        {
          title: 'Codigo registro',
          align: 'start',
          sortable: false,
          value: 'idRegCaja',
          hidden: true
        },
        { title: 'Nombres', value: 'nombre' },
        { title: 'Apellidos', value: 'apellido' },
        { title: 'Documento de identidad', value: 'nroCarnet' },
        { title: 'Correo', value: 'email',hidden: true },
        { title: 'Celular', value: 'celular' },
        { title: 'Edad', value: 'edad',hidden: true },
        { title: 'Profesión', value: 'profesion' },
        { title: 'Ciudad', value: 'ciudadR' },
        { title: 'Archivo', value: 'file' },
        { title: 'Fecha reg.', value: 'fecha',hidden: true },
        { title: 'Fase', text: 'Fase', value: 'fase' },
        { title: 'Estado', text: 'Estado', value: 'estado'},
        { title: 'Acciones', key: 'actions', sortable: false },
      ],

    };
  },
  computed: {

    //Maneja las columnas visibles
          visibleHeaders() {
            if (this.showExtraColumns) {
              return this.headers;
            } else {
              return this.headers.filter(header => !header.hidden);
            }
          },
          // Muestra las columnas adicionales
          toggleExtraColumns() {
            // Ajusta la propiedad hidden basada en showExtraColumns
            this.headers.forEach(header => {
              if (header.hidden !== undefined) {
                header.hidden = !this.showExtraColumns;
              }
            });
          },
    },
        
methods: {
            //descargar archivo
            downloadFile(url) {
              window.open(url, '_blank');
            },
            }
}


</script>

<template>
  <v-btn color="blue" variant="flat" :to="{ name: 'nuevo-reg-contabilidad' }">Nuevo Registro</v-btn>

  <h3 class="text-center text-h4 my-5 font-weight-bold">Lista de registros asesores de marketing</h3>

  <v-data-table 
  class="data-table"
  v-if="contabilidadFecha.length" 
  :headers="visibleHeaders" 
  :items="registrosFiltrados"
  :sort-by="[{ key: 'idRegCaja', order: 'asc' }]">
    
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
        <v-date-input
            class="date-input-fecha"
            v-model="rangoFecha"
            label="Seleccionar rango de fechas"
            multiple="range"
            clearable
            variant="outlined"
            persistent-placeholder
            max-width="300px"
            @change="aplicarFiltros"
          ></v-date-input>        
        <v-select
          class="select-fase"
          v-model="filtroFase"
          :items="fasesDisponibles"
          item-text="text"
          item-value="value"
          label="Fase"
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
    <template v-slot:item.file="{ item }">
      <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        small
        color="blue darken-2"
        v-bind="attrs"
        v-on="on"
        @click="downloadFile(item.file)"  
        
      ><!-- Asegúrate que `item.archivo` es la URL del archivo -->
        mdi-file-download
      </v-icon>
    </template>
    <span>Descargar archivo</span>
  </v-tooltip>
</template>

    <template v-slot:item.fase="{ item }">
    <div class="mr-2">
      <v-chip 
      :color="getChipProperties(item.fase).color"
      :text="getChipProperties(item.fase).text"
      class="text-uppercase"
      size="small"
      label
      >
        {{ getChipProperties(item.fase).text }}
      </v-chip>
    </div>
  </template>
    <template v-slot:item.estado="{ item }">
    <div class="mr-2">
      <v-chip
        :color="item.estado ? 'green' : 'red'"
        :text="item.estado ? 'Activo' : 'Inactivo'"
        class="text-uppercase"
        size="small"
        label
      ></v-chip>
    </div>
  </template>
   
    <template v-slot:item.actions="{ item }">
      <v-icon 
      color="green-accent-3"
      size="small" 
      class="mr-2" 
      @click="openFaseDialog(item)">mdi-cached</v-icon>

      <v-icon 
      color="blue-darken-2"
      size="small" 
      class="mr-2" 
      @click="showDetails(item)"> mdi-eye</v-icon>

      <v-icon 
      color="blue-grey-darken-2"
      size="small" 
      class="mr-2" 
      @click="openEditDialog(item)"> mdi-pencil</v-icon>

      <v-icon
      color="red-darken-2"
      size="small" 
      class="mr-2"
       @click="openDeleteDialog(item)"> mdi-delete</v-icon>

    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reiniciar
      </v-btn>
    </template>

  </v-data-table>
  <!-- Diálogo para editar registros -->
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedItem.celular" label="Monto (Bs.)"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="editedItem.ciudadR"  :items="tipo"  label="Tipo"></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedItem.profesion" label="Fecha" type="date"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedItem.profesion" label="Detalle" multiline></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="saveItem">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo para cambiar de fase de los registros -->


  <v-dialog v-model="dialogFase" max-width="300px">
    <v-card>
      <v-card-title class="text-h5">Cambiar Fase</v-card-title>
      <v-card-text>
        ¿Deseas subir o bajar la fase del registro?
      </v-card-text>
      <v-card-actions>
        <v-btn color="green" text @click="modificarFase(1)">Subir</v-btn>
        <v-btn color="red" text @click="modificarFase(-1)">Bajar</v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="dialogFase = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <!-- Diálogo para confirmar la eliminación de registros -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">¿Estás seguro?</v-card-title>
      <v-card-text>
        Esta acción no se puede deshacer.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeDeleteDialog">Cancelar</v-btn>
        <v-btn color="red darken-1" text @click="deleteItemConfirmDialog">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style>
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
.data-table thead {
  background-color: #d1dbe9;
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