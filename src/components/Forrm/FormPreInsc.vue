<script setup>
import { useForm, useField } from "vee-validate";
import { collection, setDoc, getDocs, doc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useRouter } from "vue-router";
import { validationSchema, fileSchema } from "@/validation/rrhh-mktSchema.js";
import useFileUpload from "@/composables/useFileUpload";
import { ref } from "vue";

const fechaFin = ref(new Date().toISOString().substr(0, 10));
const db = useFirestore();
const router = useRouter();

const snackbar = ref(false);
const snackbarMessage = ref("");

console.log("fechaFin", fechaFin.value);
const { handleSubmit } = useForm({
  validationSchema: {
    ...validationSchema,
    ...fileSchema,
  },
});

const { url, uploadFile, file } = useFileUpload();

const nombre = useField("nombre");
const apellido = useField("apellido");
const nroCarnet = useField("nroCarnet");
const email = useField("email");
const celular = useField("celular");
const edad = useField("edad");
const profesion = useField("profesion");
const comtExpArea = useField("comtExpArea");
const ciudadR = useField("ciudadR");
const ciudades = [
  "Cobija",
  "Cochabamba",
  "El Alto",
  "La Paz",
  "Oruro",
  "Potosí",
  "Santa Cruz de la Sierra",
  "Sucre",
  "Tarija",
  "Trinidad",
];

const files = useField("files");
const pretensionSal = useField("pretensionSal");
const cuentasComp = useField("cuentasComp");
const cuentasCompItem = ["Si", "No"];

const cuentasInt = useField("cuentasInt");
const cuentasIntItem = ["Si", "No"];
// <!-- Tu tarjeta de debito esta habilitada para compras por internet -->
const detalleTarjeta = useField("detalleTarjeta");
const detalleTarjetaItem = ["Si", "No", "No cuento con tarjeta de debito"];
//  <!-- Sabes lanzar campañas pagadas en facebook -->
const detalleFacebook = useField("detalleFacebook");
const detalleFacebookItem = ["Si", "No"];
const fileEvent = ref(null);

function handleFileChange(event) {
  fileEvent.value = event; // Guarda el evento para usarlo después
}

const submit = handleSubmit(async (values) => {
  const { files, ...re_applicants } = values;

  let originalId = "COD-RP-";
  let contador = 1;

  const queryID = await getDocs(collection(db, "re_applicants"));
  queryID.forEach((doc) => {
    const id = doc.id;
    const partes = id.split("-");
    const secuencia = partes[partes.length - 1]; // Obtiene el último elemento del array
    if (secuencia && !isNaN(secuencia)) {
      const numSecuencia = parseInt(secuencia);
      if (numSecuencia >= contador) {
        contador = numSecuencia + 1;
      }
    }
  });

  const generateNewId = () => {
    return `${originalId}${contador}`;
  };
  let generatedId = generateNewId();

  const fileChangeEvent = files.value;

  try {
    // Espera a que la carga del archivo se complete
    if (fileEvent.value) {
      const fileUrl = await uploadFile(fileEvent.value); // Usa el evento guardado
      values.file = fileUrl; // Añade la URL del archivo a los valores a guardar
      console.log(values.file, "enlace para guardar en fire base");
    }

    const docRef = await setDoc(
      doc(collection(db, "re_applicants"), generatedId),
      {
        ...re_applicants,
        file: values.file,
        idRegCaja: generatedId,
        fecha: fechaFin.value,
        estado: true,
        fase: 1,
      }
    );
    console.log("Documento guardado correctamente.");
    snackbar.value = true;
    snackbarMessage.value = "Tu solicitud ha sido guardada exitosamente.";

    // Redirige al usuario a la lista de registros
    setTimeout(() => {
      router.push({ name: "home" });
    }, 2000); // Muestra el snackbar por 2 segundos antes de redirigir
  } catch (error) {
    console.error("Error al guardar el documento en Firestore:", error);
    snackbar.value = true;
    snackbarMessage.value =
      "Error al guardar el documento. Por favor, intenta de nuevo.";
  }
});
</script>
    

<template>
  <v-row>
    <v-col cols="12" class="text-center">
      <h2>FORMULARIO DE PRE INSCRIPCIÓN</h2>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="text-center">
      <h2>
        DIPLOMADO EN EDUCACIÓN SUPERIOR EN SALUD FORMACIÓN POR COMPETENCIAS
      </h2>
      <v-span>Asesor: xxxxx</v-span>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" md="6"> 
      <v-img src="../assets/images/dip. edu.jpeg">
      </v-img>
    </v-col>
    <v-col cols="12" md="6">
      <v-card elevation="3" max-width="800" flat class="card mx-auto my-10">
        <v-snackbar v-model="snackbar" top right color="green" :timeout="3000">
          {{ snackbarMessage }}
          <v-btn color="white" text @click="snackbar = false"> Cerrar </v-btn>
        </v-snackbar>
        <v-card-title class="text-h4 font-weight-bold" tag="h6">
          Datos Personales
        </v-card-title>

        <v-col cols="12">
          <v-span> Los campos con un asterisco(*) son obligatorios </v-span>
          <VDivider />
          <v-row>
            <!-- Nombre -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="nombre.value.value"
                label="Nombres"
                variant="outlined"
                persistent-hint
                :error-messages="nombre.errorMessage.value"
              ></v-text-field>
            </v-col>
            <!-- Apellido -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="apellido.value.value"
                label="Apellidos"
                variant="outlined"
                persistent-hint
                :error-messages="apellido.errorMessage.value"
              ></v-text-field>
            </v-col>
            <!-- Numero de carnet -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="nroCarnet.value.value"
                label="Documento de identidad"
                variant="outlined"
                persistent-hint
                :error-messages="nroCarnet.errorMessage.value"
              ></v-text-field>
            </v-col>
            <!-- Numero de Genero -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="nroCarnet.value.value"
                label="Genero"
                variant="outlined"
                persistent-hint
                :error-messages="nroCarnet.errorMessage.value"
              ></v-text-field>
            </v-col>
            <!-- Fecha de nacimiento -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="nroCarnet.value.value"
                label="Fecha de nacimiento"
                variant="outlined"
                persistent-hint
                :error-messages="nroCarnet.errorMessage.value"
              ></v-text-field>
            </v-col>
            <!-- Grado academico -->
            <v-col md="6" cols="12">
              <v-select
                v-model="ciudadR.value.value"
                label="Grado académico"
                :items="ciudades"
                outlined
                variant="outlined"
                persistent-hint
                :error-messages="ciudadR.errorMessage.value"
              ></v-select>
            </v-col>
            <!-- Profesion -->
            <v-col md="6" cols="12">
              <v-select
                v-model="ciudadR.value.value"
                label="Profesión"
                :items="ciudades"
                outlined
                variant="outlined"
                persistent-hint
                :error-messages="ciudadR.errorMessage.value"
              ></v-select>
            </v-col>
            <!-- Ciudad de recidencia -->
            <v-col md="6" cols="12">
              <v-select
                v-model="ciudadR.value.value"
                label="Ciudad de recidencia"
                :items="ciudades"
                outlined
                variant="outlined"
                persistent-hint
                :error-messages="ciudadR.errorMessage.value"
              ></v-select>
            </v-col>
            <!-- Institución de egreso -->
            <v-col md="6" cols="12">
              <v-select
                v-model="ciudadR.value.value"
                label="Institución de egreso"
                :items="ciudades"
                outlined
                variant="outlined"
                persistent-hint
                :error-messages="ciudadR.errorMessage.value"
              ></v-select>
            </v-col>
            <!-- Domicilio/direccion: -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="email.value.value"
                label="Domicilio/direccion:"
                variant="outlined"
                persistent-hint
                :error-messages="email.errorMessage.value"
              ></v-text-field>
            </v-col>
            <VDivider />
            <v-card-subtitle class="text-h5 py-5">
              Los campos con un asterisco(*) son obligatorios
            </v-card-subtitle>
            <!-- Celular -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="celular.value.value"
                label="Celular"
                variant="outlined"
                persistent-hint
                :error-messages="celular.errorMessage.value"
              ></v-text-field>
            </v-col>
            <!-- Correo -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="celular.value.value"
                label="Correo"
                variant="outlined"
                persistent-hint
                :error-messages="celular.errorMessage.value"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <!-- Guardar los datos del Formulario -->
    <v-col cols="12" class="center">
      <v-btn @click="submit">Guardar</v-btn>

      <v-btn
        color="secondary"
        variant="outlined"
        type="reset"
        @click.prevent=""
      >
        Borrar
      </v-btn>
    </v-col>
  </v-row>
</template>

