import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctor } from '../redux/slices/doctorSlice';
import Spinner from '../components/common/Spinner';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const DoctorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: doctor, loading } = useSelector(s => s.doctors);
  const { isAuthenticated, user } = useSelector(s => s.auth);

  useEffect(() => { dispatch(fetchDoctor(id)); }, [id]);

  if (loading) return <Spinner center size="lg" />;
  if (!doctor) return <div className="text-center py-20 text-slate-500">Doctor not found</div>;

  const u = doctor.userId;
  const initials = u?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleBook = () => {
    if (!isAuthenticated) return navigate('/login');
    if (user?.role !== 'patient') return;
    navigate(`/patient/book/${doctor._id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-700 to-teal-600 pt-20 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white">Home</Link><span>›</span>
            <Link to="/doctors" className="hover:text-white">Doctors</Link><span>›</span>
            <span className="text-white">Dr. {u?.name}</span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 overflow-hidden">
              {u?.profileImage ? <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" /> : initials}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Dr. {u?.name}</h1>
                <span className="badge-status bg-white/20 text-white border border-white/30">{doctor.treatmentType}</span>
              </div>
              <p className="text-white/90 text-lg font-medium mb-1">{doctor.specialization}</p>
              {doctor.qualification && <p className="text-white/70 mb-2">{doctor.qualification}</p>}
              <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                {doctor.experience > 0 && <span>⏱ {doctor.experience} years experience</span>}
                {doctor.city && <span>📍 {doctor.city}</span>}
                {doctor.hospital && <span>🏥 {doctor.hospital}</span>}
                {doctor.rating > 0 && <span>⭐ {doctor.rating.toFixed(1)} ({doctor.totalReviews} reviews)</span>}
              </div>
            </div>
            <div className="text-center bg-white/10 rounded-2xl p-5 border border-white/20 min-w-[160px]">
              <p className="text-white/70 text-sm mb-1">Consultation Fee</p>
              <p className="text-3xl font-bold text-white">Rs. {doctor.fee?.toLocaleString()}</p>
              <button onClick={handleBook} className="mt-4 bg-white text-primary-700 font-bold py-2.5 px-6 rounded-xl w-full hover:bg-white/90 transition-all active:scale-95">
                {isAuthenticated && user?.role === 'patient' ? 'Book Now' : 'Login to Book'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        {/* Left */}
        <div className="md:col-span-2 space-y-6">
          {doctor.about && (
            <div className="card">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-3">About Doctor</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{doctor.about}</p>
            </div>
          )}

          {/* Diseases */}
          {doctor.diseases?.length > 0 && (
            <div className="card">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Conditions Treated</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.diseases.map(d => (
                  <span key={d} className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-3 py-1.5 rounded-lg text-sm font-medium">{d}</span>
                ))}
              </div>
            </div>
          )}

          {/* Clinics */}
          {doctor.clinics?.length > 0 && (
            <div className="card">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Clinic Locations</h3>
              <div className="space-y-4">
                {doctor.clinics.map(c => (
                  <div key={c._id} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{c.clinicName}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{c.address}, {c.city}</p>
                      {c.phone && <p className="text-sm text-primary-600 dark:text-primary-400">{c.phone}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Availability */}
          {doctor.availability?.length > 0 && (
            <div className="card">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Availability</h3>
              <div className="space-y-2">
                {DAYS.map(day => {
                  const slot = doctor.availability.find(a => a.day === day);
                  return (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400 font-medium w-24">{day.slice(0,3)}</span>
                      {slot?.isAvailable ? (
                        <span className="text-teal-600 dark:text-teal-400 font-semibold">{slot.startTime} – {slot.endTime}</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">Unavailable</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Book CTA */}
          <div className="card bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20 border-primary-100 dark:border-primary-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Book a Consultation</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Consultation fee: <span className="font-bold text-primary-600">Rs. {doctor.fee?.toLocaleString()}</span></p>
            <button onClick={handleBook} className="btn-primary w-full">
              {isAuthenticated && user?.role === 'patient' ? 'Book Appointment' : 'Login to Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
