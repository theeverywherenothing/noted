import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import quotes from '../../public/quotes.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartBroken, faGraduationCap, faUserSlash, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [quote, setQuote] = useState('');
  const [fade, setFade] = useState(true);

  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    };

    getRandomQuote();
    const intervalId = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        getRandomQuote();
        setFade(true);
      }, 500);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="font-inter antialiased bg-white text-gray-900 min-h-screen">
      <main className="overflow-hidden">
        <section ref={section1Ref} className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-20">
          <div className="container mx-auto px-6 py-12 text-center">
            <h1 className="text-4xl font-bold leading-tight mb-5 md:text-5xl lg:text-6xl">
              Speak Up, Stand Strong
            </h1>
            <p className="text-lg mb-8 opacity-90 md:text-xl lg:text-2xl">
              Creating safer environments, together.
            </p>
            <div className="flex flex-col items-center space-y-3 sm:space-x-4 sm:flex-row sm:justify-center sm:space-y-0">
              <Link
                to="/report"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-colors duration-300 shadow-md"
              >
                Report Anonymously
              </Link>
              <button
                onClick={() => scrollToSection(section2Ref)}
                className="inline-flex items-center justify-center px-6 py-3 border border-white rounded-full font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300"
              >
                Learn More <FontAwesomeIcon icon={faArrowDown} className="ml-2" />
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-indigo-500 pointer-events-none"></div>
        </section>

        <section ref={section2Ref} className="min-h-screen flex items-center justify-center bg-gray-50 py-20">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">The Impact of Bullying</h2>
              <p className="text-gray-600 leading-relaxed">
                Understanding the effects of bullying is the first step towards creating change.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300">
                <div className="p-6">
                  <FontAwesomeIcon icon={faHeartBroken} size="3x" className="text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Emotional Distress</h3>
                  <p className="text-gray-600">Anxiety, depression, and feelings of isolation.</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300">
                <div className="p-6">
                  <FontAwesomeIcon icon={faGraduationCap} size="3x" className="text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Academic Decline</h3>
                  <p className="text-gray-600">Difficulty concentrating and decreased interest in learning.</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300">
                <div className="p-6">
                  <FontAwesomeIcon icon={faUserSlash} size="3x" className="text-yellow-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Social Isolation</h3>
                  <p className="text-gray-600">Damaged relationships and feelings of loneliness.</p>
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <button
                onClick={() => scrollToSection(section3Ref)}
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors duration-300"
              >
                Our Solution
              </button>
            </div>
          </div>
        </section>

        <section ref={section3Ref} className="min-h-screen flex items-center justify-center bg-indigo-100 py-20">
          <div className="container mx-auto px-6 text-center">
            <div className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-2xl italic text-gray-700 font-medium mb-8 md:text-3xl">
                {quote}
              </p>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Noted provides a safe platform for reporting bullying. We empower individuals, schools, and communities to create a culture of respect.
            </p>
            <div className="flex flex-col items-center space-y-3 sm:space-x-4 sm:flex-row sm:justify-center sm:space-y-0">
              <Link
                to="/report"
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors duration-300 shadow-md"
              >
                Report Anonymously
              </Link>
              <button
                onClick={() => scrollToSection(footerRef)}
                className="inline-flex items-center justify-center px-6 py-3 border border-purple-600 text-purple-600 rounded-full font-medium hover:bg-purple-50 hover:text-white transition-colors duration-300"
              >
                Learn More About Us
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer ref={footerRef} className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm mb-2">
            &copy; 2025 Noted. All rights reserved.
          </p>
          <p className="text-xs">
            Empowering voices, creating change.
          </p>
        </div>
      </footer>
    </div>
  );
}
