import React, { CSSProperties, FC, MouseEvent, ReactElement } from 'react';

export interface ButtonProps {
  className?: string;
  disabled?: boolean;
  endIcon?: ReactElement;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  startIcon?: ReactElement;
  style?: CSSProperties;
  tabIndex?: number;
  children: any;
}

export const Button: FC<ButtonProps> = (props) => {
  const justifyContent = props.endIcon || props.startIcon ? 'space-between' : 'center';

  return (
    <button
      className={`wallet-adapter-button ${props.className || ''}`}
      disabled={props.disabled}
      onClick={props.onClick}
      style={{ justifyContent, ...props.style }}
      tabIndex={props.tabIndex || 0}
      type='button'
    >
      {props.children}
    </button>
  );
};
