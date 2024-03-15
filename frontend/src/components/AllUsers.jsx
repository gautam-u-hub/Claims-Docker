import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../Links";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/all-users`);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/user/${id}`);
    } catch (e) {
      console.log(e);
    }
    setUsers(users.filter((user) => user._id !== id));
  };

  const changeUserRoleAdmin = async (user) => {
    try {
      const config = {
        headers: { "content-Type": "application/json" },
      };
      const response = await axios.put(
        `${API_URL}/change-role/${user._id}`,
        {
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          role: "admin",
        },
        config
      );
    } catch (e) {
      console.log(e);
    }
    const id = user._id;
    setUsers(users.map((u) => (u._id === id ? { ...u, role: "admin" } : u)));
  };

  const changeUserRoleTPA = async (user) => {
    try {
      const config = {
        headers: { "content-Type": "application/json" },
      };
      const response = await axios.put(
        `${API_URL}/change-role/${user._id}`,
        {
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          role: "TPA",
        },
        config
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
    const id = user._id;
    setUsers(users.map((u) => (u._id === id ? { ...u, role: "TPA" } : u)));
  };

  return (
    <div className="container mt-5">
      <h1>User List</h1>
      <div className="row">
        {users.map((user) => (
          <div className="col-md-4 mb-4" key={user.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">Email: {user.email}</p>
                <p className="card-text">Role: {user.role}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteUser(user._id)}
                  style={{ marginRight: "5px" }}
                >
                  Delete
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => changeUserRoleAdmin(user)}
                  style={{ marginRight: "5px" }}
                >
                  Make Admin
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => changeUserRoleTPA(user)}
                >
                  Make TPA
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
