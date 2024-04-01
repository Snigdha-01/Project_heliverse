import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
    const [userData, setUserData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [domainFilter, setDomainFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [teamDetails, setTeamDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const usersPerPage = 16;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://heliverse-mern-api.vercel.app/api/users');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            console.log('Fetched data:', jsonData);
            setUserData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const filteredUsers = userData
        .filter(user =>
            user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(user => domainFilter ? user.domain === domainFilter : true)
        .filter(user => genderFilter ? user.gender === genderFilter : true)
        .filter(user => availabilityFilter ? user.available.toString() === availabilityFilter : true);
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); 
    };

    
    const handleFilterChange = (filterType, value) => {
        switch (filterType) {
            case 'domain':
                setDomainFilter(value);
                break;
            case 'gender':
                setGenderFilter(value);
                break;
            case 'availability':
                setAvailabilityFilter(value);
                break;
            default:
                break;
        }
        setCurrentPage(1); 
    };

    // for team
    const handleUserSelect = (userId) => {
        const user = userData.find(user => user.id === userId);
        if (!selectedUsers.some(u => u.domain === user.domain && u.available === user.available)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // team creation
    const createTeam = () => {
        setTeamDetails(selectedUsers);
        setIsModalOpen(true); 
    };

    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <h1 className="title">User Information</h1>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name..."
                className="search-input"
            />
            <div className="filters">
                <select onChange={(e) => handleFilterChange('domain', e.target.value)} value={domainFilter}>
                    <option value="">All Domains</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="IT">IT</option>
                    <option value="UI Designing">UI Designing</option>
                    <option value="Management">Management</option>
                </select>
                <select onChange={(e) => handleFilterChange('gender', e.target.value)} value={genderFilter}>
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <select onChange={(e) => handleFilterChange('availability', e.target.value)} value={availabilityFilter}>
                    <option value="">All Availability</option>
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                </select>
            </div>
            <div className="user-cards">
                {currentUsers.map((user, index) => (
                    <div className="user-card" key={index}>
                        <img src={user.avatar} alt="User Avatar" className="user-avatar" />
                        <div className="user-details">
                            <p className="user-info"><strong>ID:</strong> {user.id}</p>
                            <p className="user-info"><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                            <p className="user-info"><strong>Email:</strong> {user.email}</p>
                            <p className="user-info"><strong>Gender:</strong> {user.gender}</p>
                            <p className="user-info"><strong>Domain:</strong> {user.domain}</p>
                            <p className="user-info"><strong>Available:</strong> {user.available ? 'Yes' : 'No'}</p>
                            <button onClick={() => handleUserSelect(user.id)}>Add to Team</button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={createTeam} className="create-team-button">Create Team</button>
            
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span> 
                        <h2>Team Details</h2>
                        {teamDetails.map((user, index) => (
                            <div className="team-member" key={index}>
                                <p><strong>ID:</strong> {user.id}</p>
                                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Gender:</strong> {user.gender}</p>
                                <p><strong>Domain:</strong> {user.domain}</p>
                                <p><strong>Available:</strong> {user.available ? 'Yes' : 'No'}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={closeModal} className="close-modal-button">Close</button> 
                </div>
            )}
            {/* Pagination */}
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage - 1)}>&laquo;</button>
                </li>
                <li className={`page-item ${currentPage === Math.ceil(filteredUsers.length / usersPerPage) ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage + 1)}>&raquo;</button>
                </li>
            </ul>
        </div>
    );
}

export default App;
