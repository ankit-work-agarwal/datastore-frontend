function ToastNotifications({ toasts, onClose }) {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000, display: 'grid', gap: 8 }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            minWidth: 280,
            maxWidth: 420,
            padding: '10px 12px',
            borderRadius: 6,
            color: '#fff',
            backgroundColor: toast.type === 'error' ? '#d32f2f' : '#2e7d32',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => onClose(toast.id)}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            aria-label="Close notification"
          >
            x
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastNotifications

