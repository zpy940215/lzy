package com.pro.msv.util;

import org.springframework.web.client.RestTemplate;

import com.pro.msv.common.req.BaseReq;
import com.pro.msv.common.resp.BaseResp;

public class AppUtil {

	private static RestTemplate restTemplate = new RestTemplate();
	
	public static <T extends BaseResp,R extends BaseReq> T post(String url,R req, Class<T> t) {
		return restTemplate.postForObject(url, req, t);
	}
	
	public static <T extends BaseResp> T get(String url, Class<T> t) {
		return restTemplate.getForObject(url, t);
	}
	
	public static <T extends BaseResp> T getFailResponse(int code,String desc,Class<T> clazz) {
		try {
			T t = clazz.newInstance();
			t.setCode(code);
			t.setDescription(desc);
			return t;
		} catch (InstantiationException | IllegalAccessException e) {
			e.printStackTrace();
		}
		return null;
	}
}
