import React, { useEffect, useState } from 'react';
import timeDifference from '../lib/relativeTime';

const defaultProps = {
  defaultShowRelative: true,
  updateInterval: 30 * 1000,
};

export interface TimeProps extends Partial<typeof defaultProps> {
  time: number | Date | string
}

const Time: React.FC<TimeProps> = (props) => {
  const { time, defaultShowRelative, updateInterval } = { ...defaultProps, ...props };
  const [relativeMode, setRelativeMode] = useState(defaultShowRelative);
  const [now, setNow] = useState(Date.now());
  const timestamp = +new Date(time);

  const toggle = (): void => {
    setRelativeMode(!relativeMode);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
    }, updateInterval);

    return () => {
      clearInterval(t);
    };
  }, [updateInterval]);

  return <span
    style={{ cursor: 'pointer' }}
    onClick={toggle}>
    {relativeMode ? timeDifference(now, timestamp) : new Date(timestamp).toLocaleString()}
  </span>;
};

export default Time;
