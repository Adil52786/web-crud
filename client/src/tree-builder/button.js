// @flow

import React from 'react';

import './button.css';

type PropsType = {
  className: string,
  disabled?: boolean,
  icon?: string,
  label?: string,
  onClick: Function
};

export default ({
  className,
  disabled,
  icon,
  label = '',
  onClick
}: PropsType) => {
  let classes = `button ${className}`;
  if (icon) classes += ` fa fa-${icon}`;
  if (disabled) classes += ' disabled';
  return (
    <div className={classes} onClick={onClick}>
      {label}
    </div>
  );
};
