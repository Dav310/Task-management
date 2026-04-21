import React, { useState, useEffect } from 'react';
import { dashboardService, taskService, authService } from '../services/api';
import StatsCard from '../components/StatsCard';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import { Plus, LogOut, Filter, SortAsc, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total_tasks: 0, completed_tasks: 0, pending_tasks: 0, overdue_tasks: 0 });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [user, setUser] = useState(null);

  // Filters and Pagination
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [page, setPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, tasksRes, userRes] = await Promise.all([
        dashboardService.getStats(),
        taskService.getTasks({
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          sort_by: sortBy,
          search: search || undefined,
          page,
          page_size: 10
        }),
        authService.getMe()
      ]);
      setStats(statsRes.data);
      setTasks(tasksRes.data.items);
      setTotalTasks(tasksRes.data.total);
      setUser(userRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, priorityFilter, sortBy, page, search]);

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData);
      } else {
        await taskService.createTask(taskData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchData();
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        fetchData();
      } catch (err) {
        console.error("Failed to delete task", err);
      }
    }
  };

  const toggleComplete = async (task) => {
    try {
      await taskService.updateTask(task.id, {
        status: task.status === 'completed' ? 'pending' : 'completed'
      });
      fetchData();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="container animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 style={{ marginBottom: '0', fontSize: '2.5rem', fontWeight: '700' }}>
            Hello, {user?.full_name || 'User'}
          </h1>
          <p>Organize your day efficiently</p>
        </div>
        <button className="neumorph-button" style={{ color:"red"}}  onClick={() => authService.logout()}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '3rem' }}>
        <StatsCard title="Total Tasks" value={stats.total_tasks} icon="list" />
        <StatsCard title="Completed" value={stats.completed_tasks} icon="check" color="#10b981" />
        <StatsCard title="Pending" value={stats.pending_tasks} icon="clock" color="#f59e0b" />
        <StatsCard title="Overdue" value={stats.overdue_tasks} icon="alert" color="#ef4444" />
      </div>

      {/* Tasks Section */}
      <div className="neumorph-card" style={{ padding: '2rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3>My Tasks ({totalTasks})</h3>
          </div>
          
          <div style={{ flexGrow: 1, maxWidth: '400px' }}>
            <input 
              type="text" 
              className="neumorph-input" 
              placeholder="Search tasks by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 15px' }}
            />
          </div>

          <div className="flex items-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
            {/* Filters */}
            <div className="flex items-center" style={{ gap: '0.5rem' }}>
              <Filter size={16} />
              <select
                className="neumorph-inset"
                style={{ padding: '8px 12px', fontSize: '0.875rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <select
              className="neumorph-inset"
              style={{ padding: '8px 12px', fontSize: '0.875rem' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="flex items-center" style={{ gap: '0.5rem' }}>
              <SortAsc size={16} />
              <select
                className="neumorph-inset"
                style={{ padding: '8px 12px', fontSize: '0.875rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="created_at">Date Created</option>
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <button
              className="neumorph-button"
              onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
              style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
            >
              <Plus size={18} /> New Task
            </button>
          </div>
        </div>

        {/* Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No tasks found. Create one to get started!</p>
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={() => handleDelete(task.id)}
                onEdit={() => { setEditingTask(task); setIsModalOpen(true); }}
                onToggleComplete={() => toggleComplete(task)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalTasks > 10 && (
          <div className="flex justify-center items-center" style={{ marginTop: '2rem', gap: '1.5rem' }}>
            <button
              className="neumorph-button"
              style={{ padding: '8px' }}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontWeight: '600' }}>Page {page} of {Math.ceil(totalTasks / 10)}</span>
            <button
              className="neumorph-button"
              style={{ padding: '8px' }}
              disabled={page >= Math.ceil(totalTasks / 10)}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
          onSave={handleCreateOrUpdate}
        />
      )}
    </div>
  );
};

export default Dashboard;
