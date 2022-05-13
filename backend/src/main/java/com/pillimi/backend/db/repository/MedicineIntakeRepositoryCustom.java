package com.pillimi.backend.db.repository;

import com.pillimi.backend.common.model.SchedulerDTO;

import java.time.LocalDate;
import java.util.List;

public interface MedicineIntakeRepositoryCustom {

    /*
     * 해당 날짜에 존재하는 모든 알람을 조회한다.
     */
    List<SchedulerDTO> findAlarmByDate(LocalDate date);
}
