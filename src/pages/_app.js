import 'bootstrap/dist/css/bootstrap.min.css';
import { config } from '@fortawesome/fontawesome-svg-core'
import 'font-awesome/css/font-awesome.min.css'
import "@/styles/globals.css";
import Layout from '../../Components/layout';
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  return (pageProps.isAuth ?
    <Layout>
      <Component {...pageProps} />
    </Layout> :
    <Component {...pageProps} />
  )
}
