package com.pillimi.backend.db.repository;

import com.pillimi.backend.api.response.MemberMedicineRes;
import com.pillimi.backend.api.response.TodayMedicineRes;
import com.pillimi.backend.db.entity.*;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class MemberMedicineRepositoryCustomImpl implements MemberMedicineRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    QMemberMedicine qMemberMedicine = QMemberMedicine.memberMedicine;
    QMember qMember = QMember.member;
    QMedicine qMedicine = QMedicine.medicine;
    QMedicineIntake qMedicineIntake = QMedicineIntake.medicineIntake;

    @Override
    public Optional<MemberMedicine> findByMemberAndMedicine(Member member, Medicine medicine) {
        MemberMedicine memberMedicine = jpaQueryFactory.select(qMemberMedicine)
                .from(qMemberMedicine)
                .where(qMemberMedicine.member.memberSeq.eq(member.getMemberSeq())
                        .and(qMemberMedicine.medicine.medicineSeq.eq(medicine.getMedicineSeq())
                                .and(qMemberMedicine.memberMedicineNow.eq(true))))
                .fetchFirst();
        return Optional.ofNullable(memberMedicine);
    }

    /*
     * 해당 회원의 오늘 먹을 약품을 시간순으로 조회한다.
     */
    @Override
    public List<TodayMedicineRes> findTodayMedicineList(Member member) {

        int day = LocalDateTime.now().getDayOfWeek().getValue();

        return jpaQueryFactory.select(Projections.constructor(TodayMedicineRes.class,
                qMedicine.medicineName,
                qMemberMedicine.memberMedicineName,
                qMedicine.medicineImage,
                qMedicineIntake.intakeTime,
                qMedicineIntake.intakeIsconfirm))
                .from(qMemberMedicine)
                .join(qMember)
                .on(qMember.eq(qMemberMedicine.member))
                .join(qMedicine)
                .on(qMedicine.eq(qMemberMedicine.medicine))
                .join(qMedicineIntake)
                .on(qMedicineIntake.memberMedicine.eq(qMemberMedicine))
                .where(qMember.eq(member).and(qMedicineIntake.intakeDay.eq(day)))
                .orderBy(qMedicineIntake.intakeDay.asc())
                .fetch();
    }
}
