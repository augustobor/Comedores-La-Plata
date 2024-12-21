import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")  // Aplica el filtro a todas las solicitudes
public class CORSFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // No es necesario hacer nada en la inicialización
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Permite solicitudes desde un origen específico
        httpResponse.setHeader("Access-Control-Allow-Origin", "https://comedores-la-plata.vercel.app");

        // Especifica qué métodos están permitidos
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

        // Especifica las cabeceras permitidas
        httpResponse.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");

        // Permite el uso de cookies
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");

        // Continuar con el flujo de la solicitud
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // No es necesario hacer nada al destruir el filtro
    }
}
