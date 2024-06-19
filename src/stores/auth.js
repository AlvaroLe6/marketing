import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword, onAuthStateChanged , signOut} from 'firebase/auth'
import { useRouter } from 'vue-router'
import { getFirestore, doc, getDoc } from 'firebase/firestore';


export const useAuthStore = defineStore('auth', () => 
{    
    const auth = useFirebaseAuth();
    const db = getFirestore(); 
    const authUser = ref(null);
    const userProfile = ref({});
    const router = useRouter();

    // Observa cambios en el estado de autenticación
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            authUser.value = user;
            await fetchUserProfile(user);
        } else {
            authUser.value = null;
            userProfile.value = {};
        }
    });

    async function fetchUserProfile(user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            userProfile.value = docSnap.data();
            console.log("Perfil cargado:", userProfile.value);

        } else {
            console.log("No se encontró el documento del usuario.");
        }
    }

    const login = ({ email, password }) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                authUser.value = user
                router.push({name: 'admin-list-contabilidad'})

            })
            .catch(error => {
                errorMsg.value = errorCodes[error.code] || "Ocurrió un error inesperado."
            })

    }


    const logout = () =>{
        signOut(auth).then(() =>{

            authUser.value = null
            router.push({name: 'login'})

        }).catch(error => {
            console.log(error)
        })
        
        console.log('Cerrando sesióm..')
    }
    const isAuth = computed(() => {

        return authUser.value
    })

    return {
        login,
        logout,
        isAuth,
        authUser,
        userProfile

    }
})