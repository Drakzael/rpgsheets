package com.devordie.rpgsheets.controller;

import io.vertx.ext.web.Router;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

@ApplicationScoped
public class StaticResourceController {

  public void init(@Observes Router router) {
    router.errorHandler(404, routingContext -> {
      if (!routingContext.request().path().startsWith("/api")) {
        routingContext.reroute("/index.html");
      }
    });
  }
}
