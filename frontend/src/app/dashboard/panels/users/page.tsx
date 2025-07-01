"use client";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/context/storeContext";
import DashboardLayout from "../../layout/layout";

  // Add other user fields as needed


const UsersPage = observer(() => {
  const { userStore } = useStore();

  useEffect(() => {
    userStore.loadUsers();
  },[userStore]);


  const handleAction = async (id: number, action: "soft" | "hard" | "restore") => {
    if (action === "soft") await userStore.softDeleteUser(id);
    if (action === "hard") await userStore.hardDeleteUser(id);
    if (action === "restore") await userStore.restoreUser(id);
  };


  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        {userStore.success && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{userStore.success}</div>}
        <div className="mb-4 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={userStore.showWithDeleted}
              onChange={() => userStore.changeShowWithDeleted()}
            />
            Show disabled users
          </label>
        </div>
        <div className="overflow-x-auto max-h-[60vh] border rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userStore.loading ? (
                <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
              ) : userStore.filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8">No users found.</td></tr>
              ) : (
                userStore.filteredUsers.map((user) => (
                  <tr key={user.id} className={user.deletedAt ? "bg-red-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.deletedAt ? "Disabled" : "Active"}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      {user.deletedAt ? (
                        <button onClick={() => handleAction(user.id, "restore")}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Enable</button>
                      ) : (
                        <>
                          <button onClick={() => handleAction(user.id, "soft")}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Disable</button>
                          <button onClick={() => handleAction(user.id, "hard")}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
});

export default UsersPage; 