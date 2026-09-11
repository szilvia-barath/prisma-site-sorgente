import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import './AnimatedList.css';

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.85, opacity: 0, y: 8 }}
      animate={inView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.85, opacity: 0, y: 8 }}
      transition={{ duration: 0.25, delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Griglia/lista animata generica: ogni figlio (renderItem) entra in scena con
 * una piccola scala + fade quando raggiunge il viewport. Pensata per essere
 * un wrapper leggero attorno a contenuti gia' esistenti (card, righe di
 * tabella semplificate, badge) non per sostituire tabelle dati complesse.
 */
const AnimatedList = ({
  items = [],
  renderItem,
  onItemSelect,
  className = '',
  gridClassName = '',
  staggerDelay = 0.04
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleClick = useCallback(
    (item, index) => {
      setSelectedIndex(index);
      onItemSelect?.(item, index);
    },
    [onItemSelect]
  );

  return (
    <div className={`animated-list ${className}`}>
      <div className={`animated-list__grid ${gridClassName}`}>
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={Math.min(index * staggerDelay, 0.4)}
            index={index}
            onClick={() => handleClick(item, index)}
          >
            {renderItem(item, index, selectedIndex === index)}
          </AnimatedItem>
        ))}
      </div>
    </div>
  );
};

export default AnimatedList;
