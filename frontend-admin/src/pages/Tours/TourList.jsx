import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RotateCcw } from 'lucide-react';
import TourTable from '../../components/tours/TourTable.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import { toursAPI } from '../../services/api.js';

const TourList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError('');
        const params = { page, size };
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;
        const data = await toursAPI.getAll(params);
        setTours(data.content || data || []);
      } catch (err) {
        console.error('Failed to load tours', err);
        setError('Không thể tải danh sách tour. Vui lòng thử lại sau.');
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [page, size, keyword, status]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Tours</h1>
            <p className="text-sm text-slate-500">Manage catalog, inventory, and pricing đồng bộ cùng API backend.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { setKeyword(''); setStatus(''); setPage(0); }}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button to="/tours/new" className="w-full md:w-auto">
              <Plus className="h-4 w-4" />
              New tour
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Input label="Keyword" placeholder="Search by name/slug" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={[
            { value: '', label: 'All' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'UNACTIVE', label: 'Inactive' },
            { value: 'FULL', label: 'Full' },
            { value: 'END', label: 'Ended' }
          ]} />
          <Select label="Page size" value={String(size)} onChange={(e) => setSize(Number(e.target.value))} options={[
            { value: '10', label: '10' },
            { value: '25', label: '25' },
            { value: '50', label: '50' }
          ]} />
        </div>
      </div>

      {loading ? (
        <Card className="py-12 text-center text-sm text-slate-500">Đang tải dữ liệu tour...</Card>
      ) : error ? (
        <Card className="py-12 text-center text-sm text-danger">{error}</Card>
      ) : (
        <>
          <TourTable tours={tours} />
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" disabled={page === 0} onClick={() => setPage(Math.max(page - 1, 0))}>Prev</Button>
            <Button variant="secondary" onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </>
      )}

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
};

export default TourList;
