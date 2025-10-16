import React from 'react';
import { useNavigate } from 'react-router-dom';

const DropdownMenu = () => {
    const navigate = useNavigate();

    const handleRedirect = (role) => {
        if (role) {
            navigate(`/${role}-login`);
        }
    };

    return (
        <select onChange={(e) => handleRedirect(e.target.value)} defaultValue="">
            <option value="" disabled>Select Role</option>
            <option value="user">User</option>
            <option value="technician">Technician</option>
            <option value="admin">Admin</option>
        </select>
    );
};

export default DropdownMenu;
