import React from 'react';
import { Trash2, Edit3, Check, RotateCcw, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const isOverdue = task.status === 'pending' && task.due_date && new Date(task.due_date) < new Date();

  return (
    <div className="neumorph-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', overflow: 'hidden' }}>
        <button 
          className="neumorph-button" 
          onClick={onToggleComplete}
          style={{ padding: '8px', minWidth: '40px', color: task.status === 'completed' ? 'var(--priority-low)' : 'var(--text-color)' }}
        >
          {task.status === 'completed' ? <RotateCcw size={18} /> : <Check size={18} />}
        </button>
        
        <div style={{ overflow: 'hidden' }}>
          <h4 style={{ 
            marginBottom: '0.25rem', 
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            opacity: task.status === 'completed' ? 0.6 : 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {task.title}
          </h4>
          <div className="flex" style={{ gap: '0.75rem', alignItems: 'center' }}>
            <span className={`badge badge-${task.priority}`}>{task.priority}</span>
            {task.due_date && (
              <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: isOverdue ? 'var(--priority-high)' : 'inherit' }}>
                <Calendar size={12} /> {format(new Date(task.due_date), 'MMM d, yyyy')}
              </span>
            )}
            {isOverdue && <span style={{ fontSize: '0.75rem', color: 'var(--priority-high)', fontWeight: '700' }}>OVERDUE</span>}
          </div>
        </div>
      </div>

      <div className="flex" style={{ gap: '0.5rem' }}>
        <button className="neumorph-button" onClick={onEdit} style={{ padding: '8px' }}>
          <Edit3 size={16} />
        </button>
        <button className="neumorph-button" onClick={onDelete} style={{ padding: '8px', color: '#ef4444' }}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
