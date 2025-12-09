import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiSettings, FiEdit, FiSliders, FiBarChart2, FiFileText, FiDownload, FiLink, FiEye } = FiIcons;

const ProductShowcase = () => {
  const features = [
    {
      title: "Intuitive Interface",
      description: "Clean, modern design that guides you through each step of the audiobook creation process",
      icon: FiEdit,
      position: "left"
    },
    {
      title: "Advanced Voice Customization",
      description: "Fine-tune pacing, tone, and emphasis with our precision controls",
      icon: FiSliders,
      position: "right"
    },
    {
      title: "Quality Analysis",
      description: "Built-in audio quality checks ensure your audiobook meets industry standards",
      icon: FiBarChart2,
      position: "left"
    },
    {
      title: "Chapter Management",
      description: "Automatically detect chapters or manually organize your content with our chapter tools",
      icon: FiFileText,
      position: "right"
    },
    {
      title: "Public Link Sharing",
      description: "Generate shareable links for previews and distribute your audiobook easily",
      icon: FiLink,
      position: "left"
    },
    {
      title: "Export Options",
      description: "Export in formats ready for all major distribution platforms",
      icon: FiDownload,
      position: "right"
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="product-showcase" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-primary-300/20 to-secondary-300/20 rounded-full filter blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-secondary-300/20 to-primary-300/20 rounded-full filter blur-3xl opacity-50 transform translate-x-1/2 translate-y-1/2"></div>

        <div className="text-center mb-16 relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Powerful{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              Features
            </span>
            , Simple Experience
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Everything you need to create professional audiobooks without the complexity
          </motion.p>
        </div>

        {/* Enhanced Product Screenshot with UI/UX Panel */}
        <motion.div
          className="relative mx-auto mb-20 max-w-6xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden p-3">
            <div className="flex items-center border-b border-gray-700 pb-2 px-2">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mx-auto text-sm text-gray-400">AudiobookSmith Studio</div>
            </div>

            {/* Enhanced UI Panel */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="flex flex-col lg:flex-row h-auto lg:h-[500px]">
                {/* Left Sidebar */}
                <div className="w-full lg:w-64 bg-white border-r border-gray-200 p-4">
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-gray-700 mb-3">My Projects</div>
                    <div className="space-y-2">
                      <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                        <div className="font-medium text-sm">The Great Novel</div>
                        <div className="text-xs text-gray-500">Chapter 12 of 24</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-primary-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="font-medium text-sm">Marketing Guide</div>
                        <div className="text-xs text-gray-500">Ready to export</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-4 lg:p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chapter Analysis</h3>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-xl lg:text-2xl font-bold text-primary-600">12:45</div>
                          <div className="text-xs text-gray-500">Estimated Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl lg:text-2xl font-bold text-green-600">2,847</div>
                          <div className="text-xs text-gray-500">Words</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl lg:text-2xl font-bold text-blue-600">A+</div>
                          <div className="text-xs text-gray-500">Quality Score</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="mb-2"><strong>Current Chapter:</strong> "The Discovery"</p>
                        <p className="mb-2"><strong>Voice:</strong> Professional Female - Sarah</p>
                        <p><strong>Status:</strong> Processing... 78% complete</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chapter Management</h3>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="divide-y divide-gray-200">
                        <div className="p-3 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <SafeIcon icon={FiEye} className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">Chapter 1: The Beginning</div>
                              <div className="text-xs text-gray-500">8:32 • 2,145 words</div>
                            </div>
                          </div>
                          <button className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                            Preview
                          </button>
                        </div>
                        <div className="p-3 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <SafeIcon icon={FiSettings} className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">Chapter 2: The Journey</div>
                              <div className="text-xs text-gray-500">Processing... 45%</div>
                            </div>
                          </div>
                          <button className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Public Access</h3>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-sm">Share Preview</div>
                          <div className="text-xs text-gray-500">Let others preview your audiobook</div>
                        </div>
                        <button className="mt-2 lg:mt-0 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          <SafeIcon icon={FiLink} className="w-3 h-3 inline mr-1" />
                          Copy Link
                        </button>
                      </div>
                      <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded overflow-hidden">
                        https://preview.audiobooksmith.com/abc123...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features List - Mobile Responsive */}
        <div className="relative z-10">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`flex ${
                  feature.position === 'right' ? 'md:flex-row-reverse md:text-right' : 'text-left'
                }`}
                initial={{ opacity: 0, x: feature.position === 'right' ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              >
                <div className={`flex-shrink-0 ${feature.position === 'right' ? 'md:ml-4' : 'md:mr-4'} mb-4 md:mb-0`}>
                  <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
                    <SafeIcon icon={feature.icon} className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            onClick={() => scrollToSection('transform-form')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-xl"
          >
            Try It Risk-Free Today
          </button>
          <p className="mt-4 text-gray-600">30-day money-back guarantee, no questions asked</p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;