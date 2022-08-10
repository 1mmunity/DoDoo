export const COLORS = {
  PRIMARY: '#5100FF',
  WHITE: '#fff',
  BLACK_LIGHTER: '#1E2B45',
  BLACK: '#111827',
  BLACK_DARKER: '#000000',
  LIGHT_GRAY: '#f5f5f5',
  GRAY: '#ccc',
  SHADOW: '#808080',
  ACCENT_LIGHT: '#B6FACE',
  ACCENT: '#3DCC6F',
  ACCENT_DARK: '#34AE5F',
  ROSE_DARK: '#dc2626',
  ROSE: '#f43f5e',
  WARNING: '#fef08a',
  WARNING_DARKER: '#fde047'
}

export const FONTS = {
  bold: 'PoppinsBold',
  semiBold: 'PoppinsSemiBold',
  medium: 'PoppinsMedium',
  regular: 'PoppinsRegular',
  light: 'PoppinsLight'
}

export const SIZES = {
  base: 12,
  small: 14,
  font: 15,
  medium: 16,
  large: 18,
  extraLarge: 20,
}

export const SHADOWS = {
  extraLarge: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    
    elevation: 6,
  },
  base: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  small: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    
    elevation: 6,
  },
  medium: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  }
}