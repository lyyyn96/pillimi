package com.pillimi.backend.api.service;

import com.pillimi.backend.api.request.MemberMedicineCreateReq;
import com.pillimi.backend.api.request.MemberMedicineUpdateReq;
import com.pillimi.backend.api.response.CheckMedicineRes;
import com.pillimi.backend.api.response.MemberMedicineRes;
import com.pillimi.backend.api.response.TodayMedicineRes;
import com.pillimi.backend.common.exception.DuplicateException;
import com.pillimi.backend.common.exception.NotFoundException;
import com.pillimi.backend.common.exception.handler.ErrorCode;
import com.pillimi.backend.db.entity.*;
import com.pillimi.backend.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberMedicineServiceImpl implements MemberMedicineService {

    private final MemberMedicineRepository memberMedicineRepository;

    private final MemberRepository memberRepository;

    private final MedicineRepository medicineRepository;

    private final MedicineIntakeRepository medicineIntakeRepository;

    private final MedicineIngredientRepository medicineIngredientRepository;

    private final MemberIngredientRepository memberIngredientRepository;

    private final RemarkRepository remarkRepository;

    private final DaaRepository daaRepository;

    private final DcaRepository dcaRepository;

    private final DeaRepository deaRepository;


    @Override
    public void createMemberMedicine(MemberMedicineCreateReq req) {

        Member member = memberRepository.getById(req.getMemberSeq());
        Medicine medicine = medicineRepository.getById(req.getMedicineSeq());

        // 이미 등록된 약품이라면 에러 처리
        MemberMedicine memberMedicine = memberMedicineRepository.findByMemberAndMedicine(member, medicine).orElseThrow(() -> new DuplicateException(ErrorCode.ALREADY_REGISTERED_MEMBER_MEDICINE));

        memberMedicineRepository.save(MemberMedicine.builder().member(member)
                        .medicine(medicine)
                        .memberMedicineName(req.getMemberMedicineName())
                        .memberMedicineNow(true)
                        .memberMedicineCount(req.getIntakeCount())
                        .memberMedicineStart(req.getStartDay())
                        .memberMedicineEnd(req.getEndDay())
                        .build());

        for(int day : req.getIntakeDay()){
            for(LocalTime time : req.getIntakeTime()){
                medicineIntakeRepository.save(MedicineIntake.builder()
                        .memberMedicine(memberMedicine)
                        .intakeDay(day)
                        .intakeTime(time)
                        .build());
            }
        }

        List<MedicineIngredient> medicineIngredients = medicineIngredientRepository.findMedicineIngredientByMedicine(medicine);


        for (MedicineIngredient medicineIngredient : medicineIngredients) {
            memberIngredientRepository.save(MemberIngredient.builder()
                    .Ingredient(medicineIngredient.getIngredient())
                    .member(member)
                    .build());
        }

        Remark remark = remarkRepository.save(Remark.builder().memberMedicine(memberMedicine)
                .remarkContent(req.getRemarkContent())
                .remarkDate(LocalDate.now())
                .build());
    }

    @Override
    public void updateMemberMedicine(MemberMedicineUpdateReq req) {

        Member member = memberRepository.getById(req.getMemberSeq());
        Medicine medicine = medicineRepository.getById(req.getMedicineSeq());
        if (medicine == null) {
            throw new NotFoundException(ErrorCode.MEDICINE_NOT_FOUND.getCode());
        }

        MemberMedicine memberMedicine = memberMedicineRepository.save(MemberMedicine.builder().member(member)
                .memberMedicineSeq(req.getMemberMedicineSeq())
                .medicine(medicine)
                .memberMedicineName(req.getMemberMedicineName())
                .memberMedicineNow(true)
                .memberMedicineCount(req.getIntakeCount())
                .memberMedicineStart(req.getStartDay())
                .memberMedicineEnd(req.getEndDay())
                .build());

        medicineIntakeRepository.deleteByMemberMedicine(memberMedicine);

        for(int day : req.getIntakeDay()){
            for(LocalTime time : req.getIntakeTime()){
                medicineIntakeRepository.save(MedicineIntake.builder()
                        .memberMedicine(memberMedicine)
                        .intakeDay(day)
                        .intakeTime(time)
                        .intakeIsconfirm(false)
                        .build());
            }
        }

        Remark remark = remarkRepository.getByMemberMedicine(memberMedicine);
        remarkRepository.save(Remark.builder()
                .remarkSeq(remark.getRemarkSeq())
                .memberMedicine(memberMedicine)
                .remarkContent(req.getRemarkContent())
                .remarkDate(LocalDate.now())
                .build());
    }

    @Override
    public void deleteMemberMedicine(Long memberMedicineSeq) {

        Optional<MemberMedicine> memberMedicineOptional = memberMedicineRepository.findById(memberMedicineSeq);
        if (!memberMedicineOptional.isPresent()) {
            throw new NotFoundException(ErrorCode.MEMBER_MEDICINE_NOT_FOUND.getCode());
        }
        MemberMedicine memberMedicine = memberMedicineOptional.get();
        List<MedicineIngredient> medicineIngredients = medicineIngredientRepository.findMedicineIngredientByMedicine(memberMedicine.getMedicine());

        Member member = memberMedicine.getMember();

        for (MedicineIngredient medicineIngredient : medicineIngredients) {
            memberIngredientRepository.deleteByMemberAndIngredient(member, medicineIngredient.getIngredient());
        }

        memberMedicine.setMemberMedicineNow(false);
        memberMedicineRepository.save(memberMedicine);
    }

    @Override
    public List<MemberMedicineRes> getMemberMedicine(Long memberSeq) {

        Member member = memberRepository.getById(memberSeq);

        List<MemberMedicine> memberMedicines = memberMedicineRepository.getByMember(member);
        List<MemberMedicineRes> memberMedicineResList = new LinkedList<MemberMedicineRes>();
        for (MemberMedicine memberMedicine : memberMedicines) {
            List<MedicineIntake> medicineIntakes = medicineIntakeRepository.getByMemberMedicine(memberMedicine);
            Remark remark = remarkRepository.getByMemberMedicine(memberMedicine);
            HashSet<Integer> dayset = new HashSet<>();
            HashSet<LocalTime> timeset = new HashSet<>();
            for(MedicineIntake medicineIntake : medicineIntakes) {
                timeset.add(medicineIntake.getIntakeTime());
                dayset.add(medicineIntake.getIntakeDay());
            }
            System.out.println(timeset);
            List<LocalTime> times = new LinkedList<>(timeset);
            List<Integer> days = new LinkedList<>(dayset);

            MemberMedicineRes memberMedicineRes = MemberMedicineRes.builder()
                    .memberMedicineSeq(memberMedicine.getMemberMedicineSeq())
                    .imageURL("www.jcgroup.hk/wp-content/uploads/2019/08/test-img-300x194_2.png")
                    .medicineSeq(memberMedicine.getMedicine().getMedicineSeq())
                    .memberMedicineName(memberMedicine.getMemberMedicineName())
                    .startDay(memberMedicine.getMemberMedicineStart())
                    .endDay(memberMedicine.getMemberMedicineEnd())
                    .intakeDay(days)
                    .intakeTime(times)
                    .intakeCount(memberMedicine.getMemberMedicineCount())
                    .remarkContent(remark.getRemarkContent())
                    .isNow(memberMedicine.isMemberMedicineNow())
                    .build();

            memberMedicineResList.add(memberMedicineRes);
        }
        return memberMedicineResList;
    }

    @Override
    public MemberMedicineRes getMemberMedicineInfo(Long memberMedicineSeq) {
        MemberMedicine memberMedicine = memberMedicineRepository.findByMemberMedicineSeq(memberMedicineSeq);

        List<MedicineIntake> medicineIntakes = medicineIntakeRepository.getByMemberMedicine(memberMedicine);
        Remark remark = remarkRepository.getByMemberMedicine(memberMedicine);
        List<LocalTime> times = new LinkedList<>();
        HashSet<Integer> dayset = new HashSet<>();
        for(MedicineIntake medicineIntake : medicineIntakes) {
            times.add(medicineIntake.getIntakeTime());
            dayset.add(medicineIntake.getIntakeDay());
        }
        List<Integer> days = new LinkedList<>(dayset);

        MemberMedicineRes memberMedicineRes = MemberMedicineRes.builder()
                .memberMedicineSeq(memberMedicine.getMemberMedicineSeq())
                .imageURL("www.jcgroup.hk/wp-content/uploads/2019/08/test-img-300x194_2.png")
                .medicineSeq(memberMedicine.getMedicine().getMedicineSeq())
                .memberMedicineName(memberMedicine.getMemberMedicineName())
                .startDay(memberMedicine.getMemberMedicineStart())
                .endDay(memberMedicine.getMemberMedicineEnd())
                .intakeDay(days)
                .intakeTime(times)
                .intakeCount(memberMedicine.getMemberMedicineCount())
                .remarkContent(remark.getRemarkContent())
                .isNow(memberMedicine.isMemberMedicineNow())
                .build();

        return memberMedicineRes;
    }

    public CheckMedicineRes checkMemberMedicine(Long memberSeq, Long medicineSeq) {
        Member member = memberRepository.getById(memberSeq);
        Medicine medicine = medicineRepository.findById(medicineSeq).orElseThrow(() -> new NotFoundException(ErrorCode.MEDICINE_NOT_FOUND.getCode()));

        List<MedicineIngredient> medicineIngredients = medicineIngredientRepository.findMedicineIngredientByMedicine(medicine);

        for (MedicineIngredient medicineIngredient : medicineIngredients) {
            Ingredient ingredient = medicineIngredient.getIngredient();

            //연령대 금기
            Optional<Daa> daaOptional = daaRepository.findByIngredient(ingredient);
            if (daaOptional.isPresent()) {
                Daa daa = daaOptional.get();
                return CheckMedicineRes.builder()
                        .checkType(1)
                        .checkDesc(medicineIngredient.getMedicine().getMedicineName()
                                + "중  " + medicineIngredient.getIngredient().getIngredientName()
                                + "성분은 노인 금기 약물입니다. 확인해주세요.\n" + daa.getDaaDesc())
                        .build();
            }

            // 효능군 주의
            Optional<Dea> deaOptional = deaRepository.findByIngredient(ingredient);
            if (deaOptional.isPresent()) {
                Dea dea_tmp = deaOptional.get();
                List<Dea> deas = deaRepository.findByDeaName(dea_tmp.getDeaName());
                for(Dea dea : deas) {
                    MemberIngredient memberIngredient = memberIngredientRepository.findByMemberAndIngredient(member, dea.getIngredient());
                    Optional<MemberIngredient> memberIngredientOptional = Optional.ofNullable(memberIngredient);
                    if (memberIngredientOptional.isPresent()) {
                        return CheckMedicineRes.builder()
                                .checkType(2)
                                .checkDesc(dea.getDeaName() + "성분은 현재 복용중입니다..\n"
                                        + medicineIngredient.getMedicine().getMedicineName()
                                        + "악품의 " + medicineIngredient.getIngredient().getIngredientName()
                                        + "성분을 확인해주세요.\n"
                                        + dea.getDeaEffectName())
                                .build();
                    }
                }
            }

            //병용 금기
            List<MemberIngredient> memberIngredients = memberIngredientRepository.findByMember(member);

            for (MemberIngredient memberIngredient : memberIngredients) {
                Optional<Dca> dcaOptional = dcaRepository.findByRelationAndAvoid(memberIngredient.getIngredient(), medicineIngredient.getIngredient());
                if (dcaOptional.isPresent()) {
                    Dca dca = dcaOptional.get();
                    return CheckMedicineRes.builder()
                            .checkType(3)
                            .checkDesc(medicineIngredient.getMedicine().getMedicineName()
                                    + "의 성분 " + medicineIngredient.getIngredient().getIngredientName()
                                    + "은 현재 복용중인 " + memberIngredient.getIngredient().getIngredientName()
                                    + " 성분과 함께 먹을수 없습니다. 확인해주세요.\n"
                                    + dca.getDcaAvoidDesc())
                            .build();
                }
            }
        }
        return CheckMedicineRes.builder()
                .checkType(0)
                .build();
    }

    /*
    오늘의 약 목록 조회
     */
    @Override
    public TreeMap<LocalTime, List<TodayMedicineRes>> findTodayMedicineList(Member member) {

        List<TodayMedicineRes> list = memberMedicineRepository.findTodayMedicineList(member);

        TreeMap<LocalTime, List<TodayMedicineRes>> res = new TreeMap<>();

        for (TodayMedicineRes todayMedicineRes : list) {
            LocalTime time = todayMedicineRes.getTime();

            if(!res.containsKey(time)){
                res.put(time, new ArrayList<>());
            }
            res.get(time).add(todayMedicineRes);
        }

        return res;
    }
}
