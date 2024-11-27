import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';

import QuienesSomos from './Pages/QuienesSomos/QuienesSomos';
import Principal from './Pages/Principal/Principal';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Mapa from './Pages/Mapa/Mapa';
import Noticias from './Pages/Noticias/Noticias';
import InicioSesion from './Pages/InicioSesion/InicioSesion';
import Paleta from './Pages/paleta/paleta';
import AdminPerfil from './Pages/AdminPerfil/AdminPerfil';
import NoticiaNueva from './Pages/NoticiaNueva/NoticiaNueva';
import CentroPostFormRedirect from './Components/Centros/post/PostFormRedirect/CentroPostForm';
import Background from './Components/Background/Background';
import NoticiaNuevaRedirect from './Pages/NoticiaNueva/NoticiaNuevaRedirect/NoticiaNuevaRedirect'

import AdminLista from './Pages/AdminLista/AdminLista';
import AdminNuevo from './Pages/AdminNuevo/AdminNuevo';
import AdminNuevoRedirect from './Pages/AdminNuevo/AdminNuevoRedirect/AdminNuevoRedirect';
import Error404Redirect from './Pages/404/404redirect/404';
import Error404 from './Pages/404/404';

import ayudantes from '../src/assets/Fondo_2.png';

function App() {
  const location = useLocation(); // Obtén la ubicación actual

  // Define las rutas donde no quieres que aparezcan Header y Footer
  // const noHeaderRoutes = ['/InicioSesion', '/postmanUsuarios', '/AgregarCentro', '/NoticiaNueva', '/AdminNuevo', '/404PageNotFound'];
  // const noFooterRoutes = ['/InicioSesion', '/postmanUsuarios', '/Mapa', '/Noticias', '/AdminPerfil', '/NoticiaNueva', '/form', '/AgregarCentro', '/AdminNuevo', '/AdminLista', '/404PageNotFound'];

  const noHeaderRoutes = ['/iniciosesion', '/postmanusuarios', '/agregarcentro', '/noticianueva', '/adminnuevo', '/404pagenotfound'];
  const noFooterRoutes = ['/iniciosesion', '/postmanusuarios', '/mapa', '/noticias', '/adminperfil', '/noticianueva', '/form', '/agregarcentro', '/adminnuevo', '/adminlista', '/404pagenotfound'];

  // Función para verificar rutas dinámicas
  const isDynamicRoute = (path) => {
    return path.startsWith('/EditarCentro/') ||
           path.startsWith('/EditarNoticia/') ||
           path.startsWith('/EditarAdmin/');
  };

  return (
    <>
      <div className={noHeaderRoutes.includes(location.pathname.toLowerCase()) && noFooterRoutes.includes(location.pathname.toLowerCase) ? '' : 'all-container'}>
        
        {/* Muestra el Header solo si la ruta no está en noHeaderRoutes */}
        {!noHeaderRoutes.includes(location.pathname.toLowerCase()) && !isDynamicRoute(location.pathname) && <Header />}

        <Routes>
          <Route path="/" element={
            <Background image={ayudantes}>
              <Principal />
            </Background>
          } />
          <Route path="/QuienesSomos" element={
            <Background image={ayudantes}>
              <QuienesSomos />
            </Background>
          } />
          <Route path="/Mapa" element={
            <Background image={ayudantes}>
              <Mapa />    
            </Background>
          } />
          <Route path="/Noticias" element={
            <Background image={ayudantes}>
              <Noticias />
            </Background>
          } />
          <Route path="/AgregarCentro" element={<CentroPostFormRedirect />} />
          <Route path="/EditarCentro/:id" element={<CentroPostFormRedirect />} />
          <Route path="/InicioSesion" element={<InicioSesion />} />
          {/* <Route path="/paleta" element={<Paleta />} /> */}

          <Route path="/AdminPerfil" element={
            <Background image={ayudantes}>
              <AdminPerfil />
            </Background>
            } />
            
          <Route path="/AdminNuevo" element={<AdminNuevoRedirect />} />
          <Route path="/EditarAdmin/:id" element={<AdminNuevoRedirect />} />
          <Route path="/AdminLista" element={<AdminLista />} />

          <Route path="/NoticiaNueva" element={<NoticiaNuevaRedirect />} />

          <Route path="/EditarNoticia/:id" element={<NoticiaNuevaRedirect />} />

          <Route path="/404PageNotFound" element={<Error404 />} />
          <Route path="*" element={<Error404Redirect />} />

        </Routes>
        
        {/* Muestra el Footer solo si la ruta no está en noFooterRoutes */}
        {!noFooterRoutes.includes(location.pathname.toLowerCase()) && !isDynamicRoute(location.pathname) && <Footer />}
      </div>
    </>
  );
}

export default App;
