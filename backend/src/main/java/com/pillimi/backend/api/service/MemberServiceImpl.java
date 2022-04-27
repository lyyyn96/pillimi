package com.pillimi.backend.api.service;

import com.pillimi.backend.api.request.RegisterReq;
import com.pillimi.backend.api.response.MemberInfoRes;
import com.pillimi.backend.common.auth.JwtTokenProvider;
import com.pillimi.backend.common.model.KakaoProfile;
import com.pillimi.backend.common.model.RoleType;
import com.pillimi.backend.db.entity.Member;
import com.pillimi.backend.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService {

    private final JwtTokenProvider tokenProvider;

    private final MemberRepository memberRepository;

    /*
    회원 정보 DB 저장
     */
    @Override
    public Member createMember(Member member) {
        return memberRepository.save(member);
    }

    /*
    카카오 로그인 회원 생성
     */
    @Override
    public Member createKakaoMember(KakaoProfile kakaoProfile) {

        Member member = new Member();

        //카카오에서 받은 정보들로 회원 생성
        member.setMemberUid(Long.toString(kakaoProfile.getId()));
        member.setMemberNickname(kakaoProfile.getKakao_account().getProfile().getNickname());
        member.setMemberEmail(kakaoProfile.getKakao_account().getEmail());
        member.setMemberImage(kakaoProfile.getKakao_account().getProfile().getProfile_image_url());

        return createMember(member);
    }

    /*
    id로 회원 조회
     */
    @Override
    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    /*
    uid로 회원 조회
     */
    @Override
    public Optional<Member> getMemberByUid(String uid) {
        return memberRepository.findByMemberUid(uid);
    }

    /*
    accessToken 발급
     */
    @Override
    public String createToken(Long id, RoleType roleType) {
        return tokenProvider.createToken(id.toString(), roleType);
    }


    /*
    추가 회원 정보 입력
     */
    @Override
    public void registerInfo(Member member, RegisterReq req) {

        member.setMemberIsfirst(false);
        member.setMemberBirthdate(req.getBirthDate());
        member.setMemberIsprotector(req.getIsProtector());
        member.setMemberPhone(req.getPhone());

    }

    /*
    회원 정보 조회
     */
    public MemberInfoRes getMemberInfo(Member member) {

        return MemberInfoRes.builder().memberSeq(member.getMemberSeq())
                .nickName(member.getMemberNickname())
                .birthDate(member.getMemberBirthdate())
                .phone(member.getMemberPhone())
                .memberImage(member.getMemberImage())
                .build();
    }


}
