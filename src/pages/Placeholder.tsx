import { PageHeader } from '../components/PageHeader';
import { useLocation } from 'react-router-dom';

export function Placeholder() {
  const location = useLocation();
  const pathName = location.pathname.split('/')[1] || 'Dashboard';
  const title = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <div>
      <PageHeader 
        title={title} 
        description={`Manage your ${title.toLowerCase()} and configurations.`} 
      />
      
      <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl opacity-50">🚧</span>
        </div>
        <h3 className="font-sora text-xl font-semibold mb-2">{title} Module</h3>
        <p className="text-text-muted max-w-md">
          This section is currently under development as part of the phase 1 UI/UX setup. 
          Real data integration will be implemented in subsequent phases.
        </p>
      </div>
    </div>
  );
}
