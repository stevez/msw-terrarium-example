import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import TodoList from '@/app/components/TodoList';
import { ITask } from '@/types/tasks';

vi.mock('@/api/api', () => ({
  deleteTodo: vi.fn(),
  editTodo: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ refresh: vi.fn() })),
}));

describe('TodoList (browser)', () => {
  it('should render empty state when no tasks', async () => {
    await render(<TodoList tasks={[]} />);
    await expect.element(page.getByText('No task')).toBeInTheDocument();
  });

  it('should render tasks when provided', async () => {
    const tasks: ITask[] = [
      { id: '1', text: 'Task 1' },
      { id: '2', text: 'Task 2' },
      { id: '3', text: 'Task 3' },
    ];

    await render(<TodoList tasks={tasks} />);

    await expect.element(page.getByText('Task 1')).toBeInTheDocument();
    await expect.element(page.getByText('Task 2')).toBeInTheDocument();
    await expect.element(page.getByText('Task 3')).toBeInTheDocument();
  });

  it('should render table headers', async () => {
    await render(<TodoList tasks={[]} />);
    await expect.element(page.getByText('Tasks')).toBeInTheDocument();
    await expect.element(page.getByText('Actions')).toBeInTheDocument();
  });
});
