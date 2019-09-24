package com.pro.msv.util;

import org.springframework.web.client.RestTemplate;

import com.pro.msv.common.req.BaseReq;
import com.pro.msv.common.resp.BaseResp;

public class AppUtil {

	private static RestTemplate restTemplate = new RestTemplate();
	
	public static <T extends BaseResp,R extends BaseReq> T post(String url,R r, Class<T> t) {
		return restTemplate.postForObject(url, r, t);
	}
	
	public static <T extends BaseResp> T get(String url, Class<T> t) {
		return restTemplate.getForObject(url, t);
	}
}
