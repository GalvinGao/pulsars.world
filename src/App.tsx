import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import LoadingOrError from 'components/LoadingOrError'
import HomePage from 'pages/Home'
import type { ReactElement } from 'react'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'

const theme = extendTheme({
	config: {
		initialColorMode: 'dark'
	},
	styles: {
		global: {
			'html, body': {
				backgroundColor: 'black'
			}
		}
	}
})

export default function App(): ReactElement {
	return (
		<BrowserRouter>
			<ChakraProvider theme={theme}>
				<Suspense fallback={<LoadingOrError />}>
					<HomePage />
				</Suspense>
			</ChakraProvider>
		</BrowserRouter>
	)
}
