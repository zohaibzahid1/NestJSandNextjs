"use client";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/context/storeContext";
import DashboardLayout from "../../layout/layout";

// -------------QUESTION-------------
       // Is it neeseary to change the values of an observable only in action functions in store??
       // since it is giving me warning that i am changing the values of an observable outside of an action function
       // even inside an action when i directly change the values of an observable it is giving me warning
// ----------------------------------
// ANS 
// yes it is necessary to change the values of an observable only in action functions in store

const CoursesPage = observer(() => {
  const { courseStore } = useStore();

  useEffect(() => {
    courseStore.loadCourses();
  }, [courseStore]);

  const handleAction = async (id: number, action: "soft" | "hard" | "restore") => {
    if (action === "soft") await courseStore.softDeleteCourse(id);
    if (action === "hard") await courseStore.hardDeleteCourse(id);
    if (action === "restore") await courseStore.restoreCourse(id);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>
        {courseStore.successMsg && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{courseStore.successMsg}</div>}
        {courseStore.error && <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{courseStore.error}</div>}
        <button
          onClick={() => { courseStore.showCreate = true; courseStore.formError = null; courseStore.successMsg = null; }}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Course
        </button>

        <div className="mb-4 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={courseStore.showWithDeleted}
              onChange={() => courseStore.changeShowWithDeleted()}
            />
            Show disabled courses
          </label>
        </div>

        {courseStore.showCreate && (
          <div className="mb-4 p-4 border rounded bg-gray-50">
            {courseStore.formError && <div className="mb-2 text-red-600">{courseStore.formError}</div>}
            <input
              className="mr-2 p-2 border rounded"
              placeholder="Title"
              value={courseStore.form.name}
              onChange={(e) => courseStore.form = { ...courseStore.form, name: e.target.value }}
            />
            <input
              className="mr-2 p-2 border rounded"
              placeholder="Description"
              value={courseStore.form.description}
              onChange={(e) => courseStore.form = { ...courseStore.form, description: e.target.value }}
            />
            <button
              onClick={courseStore.handleCreate}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={!!courseStore.validateForm()}
            >
              Create
            </button>
            <button
              onClick={() => courseStore.showCreate = false}
              className="ml-2 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="overflow-x-auto max-h-[60vh] border rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courseStore.loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">Loading...</td>
                </tr>
              ) : courseStore.filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">No courses found.</td>
                </tr>
              ) : (
                courseStore.filteredCourses.map((course) => (
                  <tr key={course.id} className={course.deletedAt ? "bg-red-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">{course.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {courseStore.showEdit === course.id ? (
                        <input
                          className="p-1 border rounded"
                          value={courseStore.form.name}
                          onChange={(e) => courseStore.form = { ...courseStore.form, name: e.target.value }}
                        />
                      ) : (
                        course.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {courseStore.showEdit === course.id ? (
                        <input
                          className="p-1 border rounded"
                          value={courseStore.form.description}
                          onChange={(e) => courseStore.form = { ...courseStore.form, description: e.target.value }}
                        />
                      ) : (
                        course.description
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.deletedAt ? "Disabled" : "Active"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      {courseStore.showEdit === course.id ? (
                        <>
                          {courseStore.formError && <span className="text-red-600 text-xs mr-2">{courseStore.formError}</span>}
                          <button
                            onClick={() => courseStore.handleUpdate(course.id)}
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            disabled={!!courseStore.validateForm()}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => courseStore.showEdit = null}
                            className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => courseStore.handleEdit(course)}
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          {course.deletedAt ? (
                            <button
                              onClick={() => handleAction(course.id, "restore")}
                              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Enable
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleAction(course.id, "soft")}
                                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                              >
                                Disable
                              </button>
                              <button
                                onClick={() => handleAction(course.id, "hard")}
                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </>
                          )}
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

export default CoursesPage;
