package com.devordie.rpgsheets.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devordie.rpgsheets.entities.Campain;
import com.devordie.rpgsheets.entities.CampainResponse;
import com.devordie.rpgsheets.entities.SheetOverviewResponse;
import com.devordie.rpgsheets.services.CampainService;
import com.devordie.rpgsheets.services.SheetService;

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

  public CampainController(CampainService campainService, SheetService sheetService) {
    this.campainService = campainService;
    this.sheetService = sheetService;
  }

  @GetMapping("{id}")
  public CampainResponse getCampain(@PathVariable String id) {
    final Campain campain = campainService.getCampain(id);
    return new CampainResponse()
        .setId(campain.getId())
        .setName(campain.getName())
        .setDescription(campain.getDescription())
        .setSheets(campain.getSheetIds().stream()
            .map(sheetId -> this.sheetService.getSheet(sheetId))
            .filter(sheet -> sheet != null)
            .map(sheet -> new SheetOverviewResponse(sheet.getName(), sheet.getId()))
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
                .map(sheet -> new SheetOverviewResponse(sheet.getName(), sheet.getId()))
                .toList()))
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

  @PostMapping("{campainId}/{sheeId}")
  public void addSheetToCampain(@PathVariable String campainId, @PathVariable String sheetid) {
    campainService.addToCampain(campainId, sheetid);
  }

  @DeleteMapping("{campainId}/{sheeId}")
  public void removeSheetFromCampain(@PathVariable String campainId, @PathVariable String sheetid) {
    campainService.removeFromCampain(campainId, sheetid);
  }
}
