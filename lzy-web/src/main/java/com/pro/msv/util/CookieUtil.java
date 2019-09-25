package com.pro.msv.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class CookieUtil {
	
	private static String domain = null;
	
	private static int maxAge = 0;
	
	private static String path = "/";
	
	public static HttpServletRequest getRequest() {
		ServletRequestAttributes attr = (ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
		return attr.getRequest();
	}
	
	public static HttpServletResponse getResponse() {
		ServletRequestAttributes attr = (ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
		return attr.getResponse();
	}
	
	public static String getAttribute(String name) {
		HttpServletRequest request = getRequest();
		if(request.getCookies() == null) {
			return null;
		}
		for(Cookie cookie:request.getCookies()) {
			if(cookie.getName().equals(name)) {
				return cookie.getValue();
			}
		}
		return null;
	}
	
	public static void setAttribute(String name,Object value) {
		Cookie cookie = new Cookie(name, String.valueOf(value));
		if (domain != null) {
			cookie.setDomain(domain);
		}
		if(maxAge > 0) {
			cookie.setMaxAge(maxAge);
		}
		cookie.setPath(path);
		getResponse().addCookie(cookie);
	}
}
