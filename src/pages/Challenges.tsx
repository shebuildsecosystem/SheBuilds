import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Challenge {
  challenge_id: string;
  title: string;
  description: string;
  category: string;
  status: 'upcoming' | 'active' | 'completed';
  prize_pool: number;
  start_date: string;
  end_date: string;
  participant_count: number;
  created_at: string;
}

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('start_date');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallenges();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, sortBy]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        sortBy,
        sortOrder: 'asc',
      });
      const response = await api.get(`/challenges?${params}`);
      setChallenges(response.data.data.challenges);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: 'Error',
        description: 'Failed to load challenges. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewChallenge = (challengeId: string) => {
    navigate(`/challenges/${challengeId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="px-2 sm:px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-4 md:mb-8 text-gray-900 leading-tight font-martian">
              Challenges
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto font-inter font-light">
              Join, compete, and grow with SheBuilds challenges.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 md:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="innovation">Innovation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start_date">Start Date</SelectItem>
                  <SelectItem value="end_date">End Date</SelectItem>
                  <SelectItem value="prize_pool">Prize Pool</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i} className="h-56 sm:h-64 animate-pulse bg-white rounded-lg shadow-sm" />
              ))
            ) : challenges.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 font-inter text-lg">No challenges found.</div>
            ) : (
              challenges.map((challenge) => (
                <Card key={challenge.challenge_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-0" onClick={() => handleViewChallenge(challenge.challenge_id)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-martian text-gray-900 mb-1">{challenge.title}</CardTitle>
                    <CardDescription className="text-gray-500 font-inter mb-2 line-clamp-2">{challenge.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 items-center text-sm mb-1">
                      <span className={`px-3 py-1 rounded-full font-inter font-medium ${getStatusColor(challenge.status)}`}>{challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}</span>
                      <span className="flex items-center gap-1 text-amber-700 font-inter">Prize: ₹{challenge.prize_pool.toLocaleString()}</span>
                      <span className="flex items-center gap-1 text-gray-600 font-inter"><Calendar className="w-4 h-4" />{formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}</span>
                      <span className="flex items-center gap-1 text-gray-500 font-inter"><Users className="w-4 h-4" />{challenge.participant_count} participants</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full mt-2 font-inter" onClick={e => { e.stopPropagation(); handleViewChallenge(challenge.challenge_id); }}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 md:mt-12 gap-4">
            <Button
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="mx-2 md:mx-4 text-gray-700 font-inter">Page {currentPage} of {totalPages}</span>
            <Button
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges; 