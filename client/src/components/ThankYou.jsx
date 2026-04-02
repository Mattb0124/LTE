export default function ThankYou({ onClose }) {
  return (
    <div className="thank-you show">
      <div className="thank-you-card">
        <div className="accent-line"></div>
        <h2>Thank You</h2>
        <p>
          We've received your inquiry. A member of the Luke's LTE team will be in touch with you shortly.
        </p>
        <button className="btn-close" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
