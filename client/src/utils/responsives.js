export const size = {
  smallPhone: 415,
  tablet: 768,
  desktop: 1024,
  // largeDesktop: 1440,
  largeDesktop: 1025,
};

export const device = {
  smallPhone: `(max-width: ${size.smallPhone}px)`,
  tablet: `(max-width: ${size.tablet}px)`,
  desktop: `(max-width: ${size.desktop}px)`,
  largeDesktop: `(min-width: ${size.largeDesktop}px)`,
};

export const onSmallPhoneMediaQuery = (): string => `
    @media ${device.smallPhone}
  `;
export const onTabletMediaQuery = (): string => `
    @media ${device.tablet}
  `;
export const onDesktopMediaQuery = (): string => `
    @media ${device.desktop}
  `;
export const onLargeDesktopMediaQuery = (): string => `
    @media ${device.largeDesktop}
  `;
