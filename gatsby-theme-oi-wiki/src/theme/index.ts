import createTheme from '@mui/material/styles/createTheme'
import { grey } from '@mui/material/colors'
import { CSSProperties, TypographyStyleOptions } from '@mui/material/styles/createTypography'

const commonTypographyStyle: CSSProperties = {
  fontWeight: 'bold',
  marginBlockEnd: '1rem',
  marginBlockStart: '1.5rem',
}

function withTypographyStyle(t: TypographyStyleOptions): TypographyStyleOptions {
  return { t, ...commonTypographyStyle }
}

const theme = createTheme({
  unstable_strictMode: true,
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
    h1: withTypographyStyle({
      fontSize: '2.5rem',
      paddingBottom: '.3rem',
      borderBlockEnd: `1px solid ${grey['300']}`,
    }),
    h2: {
      fontSize: '2rem',
      paddingBottom: '.3rem',
      borderBlockEnd: `1px solid ${grey['300']}`,
    },
    h3: withTypographyStyle({
      fontSize: '1.75rem',
    }),
    h4: withTypographyStyle({
      fontSize: '1.5rem',
    }),
    h5: withTypographyStyle({
      fontSize: '1.25rem',
    }),
    h6: withTypographyStyle({
      fontSize: '1rem',
    }),
    body2: withTypographyStyle({
      fontSize: '0.875rem',
      lineHeight: '1.5rem',
      marginBlockEnd: '0.5rem',
    }),
  },
})

export { theme }
