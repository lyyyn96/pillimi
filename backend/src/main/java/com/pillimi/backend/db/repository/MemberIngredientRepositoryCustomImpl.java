package com.pillimi.backend.db.repository;

import com.pillimi.backend.db.entity.*;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class MemberIngredientRepositoryCustomImpl implements MemberIngredientRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    QMemberIngredient qMemberIngredient = QMemberIngredient.memberIngredient;


    @Override
    public MemberIngredient findByMemberAndIngredient(Member member, Ingredient ingredient) {
        return jpaQueryFactory.select(qMemberIngredient)
                .from(qMemberIngredient)
                .where(qMemberIngredient.member.eq(member)
                        .and(qMemberIngredient.medicineIngredient.ingredient.eq(ingredient)))
                .fetchOne();

    }

    @Override
    public void deleteByMemberAndMedicineIngredient(Member member, MedicineIngredient medicineingredient) {
        jpaQueryFactory.delete(qMemberIngredient).where(qMemberIngredient.member.eq(member).and(qMemberIngredient.medicineIngredient.eq(medicineingredient))).execute();
    }

}
