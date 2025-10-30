// Routes
import Dashboard from 'Routes/dashboard';
import Crm from 'Routes/crm';
import Signin from 'Container/SigninFirebase'; // ✅ Add this import
import Signup from 'Container/SignupFirebase';
import ResetPassword from 'Container/ResetPassword';
import BusinessUnitSelector from 'Container/BusinessUnitSelector';
import CompanySelector from 'Container/CompanySelector';

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
  },
  {
    path: 'signup',
    component: Signup
  },
  {
    path: 'reset-password',
    component: ResetPassword
  },
  {
    path: 'choose-business-unit',
    component: BusinessUnitSelector
  },
  {
    path: 'choose-company',
    component: CompanySelector
  }
];

export default routes;
