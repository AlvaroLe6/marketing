
import { defineStore } from 'pinia';
import { collection, getFirestore, doc, setDoc, getDoc,updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';



export const useStateCheckbox = defineStore('stateCheckbox', {
  state: () => ({
    marketingDisabled: false,
    adminDisabled: false,
    docenteDisabled: false,
  }),
  actions: {
    async buscarStates() {
      const docRef = doc(db, 'btn_states', 'btn_stateMenu');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.marketingDisabled = data.btn_marketing;
        this.adminDisabled = data.btn_admin;
        this.docenteDisabled = data.btn_docente;
      } else {
        console.log("No se encontro el docuemnto");
      }
    },
    async actualizarStates(type, value) {
      const docRef = doc(db, 'btn_states', 'btn_stateMenu');
      await updateDoc(docRef, { [type]: value });

    },
    setMarketingDisabled(value) {
      this.marketingDisabled = value;
    },
    setAdminDisabled(value) {
      this.adminDisabled = value;
    },
    setDocenteDisabled(value) {
      this.docenteDisabled = value;
    },
  },
});
