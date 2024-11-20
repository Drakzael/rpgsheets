package com.devordie.rpgsheets.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devordie.rpgsheets.entities.IdName;
import com.devordie.rpgsheets.entities.Sheet;
import com.devordie.rpgsheets.entities.SheetOverviewResponse;
import com.devordie.rpgsheets.entities.SheetResponse;
import com.devordie.rpgsheets.services.CampainService;
import com.devordie.rpgsheets.services.MetadataService;
import com.devordie.rpgsheets.services.SheetService;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/sheet")
public class SheetController {
  private final SheetService sheetService;
  private final CampainService campainService;
  private final MetadataService metadataService;

  public SheetController(
      SheetService sheetService,
      CampainService campainService,
      MetadataService metadataService) {
    this.sheetService = sheetService;
    this.campainService = campainService;
    this.metadataService = metadataService;
  }

  @GetMapping("{id}")
  public SheetResponse getSheet(@PathVariable String id) {
    return new SheetResponse(sheetService.getSheet(id))
        .setCampains(campainService.listAllCampains().stream()
            .filter(campain -> campain.getSheetIds().contains(id))
            .map(campain -> new IdName(campain.getId(), campain.getName()))
            .toList());
  }

  @GetMapping("")
  public List<SheetOverviewResponse> listMySheets() {
    return sheetService.listMySheets().stream()
        .map(sheet -> {
          SheetOverviewResponse res = new SheetOverviewResponse()
              .setName(sheet.getName())
              .setId(sheet.getId());
          if (metadataService.getMetadataOverview(sheet.getGame()).deprecated()) {
            res.setDeprecated(true);
          }
          return res;
        })
        .toList();
  }

  @PutMapping("{sheetId}")
  public void updateSheet(@PathVariable String sheetId, @RequestBody Sheet sheet) {
    sheetService.saveSheet(sheet.setId(sheetId));
  }

  @PostMapping("")
  public String addSheet(@RequestBody Sheet sheet) {
    return this.sheetService.createSheet(sheet);
  }

  @DeleteMapping("{sheetId}")
  public void deleteSheet(@PathVariable String sheetId) {
    sheetService.deleteSheet(sheetId);
  }
}
