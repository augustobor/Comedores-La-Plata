package com.example.demo.utils;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")
public class CORSFilter implements Filter {

	/**
	 * Initializes the filter. This method is called once when the filter is first
	 * created and can be used for one-time setup or resource allocation.
	 * 
	 * @param filterConfig the filter configuration
	 * @throws ServletException if an error occurs during filter initialization
	 */
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// No specific initialization is needed for this filter
	}

	/**
	 * Processes the HTTP request and response, adding CORS headers to the response
	 * to enable cross-origin requests.
	 * 
	 * This method is invoked for every request that matches the filter's mapping.
	 * It sets the required CORS headers to support different HTTP methods and
	 * credentials.
	 * 
	 * @param servletRequest  the HTTP request
	 * @param servletResponse the HTTP response
	 * @param filterChain     the filter chain
	 * @throws IOException      if an I/O error occurs during filter processing
	 * @throws ServletException if an error occurs during filter processing
	 */
	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
			throws IOException, ServletException {
		// Cast the response to HttpServletResponse for setting headers
		HttpServletResponse response = (HttpServletResponse) servletResponse;

		// Set the CORS headers to allow all origins and specific HTTP methods
        response.setHeader("Access-Control-Allow-Origin", "https://comedores-la-plata.vercel.app");
		response.setHeader("Access-Control-Allow-Credentials", "true");
		response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, HEAD, OPTIONS");

		// Agregar los headers para window.postMessage
		response.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
		response.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");

		// Allow specific headers, including the custom "Refresh-Token"
		response.setHeader("Access-Control-Allow-Headers",
				"Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Refresh-Token, Authorization");

		// Continue the request-response chain
		filterChain.doFilter(servletRequest, servletResponse);
	}

	/**
	 * Destroys the filter. This method is called when the filter is destroyed,
	 * allowing for resource cleanup if necessary.
	 */
	@Override
	public void destroy() {
		// No specific cleanup is needed for this filter
	}
}