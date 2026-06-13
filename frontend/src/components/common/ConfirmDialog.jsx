import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Confirm', confirmClass = 'btn-danger', loading = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm"
    footer={
      <>
        <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className={`${confirmClass} text-sm flex items-center gap-2`}>
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {confirmLabel}
        </button>
      </>
    }
  >
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{message}</p>
  </Modal>
);

export default ConfirmDialog;
