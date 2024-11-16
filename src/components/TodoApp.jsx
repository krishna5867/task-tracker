import { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSort, faTrash } from '@fortawesome/free-solid-svg-icons';

const TodoApp = () => {
    const [taskInput, setTaskInput] = useState('');
    const [storedTasks, setStoredTasks] = useLocalStorage('tasks', []);
    const [filter, setFilter] = useState('all');
    const [sortTask, setSortTask] = useState(1);
    const [editingTaskId, setEditingTaskId] = useState(null);


    const handleAddTask = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (taskInput.trim()) {
                if (editingTaskId !== null) {
                    const updatedTasks = storedTasks.map(task =>
                        task.id === editingTaskId ? { ...task, task: taskInput } : task
                    );
                    setStoredTasks(updatedTasks);
                    setEditingTaskId(null);
                } else {
                    const newTasks = [...storedTasks, { id: Date.now(), task: taskInput, completed: false }];
                    setStoredTasks(newTasks);
                }
                setTaskInput('');
            } else {
                alert("Task cannot be empty! Please enter a task.");
            }
        }
    };

    const toggleTaskCompletion = (id) => {
        const updatedTasks = storedTasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setStoredTasks(updatedTasks);
    };

    const deleteTask = (id) => {
        const updatedTasks = storedTasks.filter(task => task.id !== id);
        setStoredTasks(updatedTasks);
    };

    const handleToggleSort = () => {
        const sortedTasks = [...storedTasks].sort((a, b) => {
            if (sortTask === 1) {
                return a.task.toLowerCase() > b.task.toLowerCase() ? 1 : -1;
            } else {
                return a.task.toLowerCase() < b.task.toLowerCase() ? 1 : -1;
            }
        });
        setStoredTasks(sortedTasks);
        setSortTask(sortTask === 1 ? -1 : 1);
    };

    const filteredTasks = storedTasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    const handleEditTask = (id) => {
        const taskToEdit = storedTasks.find(task => task.id === id);
        setTaskInput(taskToEdit.task);
        setEditingTaskId(id);
    };

    const handleClearAll = () => {
        const confirmed = confirm("Are you sure you want to clear all tasks?");
        if (confirmed) {
            setStoredTasks([]);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 shadow-sm rounded-md md:my-6 bg-white">
            <h1 className="text-2xl font-bold text-center mb-4">Persistent Task Tracker</h1>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyDown={handleAddTask}
                    className="flex-1 border-2 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
                    placeholder={editingTaskId !== null ? "Edit task..." : "Add a new task..."}
                />
                <button onClick={handleAddTask} className="btn sm:mx-1 !bg-black">
                    {editingTaskId !== null ? "Update Task" : "Add Task"}
                </button>
            </div>
            {storedTasks.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
                    <div className='flex flex-wrap items-center gap-y-4 gap-x-2'>
                        <button onClick={() => setFilter('all')} className="btn">All</button>
                        <button onClick={() => setFilter('pending')} className="btn">Pending</button>
                        <button onClick={() => setFilter('completed')} className="btn">Completed</button>
                    </div>
                    <div className='flex gap-x-2'>
                        <button onClick={handleToggleSort} className="btn rounded px-4 py-2">Sort&nbsp;<FontAwesomeIcon icon={faSort} /></button>
                        <button onClick={handleClearAll} className="btn !bg-red-500">Clear All</button>
                    </div>
                </div>
            )}
            <ul className="space-y-2 pt-10">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(todo => (
                        <li key={todo.id} className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center">
                                <input
                                    id={todo.task}
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTaskCompletion(todo.id)}
                                    className="mr-2"
                                />
                                <label htmlFor={todo.task} className={todo.completed ? 'line-through text-gray-400' : 'cursor-pointer'}>
                                    {todo.task}
                                </label>
                            </div>
                            <div className='flex items-center'>
                                {!todo.completed && (
                                    <button
                                        onClick={() => handleEditTask(todo.id)}
                                        className="flex items-center justify-center text-blue-500 mx-1 bg-gray-100 hover:bg-gray-200 transition duration-200 rounded-full w-8 h-8"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteTask(todo.id)}
                                    className="flex items-center justify-center text-red-500 mx-1 bg-gray-100 hover:bg-gray-200 transition duration-200 rounded-full w-8 h-8"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div> 
                        </li>
                    ))
                ) : (
                    <li>No tasks available.</li>
                )}
            </ul>
            <div className="mt-4 text-center">
                <span>Total Tasks: {storedTasks.length} | Completed Tasks: {storedTasks.filter(task => task.completed).length}</span>
            </div>
        </div>
    );
};

export default TodoApp;
