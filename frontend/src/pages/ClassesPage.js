import React, { useEffect, useState } from 'react';
import { getClasses, createClass, updateClass, deleteClass } from '../services/api';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await getClasses();
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleCreateClass = async () => {
    try {
      await createClass({ class_name: newClass });
      fetchClasses();
      setNewClass('');
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleUpdateClass = async (id, updatedName) => {
    try {
      await updateClass(id, { class_name: updatedName });
      fetchClasses();
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await deleteClass(id);
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <div>
      <h1>Classes</h1>
      <div>
        <input
          type="text"
          placeholder="Class Name"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
        />
        <button onClick={handleCreateClass}>Add Class</button>
      </div>
      <ul>
        {classes.map((cls) => (
          <li key={cls.class_id}>
            {cls.class_name}
            <button onClick={() => handleUpdateClass(cls.class_id, 'Updated Class Name')}>
              Update
            </button>
            <button onClick={() => handleDeleteClass(cls.class_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassesPage;