import React from 'react';
import { Shield, Users, Lock, FileText, Zap, ChevronRight, Star } from 'lucide-react';
import { Button } from './ui/button';

type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'insurance' | 'researcher';

interface LandingPageProps {
  onAuth: (mode: 'signin' | 'signup', role?: UserRole) => void;
}

export function LandingPage({ onAuth }: LandingPageProps) {
  const features = [
    {
      icon: Shield,
      title: "Secure by Design",
      description: "Zero-knowledge proofs protect your privacy while maintaining data integrity"
    },
    {
      icon: Users,
      title: "Seamless Collaboration",
      description: "Connect patients, doctors, and healthcare providers in one unified platform"
    },
    {
      icon: Lock,
      title: "You Own Your Data",
      description: "Complete control over who accesses your health information"
    },
    {
      icon: FileText,
      title: "Immutable Records",
      description: "Blockchain-backed medical history that can't be tampered with"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Cardiotologist",
      content: "AfyaNet has transformed how I access and share patient data. The security features give both me and my patients complete peace of mind.",
      rating: 5
    },
    {
      name: "James Rodriguez",
      role: "Patient",
      content: "Finally, I have complete control over my medical records. I can share them instantly with new doctors while keeping my privacy intact.",
      rating: 5
    },
    {
      name: "City General Hospital",
      role: "Healthcare Institution",
      content: "The efficiency gains are remarkable. Our staff can focus on patient care instead of chasing paperwork across different systems.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">AfyaNet</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => onAuth('signin')}>
                Sign In
              </Button>
              <Button onClick={() => onAuth('signup')} className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
              Own Your Health.
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                {" "}Share Securely.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              The first blockchain-powered health platform that gives you complete control over your medical data 
              while enabling seamless, secure sharing with healthcare providers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => onAuth('signup', 'patient')}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                Register as Patient
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => onAuth('signup', 'doctor')}
                className="text-lg px-8 py-3 border-slate-300 hover:bg-slate-50"
              >
                Doctor Portal
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => onAuth('signup', 'hospital_admin')}
                className="text-lg px-8 py-3 border-slate-300 hover:bg-slate-50"
              >
                Hospital Access
              </Button>
            </div>

            {/* How it Works Animation */}
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">How AfyaNet Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Upload Records</h4>
                  <p className="text-slate-600 text-sm">Securely store your medical data using IPFS and blockchain technology</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Grant Access</h4>
                  <p className="text-slate-600 text-sm">Use smart contracts to control who can view your health information</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Instant Sharing</h4>
                  <p className="text-slate-600 text-sm">Healthcare providers access your data instantly with your permission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Built for the Future of Healthcare
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Combining cutting-edge blockchain technology with intuitive design 
              for a healthcare experience that puts you in control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-slate-600">
              See what doctors, patients, and institutions say about AfyaNet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">AfyaNet</span>
              </div>
              <p className="text-slate-400 text-sm">
                Empowering patients and healthcare providers with secure, decentralized health data management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Whitepaper</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Doctor Portal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hospital Integration</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 mt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 AfyaNet. All rights reserved. Built with security and privacy at its core.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}