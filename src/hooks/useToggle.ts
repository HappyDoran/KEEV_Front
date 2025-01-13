import { useState } from 'react';

type ToggleHookType = [boolean, () => void];

const useToggle = (initialValue: boolean = false): ToggleHookType => {
  const [status, setStatus] = useState(initialValue);

  const toggleStatus = () => setStatus((prevStatus) => !prevStatus);

  return [status, toggleStatus];
};

export default useToggle;
