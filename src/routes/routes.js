import DashboardLayout from '../layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'

// Admin pages
import loginIn from 'src/pages/login/loginIn.vue'
import Overview from 'src/pages/Overview.vue'
import UserProfile from 'src/pages/UserProfile.vue'
import TableList from 'src/pages/TableList.vue'
import Typography from 'src/pages/Typography.vue'
import Icons from 'src/pages/Icons.vue'
import Notifications from 'src/pages/Notifications.vue'
import Upgrade from 'src/pages/Upgrade.vue'
import cliente from 'src/pages/clientes/clienteView.vue'
import clienteEdit from 'src/pages/clientes/clientesEditar'
import etapa from 'src/pages/etapas/etapaView.vue'
import fases from 'src/pages/fases/fasesView.vue'
import proyectos from 'src/pages/proyectos/proyectosView.vue'
import proyectosAdd from 'src/pages/proyectos/proyectosAdd.vue'
import actividad from 'src/pages/actividades/actividadView.vue'
import actividadAdd from 'src/pages/actividades/actividadAdd.vue'

const routes = [
  {
    path: '/',
    component: loginIn,
  
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      },
      {
        path: '/clientesEditar/:id',
        name: 'clienteSEditar',
        component: clienteEdit
      },
      {
        path: 'user',
        name: 'User',
        component: UserProfile
      },
      {
        path: 'table-list',
        name: 'Table List',
        component: TableList
      },
      {
        path: 'clienteView',
        name: 'clienteView',
        component: cliente
      },
      
      {
        path: 'etapaView',
        name: 'etapaView',
        component: etapa
      },
      {
        path: 'fasesView',
        name: 'fasesView',
        component: fases
      },
      {
        path: 'proyectosView',
        name: 'proyectosView',
        component: proyectos
      },
      {
        path: 'proyectosAdd',
        name: 'proyectosAdd',
        component: proyectosAdd
      },
      {
        path: 'actividadView',
        name: 'actividadView',
        component: actividad
      },
      {
        path: 'actividadAdd',
        name: 'actividadAdd',
        component: actividadAdd
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },
      {
        path: 'upgrade',
        name: 'Upgrade to PRO',
        component: Upgrade
      }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes


/* 
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/overview'
  },
*/