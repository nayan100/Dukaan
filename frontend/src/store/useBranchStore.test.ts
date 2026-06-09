import { describe, it, expect, beforeEach } from 'vitest';
import { useBranchStore } from './useBranchStore';

describe('useBranchStore', () => {
  beforeEach(() => {
    // Reset store state if possible or ensure clean state
    useBranchStore.setState({
      tasks: [
        {
          id: 'test-task-1',
          type: 'logistics',
          title: 'Test Task',
          description: 'Description',
          status: 'pending',
          priority: 'medium',
          createdAt: new Date().toISOString()
        }
      ]
    });
  });

  it('should add a new task', () => {
    const newTask = {
      id: 'test-task-2',
      type: 'stock_alert' as const,
      title: 'New Alert',
      description: 'Alert description',
      status: 'pending' as const,
      priority: 'high' as const,
      createdAt: new Date().toISOString()
    };

    useBranchStore.getState().addTask(newTask);
    
    const tasks = useBranchStore.getState().tasks;
    expect(tasks.length).toBe(2);
    expect(tasks[0].id).toBe('test-task-2');
  });

  it('should resolve a task', () => {
    useBranchStore.getState().resolveTask('test-task-1');
    
    const task = useBranchStore.getState().tasks.find(t => t.id === 'test-task-1');
    expect(task?.status).toBe('resolved');
  });

  it('should dismiss a task', () => {
    useBranchStore.getState().dismissTask('test-task-1');
    
    const tasks = useBranchStore.getState().tasks;
    expect(tasks.length).toBe(0);
  });
});
