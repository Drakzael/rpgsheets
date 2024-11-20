package com.devordie.rpgsheets.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devordie.rpgsheets.entities.Campain;
import com.devordie.rpgsheets.entities.CampainResponse;
import com.devordie.rpgsheets.entities.IdName;
import com.devordie.rpgsheets.entities.SheetOverviewResponse;
import com.devordie.rpgsheets.services.CampainService;
import com.devordie.rpgsheets.services.SheetService;
import com.devordie.rpgsheets.services.UserService;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/campain")
public class CampainController {
  private final CampainService campainService;
  private final SheetService sheetService;
  private final UserService userService;

  public CampainController(
      CampainService campainService,
      SheetService sheetService,
      UserService userService
      ) {
    this.campainService = campainService;
    this.sheetService = sheetService;
    this.userService = userService;
  }

  @GetMapping("{id}")
  public CampainResponse getCampain(@PathVariable Integer id) {
    final Campain campain = campainService.getCampain(id.toString());
    return new CampainResponse()
        .setId(campain.getId())
        .setName(campain.getName())
        .setDescription(campain.getDescription())
        .setSheets(campain.getSheetIds().stream()
            .map(sheetId -> this.sheetService.getSheet(sheetId))
            .filter(sheet -> sheet != null)
            .map(sheet -> new SheetOverviewResponse()
                .setName(sheet.getName())
                .setId(sheet.getId())
                .setMine(sheet.getUsername().equals(userService.getCurrentUser().getUsername())))
            .toList());
  }

  @GetMapping("")
  public List<CampainResponse> listCampains() {
    return campainService.listCampains().stream()
        .map(campain -> new CampainResponse()
            .setId(campain.getId())
            .setName(campain.getName())
            .setSheets(campain.getSheetIds().stream()
                .map(sheetId -> this.sheetService.getSheet(sheetId))
                .filter(sheet -> sheet != null)
                .map(sheet -> new SheetOverviewResponse()
                    .setName(sheet.getName())
                    .setId(sheet.getId())
                    .setMine(sheet.getUsername().equals(userService.getCurrentUser().getUsername())))
                .toList()))
        .toList();
  }

  @GetMapping("all")
  public List<IdName> listAllCampains() {
    return campainService.listAllCampains().stream()
        .map(campain -> new IdName(campain.getId(), campain.getName()))
        .toList();
  }

  @PutMapping("{id}")
  public void updateCampain(@PathVariable String id, @RequestBody Campain campain) {
    campainService.saveCampain(campain);
  }

  @PostMapping("")
  public String addCampain(@RequestBody Campain campain) {
    return campainService.createCampain(campain);
  }

  @DeleteMapping("{id}")
  public void deleteCampain(@PathVariable String id) {
    campainService.deleteCampain(id);
  }

  @PostMapping("{campainId}/{sheetId}")
  public void addSheetToCampain(@PathVariable String campainId, @PathVariable String sheetId) {
    campainService.addToCampain(campainId, sheetId);
  }

  @DeleteMapping("{campainId}/{sheetId}")
  public void removeSheetFromCampain(@PathVariable String campainId, @PathVariable String sheetId) {
    campainService.removeFromCampain(campainId, sheetId);
  }
}
