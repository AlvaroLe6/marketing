import { ref } from 'vue'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useFirebaseStorage } from 'vuefire'
import { uid } from 'uid'

export default function useFileUpload() {

    const storage = useFirebaseStorage()
    const fileUrl = ref(null); // Ref para la URL del archivo

    async function uploadFile(event) {
        return new Promise(async (resolve, reject) => {
            const storage = useFirebaseStorage();
            const file = event.target.files[0]
            if (!file) {
                reject('No se proporcionó ningún archivo');
                return;
            }
                // Determina la extensión del archivo y crea una referencia única
                const fileExtension = file.name.split('.').pop();
                const fileRef = storageRef(storage, `/re_applicants/${uid()}.${fileExtension}`)

                // Inicia la carga del archivo
                try {
                    await uploadBytes(fileRef, file);
                  // Obtiene la URL de descarga
      const url = await getDownloadURL(fileRef);
      resolve(url);
         } catch (error) {
                    console.error("Error uploading file: ", error);
                    reject(error); // Rechaza la promesa si hay un error
                    // Manejar errores de carga aquí
                }
            

        });
    }
    return {
        url: fileUrl,
        uploadFile
    }
}