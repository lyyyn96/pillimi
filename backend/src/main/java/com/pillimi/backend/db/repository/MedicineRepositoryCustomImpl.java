package com.pillimi.backend.db.repository;

import com.pillimi.backend.api.response.MedicineDetailRes;
import com.pillimi.backend.api.response.SearchRes;
import com.pillimi.backend.db.entity.*;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class MedicineRepositoryCustomImpl implements MedicineRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    QMedicine qMedicine = QMedicine.medicine;
    QIngredient qIngredient = QIngredient.ingredient;
    QMedicineIngredient qMedicineIngredient = QMedicineIngredient.medicineIngredient;
    QShape qShape = QShape.shape;

    /*
     * medicine_name에 keyword가 포함되는 약 리스트를 조회한다.
     */
    @Override
    public List<SearchRes> findByMedicineNameContaining(String keyword) {
        return jpaQueryFactory.select(Projections.constructor(SearchRes.class,
                        qMedicine.medicineSeq, qMedicine.medicineName, qMedicine.medicineImage))
                .from(qMedicine).leftJoin(qShape)
                .on(qShape.shapeSeq.eq(qMedicine.shape.shapeSeq))
                .where(qMedicine.medicineName.contains(keyword)).fetch();
    }


    /*
     * 약품의 상세 정보를 조회한다.
     */
    @Override
    public MedicineDetailRes findDetailInfo(Medicine medicine) {
        return jpaQueryFactory.select(Projections.constructor(MedicineDetailRes.class,
                        qMedicine.medicineName,
                        qMedicine.medicineCompany,
                        qMedicine.medicineImage,
                        qMedicine.medicineEffectSub.coalesce(qMedicine.medicineEffect),
                        qMedicine.medicineCautionSub.coalesce(qMedicine.medicineCaution),
                        qMedicine.medicineDosageSub.coalesce(qMedicine.medicineDosage),
                        qMedicine.medicineValidity,
                        qMedicine.medicineStore))
                .from(qMedicine)
                .leftJoin(qShape)
                .on(qShape.eq(qMedicine.shape))
                .where(qMedicine.eq(medicine))
                .fetchOne();
    }


    /*
     * 약품의 성분 리스트를 주성분, 첨가제 순으로 조회한다.
     */
    @Override
    public List<String> findIngredientList(Medicine medicine) {
        return jpaQueryFactory.select(qIngredient.ingredientName)
                .from(qIngredient)
                .join(qMedicineIngredient)
                .on(qMedicineIngredient.ingredient.eq(qIngredient))
                .where(qMedicineIngredient.medicine.eq(medicine))
                .orderBy(qMedicineIngredient.ingredientType.desc())
                .fetch();
    }
}
