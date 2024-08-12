<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const route = useRoute();

const form = ref({
  apellidoPaterno: route.query.apellidoPaterno || "",
  apellidoMaterno: route.query.apellidoMaterno || "",
  nombres: route.query.nombres || "",
  sexo: route.query.genero || "",
  ci: route.query.num_doc || "",
  direccion: route.query.domicilio || "",
  ciudad: route.query.ciudad_residencia || "",
  departamento:  route.query.ciudad_residencia || "", 
  telFijo:"",
  telMovil:route.query.telefono || "", 
  email: route.query.correo || "",
  fechaNac: route.query.fecha_nac || "",
  estadoCivil: "", 
  contacto1: "", 
  telContacto1: "", 
  contacto2: "", 
  telContacto2: "",
  gradoAcademico: route.query.grado_academico || "",
  profesion: route.query.profesion || "",
  universidadEgreso: route.query.institucion_egreso || "",
  gestion: "", 
  fechaInscripcion: "", 
  programaEstudio: route.query.programa || "", 
  empresa: "", 
  cargo: "", 
  fechaIncorporacion: "", 
  direccionEmpresa: "" 
});

const styleText = (top, left, width = 'auto', fontSize = '14px') => {
  return {
    position: 'absolute',
    top: `${top}%`,
    left: `${left}%`,
    width: width,
    fontSize: fontSize,
    fontWeight: 'bold',
    whiteSpace: 'normal',
    textAlign: 'center',
    lineHeight: '1.2', 
    wordBreak: 'break-word', 
    overflow: 'hidden',   

  };
};

const formContainer = ref(null);

const downloadPDF = async () => {
  const element = formContainer.value;
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'letter');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('formulario-inscripcion.pdf');
};
</script>

<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div ref="formContainer" class="form-container">
          <img src="@/assets/images/formulario/form.png" alt="Formulario de Inscripción" class="form-image">
          <div class="form-fields">
            <!-- Datos Personales -->
            <span :style="styleText(20, 51, '20%')">{{ form.nombres }}</span>
            <span :style="styleText(20, 29, '20%')">{{ form.apellidoMaterno }}</span>
            <span :style="styleText(20, 9, '20%')">{{ form.apellidoPaterno }}</span>
            <span :style="styleText(20, 72, '20%')">{{ form.sexo }}</span>
            <span :style="styleText(24, 9, '20%')">{{ form.ci }}</span>
            <span :style="styleText(24, 19, '60%')">{{ form.direccion }}</span>
            <span :style="styleText(28, 9, '20%')">{{ form.ciudad }}</span>
            <span :style="styleText(28, 29, '20%')">{{ form.departamento }}</span>
            <span :style="styleText(28, 51, '20%')">{{ form.telFijo }}</span>
            <span :style="styleText(28, 72, '20%')">{{ form.telMovil }}</span>
            <span :style="styleText(32, 10, '40%')">{{ form.email }}</span>
            <span :style="styleText(32, 51, '20%')">{{ form.fechaNac }}</span>
            <span :style="styleText(32, 72, '20%')">{{ form.estadoCivil }}</span>
            <span :style="styleText(36, 9, '20%')">{{ form.contacto1 }}</span>
            <span :style="styleText(36,29, '20%')">{{ form.telContacto1 }}</span>
            <span :style="styleText(36, 51, '20%')">{{ form.contacto2 }}</span>
            <span :style="styleText(36, 72, '20%')">{{ form.telContacto2 }}</span>
            <!-- Datos Académicos -->
            <span :style="styleText(44, 9, '20%')">{{ form.gradoAcademico }}</span>
            <span :style="styleText(44, 29, '20%')">{{ form.profesion }}</span>
            <span :style="styleText(44, 61, '20%','11px')">{{ form.universidadEgreso }}</span>
            <span :style="styleText(48, 9, '20%')">{{ form.gestion }}</span>
            <span :style="styleText(48, 29, '20%')">{{ form.fechaInscripcion }}</span>
            <span :style="styleText(48, 61, '20%','11px')">{{ form.programaEstudio }}</span>

          </div>
        </div>
        <v-btn color="green" @click="downloadPDF">Descargar PDF</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.form-container {
  position: relative;
  width: 100%;
}

.form-image {
  width: 100%;
}

.form-fields {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  word-wrap: break-word; 
}
</style>
