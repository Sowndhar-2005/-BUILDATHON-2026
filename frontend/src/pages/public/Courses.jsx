import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, BookOpen, Clock, ChevronRight, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Computer Science',
    'Database & Storage',
    'Algorithms',
    'Cloud & Infrastructure',
    'AI & Machine Learning'
  ];

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        let queryParams = [];
        if (searchTerm) queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
        if (selectedCategory !== 'All') queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
        
        const data = await api.getCourses(queryParams.join('&'));
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    }
    const timeout = setTimeout(fetchCourses, 250);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Curriculum & Programs</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Academic Course Catalog</h1>
        <p className="text-sm text-slate-400">
          Search and explore accredited undergraduate and postgraduate courses with complete module syllabi and assessment structures.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by code, title, topic..."
            className="input-field !pl-10 text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <LoadingSpinner text="Searching course catalog..." />
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="glass-card overflow-hidden flex flex-col group border border-slate-800">
              <div className="h-48 relative overflow-hidden bg-slate-850">
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516116211227-bbc13c7d6352?w=600"}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-xs font-mono font-bold text-brand-400 border border-brand-500/30">
                  {course.code}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/85 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {course.rating} ({course.total_reviews})
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">
                    {course.category}
                  </span>
                  <h2 className="font-bold text-lg text-white group-hover:text-brand-400 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-400" /> {course.schedule_info || "Mon/Wed/Fri"}
                    </span>
                    <span className="font-semibold text-slate-300">
                      {course.credits} Credits
                    </span>
                  </div>

                  <Link
                    to={`/courses/${course.id}`}
                    className="btn-outline w-full !py-2 text-xs flex items-center justify-center gap-1.5"
                  >
                    View Syllabus & Enroll <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-panel space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Courses Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your keyword search or category filter.</p>
        </div>
      )}

    </div>
  );
}
