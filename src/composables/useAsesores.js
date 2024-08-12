import { ref, onMounted } from 'vue';
import axios from 'axios';

export default  function useAsesores(){
    const dialogState = ref(false);
    const dialogEdit = ref(false);
    const editedItem = ref(null);
    const regAsesor = ref([]);


const buscarRegistrosAser = async () => {
  try {
    const response = await axios.get('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/asesores');
    if (response.data) {
      regAsesor.value = response.data;
    } else {
      console.error("No se encontraron asesores");
    }
  } catch (error) {
    console.error("Error al buscar asesores:", error);
  }
};
onMounted(() => {
  buscarRegistrosAser();

});
const stateItem = (item) => {
  dialogState.value = true;
  editedItem.value = item;
};

const stateItemConfirm = async () => {
  if (editedItem.value) {
    try {
      const codAsesor = editedItem.value.cod_asesor;
      const nuevoEstado = editedItem.value.estado === 1 ? 0 : 1;
      await axios.put(`https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/asesores/${codAsesor}`, { estado: nuevoEstado });

      const index = regAsesor.value.findIndex((doc) => doc.cod_asesor === editedItem.value.cod_asesor);
      if (index !== -1) {
        regAsesor.value[index].estado = nuevoEstado;
      }

      dialogState.value = false;
      
      await buscarRegistrosAser(); 
    } catch (error) {
      console.error("Error al cambiar el estado del documento:", error);
    }
  } else {
    console.error("Ítem editado no válido. No se puede cambiar el estado.");
  }
};

const editItem = (item) => {
  editedItem.value = { ...item }; 
  dialogEdit.value = true;
};

const updateItem = async () => {
  if (editedItem.value) {
    try {
      await axios.put(`https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/update_asesores/${editedItem.value.cod_asesor}`, editedItem.value);

      // Refrescar la lista de asesores
      await buscarRegistrosAser();

      dialogEdit.value = false;
    } catch (error) {
      console.error("Error al actualizar el asesor:", error);
    }
  } else {
    console.error("Ítem editado no válido. No se puede actualizar el asesor.");
  }
};

    return{  
      regAsesor,
      dialogState,
      dialogEdit,
      editedItem,
      stateItem,
      stateItemConfirm,
      buscarRegistrosAser,
      editItem,
      updateItem,
    }
    
}