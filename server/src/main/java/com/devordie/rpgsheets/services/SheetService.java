package com.devordie.rpgsheets.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devordie.rpgsheets.entities.ISheet;
import com.devordie.rpgsheets.entities.Sheet;
import com.devordie.rpgsheets.entities.SheetOverview;
import com.devordie.rpgsheets.repository.SheetRepository;

@Service
public class SheetService {
  private final SheetRepository sheetRepository;
  private final UserService userService;

  public SheetService(SheetRepository sheetRepository, UserService userService) {
    this.sheetRepository = sheetRepository;
    this.userService = userService;
  }

  public Sheet getSheet(String id) {
    final Sheet sheet = sheetRepository.getSheet(id);
    if (sheet != null && isReadable(sheet)) {
      return sheet;
    }
    return null;
  }

  public List<SheetOverview> listSheets() {
    return sheetRepository.listAllSheets().stream()
        .filter(this::isReadable)
        .toList();
  }

  public boolean isReadable(ISheet sheet) {
    return sheet.getUsername().equals(userService.getCurrentUser().getUsername());
  }

  public boolean isWritable(ISheet sheet) {
    return sheet.getUsername().equals(userService.getCurrentUser().getUsername());
  }
}
