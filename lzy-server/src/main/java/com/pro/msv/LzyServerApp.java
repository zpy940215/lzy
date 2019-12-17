package com.pro.msv;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.pro.msv.server.*.mapper")
public class LzyServerApp {

	public static void main(String[] args) {
		SpringApplication.run(LzyServerApp.class, args);
	}
}
