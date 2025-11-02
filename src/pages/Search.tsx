/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Search as SearchIcon, User, Layers, Gift, Target } from 'lucide-react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [search, setSearch] = useState(query.get('q') || '');
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [grants, setGrants] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    if (search) fetchAll();
    // eslint-disable-next-line
  }, [search]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [userRes, projectRes, grantRes, challengeRes] = await Promise.all([
        api.get(`/search/users?q=${encodeURIComponent(search)}`),
        api.get(`/search/projects?q=${encodeURIComponent(search)}`),
        api.get(`/grant-programs?search=${encodeURIComponent(search)}`),
        api.get(`/challenges?search=${encodeURIComponent(search)}`),
      ]);
      setUsers(userRes.data.users || []);
      setProjects(projectRes.data.projects || []);
      setGrants(grantRes.data.grants || []);
      setChallenges(challengeRes.data.challenges || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch search results.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 py-8 md:py-16">
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-8">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users, projects, grants, challenges..."
            className="w-full max-w-xl font-inter"
          />
          <button type="submit" className="bg-amber-800 hover:bg-amber-900 text-white rounded-full p-3 ml-2">
            <SearchIcon className="w-5 h-5" />
          </button>
        </form>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6 flex flex-wrap gap-2">
            <TabsTrigger value="users"><User className="w-4 h-4 mr-1" />Users</TabsTrigger>
            <TabsTrigger value="projects"><Layers className="w-4 h-4 mr-1" />Projects</TabsTrigger>
            <TabsTrigger value="grants"><Gift className="w-4 h-4 mr-1" />Grants</TabsTrigger>
            <TabsTrigger value="challenges"><Target className="w-4 h-4 mr-1" />Challenges</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            {loading ? <div>Loading...</div> : users.length === 0 ? <div className="text-gray-500">No users found.</div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {users.map(user => (
                  <Card key={user.user_id} className="hover:shadow-lg cursor-pointer" onClick={() => navigate(`/users/${user.username}`)}>
                    <CardHeader>
                      <CardTitle className="text-lg font-martian">{user.name}</CardTitle>
                      <CardDescription>@{user.username}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-600 font-inter mb-2">{user.bio}</div>
                      <div className="text-xs text-gray-500 font-inter">Skills: {user.skills?.join(', ')}</div>
                      <div className="text-xs text-gray-500 font-inter">Location: {user.location}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="projects">
            {loading ? <div>Loading...</div> : projects.length === 0 ? <div className="text-gray-500">No projects found.</div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map(project => (
                  <Card key={project.project_id} className="hover:shadow-lg cursor-pointer" onClick={() => navigate(`/projects/${project.project_id}`)}>
                    <CardHeader>
                      <CardTitle className="text-lg font-martian">{project.title}</CardTitle>
                      <CardDescription>{project.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-600 font-inter mb-2">{project.description}</div>
                      <div className="text-xs text-gray-500 font-inter">Tech: {project.technologies?.join(', ')}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="grants">
            {loading ? <div>Loading...</div> : grants.length === 0 ? <div className="text-gray-500">No grants found.</div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {grants.map(grant => (
                  <Card key={grant.grant_id} className="hover:shadow-lg cursor-pointer" onClick={() => navigate(`/grant-programs/${grant.grant_id}`)}>
                    <CardHeader>
                      <CardTitle className="text-lg font-martian">{grant.title}</CardTitle>
                      <CardDescription>{grant.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-600 font-inter mb-2">{grant.description}</div>
                      <div className="text-xs text-gray-500 font-inter">Amount: ₹{grant.amount?.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="challenges">
            {loading ? <div>Loading...</div> : challenges.length === 0 ? <div className="text-gray-500">No challenges found.</div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {challenges.map(challenge => (
                  <Card key={challenge.challenge_id} className="hover:shadow-lg cursor-pointer" onClick={() => navigate(`/challenges/${challenge.challenge_id}`)}>
                    <CardHeader>
                      <CardTitle className="text-lg font-martian">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-600 font-inter mb-2">{challenge.description}</div>
                      <div className="text-xs text-gray-500 font-inter">Prize: ₹{challenge.prize_pool?.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SearchPage; 