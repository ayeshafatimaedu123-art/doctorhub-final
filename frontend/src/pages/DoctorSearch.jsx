import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors } from '../redux/slices/doctorSlice';
import DoctorCard from '../components/doctor/DoctorCard';
import Spinner from '../components/common/Spinner';
import { Link } from 'react-router-dom';

const TREATMENT_TYPES = ['', 'Allopathic', 'Homeopathic', 'Herbal'];

const DoctorSearch = () => {
  const dispatch = useDispatch();
  const { list: doctors, loading, total, pages } = useSelector(s => s.doctors);
  const [filters, setFilters] = useState({ search: '', treatmentType: '', city: '', disease: '', minFee: '', maxFee: '', page: 1 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    dispatch(fetchDoctors(params));
  }, [filters]);

  const handleChange = (e) => setFilters(p => ({ ...p, [e.target.name]: e.target.value, page: 1 }));
  const clearFilters = () => setFilters({ search: '', treatmentType: '', city: '', disease: '', minFee: '', maxFee: '', page: 1 });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-teal-500 pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white">Find Doctors</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Find Your Doctor</h1>
          <p className="text-white/80 mb-8">Search from {total || '500+'} verified doctors by disease, specialization, or city</p>
          {/* Main Search */}
          <div className="flex gap-3 max-w-3xl">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input name="search" value={filters.search} onChange={handleChange} type="text" placeholder="Search by disease, doctor name, specialization..." className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/95" />
            </div>
            <button onClick={() => setShowFilters(p => !p)} className="bg-white/20 border border-white/30 text-white px-5 py-3.5 rounded-xl font-medium flex items-center gap-2 hover:bg-white/30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Panel */}
        {showFilters && (
          <div className="card mb-6 animate-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Advanced Filters</h3>
              <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium">Clear All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Treatment Type</label>
                <select name="treatmentType" value={filters.treatmentType} onChange={handleChange} className="input-field py-2.5 text-sm">
                  {TREATMENT_TYPES.map(t => <option key={t} value={t}>{t || 'All Types'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Disease</label>
                <input name="disease" value={filters.disease} onChange={handleChange} type="text" placeholder="e.g. Diabetes" className="input-field py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">City</label>
                <input name="city" value={filters.city} onChange={handleChange} type="text" placeholder="e.g. Lahore" className="input-field py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Min Fee (Rs)</label>
                <input name="minFee" value={filters.minFee} onChange={handleChange} type="number" placeholder="500" className="input-field py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Max Fee (Rs)</label>
                <input name="maxFee" value={filters.maxFee} onChange={handleChange} type="number" placeholder="3000" className="input-field py-2.5 text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {loading ? 'Searching...' : <><span className="font-semibold text-slate-900 dark:text-white">{total}</span> doctors found</>}
          </p>
        </div>

        {loading ? (
          <Spinner center size="lg" />
        ) : doctors.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Doctors Found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your search filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {doctors.map(doctor => <DoctorCard key={doctor._id || doctor.id} doctor={doctor} />)}
            </div>
            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setFilters(prev => ({ ...prev, page: p }))} className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${filters.page === p ? 'bg-primary-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-slate-200 dark:border-slate-700'}`}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
