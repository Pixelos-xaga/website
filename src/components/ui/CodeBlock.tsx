import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock = ({ code, language = 'bash', className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${styles.wrapper}${className ? ` ${className}` : ''}`}>
      <div className={styles.header}>
        <span className={styles.lang}>{language}</span>
        <button onClick={copy} className={styles.copyBtn}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className={styles.content}>
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
};
