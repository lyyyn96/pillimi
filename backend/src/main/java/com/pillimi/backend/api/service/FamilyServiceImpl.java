package com.pillimi.backend.api.service;

import com.pillimi.backend.api.request.FamilyRegistReq;
import com.pillimi.backend.api.response.FamilyRequestRes;
import com.pillimi.backend.common.auth.JwtTokenProvider;
import com.pillimi.backend.db.entity.Family;
import com.pillimi.backend.db.entity.FamilyRequest;
import com.pillimi.backend.db.entity.Member;
import com.pillimi.backend.db.repository.FamilyRepository;
import com.pillimi.backend.db.repository.FamilyRequestRepository;
import com.pillimi.backend.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FamilyServiceImpl implements FamilyService{
    private final MemberRepository memberRepository;
    private final FamilyRequestRepository familyRequestRepository;

    @Override  //보호자가 피보호자 가족 등록하는 상황
    public FamilyRequest createFamily(FamilyRegistReq req) {
        FamilyRequest familyrequest = new FamilyRequest();
        Member protegeName = memberRepository.findByMemberPhone(req.getPhone()); //피보호자 멤버정보
        Member protectorId = memberRepository.getById(req.getMemberSeq()); //보호자 아이디
        if(protegeName.getMemberPhone().equals(req.getPhone())) {
            familyrequest.setRequestProtege(protegeName);
            familyrequest.setRequestProtector(protectorId);
        }
        return familyRequestRepository.save(familyrequest);
    }

    /*
    가족 요청 목록 조회
     */
    @Override
    public List<FamilyRequestRes> getFamilyRequestList(Member member) {

        return familyRequestRepository.findFamilyRequestByMember(member);
    }

}
