package com.pillimi.backend.db.repository;

import com.pillimi.backend.db.entity.*;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class MedicineIngredientRepositoryCustomImpl implements MedicineIngredientRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    QMedicineIngredient qMedicineIngredient = QMedicineIngredient.medicineIngredient;

    /*
     * member의 가족 리스트를 조회한다.
     */
    @Override
    public List<MedicineIngredient> findMedicineIngredientByMedicine(Medicine medicine) {

        return jpaQueryFactory.select(qMedicineIngredient)
                .from(qMedicineIngredient)
                .where(qMedicineIngredient.medicine.medicineSeq.eq(medicine.getMedicineSeq()))
                .fetch();

    }
}
