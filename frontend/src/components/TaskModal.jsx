import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const TaskModal = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'low');
      setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, priority, due_date: dueDate || null });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
      <div className="neumorph-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="neumorph-button" onClick={onClose} style={{ padding: '8px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Title</label>
            <input
              className="neumorph-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
            <textarea
              className="neumorph-input"
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
            />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Priority</label>
              <select
                className="neumorph-inset"
                style={{ padding: '12px', width: '100%' }}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Due Date</label>
              <input
                type="date"
                className="neumorph-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="neumorph-button" style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--primary-color)', color: 'white' }}>
              <Save size={18} /> {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
