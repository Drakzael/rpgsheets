package com.devordie.rpgsheets.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devordie.rpgsheets.entities.Sheet;
import com.devordie.rpgsheets.repository.CampainRepository;
import com.devordie.rpgsheets.repository.SheetRepository;

@Service
public class SheetService {
  private final SheetRepository sheetRepository;
  private final CampainRepository campainRepository;
  private final UserService userService;

  public SheetService(SheetRepository sheetRepository, CampainRepository campainRepository, UserService userService) {
    this.sheetRepository = sheetRepository;
    this.campainRepository = campainRepository;
    this.userService = userService;
  }

  public Sheet getSheet(String id) {
    final Sheet sheet = sheetRepository.getSheet(id);
    if (sheet != null && isReadable(sheet)) {
      return sheet
          .setWritable(this.isWritable(sheet))
          .setDeletable(this.isWritable(sheet));
    }
    return null;
  }

  public List<Sheet> listSheets() {
    return sheetRepository.listAllSheets().stream()
        .filter(this::isReadable)
        .toList();
  }

  public List<Sheet> listMySheets() {
    return sheetRepository.listAllSheets().stream()
        .filter(sheet -> sheet.getUsername().equals(userService.getCurrentUser().getUsername()))
        .toList();
  }

  public String createSheet(Sheet sheet) {
    return sheetRepository.createSheet(sheet.setUsername(userService.getCurrentUser().getUsername()));
  }

  public void saveSheet(Sheet sheet) {
    final Sheet refSheet = getSheet(sheet.getId());
    sheet.setUsername(refSheet.getUsername());
    if (isWritable(sheet)) {
      sheetRepository.saveSheet(sheet);
    }
  }

  public void deleteSheet(String sheetId) {
    if (isDeletable(sheetId)) {
      sheetRepository.deleteSheet(sheetId);
    }
  }

  public boolean isReadable(String sheetId) {
    return isReadable(getSheet(sheetId));
  }

  public boolean isReadable(Sheet sheet) {
    if (sheet == null) {
      return false;
    }
    if (sheet.getUsername().equals(userService.getCurrentUser().getUsername())) {
      return true;
    }
    return campainRepository.listAllCampains().stream()
        .filter(campain -> campain.getUsername().equals(userService.getCurrentUser().getUsername()))
        .anyMatch(campain -> campain.getSheetIds().contains(sheet.getId()));
  }

  public boolean isWritable(String sheetId) {
    return isWritable(getSheet(sheetId));
  }

  public boolean isWritable(Sheet sheet) {
    return sheet != null && sheet.getUsername().equals(userService.getCurrentUser().getUsername());
  }

  public boolean isDeletable(String sheetId) {
    return isDeletable(getSheet(sheetId));
  }

  public boolean isDeletable(Sheet sheet) {
    return isWritable(sheet);
  }
}
