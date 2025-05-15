// Routes
import Dashboard from 'Routes/dashboard';
import Crm from 'Routes/crm';
import Signin from 'Container/SigninFirebase'; // ✅ Add this import

let routes = [
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'crm',
    component: Crm
  },
  {
    path: 'signin', // ✅ Add this route
    component: Signin
  }
];

export default routes;
