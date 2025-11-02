/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, Users, Filter, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { getCommunityUsers } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';

interface User {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  location?: string;
  skills: string[];
  profile_picture?: string;
  portfolio_slug?: string;
  joined_date: string;
  is_verified: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('joined_date');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, selectedLocation, sortBy]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 12,
        sort: sortBy
      };

      if (selectedLocation) {
        params.location = selectedLocation;
      }

      const response = await getCommunityUsers(params);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load community members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll use the search term to filter by name/username
    // You can enhance this by adding search parameter to the API
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const handleLocationFilter = (location: string) => {
    setSelectedLocation(location);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedLocation('');
    setSortBy('joined_date');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const UserCard = ({ user }: { user: User }) => (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-xl cursor-pointer transform hover:-translate-y-1" 
          onClick={() => navigate(`/${user.username}`)}>
      
      {/* Gradient Background Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-4 pt-6 px-6">
        <div className="flex items-start space-x-4">
          {/* Enhanced Avatar with Ring */}
          <div className="relative">
            <Avatar className="w-16 h-16 ring-2 ring-gray-100 group-hover:ring-amber-200 transition-all duration-300">
              <AvatarImage src={user.profile_picture} alt={user.name} className="object-cover" />
              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-amber-700 transition-colors duration-200 font-martian leading-tight mb-1">
              {user.name}
            </CardTitle>
            <p className="text-sm text-gray-500 font-medium font-inter mb-2">
              @{user.username}
            </p>
            
            {/* Joined Date - Moved to header for better hierarchy */}
            <div className="flex items-center text-xs text-gray-400 font-inter">
              <Users className="w-3 h-3 mr-1.5" />
              <span>Joined {formatDate(user.joined_date)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 pt-0">
        {/* Bio Section */}
        {user.bio && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 font-inter leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors">
              {user.bio}
            </p>
          </div>
        )}
        
        {/* Location */}
        {user.location && (
          <div className="mb-4">
            <div className="inline-flex items-center px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-600 font-inter">
              <MapPin className="w-3 h-3 mr-1.5 text-gray-400" />
              <span className="font-medium">{user.location}</span>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide font-inter">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.slice(0, 4).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs font-medium font-inter bg-amber-50 text-amber-700 hover:bg-amber-100 border-0 px-2 py-1"
                >
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 4 && (
                <Badge 
                  variant="outline" 
                  className="text-xs font-medium font-inter text-gray-500 border-gray-200 px-2 py-1"
                >
                  +{user.skills.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Portfolio Link Indicator */}
        {user.portfolio_slug && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 font-inter">
              <span className="flex items-center">
                <ExternalLink className="w-3 h-3 mr-1" />
                Portfolio available
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 font-medium">
                View →
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const UserCardSkeleton = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="mt-3 flex gap-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 font-martian">
              Community
            </h1>
            <p className="text-lg text-gray-600 font-inter">
              Discover and connect with amazing builders in the SheBuilds community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by name, username, or bio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-inter"
                  />
                </div>
              </form>

              {/* Sort */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="font-inter">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joined_date">Recently Joined</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="username">Username A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {selectedLocation && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600 font-inter">Active filters:</span>
                {selectedLocation && (
                  <Badge variant="secondary" className="font-inter">
                    Location: {selectedLocation}
                    <button
                      onClick={() => setSelectedLocation('')}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm font-inter"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          {pagination && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 font-inter">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total.toLocaleString()} community members
              </p>
            </div>
          )}

          {/* Users Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <UserCardSkeleton key={index} />
              ))}
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="font-inter"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8 p-0 font-inter"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="font-inter"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-martian">
                No community members found
              </h3>
              <p className="text-gray-600 font-inter mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters} className="font-inter">
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community; 
