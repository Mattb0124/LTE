import { useState } from 'react'
import ThankYou from './ThankYou'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  timeline: '',
  vin: '',
  mileage: '',
  modifications: '',
  askingPrice: '',
}

export default function LeadForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showThankYou, setShowThankYou] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = true
    if (!form.email.trim()) newErrors.email = true
    if (!form.phone.trim()) newErrors.phone = true
    if (!form.timeline) newErrors.timeline = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setShowThankYou(true)
    } catch (err) {
      setSubmitError(err.message)
    }
  }

  function handleClose() {
    setShowThankYou(false)
    setForm(initialForm)
    setErrors({})
  }

  return (
    <>
      <header>
        <div className="logo-accent">Est. 2026</div>
        <h1>Luke's <span>LTE</span></h1>
        <p className="tagline">Lifted Truck Experience</p>
      </header>

      <main>
        <p className="intro">
          Begin your lifted truck journey. Complete the form below and a member of our team will reach out personally.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Contact */}
          <div className="form-section">
            <h2>Contact</h2>
            <div className="section-line"></div>

            <div className="form-group">
              <label htmlFor="fullName">Full Name <span className="required">*</span></label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className={errors.fullName ? 'field-error' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className={errors.email ? 'field-error' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone <span className="required">*</span></label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className={errors.phone ? 'field-error' : ''}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="form-section">
            <h2>Timeline</h2>
            <div className="section-line"></div>

            <div className="form-group">
              <label htmlFor="timeline">When are you looking to purchase? <span className="required">*</span></label>
              <select
                id="timeline"
                name="timeline"
                value={form.timeline}
                onChange={handleChange}
                className={errors.timeline ? 'field-error' : ''}
              >
                <option value="" disabled>Select your timeline</option>
                <option value="immediately">Immediately</option>
                <option value="30days">Within 30 Days</option>
                <option value="1-3months">1 – 3 Months</option>
                <option value="3-6months">3 – 6 Months</option>
                <option value="browsing">Just Browsing</option>
              </select>
            </div>
          </div>

          {/* Trade-In */}
          <div className="form-section">
            <h2>Trade-In</h2>
            <div className="section-line"></div>

            <div className="form-group">
              <label htmlFor="vin">VIN</label>
              <input
                type="text"
                id="vin"
                name="vin"
                value={form.vin}
                onChange={handleChange}
                placeholder="17-character vehicle identification number"
                maxLength={17}
              />
            </div>

            <div className="form-group">
              <label htmlFor="mileage">Mileage</label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={form.mileage}
                onChange={handleChange}
                placeholder="Current odometer reading"
                min={0}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modifications">Aftermarket Modifications</label>
              <textarea
                id="modifications"
                name="modifications"
                value={form.modifications}
                onChange={handleChange}
                placeholder="Lift kit, wheels, tires, exhaust, bumpers, lighting..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="askingPrice">Desired Value</label>
              <input
                type="text"
                id="askingPrice"
                name="askingPrice"
                value={form.askingPrice}
                onChange={handleChange}
                placeholder="What are you looking to get for your trade-in?"
              />
            </div>
          </div>

          {submitError && <p className="submit-error">{submitError}</p>}

          <button type="submit" className="btn-submit">
            <span>Submit Inquiry</span>
          </button>
        </form>
      </main>

      <footer>&copy; 2026 Luke's LTE &mdash; Lifted Truck Experience</footer>

      {showThankYou && <ThankYou onClose={handleClose} />}
    </>
  )
}
