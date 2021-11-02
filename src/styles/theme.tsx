import { extendTheme } from '@chakra-ui/react';

const fonts = { mono: `'Menlo', monospace` };

// const breakpoints = createBreakpoints({
//   sm: '40em',
//   md: '52em',
//   lg: '64em',
//   xl: '80em',
// })

const theme = extendTheme({
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: 'blue.900',
      },
    },
    Text: {
      baseStyle: {
        color: 'blue.900',
      },
    },
    FormLabel: {
      baseStyle: {
        color: 'blue.800',
      },
    },
    Button: {
      baseStyle: {
        textTransform: 'uppercase',
        borderRadius: 'base',
      },
      variants: {
        outline: {
          border: '2px solid',
          borderColor: 'blue.800',
          color: 'blue.800',
          _hover: {
            borderColor: 'blue.900',
            color: 'blue.900',
            bg: 'transparent',
          },
        },
        solid: {
          bg: 'blue.800',
          color: 'white',
          _hover: {
            bg: 'blue.900',
          },
        },
      },
      // The default size and variant values
      defaultProps: {
        variant: 'solid',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'blue.50',
        color: 'black.50',
        // fontFamily: 'Noto Sans JP, sans-serif',
        fontFamily: 'Montserrat, sans-serif',
      },
    },
  },
  fonts,
  // breakpoints,
});

export default theme;
