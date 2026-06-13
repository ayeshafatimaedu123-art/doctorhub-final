import { Link } from 'react-router-dom';

const treatmentColors = {
  Allopathic: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Homeopathic: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Herbal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

const DoctorCard = ({ doctor }) => {
  const user = doctor.userId;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="card hover:shadow-card-hover group transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
          ) : initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">Dr. {user?.name}</h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mt-0.5">{doctor.specialization}</p>
            </div>
            <span className={`badge-status ${treatmentColors[doctor.treatmentType]}`}>{doctor.treatmentType}</span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500 dark:text-slate-400">
            {doctor.experience > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {doctor.experience} yrs exp
              </span>
            )}
            {doctor.city && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {doctor.city}
              </span>
            )}
            {doctor.rating > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                {doctor.rating.toFixed(1)} ({doctor.totalReviews})
              </span>
            )}
          </div>

          {/* Diseases */}
          {doctor.diseases?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {doctor.diseases.slice(0, 3).map(d => (
                <span key={d} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg">{d}</span>
              ))}
              {doctor.diseases.length > 3 && (
                <span className="text-xs text-slate-400 dark:text-slate-500 px-2.5 py-1">+{doctor.diseases.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Consultation Fee</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            <span className="text-sm font-normal text-slate-500">Rs. </span>{doctor.fee?.toLocaleString()}
          </p>
        </div>
        <Link
          to={`/doctors/${doctor._id}`}
          className="btn-primary text-sm py-2 px-4"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
