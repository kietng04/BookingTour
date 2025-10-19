import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import TourTable from '../../components/tours/TourTable.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import { adminTours } from '../../data/tours.js';

const TourList = () => (
  <div className="space-y-8">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tours</h1>
        <p className="text-sm text-slate-500">Manage catalog, inventory, and pricing. Syncs with `GET /admin/tours` endpoint.</p>
      </div>
      <Button to="/tours/new" className="w-full md:w-auto">
        <Plus className="h-4 w-4" />
        New tour
      </Button>
    </div>

    <TourTable tours={adminTours} />

    <Card className="space-y-3 bg-slate-900 text-slate-100">
      <h3 className="text-lg font-semibold">Draft workflow tip</h3>
      <p className="text-sm text-slate-300">
        Promote tours by switching status to <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs text-success">live</span>.
        Keep limited campaigns hidden as <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs text-warning">draft</span>.
      </p>
      <Link to="/settings" className="text-xs font-semibold text-primary-200">Configure publishing policies →</Link>
    </Card>
  </div>
);

export default TourList;
