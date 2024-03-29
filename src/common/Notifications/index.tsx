import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTransition } from 'react-spring';

import { useStatesContext } from '@/contexts/states';
import { ReactComponent as CrossIcon } from '@/assets/cross.svg';
import { ReactComponent as ErrorIcon } from '@/assets/notifications/error_icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/notifications/info_icon.svg';
import { ReactComponent as SuccessIcon } from '@/assets/notifications/success_icon.svg';

const ICONS = {
  SUCCESS: SuccessIcon,
  INFO: InfoIcon,
  ERROR: ErrorIcon
};

const ToastContext = React.createContext(null);

let id = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((content, type = 'SUCCESS') => {
      setToasts((toasts) => [
        {
          id: id++,
          content,
          type
        },
        ...toasts
      ]);
    },
    [setToasts]);

  const removeToast = useCallback((id) => {
      setToasts((toasts) => toasts.filter((t) => t.id !== id));
    },
    // eslint-disable-next-line
    [setToasts]);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast
      }}
    >
      <ToastContainer toasts={toasts} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

export const Toast = ({ children, id, type, style }) => {
  const { removeToast } = useToast();
  const { theme } = useStatesContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 20000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);

  const Icon = ICONS[type];

  return <div className={`react-notie-container mt-8 w-full rounded-lg
    ${theme === 'dark' ? 'react-notie-container--dark' : ''}`} style={style}>
    <div className='flex items-center'>
      <div className='mr-4'>
        <Icon />
      </div>
      <div className='flex flex-col'>
        <div className='react-notie-title'>{children}</div>
      </div>
    </div>
    <div className='react-notie-dismiss' onClick={() => removeToast(id)}>
      <CrossIcon />
    </div>
  </div>;
};

export const ToastContainer = ({ toasts }) => {
  const transitions = useTransition(toasts, (toast) => toast.id, {
    from: { left: '-100%' },
    enter: { left: '0%' },
    leave: { left: '-100%' }
  });

  return <div className='fixed flex flex-col justify-end left-6 bottom-6 z-10'>
    {transitions.map(({ item, key, props }) => (
      <Toast key={key} id={item.id} type={item.type} style={props}>
        {item.content}
      </Toast>
    ))}
  </div>;
};
