import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#493222] px-10 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-white">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <Link to="/" className="text-white text-lg font-bold leading-tight tracking-[-0.015em] no-underline">
            StackIt
          </Link>
        </div>
        <div className="flex items-center gap-9">
          <Link to="/" className="text-white text-sm font-medium leading-normal hover:text-[#cba990] no-underline">
            Home
          </Link>
          <Link to="/" className="text-white text-sm font-medium leading-normal hover:text-[#cba990] no-underline">
            Questions
          </Link>
          <Link to="/tags" className="text-white text-sm font-medium leading-normal hover:text-[#cba990] no-underline">
            Tags
          </Link>
          <Link to="/users" className="text-white text-sm font-medium leading-normal hover:text-[#cba990] no-underline">
            Users
          </Link>
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <form onSubmit={handleSearch} className="flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div
              className="text-[#cba990] flex border-none bg-[#493222] items-center justify-center pl-4 rounded-l-xl border-r-0"
              data-icon="MagnifyingGlass"
              data-size="24px"
              data-weight="regular"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#493222] focus:border-none h-full placeholder:text-[#cba990] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            />
          </div>
        </form>
        
        {user ? (
          <>
            <Link
              to="/ask"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f26c0c] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e55a00] no-underline"
            >
              <span className="truncate">Ask Question</span>
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#493222] hover:border-[#cba990] transition-colors"
                style={{
                  backgroundImage: user.avatar 
                    ? `url("${user.avatar}")` 
                    : 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23cba990\'%3E%3Cpath d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/%3E%3C/svg%3E")'
                }}
              />
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#493222] rounded-md shadow-lg py-1 z-50 border border-[#cba990]">
                  <div className="px-4 py-2 border-b border-[#cba990]">
                    <p className="text-sm font-medium text-white">{user.username}</p>
                  </div>
                  <Link
                    to={`/profile/${user._id}`}
                    className="block px-4 py-2 text-sm text-white hover:bg-[#cba990] hover:text-[#493222]"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#cba990] hover:text-[#493222]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="text-white text-sm font-medium leading-normal hover:text-[#cba990] no-underline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f26c0c] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e55a00] no-underline"
            >
              <span className="truncate">Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar; 