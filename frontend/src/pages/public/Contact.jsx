import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      q: "How are the final marks calculated in the portal?",
      a: "The final subject mark is calculated out of 100 as: Internal Assessment (/25) + Converted External Mark (/75). The external exam raw score (/100) is automatically scaled by 0.75."
    },
    {
      q: "How does the AI Academic Risk Detection work?",
      a: "The AI engine evaluates multi-factor signals: attendance (<75% triggers alert), internal test scores, assignment timeliness, and score trajectories across subjects to flag students needing mentorship."
    },
    {
      q: "Can subject teachers customize the internal 25 marks components?",
      a: "Yes. Subject faculty can configure the weightings of Internal Tests, Model Exams, Assignments, Seminars, and Projects per subject to compose the 25 internal target marks."
    },
    {
      q: "How do students download their Section 10 Performance Report?",
      a: "Students can navigate to the Performance Report tab on their dashboard to view and print/download a high-fidelity official academic summary and AI action plan."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Help & Support</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Contact Academic Operations</h1>
        <p className="text-sm text-slate-400">
          Have questions regarding curriculum enrollment, assessment guidelines, or technical support? Our academic administration team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Contact Info & Support Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-8 border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-400" />
              Send Academic Inquiry
            </h2>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                <h3 className="font-bold text-base text-white">Inquiry Received</h3>
                <p className="text-xs text-slate-300">
                  Thank you! An academic coordinator will review your ticket and respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Verma"
                      className="input-field text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. student@portal.edu"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Inquiry Category</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Marks calculation query / Course enrollment"
                    className="input-field text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Message & Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question or technical issue..."
                    className="input-field text-xs resize-none"
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full !py-3 text-xs flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Contact Cards & FAQs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">Campus Location</h3>
                <p className="text-[11px] text-slate-400">Academic Block 4, Tech Campus, India</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">Academic Registrar</h3>
                <p className="text-[11px] text-slate-400">+91 (080) 4567-8900 (Mon-Fri 9AM-5PM)</p>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Frequently Asked Questions
            </h3>

            <div className="space-y-3 text-xs">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
                  <h4 className="font-bold text-slate-200">{faq.q}</h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
