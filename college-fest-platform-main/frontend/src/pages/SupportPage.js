import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  LifeBuoy,
  ShieldCheck
} from 'lucide-react';

const TOPIC_META = {
  faq: { label: 'FAQ', icon: HelpCircle },
  terms: { label: 'Terms & Conditions', icon: FileText },
  privacy: { label: 'Privacy Policy', icon: ShieldCheck },
  'help-center': { label: 'Help Center', icon: LifeBuoy }
};

const TOPIC_ORDER = ['faq', 'terms', 'privacy', 'help-center'];

const TOPIC_CONTENT = {
  faq: {
    title: 'Frequently Asked Questions',
    intro: 'Quick answers to the most common questions from participants.',
    type: 'faq',
    items: [
      {
        question: 'Who can register for the fest?',
        answer: 'Any college student with a valid email ID and college details can create an account and participate.'
      },
      {
        question: 'Is the fest fee one-time or per event?',
        answer: 'The fest fee is a one-time payment. After admin approval, you can register for multiple events.'
      },
      {
        question: 'How long does payment verification take?',
        answer: 'Manual verification usually happens within a few hours, depending on submission volume.'
      },
      {
        question: 'Can I edit my registration details later?',
        answer: 'You can update profile details from your account. Event-specific registration rules may vary.'
      },
      {
        question: 'What if my payment is rejected?',
        answer: 'You can submit fresh proof with correct UTR details and a clear payment screenshot.'
      }
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'Please read these rules before using the platform.',
    type: 'sections',
    sections: [
      {
        heading: 'Eligibility',
        body: 'You must provide accurate personal and college information while creating an account.',
        points: [
          'Only valid participants are allowed to register for events.',
          'Fake or misleading details may lead to account suspension.'
        ]
      },
      {
        heading: 'Payments and Registrations',
        body: 'Fest access is unlocked only after payment verification by admin.',
        points: [
          'Payment proof must include correct UTR and clear screenshot.',
          'Duplicate or invalid payment proof can be rejected.'
        ]
      },
      {
        heading: 'Platform Usage',
        body: 'You agree to use the platform responsibly and follow event-specific rules.',
        points: [
          'Do not attempt unauthorized access to admin features.',
          'Any abusive activity may result in a permanent ban.'
        ]
      }
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'How we collect, use, and protect your data.',
    type: 'sections',
    sections: [
      {
        heading: 'Data We Collect',
        body: 'We collect basic registration and participation data to run fest operations.',
        points: [
          'Name, email, phone, and college details.',
          'Payment references and uploaded payment proof.'
        ]
      },
      {
        heading: 'Why We Use It',
        body: 'Data is used only for authentication, registrations, approvals, and communication.',
        points: [
          'To verify payment and manage event entries.',
          'To provide support and platform notifications.'
        ]
      },
      {
        heading: 'Data Protection',
        body: 'We apply access control and secure backend practices to protect participant data.',
        points: [
          'Sensitive routes are permission-protected.',
          'Only authorized admins can review payment proof.'
        ]
      }
    ]
  },
  'help-center': {
    title: 'Help Center',
    intro: 'Need help with account, payment, or event registration? Start here.',
    type: 'sections',
    sections: [
      {
        heading: 'Account Help',
        body: 'For login/signup issues, verify your email and password and try again.',
        points: [
          'Use the latest browser version.',
          'Ensure the API URL is configured correctly for your environment.'
        ]
      },
      {
        heading: 'Payment Help',
        body: 'If payment is pending for too long, share your UTR and submission time with support.',
        points: [
          'Upload screenshots below 2 MB.',
          'Use one UTR number per submission.'
        ]
      },
      {
        heading: 'Contact Support',
        body: 'If your issue is unresolved, contact us directly.',
        points: [
          'Email: info@techfest2026.com',
          'Phone: +91 80195 48729',
          'Location: Vignan University'
        ]
      }
    ]
  }
};

const SupportPage = () => {
  const { topic = '' } = useParams();
  const content = TOPIC_CONTENT[topic];

  if (!content) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="glass rounded-xl p-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white mb-3">Support Topic Not Found</h1>
            <p className="text-gray-400 mb-6">
              Please choose one of the available support sections below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TOPIC_ORDER.map((slug) => (
                <Link
                  key={slug}
                  to={`/support/${slug}`}
                  className="glass rounded-lg px-4 py-3 hover:bg-white/10 transition-colors text-gray-300"
                >
                  {TOPIC_META[slug].label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-blue transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold gradient-text mb-2">{content.title}</h1>
          <p className="text-gray-400 max-w-2xl">{content.intro}</p>
          <p className="text-xs text-gray-500 mt-3">Last updated: April 20, 2026</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.aside
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass rounded-xl p-4 sticky top-24">
              <h2 className="text-white font-semibold mb-3">Support</h2>
              <div className="space-y-2">
                {TOPIC_ORDER.map((slug) => {
                  const Icon = TOPIC_META[slug].icon;
                  const active = slug === topic;
                  return (
                    <Link
                      key={slug}
                      to={`/support/${slug}`}
                      className={`w-full rounded-lg px-3 py-2 flex items-center justify-between transition-colors ${
                        active
                          ? 'bg-neon-blue/20 text-neon-blue'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {TOPIC_META[slug].label}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          <motion.section
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass rounded-xl p-6 md:p-8">
              {content.type === 'faq' ? (
                <div className="space-y-4">
                  {content.items.map((item, index) => (
                    <div key={item.question} className="rounded-lg border border-dark-border p-4 bg-dark-card/60">
                      <p className="text-white font-semibold mb-2">
                        {index + 1}. {item.question}
                      </p>
                      <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {content.sections.map((section) => (
                    <div key={section.heading} className="rounded-lg border border-dark-border p-5 bg-dark-card/60">
                      <h3 className="text-xl font-semibold text-white mb-2">{section.heading}</h3>
                      <p className="text-gray-300 mb-3 leading-relaxed">{section.body}</p>
                      {section.points?.length > 0 && (
                        <ul className="space-y-2">
                          {section.points.map((point) => (
                            <li key={point} className="text-gray-400 flex items-start gap-2">
                              <span className="text-neon-blue mt-0.5">*</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
