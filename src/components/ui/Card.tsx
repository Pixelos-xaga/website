import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'glass';
}

export const Card = ({ children, className, variant = 'default' }: CardProps) => {
  return (
    <div className={clsx(styles.card, styles[variant], className)}>
      {children}
    </div>
  );
};
