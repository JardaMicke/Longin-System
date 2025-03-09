// Add new import
import { ModuleStatusDashboard } from './pages/ModuleStatusDashboard';

// Update router
<Router>
  <Route path="/" exact component={TestPage} />
  <Route path="/status" component={ModuleStatusDashboard} />
</Router>
