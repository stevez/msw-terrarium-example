import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import AddTask from '@/app/components/AddTask';
import { addTodo } from '@/api/api';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

vi.mock('@/api/api', () => ({
  addTodo: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

describe('AddTask (browser)', () => {
  const mockRouter = { refresh: vi.fn() };
  const mockUuid = 'test-uuid';

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue(mockRouter);
    (uuidv4 as Mock).mockReturnValue(mockUuid);
    vi.clearAllMocks();
  });

  it('should render the add task button and the modal should be closed', async () => {
    const { container } = await render(<AddTask />);
    await expect.element(page.getByRole('button', { name: /add new task/i })).toBeInTheDocument();
    expect(container.querySelector('.modal.modal-open')).toBeNull();
  });

  it('should update the new task value on input change', async () => {
    await render(<AddTask />);
    const button = page.getByRole('button', { name: /add new task/i });
    await button.click();
    const input = page.getByPlaceholder('Type here');
    await input.fill('New test task');
    await expect.element(input).toHaveValue('New test task');
  });

  it('should submit the new task and close the modal', async () => {
    const { container } = await render(<AddTask />);
    const button = page.getByRole('button', { name: /add new task/i });
    await button.click();

    const input = page.getByPlaceholder('Type here');
    await input.fill('New test task');

    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    await vi.waitFor(() => {
      expect(addTodo).toHaveBeenCalledWith({
        id: mockUuid,
        text: 'New test task',
      });
    });

    await vi.waitFor(() => {
      expect(container.querySelector('.modal.modal-open')).toBeNull();
    });

    expect(mockRouter.refresh).toHaveBeenCalled();
  });
});
