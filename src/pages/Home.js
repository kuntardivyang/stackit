import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Award, Zap, BookOpen, Code, Lightbulb, User } from 'lucide-react';
import { fetchQuestions } from '../services/api';

const Home = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await fetchQuestions();
      setQuestions(response.data);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                <Code className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">StackIt</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The ultimate platform for developers to ask questions, share knowledge, and build a thriving community of tech enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/questions"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Questions
              </Link>
              <Link
                to="/ask"
                className="bg-transparent border-2 border-blue-600 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-green-500 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose StackIt?</h2>
            <p className="text-xl text-gray-300">Everything you need to grow as a developer</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#2d2d2d] p-8 rounded-lg hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Expert Community</h3>
              <p className="text-gray-300">Connect with experienced developers from around the world. Get answers from professionals who've been there.</p>
            </div>
            
            <div className="bg-[#2d2d2d] p-8 rounded-lg hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Quality Answers</h3>
              <p className="text-gray-300">Vote-based system ensures the best answers rise to the top. Find reliable solutions quickly.</p>
            </div>
            
            <div className="bg-[#2d2d2d] p-8 rounded-lg hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Fast & Reliable</h3>
              <p className="text-gray-300">Get answers within minutes, not hours. Our community is always ready to help.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">{questions.length}+</div>
              <div className="text-gray-300">Questions Asked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-300">Technologies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300">Get started in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">1</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Ask a Question</h3>
              <p className="text-gray-300">Post your programming questions with clear details and relevant tags.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">2</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Get Answers</h3>
              <p className="text-gray-300">Receive answers from our community of experienced developers.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">3</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Vote & Learn</h3>
              <p className="text-gray-300">Vote on answers and mark the best solution for future reference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of developers who are already learning and growing together.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2" />
              Sign Up Free
            </Link>
            <Link
              to="/questions"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Questions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 