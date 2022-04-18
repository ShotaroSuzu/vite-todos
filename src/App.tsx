import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

type Todo = {
  value: string;
  checked: boolean;
  removed: boolean;
  readonly id: number;
};
type Filter = 'all' | 'checked' | 'unchecked' | 'removed';
export const App = () => {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  const handleOnSubmit = () => {
    if (!text) return;
    const newTodo: Todo = {
      value: text,
      checked: false,
      removed: false,
      id: new Date().getTime(),
    };
    setTodos([newTodo, ...todos]);
    setText('');
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const handleChangeTodo = (id: number, value: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, value };
      }
      return todo;
    });
    setTodos(newTodos);
  };
  const handleChecked = (id: number, checked: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, checked };
      }
      return todo;
    });
    setTodos(newTodos);
  };
  const handleDelete = (id: number, removed: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, removed: !removed };
      }
      return todo;
    });
    setTodos(newTodos);
  };
  const handleClearRemoved = () => {
    const newTodos = todos.filter((todo) => !todo.removed);
    setTodos(newTodos);
  };
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'all':
        return !todo.removed;
      case 'checked':
        return todo.checked && !todo.removed;
      case 'unchecked':
        return !todo.checked && !todo.removed;
      case 'removed':
        return todo.removed;
      default:
        return false;
    }
  });
  return (
    <div>
      <select
        defaultValue="all"
        onChange={(e) => {
          setFilter(e.target.value as Filter);
        }}
      >
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">未完了のタスク</option>
        <option value="removed">ゴミ箱</option>
      </select>
      {filter === 'removed' ? (
        <form>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClearRemoved();
            }}
          >
            ゴミ箱を空にする
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOnSubmit();
          }}
        >
          <input
            type="text"
            value={text}
            disabled={filter === 'checked'}
            onChange={(e) => handleOnChange(e)}
          />
          <input
            type="submit"
            value="追加"
            disabled={filter === 'checked'}
            onSubmit={handleOnSubmit}
          />
        </form>
      )}

      <ul>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                onChange={(e) => {
                  handleChecked(todo.id, e.target.checked);
                }}
              />
              <input
                type="text"
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e) => {
                  e.preventDefault();
                  handleChangeTodo(todo.id, e.target.value);
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(todo.id, todo.removed);
                }}
              >
                {todo.removed ? '復元' : '削除'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
