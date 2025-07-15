package com.devordie.rpgsheets.controller;

import com.devordie.rpgsheets.entities.Campain;
import com.devordie.rpgsheets.entities.CampainResponse;
import com.devordie.rpgsheets.entities.IdName;
import com.devordie.rpgsheets.entities.Sheet;
import com.devordie.rpgsheets.entities.SheetOverviewResponse;
import com.devordie.rpgsheets.services.CampainService;
import com.devordie.rpgsheets.services.SheetService;
import com.devordie.rpgsheets.services.UserService;

import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("api/campain")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CampainController {

  @Inject
  private CampainService campainService;

  @Inject
  private SheetService sheetService;

  @Inject
  private UserService userService;

  @GET
  @Path("{id}")
  public CampainResponse getCampain(Integer id) {
    final Campain campain = campainService.getCampain(id.toString());
    final CampainResponse res = new CampainResponse()
        .setId(campain.getId())
        .setName(campain.getName())
        .setWritable(campain.isWritable())
        .setDeletable(campain.isDeletable())
        .setDescription(campain.getDescription())
        .setSheets(campain.getSheetIds().stream()
            .map(sheetId -> this.sheetService.getSheet(sheetId))
            .filter(sheet -> sheet != null)
            .filter(sheet -> sheet.getUsername().equals(userService.getCurrentUser().getUsername()) || campain.getUsername().equals(userService.getCurrentUser().getUsername()))
            .map(this::getSheetOverview)
            .toList());
    if (campain.getUsername().equals(userService.getCurrentUser().getUsername())) {
      res.setGmDescription(campain.getGmDescription());
    }
    return res;
  }

  private SheetOverviewResponse getSheetOverview(Sheet sheet) {
    final SheetOverviewResponse sh = new SheetOverviewResponse()
        .setName(sheet.getName())
        .setId(sheet.getId())
        .setGame(sheet.getGame())
        .setMine(sheet.getUsername().equals(userService.getCurrentUser().getUsername()));
    if (Boolean.TRUE.equals(sheet.isDead())) {
      sh.setDead(true);
    }
    return sh;
  }

  @GET
  public List<CampainResponse> listCampains() {
    return campainService.listCampains().stream()
        .map(campain -> new CampainResponse()
            .setId(campain.getId())
            .setName(campain.getName())
            .setGmName(userService.findByUsername(campain.getUsername()).getAlias())
            .setMine(campain.getUsername().equals(userService.getCurrentUser().getUsername()))
            .setSheets(campain.getSheetIds().stream()
                .map(sheetId -> this.sheetService.getSheet(sheetId))
                .filter(sheet -> sheet != null)
                .filter(sheet -> sheet.getUsername().equals(userService.getCurrentUser().getUsername()) || campain.getUsername().equals(userService.getCurrentUser().getUsername()))
                .map(this::getSheetOverview)
                .toList()))
        .toList();
  }

  @GET
  @Path("all")
  public List<IdName> listAllCampains() {
    return campainService.listAllCampains().stream()
        .map(campain -> new IdName(campain.getId(), campain.getName()))
        .toList();
  }

  @PUT
  @Path("{id}")
  public void updateCampain(String id, Campain campain) {
    campainService.saveCampain(campain);
  }

  @POST
  public String addCampain(Campain campain) {
    return campainService.createCampain(campain);
  }

  @DELETE
  @Path("{id}")
  public void deleteCampain(String id) {
    campainService.deleteCampain(id);
  }

  @POST
  @Path("{campainId}/{sheetId}")
  public void addSheetToCampain(String campainId, String sheetId) {
    campainService.addToCampain(campainId, sheetId);
  }

  @DELETE
  @Path("{campainId}/{sheetId}")
  public void removeSheetFromCampain(String campainId, String sheetId) {
    campainService.removeFromCampain(campainId, sheetId);
  }
}
