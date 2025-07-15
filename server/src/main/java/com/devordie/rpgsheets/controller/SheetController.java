package com.devordie.rpgsheets.controller;

import com.devordie.rpgsheets.entities.IdName;
import com.devordie.rpgsheets.entities.Sheet;
import com.devordie.rpgsheets.entities.SheetOverviewResponse;
import com.devordie.rpgsheets.entities.SheetResponse;
import com.devordie.rpgsheets.services.CampainService;
import com.devordie.rpgsheets.services.MetadataService;
import com.devordie.rpgsheets.services.SheetService;
import com.devordie.rpgsheets.services.UserService;

import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

@Path("api/sheet")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class SheetController {
  private static final Log LOGGER = LogFactory.getLog(SheetController.class);

  @Inject
  private SheetService sheetService;

  @Inject
  private CampainService campainService;

  @Inject
  private MetadataService metadataService;

  @Inject
  private UserService userService;

  @GET
  @Path("{id}")
  public SheetResponse getSheet(String id) {
    LOGGER.debug("User " + userService.getCurrentUser().getUsername() + " accesses sheet #" + id);
    final Sheet sheet = sheetService.getSheet(id);
    if (sheet == null) {
      throw new NotFoundException();
    }
    return new SheetResponse(sheet)
        .setUserAlias(userService.findByUsername(sheet.getUsername()).getAlias())
        .setCampains(campainService.listAllCampains().stream()
            .filter(campain -> campain.getSheetIds().contains(id))
            .map(campain -> new IdName(campain.getId(), campain.getName()))
            .toList());
  }

  @GET
  @Authenticated
  public List<SheetOverviewResponse> listMySheets() {
    LOGGER.debug("User " + userService.getCurrentUser().getUsername() + " accesses its sheets.");
    return sheetService.listMySheets().stream()
        .map(this::getSheetOverview)
        .toList();
  }

  private SheetOverviewResponse getSheetOverview(Sheet sheet) {
    final SheetOverviewResponse res = new SheetOverviewResponse()
        .setName(sheet.getName())
        .setId(sheet.getId())
        .setGame(sheet.getGame());
    if (Boolean.TRUE.equals(sheet.isDead())) {
      res.setDead(sheet.isDead());
    }
    if (metadataService.getMetadataOverview(sheet.getGame()).deprecated()) {
      res.setDeprecated(true);
    }
    return res;
  }

  @PUT
  @Path("{sheetId}")
  public void updateSheet(String sheetId, Sheet sheet) {
    sheetService.saveSheet(sheet.setId(sheetId));
  }

  @POST
  public String addSheet(Sheet sheet) {
    return this.sheetService.createSheet(sheet);
  }

  @DELETE
  @Path("{sheetId}")
  public void deleteSheet(String sheetId) {
    sheetService.deleteSheet(sheetId);
  }
}
