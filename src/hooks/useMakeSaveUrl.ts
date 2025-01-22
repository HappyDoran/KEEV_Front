import { useCallback } from 'react';

const useMakeSaveUrl = () => {
  const makeSaveUrl = useCallback((url: string) => {
    const parts = url.split('/event');
    if (parts.length < 2) {
      return url;
    }

    const encodedPart = encodeURIComponent(parts[1]);
    return `${parts[0]}/event${encodedPart}`;
  }, []);

  return makeSaveUrl;
};

export default useMakeSaveUrl;
