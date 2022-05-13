package com.pillimi.backend.db.repository;

import com.pillimi.backend.db.entity.Member;
import com.pillimi.backend.db.entity.MemberMedicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MemberMedicineRepository extends JpaRepository<MemberMedicine, Long>, MemberMedicineRepositoryCustom {

    List<MemberMedicine> getByMember(Member member);

    MemberMedicine findByMemberMedicineSeq(long memberMedicineSeq);

    List<MemberMedicine> findByMemberMedicineEndBeforeAndMemberMedicineNow(LocalDate date, boolean now);

}
