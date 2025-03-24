package org.example.finance_management_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

@Configuration
public class RequestLoggingFilterConfig {

    @Bean
    public CommonsRequestLoggingFilter logFilter() {
        CommonsRequestLoggingFilter filter = new CommonsRequestLoggingFilter();
        filter.setIncludeQueryString(true);
        filter.setIncludePayload(false); // Don't log request body to avoid excessive logging
        filter.setMaxPayloadLength(10000);
        filter.setIncludeHeaders(false); // Don't log headers to improve performance
        filter.setAfterMessagePrefix("REQUEST: ");
        return filter;
    }
}