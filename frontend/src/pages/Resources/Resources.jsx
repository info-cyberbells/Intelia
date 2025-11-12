import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

const FAQAccordion = () => {
  const [openItems, setOpenItems] = useState([0]);
  const [activeCategory, setActiveCategory] = useState('Get started');

  const categories = [
    'Get started',
    'Login & access',
    'Billing & payments',
    'My benefits',
    'Account settings'
  ];

  const faqData = {
    'Get started': [
      {
        question: 'How to upgrade to Pro account?',
        answer: 'Enjoy instant access to our vast library of 5,121 premium products and all upcoming new releases with super-fast download speeds powered by Amazon S3. Yes, you read that right. Getting $127,035 in value means you\'re saving more than 99% on all products making it the sweetest deal for premium design assets around.'
      },
      {
        question: 'I forgot my password',
        answer: 'Click on the "Forgot Password" link on the login page. Enter your email address and we\'ll send you instructions to reset your password.'
      },
      {
        question: 'I can\'t reset my password',
        answer: 'If you\'re having trouble resetting your password, please check your spam folder for the reset email. If you still can\'t find it, contact our support team for assistance.'
      }
    ],
    'Login & access': [
      {
        question: 'How do I log in to my account?',
        answer: 'Visit the login page and enter your email address and password. Click the "Login" button to access your account.'
      },
      {
        question: 'Can I use multiple devices?',
        answer: 'Yes, you can access your account from multiple devices simultaneously with your Pro account subscription.'
      }
    ],
    'Billing & payments': [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and bank transfers for annual subscriptions.'
      },
      {
        question: 'How do I change my billing information?',
        answer: 'Go to Account Settings > Billing & Payments to update your payment method and billing address.'
      }
    ],
    'My benefits': [
      {
        question: 'What are the Pro account benefits?',
        answer: 'Pro accounts get unlimited downloads, priority support, early access to new releases, and exclusive design resources.'
      },
      {
        question: 'Can I share my account with team members?',
        answer: 'Team plans are available that allow multiple users to access the account with their own login credentials.'
      }
    ],
    'Account settings': [
      {
        question: 'How do I change and reset my password?',
        answer: 'Navigate to Account Settings > Security. Click "Change Password" and follow the prompts to update your password.'
      },
      {
        question: 'How do I delete my account?',
        answer: 'Go to Account Settings > Privacy. Scroll to the bottom and click "Delete Account". Please note this action is permanent.'
      }
    ]
  };

  const toggleItem = (index) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const currentFAQs = faqData[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:ml-56 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Frequently asked question</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Categories */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-6 py-4 transition-colors border-b border-gray-100 last:border-b-0 ${activeCategory === category
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="flex-1">
            <div className="space-y-4">
              {currentFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-900 font-medium pr-4">
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0">
                      {openItems.includes(index) ? (
                        <X className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Answer Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${openItems.includes(index)
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;