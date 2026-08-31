import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { getAllTodos, addTodo, editTodo, deleteTodo, getHeaders } from '../api';

vi.mock('next/headers');
import { headers } from 'next/headers';

global.fetch = vi.fn();

describe('API functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('with x-mock-bucket header', () => {
    beforeEach(() => {
      (headers as Mock).mockReturnValue({
        get: (key: string) => {
          if (key === 'x-mock-bucket') {
            return '1';
          }
          return null;
        },
      });
    });

    describe('getAllTodos', () => {
      it('should return a list of todos', async () => {
        (fetch as Mock).mockResolvedValueOnce({
          json: () => Promise.resolve([{ id: '1', text: 'Test task' }]),
        } as Response);

        const todos = await getAllTodos();
        expect(todos).toEqual([{ id: '1', text: 'Test task' }]);
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/tasks', {
          method: 'GET',
          headers: expect.any(Headers),
          cache: 'no-store',
        });
      });
    });

    describe('addTodo', () => {
      it('should add a new todo', async () => {
        const newTodo = { id: '2', text: 'New task' };
        (fetch as Mock).mockResolvedValueOnce({
          json: () => Promise.resolve(newTodo),
        } as Response);

        const result = await addTodo(newTodo);
        expect(result).toEqual(newTodo);
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/tasks', {
          method: 'POST',
          headers: expect.any(Headers),
          body: JSON.stringify(newTodo),
        });
      });
    });

    describe('editTodo', () => {
      it('should edit an existing todo', async () => {
        const updatedTodo = { id: '1', text: 'Updated task' };
        (fetch as Mock).mockResolvedValueOnce({
          json: () => Promise.resolve(updatedTodo),
        } as Response);

        const result = await editTodo(updatedTodo);
        expect(result).toEqual(updatedTodo);
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/tasks/1', {
          method: 'PUT',
          headers: expect.any(Headers),
          body: JSON.stringify(updatedTodo),
        });
      });
    });

    describe('deleteTodo', () => {
      it('should delete an existing todo', async () => {
        (fetch as Mock).mockResolvedValueOnce({} as Response);

        await deleteTodo('1');
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/tasks/1', {
          method: 'DELETE',
          headers: expect.any(Headers),
        });
      });
    });

    describe('getHeaders', () => {
      it('should return headers with x-mock-bucket', async () => {
        const headers = await getHeaders();
        expect(headers.get('x-mock-bucket')).toBe('1');
      });
    });
  });

  describe('without x-mock-bucket header', () => {
    beforeEach(() => {
      (headers as Mock).mockReturnValue({
        get: () => {
          return null;
        },
      });
    });

    it('should return headers with x-mock-bucket set to 0', async () => {
      const headers = await getHeaders();
      expect(headers.get('x-mock-bucket')).toBe('0');
    });
  });

  describe('with empty x-mock-bucket header', () => {
    beforeEach(() => {
      (headers as Mock).mockReturnValue({
        get: (key: string) => {
          if (key === 'x-mock-bucket') {
            return '';
          }
          return null;
        },
      });
    });

    it('should return headers with x-mock-bucket set to empty string', async () => {
      const headers = await getHeaders();
      expect(headers.get('x-mock-bucket')).toBe('');
    });
  });
});
