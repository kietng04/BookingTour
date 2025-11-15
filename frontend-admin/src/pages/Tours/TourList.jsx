import { useEffect, useState } from 'react';
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
            <h1 className="text-2xl font-semibold text-slate-900">Tour du lịch</h1>
            <p className="text-sm text-slate-500">Quản lý danh mục, tồn kho và giá cả đồng bộ cùng API backend.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { setKeyword(''); setStatus(''); setPage(0); }}>
              <RotateCcw className="h-4 w-4" />
              Đặt lại
            </Button>
            <Button to="/tours/new" className="w-full md:w-auto">
              <Plus className="h-4 w-4" />
              Tour mới
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Input label="Từ khóa" placeholder="Tìm theo tên/slug" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <Select label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value)} options={[
            { value: '', label: 'Tất cả' },
            { value: 'ACTIVE', label: 'Hoạt động' },
            { value: 'UNACTIVE', label: 'Không hoạt động' },
            { value: 'FULL', label: 'Đã đầy' },
            { value: 'END', label: 'Đã kết thúc' }
          ]} />
          <Select label="Kích thước trang" value={String(size)} onChange={(e) => setSize(Number(e.target.value))} options={[
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
            <Button variant="secondary" disabled={page === 0} onClick={() => setPage(Math.max(page - 1, 0))}>Trước</Button>
            <Button variant="secondary" onClick={() => setPage(page + 1)}>Sau</Button>
          </div>
        </>
      )}

      <Card className="space-y-3 bg-slate-50 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">Lưu ý về trạng thái tour</h3>
        <ul className="space-y-1 text-sm text-slate-600">
          <li>• <strong>Hoạt động:</strong> Tour đang hoạt động và có thể đặt</li>
          <li>• <strong>Không hoạt động:</strong> Tour tạm ngưng hoạt động</li>
          <li>• <strong>Đã đầy:</strong> Tour đã đầy chỗ</li>
          <li>• <strong>Đã kết thúc:</strong> Tour đã kết thúc</li>
        </ul>
      </Card>
    </div>
  );
};

export default TourList;
