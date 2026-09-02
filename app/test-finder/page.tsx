'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Button, Card, Alert, Badge } from '@/components/ui';
import Link from 'next/link';
import { 
  CheckCircle, 
  Heart, 
  Scale, 
  Plane, 
  Stethoscope, 
  HelpCircle,
  Users,
  Baby,
  User,
  Home,
  MapPin,
  Globe,
  Building,
  CalendarDays,
  DollarSign,
  Shield,
  ArrowRight,
  RotateCcw,
  Info
} from 'lucide-react';

interface TestRecommendation {
  name: string;
  description: string;
  category: string;
  isLegal: boolean;
  chainOfCustody: boolean;
  estimatedDays: string;
  estimatedCost: string;
  slug: string;
}

export default function TestFinderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    purpose: '',
    relationship: '',
    legalRequired: '',
    country: '',
    participants: '',
    pregnant: '',
  });
  const [recommendation, setRecommendation] = useState<TestRecommendation | null>(null);

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRecommendation();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setFormData({
      purpose: '',
      relationship: '',
      legalRequired: '',
      country: '',
      participants: '',
      pregnant: '',
    });
    setRecommendation(null);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateRecommendation = () => {
    // Simple rule-based recommendation engine
    let recommendation: TestRecommendation;

    // Prenatal Testing
    if (formData.pregnant === 'yes') {
      recommendation = {
        name: 'Non-Invasive Prenatal Paternity DNA Test',
        description: 'DNA testing during pregnancy using a simple blood sample from the mother. Safe, accurate, and non-invasive.',
        category: 'PRENATAL',
        isLegal: false,
        chainOfCustody: false,
        estimatedDays: '7-10 business days',
        estimatedCost: '₦450,000 or $550 USD',
        slug: 'prenatal-paternity-dna-test',
      };
    }
    // Immigration Testing
    else if (formData.purpose === 'immigration') {
      const countryMap: Record<string, TestRecommendation> = {
        'United Kingdom': {
          name: 'UK Immigration DNA Test',
          description: 'Home Office approved DNA testing for UK visa applications with full identity verification and chain of custody.',
          category: 'IMMIGRATION',
          isLegal: true,
          chainOfCustody: true,
          estimatedDays: '5-7 business days',
          estimatedCost: '£450 GBP',
          slug: 'uk-immigration-dna-test',
        },
        'United States': {
          name: 'USA Immigration DNA Test',
          description: 'USCIS approved DNA testing for US immigration applications with embassy-standard collection and documentation.',
          category: 'IMMIGRATION',
          isLegal: true,
          chainOfCustody: true,
          estimatedDays: '5-7 business days',
          estimatedCost: '$550 USD',
          slug: 'usa-immigration-dna-test',
        },
        'Canada': {
          name: 'Canada Immigration DNA Test',
          description: 'Immigration Canada approved DNA testing with identity verification and chain of custody documentation.',
          category: 'IMMIGRATION',
          isLegal: true,
          chainOfCustody: true,
          estimatedDays: '5-7 business days',
          estimatedCost: '$500 CAD',
          slug: 'canada-immigration-dna-test',
        },
      };
      recommendation = countryMap[formData.country] || countryMap['United Kingdom'];
    }
    // Legal/Court Testing
    else if (formData.legalRequired === 'yes' || formData.purpose === 'legal') {
      recommendation = {
        name: 'Legal Paternity DNA Test',
        description: 'Court-admissible DNA testing with identity verification, witnessed sample collection, and full chain of custody documentation.',
        category: 'LEGAL',
        isLegal: true,
        chainOfCustody: true,
        estimatedDays: '3-5 business days',
        estimatedCost: '₦95,000',
        slug: 'legal-paternity-dna-test',
      };
    }
    // Sibling Testing
    else if (formData.relationship === 'sibling') {
      recommendation = {
        name: 'Sibling DNA Test',
        description: 'Determine if two individuals share one or both biological parents through DNA analysis.',
        category: 'SIBLING',
        isLegal: false,
        chainOfCustody: false,
        estimatedDays: '3-5 business days',
        estimatedCost: '₦85,000',
        slug: 'sibling-dna-test',
      };
    }
    // Maternity Testing
    else if (formData.relationship === 'maternity') {
      recommendation = {
        name: 'Maternity DNA Test',
        description: 'Establish biological relationship between mother and child through DNA analysis.',
        category: 'MATERNITY',
        isLegal: false,
        chainOfCustody: false,
        estimatedDays: '3 business days',
        estimatedCost: '₦65,000',
        slug: 'maternity-dna-test',
      };
    }
    // Default: Standard Paternity
    else {
      recommendation = {
        name: 'Paternity DNA Test',
        description: 'Standard paternity testing for personal knowledge. Accurate, confidential, and fast results.',
        category: 'PATERNITY',
        isLegal: false,
        chainOfCustody: false,
        estimatedDays: '3 business days',
        estimatedCost: '₦65,000',
        slug: 'paternity-dna-test',
      };
    }

    setRecommendation(recommendation);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.purpose !== '';
      case 2:
        return formData.relationship !== '';
      case 3:
        return formData.legalRequired !== '';
      case 4:
        return formData.country !== '';
      case 5:
        return formData.participants !== '';
      case 6:
        return formData.pregnant !== '';
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 py-12 md:py-16">
        <Container>
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">
              Intelligent Test Finder
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Find Your Perfect DNA Test
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Answer a few simple questions and we'll recommend the most appropriate test coordinated through our laboratory network
            </p>
          </div>

          {!recommendation ? (
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-xl border-2 border-gray-100">
                <div className="p-8 md:p-12">
                  {/* Enhanced Progress Bar */}
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-navy-900">
                        Step {currentStep} of {totalSteps}
                      </span>
                      <span className="text-sm font-semibold text-teal-600">
                        {Math.round((currentStep / totalSteps) * 100)}% Complete
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                      />
                    </div>
                    
                    {/* Step Labels */}
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span className={currentStep >= 1 ? 'text-teal-600 font-medium' : ''}>Purpose</span>
                      <span className={currentStep >= 2 ? 'text-teal-600 font-medium' : ''}>Relationship</span>
                      <span className={currentStep >= 3 ? 'text-teal-600 font-medium' : ''}>Legal Status</span>
                      <span className={currentStep >= 4 ? 'text-teal-600 font-medium' : ''}>Location</span>
                      <span className={currentStep >= 5 ? 'text-teal-600 font-medium' : ''}>Participants</span>
                      <span className={currentStep >= 6 ? 'text-teal-600 font-medium' : ''}>Final</span>
                    </div>
                  </div>

                  {/* Step 1: Purpose - Enhanced Cards */}
                  {currentStep === 1 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
                          What is the primary purpose?
                        </h2>
                        <p className="text-lg text-gray-600">
                          This helps us recommend the right testing pathway
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { value: 'personal', label: 'Personal Knowledge', desc: 'Peace of mind testing', icon: Heart, color: 'blue' },
                          { value: 'legal', label: 'Legal / Court', desc: 'Court-admissible testing', icon: Scale, color: 'purple' },
                          { value: 'immigration', label: 'Immigration / Visa', desc: 'Embassy-approved testing', icon: Plane, color: 'teal' },
                          { value: 'medical', label: 'Medical / Health', desc: 'Health-related testing', icon: Stethoscope, color: 'green' },
                          { value: 'other', label: 'Other Purpose', desc: 'Different testing need', icon: HelpCircle, color: 'gray' },
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = formData.purpose === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => updateFormData('purpose', option.value)}
                              className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                                isSelected
                                  ? 'border-teal-500 bg-white shadow-lg scale-[1.02]'
                                  : 'border-gray-200 hover:border-teal-300 hover:shadow-md hover:scale-[1.01]'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected 
                                    ? 'bg-teal-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-teal-100 group-hover:text-teal-600'
                                }`}>
                                  <Icon className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-navy-900 mb-1">
                                    {option.label}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {option.desc}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Relationship - Enhanced Cards */}
                  {currentStep === 2 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
                          What relationship to establish?
                        </h2>
                        <p className="text-lg text-gray-600">
                          Select the biological relationship you need to test
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { value: 'paternity', label: 'Paternity', desc: 'Father and child relationship', icon: User },
                          { value: 'maternity', label: 'Maternity', desc: 'Mother and child relationship', icon: Heart },
                          { value: 'sibling', label: 'Sibling', desc: 'Brother or sister relationship', icon: Users },
                          { value: 'grandparent', label: 'Grandparent', desc: 'Grandparent and grandchild', icon: Home },
                          { value: 'other', label: 'Other Relationship', desc: 'Different family relationship', icon: HelpCircle },
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = formData.relationship === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => updateFormData('relationship', option.value)}
                              className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                                isSelected
                                  ? 'border-teal-500 bg-white shadow-lg scale-[1.02]'
                                  : 'border-gray-200 hover:border-teal-300 hover:shadow-md hover:scale-[1.01]'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected 
                                    ? 'bg-teal-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-teal-100 group-hover:text-teal-600'
                                }`}>
                                  <Icon className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-navy-900 mb-1">
                                    {option.label}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {option.desc}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Legal Requirement - Enhanced Cards */}
                  {currentStep === 3 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
                          Is this for legal or official use?
                        </h2>
                        <p className="text-lg text-gray-600 mb-4">
                          Legal tests require identity verification and chain of custody
                        </p>
                        <div className="inline-flex items-center gap-2 bg-white border border-blue-300 rounded-lg px-4 py-2 shadow-sm">
                          <Info className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-navy-900 font-medium">
                            Legal testing coordinated with certified laboratories
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 max-w-2xl mx-auto">
                        {[
                          { value: 'yes', label: 'Yes - Legal/Official Use', desc: 'For court, immigration, or official purposes', icon: Scale },
                          { value: 'no', label: 'No - Personal Knowledge', desc: 'For peace of mind only', icon: Heart },
                          { value: 'unsure', label: 'I\'m Not Sure', desc: 'Help me decide', icon: HelpCircle },
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = formData.legalRequired === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => updateFormData('legalRequired', option.value)}
                              className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                                isSelected
                                  ? 'border-teal-500 bg-white shadow-lg scale-[1.02]'
                                  : 'border-gray-200 hover:border-teal-300 hover:shadow-md hover:scale-[1.01]'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected 
                                    ? 'bg-teal-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-teal-100 group-hover:text-teal-600'
                                }`}>
                                  <Icon className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-navy-900 mb-1">
                                    {option.label}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {option.desc}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}


                  {/* Step 4: Country - Enhanced Cards */}
                  {currentStep === 4 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
                          Which country is this for?
                        </h2>
                        <p className="text-lg text-gray-600">
                          Different countries have specific laboratory requirements
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { value: 'Nigeria', label: 'Nigeria', desc: 'Local laboratory testing', icon: MapPin },
                          { value: 'United Kingdom', label: 'United Kingdom', desc: 'UK immigration approved labs', icon: Building },
                          { value: 'United States', label: 'United States', desc: 'USCIS approved testing', icon: Building },
                          { value: 'Canada', label: 'Canada', desc: 'Immigration Canada approved', icon: Building },
                          { value: 'Other', label: 'Other Country', desc: 'International testing', icon: Globe },
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = formData.country === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => updateFormData('country', option.value)}
                              className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                                isSelected
                                  ? 'border-teal-500 bg-white shadow-lg scale-[1.02]'
                                  : 'border-gray-200 hover:border-teal-300 hover:shadow-md hover:scale-[1.01]'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected 
                                    ? 'bg-teal-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-teal-100 group-hover:text-teal-600'
                                }`}>
                                  <Icon className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-navy-900 mb-1">
                                    {option.label}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {option.desc}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 5: Participants - Enhanced Cards */}
                  {currentStep === 5 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
                          Where are the participants?
                        </h2>
                        <p className="text-lg text-gray-600 mb-4">
                          We coordinate testing across different locations
                        </p>
                        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-4 py-2">
                          <Globe className="w-4 h-4 text-teal-600" />
                          <span className="text-sm text-teal-900">
                            International coordination available
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 max-w-2xl mx-auto">
                        {[
                          { value: 'same', label: 'Same City', desc: 'All participants in one location', icon: Home },
                          { value: 'different-city', label: 'Different Cities', desc: 'Within the same country', icon: MapPin },
                          { value: 'different-country', label: 'Different Countries', desc: 'International coordination needed', icon: Globe },
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = formData.participants === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => updateFormData('participants', option.value)}
                              className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                                isSelected
                                  ? 'border-teal-500 bg-white shadow-lg scale-[1.02]'
                                  : 'border-gray-200 hover:border-teal-300 hover:shadow-md hover:scale-[1.01]'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected 
                                    ? 'bg-teal-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-teal-100 group-hover:text-teal-600'
                                }`}>
                                  <Icon className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-navy-900 mb-1">
                                    {option.label}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {option.desc}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 6: Pregnancy - Enhanced Cards */}
                  {currentStep === 6 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
                          Is the mother currently pregnant?
                        </h2>
                        <p className="text-lg text-gray-600 mb-4">
                          Non-invasive prenatal testing available from 7 weeks
                        </p>
                        <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-lg px-4 py-2">
                          <Baby className="w-4 h-4 text-pink-600" />
                          <span className="text-sm text-pink-900">
                            Safe for mother and baby
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 max-w-2xl mx-auto">
                        {[
                          { value: 'yes', label: 'Yes - Prenatal Testing', desc: 'Non-invasive prenatal paternity test', icon: Baby },
                          { value: 'no', label: 'No', desc: 'Standard testing after birth', icon: Heart },
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = formData.pregnant === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => updateFormData('pregnant', option.value)}
                              className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                                isSelected
                                  ? 'border-teal-500 bg-white shadow-lg scale-[1.02]'
                                  : 'border-gray-200 hover:border-teal-300 hover:shadow-md hover:scale-[1.01]'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected 
                                    ? 'bg-teal-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-teal-100 group-hover:text-teal-600'
                                }`}>
                                  <Icon className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-navy-900 mb-1">
                                    {option.label}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {option.desc}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}


                  {/* Enhanced Navigation Buttons */}
                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      size="lg"
                      className="group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      size="lg"
                      className="group shadow-lg hover:shadow-xl"
                    >
                      {currentStep === totalSteps ? 'Get Recommendation' : 'Continue'}
                      {currentStep < totalSteps && (
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                      {currentStep === totalSteps && (
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              {/* Success Alert */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-1">
                      Perfect Match Found!
                    </h3>
                    <p className="text-green-700">
                      Based on your answers, we recommend the following test coordinated through our verified laboratory network
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Recommendation Card */}
              <Card className="overflow-hidden shadow-2xl border-2 border-gray-100">
                {/* Header Gradient */}
                <div className="bg-gradient-to-r from-navy-900 to-teal-900 p-8 text-white">
                  <Badge className="bg-white/20 border-white/30 text-white mb-4">
                    Recommended Test
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 !text-white">
                    {recommendation.name}
                  </h2>
                  <p className="text-xl text-gray-200 leading-relaxed">
                    {recommendation.description}
                  </p>
                </div>

                {/* Test Details Grid */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Test Type</h3>
                      </div>
                      <p className="text-xl font-semibold text-navy-900">
                        {recommendation.isLegal ? 'Legal / Official Use' : 'Personal / Peace of Mind'}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Scale className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Chain of Custody</h3>
                      </div>
                      <p className="text-xl font-semibold text-navy-900">
                        {recommendation.chainOfCustody ? (
                          <span className="flex items-center gap-2">
                            Required <CheckCircle className="w-5 h-5 text-green-600" />
                          </span>
                        ) : (
                          'Not Required'
                        )}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <CalendarDays className="w-5 h-5 text-teal-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Turnaround Time</h3>
                      </div>
                      <p className="text-xl font-semibold text-navy-900">
                        {recommendation.estimatedDays}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Estimated Cost</h3>
                      </div>
                      <p className="text-xl font-semibold text-navy-900">
                        {recommendation.estimatedCost}
                      </p>
                    </div>
                  </div>

                  {/* Platform Message */}
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-teal-900 font-medium mb-1">
                          Testing coordinated by Afrigenomix
                        </p>
                        <p className="text-sm text-teal-700">
                          We'll connect you with our verified laboratory partners and coordinate every step of your testing journey from sample collection to result delivery.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={`/tests/${recommendation.slug}`} className="flex-1">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        className="w-full shadow-lg hover:shadow-xl group"
                      >
                        View Full Test Details
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="/register" className="flex-1">
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="w-full shadow-md hover:shadow-lg"
                      >
                        Get Started Now
                      </Button>
                    </Link>
                  </div>

                  {/* Restart Option */}
                  <button
                    onClick={handleRestart}
                    className="w-full mt-6 flex items-center justify-center gap-2 text-gray-600 hover:text-navy-900 font-medium transition-colors group"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Start over with different answers
                  </button>
                </div>
              </Card>

              {/* Help Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-navy-900 mb-2">
                        Need Help Deciding?
                      </h3>
                      <p className="text-navy-800 mb-4">
                        Our DNA testing specialists are available to discuss your needs and answer any questions about the testing process.
                      </p>
                      <Link href="/contact">
                        <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 border-navy-300">
                          Contact a Specialist
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
