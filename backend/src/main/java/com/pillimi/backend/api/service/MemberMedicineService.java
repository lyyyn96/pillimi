package com.pillimi.backend.api.service;

import com.pillimi.backend.api.request.MemberMedicineCreateReq;
import com.pillimi.backend.api.request.MemberMedicineUpdateReq;
import com.pillimi.backend.api.response.CheckMedicineRes;
import com.pillimi.backend.api.response.MemberMedicineRes;
import com.pillimi.backend.api.response.TodayMedicineRes;
import com.pillimi.backend.db.entity.Member;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.TreeMap;

public interface MemberMedicineService {

    void createMemberMedicine(MemberMedicineCreateReq req);

    void updateMemberMedicine(MemberMedicineUpdateReq req);

    void deleteMemberMedicine(Long memberMedicineSeq);

    List<MemberMedicineRes> getMemberMedicine(Long memberSeq);

    MemberMedicineRes getMemberMedicineInfo(Long memberMedicineSeq);

    CheckMedicineRes checkMemberMedicine(Long memberSeq, Long medicineSeq);

    TreeMap<LocalTime, List<TodayMedicineRes>> findTodayMedicineList(Member member);
}
