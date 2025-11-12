import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Undo2, ArrowUpDown, CalendarDays, MapPin } from 'lucide-react';
import TourGrid from '../components/tours/TourGrid';
import { toursAPI, regionsAPI } from '../services/api';
import { enrichToursFromApi } from '../services/tourAdapter';

const DEFAULT_FILTERS = {
  priceOrder: '',
  startDate: '',
  endDate: '',
  region: '',
  province: '',
  destinationName: '', // Temporary field for URL parameter matching
};

const PAGE_SIZE = 9;

const FilterPanel = ({
  value,
  onChange,
  onReset,
  regions,
  provinces,
  isRegionsLoading,
  isProvincesLoading,
  regionError,
}) => {
  const filteredProvinceOptions = useMemo(() => {
    if (!value.region) {
      return [];
    }
    return provinces.filter((province) => !province.regionId || province.regionId === value.region);
  }, [provinces, value.region]);

  const selectedRegion = useMemo(
    () => regions.find((region) => region.id === value.region),
    [regions, value.region]
  );

  const selectedProvince = useMemo(
    () => filteredProvinceOptions.find((province) => province.id === value.province),
    [filteredProvinceOptions, value.province]
  );

  return (
    <aside className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Bộ lọc nâng cao</p>
        <h2 className="text-xl font-semibold text-gray-900">Tìm tour phù hợp hơn</h2>
      </header>

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <SlidersHorizontal className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Sắp xếp theo giá
        </h3>
        <label className="flex items-center gap-3 text-sm text-gray-600">
          <ArrowUpDown className="h-4 w-4 text-brand-500" aria-hidden="true" />
          <select
            value={value.priceOrder}
            onChange={(event) =>
              onChange({
                ...value,
                priceOrder: event.target.value,
              })
            }
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 font-semibold text-gray-900 focus:border-brand-300"
          >
            <option value="">Mặc định</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </label>
      </section>

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <CalendarDays className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Thời gian khởi hành
        </h3>
        <div className="grid gap-3 text-sm text-gray-600">
          <label className="space-y-1">
            <span className="font-medium text-gray-700">Ngày bắt đầu</span>
            <input
              type="date"
              value={value.startDate}
              onChange={(event) =>
                onChange({
                  ...value,
                  startDate: event.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 font-semibold text-gray-900 focus:border-brand-300"
            />
          </label>
          <label className="space-y-1">
            <span className="font-medium text-gray-700">Ngày kết thúc</span>
            <input
              type="date"
              value={value.endDate}
              onChange={(event) =>
                onChange({
                  ...value,
                  endDate: event.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 font-semibold text-gray-900 focus:border-brand-300"
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <MapPin className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Khu vực & tỉnh thành
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <label className="space-y-1">
            <span className="font-medium text-gray-700">Miền</span>
            <select
              value={value.region}
              onChange={(event) =>
                onChange({
                  ...value,
                  region: event.target.value,
                  province: '',
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 font-semibold text-gray-900 focus:border-brand-300"
              disabled={isRegionsLoading && regions.length === 0}
            >
              <option value="">Tất cả</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>
          {isRegionsLoading && regions.length === 0 && (
            <p className="text-xs text-gray-500">Đang tải danh sách vùng...</p>
          )}
          {regionError && <p className="text-xs font-medium text-red-500">{regionError}</p>}

          <label className="space-y-1">
            <span className="font-medium text-gray-700">Tỉnh / Thành phố</span>
            <select
              value={value.province}
              onChange={(event) =>
                onChange({
                  ...value,
                  province: event.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 font-semibold text-gray-900 focus:border-brand-300"
              disabled={!value.region || (isProvincesLoading && filteredProvinceOptions.length === 0)}
            >
              <option value="">Tất cả</option>
              {isProvincesLoading && filteredProvinceOptions.length === 0 ? (
                <option value="" disabled>
                  Đang tải...
                </option>
              ) : (
                filteredProvinceOptions.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))
              )}
            </select>
          </label>

          <div className="rounded-xl bg-gray-25 px-3 py-2 text-xs text-gray-600">
            {selectedRegion ? (
              <>
                Đang chọn: <span className="font-semibold text-gray-900">{selectedRegion.name}</span>
                {selectedProvince && (
                  <>
                    {' '}
                    • <span className="font-semibold text-gray-900">{selectedProvince.name}</span>
                  </>
                )}
              </>
            ) : (
              'Chưa chọn khu vực cụ thể'
            )}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
      >
        <Undo2 className="h-4 w-4" aria-hidden="true" />
        Đặt lại bộ lọc
      </button>
    </aside>
  );
};

FilterPanel.propTypes = {
  value: PropTypes.shape({
    priceOrder: PropTypes.oneOf(['', 'asc', 'desc']).isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    province: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  provinces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      regionId: PropTypes.string.isRequired,
    })
  ).isRequired,
  isRegionsLoading: PropTypes.bool.isRequired,
  isProvincesLoading: PropTypes.bool.isRequired,
  regionError: PropTypes.string,
};

FilterPanel.defaultProps = {
  regionError: null,
};

const ToursPageExplore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [isRegionsLoading, setRegionsLoading] = useState(false);
  const [isProvincesLoading, setProvincesLoading] = useState(false);
  const [regionError, setRegionError] = useState(null);

  // Mapping từ region slug sang region ID (chỉ 3 miền: Bắc, Trung, Nam)
  const regionMapping = {
    'north': '1',    // Miền Bắc
    'central': '2',  // Miền Trung  
    'south': '3'     // Miền Nam
  };

  // Khởi tạo filters từ URL parameters khi component mount hoặc URL thay đổi
  useEffect(() => {
    const regionParam = searchParams.get('region');
    const destinationParam = searchParams.get('destination');
    
    console.log('URL params changed:', { regionParam, destinationParam });
    
    if (regionParam && regionMapping[regionParam]) {
      // Với destination, tìm province ID thay vì set vào search
      if (destinationParam) {
        // Decode URL parameter
        const decodedDestination = decodeURIComponent(destinationParam);
        console.log('Setting filters with destination:', decodedDestination);
        setFilters(prev => ({
          ...prev,
          region: regionMapping[regionParam],
          destinationName: decodedDestination // Temporary field để match province
        }));
      } else {
        setFilters(prev => ({
          ...prev,
          region: regionMapping[regionParam],
          destinationName: undefined
        }));
      }
    } else {
      // Reset filters if no region param
      setFilters(prev => ({
        ...prev,
        region: '',
        province: '',
        destinationName: undefined
      }));
    }
  }, [searchParams]); // Chạy lại khi URL parameters thay đổi

  useEffect(() => {
    let active = true;

    const fetchTours = async () => {
      setLoading(true);
      setError(null);

      const params = {
        page: 0,
        size: 100,
        status: 'ACTIVE',
      };

      if (filters.region) {
        params.regionId = filters.region;
      }
      if (filters.province) {
        params.provinceId = filters.province;
      }
      if (keyword.trim()) {
        params.keyword = keyword.trim();
        // Tìm kiếm theo điểm đến cụ thể
        params.destination = keyword.trim();
      }
      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      try {
        const response = await toursAPI.getAll(params);
        const payload = Array.isArray(response?.content)
          ? response.content
          : Array.isArray(response)
          ? response
          : [];

        if (active) {
          setAllTours(enrichToursFromApi(payload));
        }
      } catch (err) {
        console.error('Không thể tải danh sách tour', err);
        const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi bất ngờ.';
        if (active) {
          setError(message);
          setAllTours([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchTours();

    return () => {
      active = false;
    };
  }, [filters.region, filters.province, filters.startDate, filters.endDate, keyword]);

  useEffect(() => {
    let active = true;

    const fetchRegions = async () => {
      setRegionsLoading(true);
      try {
        const response = await regionsAPI.getAll();
        const rawRegions = Array.isArray(response) ? response : [];
        if (active) {
          setRegions(
            rawRegions
              .filter((region) => region?.id !== undefined)
              .map((region) => ({
                id: String(region.id),
                name: region?.name ?? 'Không tên',
              }))
          );
          setRegionError(null);
        }
      } catch (err) {
        console.error('Không thể tải danh sách vùng', err);
        if (active) {
          setRegions([]);
          setRegionError('Không thể tải danh sách vùng. Vui lòng thử lại.');
        }
      } finally {
        if (active) {
          setRegionsLoading(false);
        }
      }
    };

    fetchRegions();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!filters.region) {
      setProvinces([]);
      setProvincesLoading(false);
      return () => {
        active = false;
      };
    }

    const fetchProvinces = async () => {
      setProvincesLoading(true);
      try {
        const response = await regionsAPI.getProvinces(filters.region);
        const rawProvinces = Array.isArray(response) ? response : [];
        if (active) {
          const processedProvinces = rawProvinces
            .filter((province) => province?.id !== undefined)
            .map((province) => ({
              id: String(province.id),
              name: province?.name ?? 'Không tên',
              regionId: (() => {
                if (province.regionId !== undefined && province.regionId !== null) {
                  return String(province.regionId);
                }
                if (province.region?.id !== undefined && province.region?.id !== null) {
                  return String(province.region.id);
                }
                if (province.region?.regionId !== undefined && province.region?.regionId !== null) {
                  return String(province.region.regionId);
                }
                return String(filters.region);
              })(),
            }));
          
          setProvinces(processedProvinces);

          // Auto-select province if destinationName matches
          if (filters.destinationName) {
            console.log('Looking for destination:', filters.destinationName);
            console.log('Available provinces:', processedProvinces.map(p => p.name));
            
            const matchingProvince = processedProvinces.find(
              province => province.name.toLowerCase().trim() === filters.destinationName.toLowerCase().trim()
            );
            
            console.log('Matching province found:', matchingProvince);
            
            if (matchingProvince) {
              console.log('Setting province to:', matchingProvince.id);
              setFilters(prev => ({
                ...prev,
                province: matchingProvince.id,
                destinationName: undefined // Clear temporary field
              }));
            } else {
              // If exact match not found, try partial match
              const partialMatch = processedProvinces.find(
                province => province.name.toLowerCase().includes(filters.destinationName.toLowerCase()) ||
                           filters.destinationName.toLowerCase().includes(province.name.toLowerCase())
              );
              
              if (partialMatch) {
                console.log('Partial match found:', partialMatch);
                setFilters(prev => ({
                  ...prev,
                  province: partialMatch.id,
                  destinationName: undefined
                }));
              }
            }
          }
        }
      } catch (err) {
        console.error('Không thể tải danh sách tỉnh thành', err);
        if (active) {
          setProvinces([]);
        }
      } finally {
        if (active) {
          setProvincesLoading(false);
        }
      }
    };

    fetchProvinces();

    return () => {
      active = false;
    };
  }, [filters.region, filters.destinationName]);

  useEffect(() => {
    const trimmedKeyword = searchInput.trim();
    const handler = setTimeout(() => {
      setKeyword((previous) => (previous === trimmedKeyword ? previous : trimmedKeyword));
    }, 250);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, filters.priceOrder, filters.startDate, filters.endDate, filters.region, filters.province]);

  const filteredTours = useMemo(() => {
    let results = [...allTours];

    if (filters.priceOrder === 'asc') {
      results = results.sort((a, b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0));
    } else if (filters.priceOrder === 'desc') {
      results = results.sort((a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0));
    }

    return results;
  }, [allTours, filters.priceOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredTours.length / PAGE_SIZE) || 1);
  const safePage = Math.min(currentPage, totalPages);

  const paginatedTours = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return filteredTours.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredTours, safePage]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginationRange = useMemo(() => {
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, safePage - half);
    let end = Math.min(totalPages, start + windowSize - 1);

    if (end - start < windowSize - 1) {
      start = Math.max(1, end - windowSize + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [safePage, totalPages]);

  const handleResetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setProvinces([]);
    setSearchInput('');
    setKeyword('');
  };

  const emptyStateVisible = !loading && paginatedTours.length === 0;

  return (
    <main id="main-content" className="bg-white">
      <section className="border-b border-gray-100 bg-gray-25">
        <div className="container space-y-6 py-12">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Khám phá</p>
            <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">Tour dành cho bạn</h1>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-card md:flex-row md:items-center"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Nhập điểm đến, chủ đề hoặc từ khóa tour..."
                className="w-full rounded-2xl border border-transparent bg-gray-25 py-3 pl-12 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                aria-label="Tìm kiếm tour"
              />
            </div>
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
            >
              Xóa từ khóa
            </button>
          </form>
        </div>
      </section>

      <section className="container grid gap-10 py-16 lg:grid-cols-[320px_1fr]">
        <FilterPanel
          value={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          regions={regions}
          provinces={provinces}
          isRegionsLoading={isRegionsLoading}
          isProvincesLoading={isProvincesLoading}
          regionError={regionError}
        />

        <div className="space-y-8">
          {error && null}

          <TourGrid tours={paginatedTours} isLoading={loading} />

          {emptyStateVisible && (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-25 p-10 text-center">
              <h3 className="text-xl font-semibold text-gray-900">Chưa tìm thấy tour phù hợp</h3>
              <p className="mt-2 text-sm text-gray-600">
                Hãy thử thay đổi thời gian, khu vực hoặc từ khóa. Bạn vẫn có thể điều chỉnh logic lọc này
                theo nhu cầu khi kết nối dữ liệu thật.
              </p>
            </div>
          )}

          <nav
            className="flex items-center justify-center gap-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-card"
            aria-label="Phân trang tour"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-brand-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trước
              </button>
              {paginationRange.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition ${
                    page === safePage
                      ? 'bg-brand-500 text-white shadow-lg'
                      : 'border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-gray-900'
                  }`}
                  aria-current={page === safePage ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages || filteredTours.length === 0}
                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-brand-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </nav>
        </div>
      </section>
    </main>
  );
};

export default ToursPageExplore;
