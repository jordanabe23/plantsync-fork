'use client';

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaRegCircle, FaPlus } from 'react-icons/fa';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    text: '',        // For Task Name
    description: '',
    recurrence: 'once',
    groupId: '',     // For Group
  });
  const [groups, setGroups] = useState([]); // State to hold available groups
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
    fetchGroups(); // Fetch groups when the component mounts
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.statusText}`);
      }

      const todos = await response.json();
      console.log('Fetched Todos:', todos);
      setTodos(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please try again later.');
    }
  };

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/groups', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }

      const fetchedGroups = await response.json();
      console.log('Fetched Groups:', fetchedGroups); // Log the fetched groups
      setGroups(fetchedGroups); // Set the groups state
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newTodo.text.trim(),
          description: newTodo.description.trim(),
          recurrence: newTodo.recurrence,
          groupId: newTodo.groupId,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to add todo');
      }

      const createdTodo = await response.json();
      console.log('Created Todo:', createdTodo); // Log the created todo
      await fetchTodos(); // Refresh the list after adding
      setIsModalOpen(false);
      setNewTodo({ text: '', description: '', recurrence: 'once', groupId: '' });
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo. Please try again.');
    }
  };

  return (
    <div className="bg-pink-100 p-6 rounded-lg shadow-md relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Tasks</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          {error}
        </div>
      )}

      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="flex items-center mb-3">
            {todo.completed ? (
              <FaCheckCircle className="text-green-500 mr-3" />
            ) : (
              <FaRegCircle className="text-gray-500 mr-3" />
            )}
            <div>
              <span className={`text-gray-700 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
              {todo.description && (
                <p className="text-sm text-gray-600">{todo.description}</p>
              )}
              {todo.recurrence !== 'once' && (
                <p className="text-sm text-gray-600">Recurs: {todo.recurrence}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <FaPlus />
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative z-60">
            <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="text"
                value={newTodo.text}
                onChange={handleInputChange}
                placeholder="Task Name"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={newTodo.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full p-2 mb-2 border rounded"
              />
              <select
                name="recurrence"
                value={newTodo.recurrence}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <select
                name="groupId"
                value={newTodo.groupId}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border rounded"
                required
              >
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>{group.name}</option>
                ))}
              </select>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
