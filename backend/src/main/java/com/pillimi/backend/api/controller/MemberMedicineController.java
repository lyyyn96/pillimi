package com.pillimi.backend.api.controller;

import com.pillimi.backend.api.request.MemberMedicineCreateReq;
import com.pillimi.backend.api.request.MemberMedicineUpdateReq;
import com.pillimi.backend.api.response.CheckMedicineRes;
import com.pillimi.backend.api.response.MemberMedicineRes;
import com.pillimi.backend.api.service.FamilyService;
import com.pillimi.backend.api.service.MemberMedicineService;
import com.pillimi.backend.api.service.MemberService;
import com.pillimi.backend.common.auth.JwtUtil;
import com.pillimi.backend.common.exception.NotFoundException;
import com.pillimi.backend.common.exception.handler.ErrorCode;
import com.pillimi.backend.common.exception.handler.ErrorResponse;
import com.pillimi.backend.common.model.BaseResponseBody;
import com.pillimi.backend.db.entity.*;
import com.querydsl.jpa.impl.JPAQueryFactory;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import static com.pillimi.backend.common.model.ResponseMessage.*;

@Api(value = "회원 API", tags = "Member")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/member/medicine")
public class MemberMedicineController {

    private final MemberService memberService;

    private final FamilyService familyService;

    private final MemberMedicineService memberMedicineService;


    @ApiOperation(value = "사용자 복용 약품 등록", notes = "사용자 복용 약품 등록 api입니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = REGIST_MEMBER_MEDICINE),
            @ApiResponse(code = 401, message = UNAUTHORIZED, response = ErrorResponse.class),
            @ApiResponse(code = 403, message = FORBIDDEN, response = ErrorResponse.class),
            @ApiResponse(code = 404, message = NOT_FOUND, response = ErrorResponse.class),
            @ApiResponse(code = 500, message = SERVER_ERROR, response = ErrorResponse.class)
    })
    @PostMapping(value = "")
    public ResponseEntity<BaseResponseBody> createMemberMedicineInfo(@RequestBody MemberMedicineCreateReq req) {

        Member protector = memberService.getMemberById(JwtUtil.getCurrentId()).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));
        if(!(protector.getMemberSeq()==req.getMemberSeq())) {
            Member protege = memberService.getMemberById(req.getMemberSeq()).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));

            familyService.checkFamily(protector, protege).orElseThrow(() -> new NotFoundException(ErrorCode.THEY_NOT_FAMILY));
        }
        memberMedicineService.createMemberMedicine(req);
        return ResponseEntity.ok(BaseResponseBody.of(HttpStatus.CREATED, REGIST_MEMBER_MEDICINE));
    }

    @ApiOperation(value = "사용자 복용 약품 수정", notes = "사용자 복용 약품 수정 api입니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = UPDATE_MEMBER_MEDICINE),
            @ApiResponse(code = 401, message = UNAUTHORIZED, response = ErrorResponse.class),
            @ApiResponse(code = 403, message = FORBIDDEN, response = ErrorResponse.class),
            @ApiResponse(code = 404, message = NOT_FOUND, response = ErrorResponse.class),
            @ApiResponse(code = 500, message = SERVER_ERROR, response = ErrorResponse.class)
    })
    @PutMapping(value = "")
    public ResponseEntity<BaseResponseBody> updateMemberMedicineInfo(@RequestBody MemberMedicineUpdateReq req) {

        Member protector = memberService.getMemberById(JwtUtil.getCurrentId()).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));
        if(!(protector.getMemberSeq()==req.getMemberSeq())) {
            Member protege = memberService.getMemberById(req.getMemberSeq()).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));

            familyService.checkFamily(protector, protege).orElseThrow(() -> new NotFoundException(ErrorCode.THEY_NOT_FAMILY));
        }
        memberMedicineService.updateMemberMedicine(req);
        return ResponseEntity.ok(BaseResponseBody.of(HttpStatus.OK, UPDATE_MEMBER_MEDICINE));
    }

    @ApiOperation(value = "사용자 복용 약품 삭제", notes = "사용자 복용 약품 삭제 api입니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = DELETE_MEMBER_MEDICINE),
            @ApiResponse(code = 401, message = UNAUTHORIZED, response = ErrorResponse.class),
            @ApiResponse(code = 403, message = FORBIDDEN, response = ErrorResponse.class),
            @ApiResponse(code = 404, message = NOT_FOUND, response = ErrorResponse.class),
            @ApiResponse(code = 500, message = SERVER_ERROR, response = ErrorResponse.class)
    })
    @DeleteMapping(value = "")
    public ResponseEntity<BaseResponseBody> deleteMemberMedicineInfo(@RequestParam Long memberMedicineSeq, @RequestParam Long protegeSeq) {

        Member protector = memberService.getMemberById(JwtUtil.getCurrentId()).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));
        if(!(protector.getMemberSeq()==protegeSeq)) {
            Member protege = memberService.getMemberById(protegeSeq).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));

            familyService.checkFamily(protector, protege).orElseThrow(() -> new NotFoundException(ErrorCode.THEY_NOT_FAMILY));
        }
        memberMedicineService.deleteMemberMedicine(memberMedicineSeq);
        return ResponseEntity.ok(BaseResponseBody.of(HttpStatus.OK, DELETE_MEMBER_MEDICINE));
    }

    @ApiOperation(value = "사용자 복용 약품 목록", notes = "사용자 복용 약품 목록 api입니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = SELECT_MEMBER_MEDICINE),
            @ApiResponse(code = 401, message = UNAUTHORIZED, response = ErrorResponse.class),
            @ApiResponse(code = 403, message = FORBIDDEN, response = ErrorResponse.class),
            @ApiResponse(code = 404, message = NOT_FOUND, response = ErrorResponse.class),
            @ApiResponse(code = 500, message = SERVER_ERROR, response = ErrorResponse.class)
    })
    @GetMapping(value = "")
    public ResponseEntity<BaseResponseBody> getMemberMedicineInfo(@RequestParam Long protegeSeq) {

        Member protector = memberService.getMemberById(JwtUtil.getCurrentId()).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));
        if(!(protector.getMemberSeq()==protegeSeq)) {
            Member protege = memberService.getMemberById(protegeSeq).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));

            familyService.checkFamily(protector, protege).orElseThrow(() -> new NotFoundException(ErrorCode.THEY_NOT_FAMILY));
        }
        List<MemberMedicineRes> memberMedicines = memberMedicineService.getMemberMedicine(protegeSeq);
        return ResponseEntity.ok(BaseResponseBody.of(HttpStatus.OK, SELECT_MEMBER_MEDICINE, memberMedicines));
    }

    @ApiOperation(value = "사용자 복용 약품 상세조회", notes = "사용자 복용 약품 상세조회 api입니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = GET_MEDICINE_INFO),
            @ApiResponse(code = 401, message = UNAUTHORIZED, response = ErrorResponse.class),
            @ApiResponse(code = 403, message = FORBIDDEN, response = ErrorResponse.class),
            @ApiResponse(code = 404, message = NOT_FOUND, response = ErrorResponse.class),
            @ApiResponse(code = 500, message = SERVER_ERROR, response = ErrorResponse.class)
        })
    @GetMapping(value = "{memberMedicineSeq}")
    public ResponseEntity<BaseResponseBody> getMemberMedicineInfodetail(@PathVariable Long memberMedicineSeq){
        return ResponseEntity.ok(BaseResponseBody.of(HttpStatus.OK, GET_MEDICINE_INFO, memberMedicineService.getMemberMedicineInfo(memberMedicineSeq)));
    }

    @ApiOperation(value = "사용자 복용 약품 확인", notes = "사용자 복용 약품 확인 api입니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = SELECT_MEMBER_MEDICINE),
            @ApiResponse(code = 401, message = UNAUTHORIZED, response = ErrorResponse.class),
            @ApiResponse(code = 403, message = FORBIDDEN, response = ErrorResponse.class),
            @ApiResponse(code = 404, message = NOT_FOUND, response = ErrorResponse.class),
            @ApiResponse(code = 500, message = SERVER_ERROR, response = ErrorResponse.class)
    })
    @GetMapping(value = "/check")
    public ResponseEntity<BaseResponseBody> checkMemberMedicine(@RequestParam Long memberSeq, Long medicineSeq) {

        memberService.getMemberById(JwtUtil.getCurrentId()).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));
        memberService.getMemberById(memberSeq).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));

        CheckMedicineRes checkMedicineRes = memberMedicineService.checkMemberMedicine(memberSeq, medicineSeq);

        return ResponseEntity.ok(BaseResponseBody.of(HttpStatus.OK, MEMBER_MEDICINE_OK, checkMedicineRes));
    }
}
