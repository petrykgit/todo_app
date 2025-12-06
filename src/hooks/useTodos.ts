import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';

interface UseTodosProps {
  onErrorReported: (message: string | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const useTodos = ({ onErrorReported, inputRef }: UseTodosProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    onErrorReported(null);
    setIsLoading(true);
    inputRef.current?.focus();

    getTodos()
      .then(setTodos)
      .catch(() => {
        onErrorReported('Unable to load todos');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddNewTodo = (title: string) => {
    const todo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    onErrorReported(null);
    setIsAdding(true);

    addTodo(todo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoTitle('');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      })
      .catch(() => {
        onErrorReported('Unable to add a todo');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      })
      .finally(() => setIsAdding(false));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isAdding) {
      return;
    }

    if (newTodoTitle.trim() === '') {
      onErrorReported('Title should not be empty');

      return;
    }

    const trimmedTitle = newTodoTitle.trim();

    if (trimmedTitle) {
      handleAddNewTodo(trimmedTitle);
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    onErrorReported(null);
    setDeletingIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      })
      .catch(() => {
        onErrorReported('Unable to delete a todo');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      })
      .finally(() => {
        setDeletingIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  const handleToggleTodo = (todo: Todo) => {
    onErrorReported(null);

    setUpdatingIds(currentIds => [...currentIds, todo.id]);

    const updatedData = { completed: !todo.completed };

    updateTodo(todo.id, updatedData)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(item => (item.id === todo.id ? updatedTodo : item)),
        );
      })
      .catch(() => {
        onErrorReported('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingIds(currentIds => currentIds.filter(id => id !== todo.id));
      });
  };

  const handleUpdateTitle = (
    todo: Todo,
    newTitle: string,
    onFinish: () => void,
  ) => {
    onErrorReported(null);
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      onFinish();

      return;
    }

    if (trimmedTitle === '') {
      onErrorReported(null);
      setDeletingIds(currentIds => [...currentIds, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(item => item.id !== todo.id),
          );
          onFinish();
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        })
        .catch(() => {
          onErrorReported('Unable to delete a todo');
        })
        .finally(() => {
          setDeletingIds(currentIds => currentIds.filter(id => id !== todo.id));
        });

      return;
    }

    setUpdatingIds(currentIds => [...currentIds, todo.id]);
    const updatedData = { title: trimmedTitle };

    updateTodo(todo.id, updatedData)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(item => (item.id === todo.id ? updatedTodo : item)),
        );
        onFinish();
      })
      .catch(() => {
        onErrorReported('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingIds(currentIds => currentIds.filter(id => id !== todo.id));
      });
  };

  const handleClearCompleted = async () => {
    onErrorReported(null);

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setDeletingIds(currentIds => [...currentIds, ...completedIds]);

    const deletePromises = completedIds.map(id =>
      deleteTodo(id)
        .then(() => id)
        .catch(() => {
          onErrorReported('Unable to delete a todo');

          return null;
        }),
    );

    const deletionResults = await Promise.all(deletePromises);

    const successfulIds: number[] = deletionResults.filter(
      (id): id is number => id !== null,
    );

    if (successfulIds.length > 0) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id)),
      );
    }

    setDeletingIds(currentIds =>
      currentIds.filter(id => !completedIds.includes(id)),
    );

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const allCompleted =
    todos.length > 0 && todos.every(todo => todo.completed === true);

  const handleToggleAll = async () => {
    onErrorReported(null);

    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);
    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    if (idsToUpdate.length === 0) {
      return;
    }

    setUpdatingIds(currentIds => [...currentIds, ...idsToUpdate]);

    const updatePromises = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: newStatus }).catch(() => {
        onErrorReported('Unable to update a todo');

        return null;
      }),
    );

    const updatedResults = await Promise.all(updatePromises);

    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        const successfulUpdate = updatedResults.find(
          result => result && result.id === todo.id,
        );

        return successfulUpdate || todo;
      });
    });

    setUpdatingIds(currentIds =>
      currentIds.filter(id => !idsToUpdate.includes(id)),
    );

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const tempTodo: Todo | null = isAdding
    ? { id: 0, title: newTodoTitle, completed: false, userId: USER_ID }
    : null;

  return {
    todos,
    isLoading,
    isAdding,
    deletingIds,
    updatingIds,
    handleSubmit,
    handleDeleteTodo,
    handleToggleTodo,
    handleUpdateTitle,
    handleClearCompleted,
    handleToggleAll,
    allCompleted,
    tempTodo,
    newTodoTitle,
    setNewTodoTitle,
  };
};
