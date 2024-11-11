package com.devordie.rpgsheets.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devordie.rpgsheets.entities.Sheet;
import com.devordie.rpgsheets.entities.SheetOverviewResponse;
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
  private final SheetService service;

  public SheetController(SheetService service) {
    this.service = service;
  }

  @GetMapping("{id}")
  public Sheet getSheet(@PathVariable String id) {
    return service.getSheet(id);
  }

  @GetMapping("")
  public List<SheetOverviewResponse> listSheets() {
    return service.listSheets().stream()
        .map(sheet -> new SheetOverviewResponse(sheet.getName(), sheet.getId()))
        .toList();
  }

  @PutMapping("{sheetId}")
  public void updateSheet(@PathVariable String sheetId, @RequestBody Sheet sheet) {
    service.saveSheet(sheet.setId(sheetId));
  }

  @PostMapping("")
  public String addSheet(@RequestBody Sheet sheet) {
    return this.service.createSheet(sheet);
  }

  @DeleteMapping("{sheetId}")
  public void deleteSheet(@PathVariable String sheetId) {
    service.deleteSheet(sheetId);
  }
}
