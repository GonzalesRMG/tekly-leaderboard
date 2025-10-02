import React, { useEffect, useState } from 'react';
import { getCars, createCar, updateCar, deleteCar, getClasses } from '../services/api';

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newCar, setNewCar] = useState({ class_id: '', car_name: '' });

  useEffect(() => {
    fetchCars();
    fetchClasses();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await getCars();
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getClasses();
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleCreateCar = async () => {
    try {
      await createCar(newCar);
      fetchCars();
      setNewCar({ class_id: '', car_name: '' });
    } catch (error) {
      console.error('Error creating car:', error);
    }
  };

  const handleUpdateCar = async (id, updatedData) => {
    try {
      await updateCar(id, updatedData);
      fetchCars();
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      await deleteCar(id);
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  return (
    <div>
      <h1>Cars</h1>
      <div>
        <select
          value={newCar.class_id}
          onChange={(e) => setNewCar({ ...newCar, class_id: e.target.value })}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.class_id} value={cls.class_id}>
              {cls.class_name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Car Name"
          value={newCar.car_name}
          onChange={(e) => setNewCar({ ...newCar, car_name: e.target.value })}
        />
        <button onClick={handleCreateCar}>Add Car</button>
      </div>
      <ul>
        {cars.map((car) => (
          <li key={car.car_id}>
            {car.car_name} (Class: {car.class_id})
            <button onClick={() => handleUpdateCar(car.car_id, { ...car, car_name: 'Updated Car Name' })}>
              Update
            </button>
            <button onClick={() => handleDeleteCar(car.car_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CarsPage;