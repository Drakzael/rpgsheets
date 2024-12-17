package com.devordie.rpgsheets.controller;

import com.devordie.rpgsheets.entities.MetadataOverview;
import com.devordie.rpgsheets.services.MetadataService;
import com.fasterxml.jackson.databind.JsonNode;

import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("api/metadata")
@Authenticated
@Produces(MediaType.APPLICATION_JSON)
public class MetadataController {

  @Inject
  private MetadataService metadataService;

  @GET
  @Path("{game}")
  public JsonNode getMetadataGame(String game) {
    final JsonNode metadata = metadataService.getMetadata(game);
    if (metadata == null) {
      throw new NotFoundException();
    }
    return metadata;
  }

  @GET
  public List<MetadataOverview> listMetadataGames() {
    return metadataService.listMetadata();
  }
}
