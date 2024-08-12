import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged} from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import HomeView from '../views/HomeView.vue'
import FormPreInsc from '@/components/Form/FormPreInsc.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/formulario-inscripcion',
      name: 'FormPreInsc',
      component: FormPreInsc
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/nuevo',
      name: 'nuevo-re-contabilidad',
      component: () => import('../views/admin/NuevoRegContabilidadView.vue'),
    },
    {
      path: '/formulario-inscripcion',
      name: 'formulario-inscripcion',
      component: () => import('../components/Form/FormPreInsc.vue'),
    },
    {
      path: '/quienes-somos',
      name: 'quienes-somos',
      component: () => import('../views/QuienesSomosView.vue'),
    },
    {
      path: '/oferta-academica',
      name: 'oferta-academica',
      component: () => import('../views/OfertaAcademicaView.vue'),
    },
    {
      path: '/admin',
      mane: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/admin/admin',
          name: 'admin-admin',
          component: () => import('../views/admin/AdminView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/admin/list_contabilidad',
          name: 'admin-list-contabilidad',
          component: () => import('../views/admin/AdminListContView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/admin/nuevo',
          name: 'nuevo-reg-contabilidad',
          component: () => import('../views/admin/NuevoRegContabilidadView.vue'),
          meta: { requiresAuth: true },

        }, {
          path: '/admin/account-settings',
          name: 'account-settings',
          component: () => import('../views/AccountSettingsView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: '/admin/reg-programa',
          name: 'admin-reg-programa',
          component: () => import('../views/admin/RegProgramaView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: '/admin/list-programas',
          name: 'admin-list-programas',
          component: () => import('../views/admin/ListProgramasView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: '/admin/list-asesores',
          name: 'admin-list-asesores',
          component: () => import('../views/admin/ListAsesoresView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: '/admin/reg-asesor',
          name: 'admin-reg-asesor',
          component: () => import('../views/admin/RegAsesoresView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: '/admin/list-insc-programa',
          name: 'admin-list-insc-programa',
          component: () => import('../views/admin/ListPreInscProgramaView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: '/admin/formulario-ins',
          name: 'admin-formulario-ins',
          component: () => import('../components/Form/Formulario.vue'),
          meta: { requiresAuth: true },
        },

      ]
    }
  ]
})


//Guard de navegación
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth)

  if (requiresAuth) {
    //comprobar que el usuario este autenticado
    try {
      await authenticateUser() 
      next()
    } catch (error) {
      console.log(error)
      next({ name: 'login' })
    }

  } else {
    //No esta protegido, mostramos la vista
    next()
  }
  console.log(requiresAuth)

})

function authenticateUser(){
  const auth = useFirebaseAuth();
  return new Promise((resolve, reject) => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      if(user){
        resolve(user)
      }else{
        reject()
      }
    })
  })
}
export default router
