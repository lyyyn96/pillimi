package com.pillimi.backend.db.repository;

import com.pillimi.backend.db.entity.*;

public interface MemberIngredientRepositoryCustom {

    MemberIngredient findByMemberAndIngredient(Member member, Ingredient ingredient);

    void deleteByMemberAndMedicineIngredient(Member member, MedicineIngredient medicineIngredient);
}
