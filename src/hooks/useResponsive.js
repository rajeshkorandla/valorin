import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && dimensions.width >= 1024;
  const isTablet = isWeb && dimensions.width >= 768 && dimensions.width < 1024;
  const isMobile = dimensions.width < 768;

  return {
    isWeb,
    isDesktop,
    isTablet,
    isMobile,
    width: dimensions.width,
    height: dimensions.height,
  };
};
