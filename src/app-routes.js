import { withNavigationWatcher } from './contexts/navigation';
import { HomePage, SchoolsPage, ProfilePage } from './pages';

const routes = [
  {
    path: '/schools',
    component: SchoolsPage
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
