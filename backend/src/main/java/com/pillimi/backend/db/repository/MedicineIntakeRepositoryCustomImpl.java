package com.pillimi.backend.db.repository;

import com.pillimi.backend.common.model.SchedulerDTO;
import com.pillimi.backend.db.entity.QMedicineIntake;
import com.pillimi.backend.db.entity.QMemberMedicine;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.jni.Local;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
public class MedicineIntakeRepositoryCustomImpl implements MedicineIntakeRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    QMedicineIntake qMedicineIntake = QMedicineIntake.medicineIntake;
    QMemberMedicine qMemberMedicine = QMemberMedicine.memberMedicine;

    /*
     * 오늘 존재하는 모든 알람을 조회한다.
     */
    @Override
    public List<SchedulerDTO> findAlarmByDate(LocalDate date){
        return jpaQueryFactory.select(Projections.constructor(SchedulerDTO.class,
                qMemberMedicine.member,
                qMedicineIntake.intakeTime))
                .distinct()
                .from(qMedicineIntake)
                .join(qMemberMedicine)
                .on(qMedicineIntake.memberMedicine.eq(qMemberMedicine))
                .where(qMedicineIntake.intakeDay.eq(date.getDayOfWeek().getValue())
                        .and(qMemberMedicine.memberMedicineNow.eq(true)))
                .fetch();
    }

}
