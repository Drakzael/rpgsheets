package com.devordie.rpgsheets.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devordie.rpgsheets.entities.Campain;
import com.devordie.rpgsheets.repository.CampainRepository;

@Service
public class CampainService {
  private final CampainRepository campainRepository;
  private final SheetService sheetService;
  private final UserService userService;

  public CampainService(CampainRepository campainRepository, SheetService sheetService, UserService userService) {
    this.campainRepository = campainRepository;
    this.sheetService = sheetService;
    this.userService = userService;
  }

  public Campain getCampain(String campainId) {
    Campain res = campainRepository.listAllCampains().stream()
        .filter(campain -> campain.getId().equals(campainId))
        .filter(this::isReadable)
        .findFirst().orElse(null);
    if (res != null) {
      return res
          .withWritable(isWritable(res))
          .withDeletable(isDeletable(res))
          .withSheetIds(res.getSheetIds().stream()
              .filter(sheetService::isReadable)
              .toList());
    }
    return null;
  }

  private Campain getCampainUnifiltered(String campainId) {
    final Campain res = campainRepository.listAllCampains().stream()
        .filter(campain -> campain.getId().equals(campainId))
        .findFirst().orElse(null);
    if (res != null) {
      return res.withSheetIds(res.getSheetIds().stream().toList());
    }
    return null;
  }

  public List<Campain> listCampains() {
    return campainRepository.listAllCampains().stream()
        .filter(this::isReadable)
        .toList();
  }

  public List<Campain> listAllCampains() {
    return campainRepository.listAllCampains().stream()
        .toList();
  }

  public String createCampain(Campain campain) {
    return campainRepository.createCampain(campain.withUsername(userService.getCurrentUser().getUsername()));
  }

  public void saveCampain(Campain campain) {
    final Campain refCampain = getCampainUnifiltered(campain.getId());
    final Campain savedCampain = campain
        .withUsername(refCampain.getUsername())
        .withSheetIds(refCampain.getSheetIds());
    if (isWritable(savedCampain)) {
      campainRepository.saveCampain(savedCampain);
    }
  }

  public void deleteCampain(String id) {
    if (isDeletable(id)) {
      campainRepository.deleteCampain(id);
    }
  }

  public void addToCampain(String campainId, String sheetId) {
    if (sheetService.isWritable(sheetId)) {
      campainRepository.saveCampain(getCampainUnifiltered(campainId).withAddedSheetId(sheetId));
    }
  }

  public void removeFromCampain(String campainId, String sheetId) {
    if (isWritable(campainId) || sheetService.isWritable(sheetId)) {
      campainRepository.saveCampain(getCampainUnifiltered(campainId).withRemovedSheetId(sheetId));
    }
  }

  public boolean isReadable(Campain campain) {
    return campain != null &&
        (campain.getUsername().equals(userService.getCurrentUser().getUsername()) ||
            campain.getSheetIds().stream()
                .map(sheetService::getSheet)
                .anyMatch(
                    sheet -> sheet != null && sheet.getUsername().equals(userService.getCurrentUser().getUsername())));
  }

  public boolean isWritable(String campainId) {
    return isWritable(getCampainUnifiltered(campainId));
  }

  public boolean isWritable(Campain campain) {
    return campain != null && campain.getUsername().equals(userService.getCurrentUser().getUsername());
  }

  public boolean isDeletable(String campainId) {
    return isDeletable(getCampainUnifiltered(campainId));
  }

  public boolean isDeletable(Campain campain) {
    return isWritable(campain);
  }
}
