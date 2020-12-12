import { withNavigationWatcher } from './contexts/navigation';
import { HomePage, InstitutionsPage, StudentsPage, ProfilePage } from './pages';

const routes = [
  {
    path: '/institutions',
    component: InstitutionsPage
  },
  {
    path: '/students?institution_id=:institution_id',
    component: StudentsPage
  },
  {
    path: '/profile',
    component: ProfilePage
  },
  {
    path: '/home',
    component: HomePage
  }
];

export default routes.map(route => {
  return {
    ...route,
    component: withNavigationWatcher(route.component)
  };
});
