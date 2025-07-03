"use client";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/context/storeContext";
import DashboardLayout from "../../layout/layout";

const EnrollmentsPage = observer(() => {
  const { enrollmentsStore } = useStore();

  useEffect(() => {
    enrollmentsStore.loadAll();
  }, []);

  const handleCreate = async () => {
    await enrollmentsStore.createEnrollment();
  };

  const handleDelete = async (id: number) => {
    console.log("inPage:: ", id, ", typeof:", typeof id);
    await enrollmentsStore.deleteEnrollment(id);
  };

  const handleGradeEdit = (id: number, grade: string) => {
    enrollmentsStore.setGradeEdit(id, grade);
  };

  const handleGradeUpdate = async () => {
    await enrollmentsStore.updateGrade();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Enrollments</h1>
        {enrollmentsStore.error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
            {enrollmentsStore.error}
          </div>
        )}
        {enrollmentsStore.successMsg && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 border border-green-300 rounded">
            {enrollmentsStore.successMsg}
          </div>
        )}
        <div className="mb-6 flex gap-4 items-end">
          <div>
            <label className="block mb-1 ">User</label>
            <select
              className="p-2 border rounded text-black"
              value={enrollmentsStore.form.userId ?? ""}
              onChange={(e) => enrollmentsStore.setForm(Number(e.target.value) || null, enrollmentsStore.form.courseId)}
              disabled={!enrollmentsStore.users || enrollmentsStore.users.length === 0}
            >
              <option value="">Select User</option>
              {(enrollmentsStore.users || []).map((u) => (
                <option key={u?.id ?? ''} value={u?.id ?? ''}>
                  {u?.firstName || u?.lastName
                    ? `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim()
                    : u?.email ?? 'Unknown'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Course</label>
            <select
              className="p-2 border rounded text-black"
              value={enrollmentsStore.form.courseId ?? ""}
              onChange={(e) => enrollmentsStore.setForm(enrollmentsStore.form.userId, Number(e.target.value) || null)}
              disabled={!enrollmentsStore.courses || enrollmentsStore.courses.length === 0}
            >
              <option value="">Select Course</option>
              {(enrollmentsStore.courses || []).map((c) => (
                <option key={c?.id ?? ''} value={c?.id ?? ''}>
                  {c?.name ?? 'Unknown'}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Enrollment
          </button>
        </div>
        <div className="overflow-x-auto max-h-[60vh] border rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollmentsStore.loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : (!enrollmentsStore.filteredEnrollments || enrollmentsStore.filteredEnrollments.length === 0) ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    No enrollments found.
                  </td>
                </tr>
              ) : (
                (enrollmentsStore.filteredEnrollments || []).map((enrollment) => (
                  <tr key={enrollment?.id ?? ''}>
                    <td className="px-6 py-4 whitespace-nowrap">{enrollment?.id ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{enrollment?.user?.firstName || enrollment?.user?.lastName
                      ? `${enrollment?.user?.firstName ?? ''} ${enrollment?.user?.lastName ?? ''}`.trim()
                      : enrollment?.user?.email ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{enrollment?.course?.name ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollmentsStore.gradeEdit?.id === enrollment?.id ? (
                        <>
                          <input
                            className="p-1 border rounded"
                            value={enrollmentsStore.gradeEdit?.grade ?? ''}
                            onChange={(e) =>
                              enrollmentsStore.setGradeEdit(
                                enrollment.id,
                                e.target.value
                              )
                            }
                          />
                          <button
                            onClick={handleGradeUpdate}
                            className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => enrollmentsStore.setGradeEdit(0, "")}
                            className="ml-2 px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {enrollment?.grade || "-"}
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGradeEdit(enrollment.id, enrollment.grade || "")}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(enrollment?.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          disabled={!enrollment?.id}
                        >
                          Delete
                        </button>
                      </div>
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

export default EnrollmentsPage;
