package com.pillimi.backend.api.controller;

import com.pillimi.backend.api.service.FamilyService;
import com.pillimi.backend.api.service.MedicineService;
import com.pillimi.backend.api.service.MemberMedicineService;
import com.pillimi.backend.api.service.MemberService;
import com.pillimi.backend.common.auth.JwtUtil;
import com.pillimi.backend.common.exception.InvalidException;
import com.pillimi.backend.common.exception.NotFoundException;
import com.pillimi.backend.common.exception.handler.ErrorCode;
import com.pillimi.backend.common.exception.handler.ErrorResponse;
import com.pillimi.backend.common.model.BaseResponseBody;
import com.pillimi.backend.db.entity.Member;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import static com.pillimi.backend.common.model.ResponseMessage.*;

@Api(value = "약 API", tags = "Medicine")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/medicine/")
public class MedicineController {

    private final MedicineService medicineService;
    private final MemberMedicineService memberMedicineService;
    private final MemberService memberService;
    private final FamilyService familyService;

    @ApiOperation(value = "약품 상세 조회", notes = "약품 상세 정보 조회 api입니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = GET_MEDICINE_INFO),
            @ApiResponse(code = 401, message = UNAUTHORIZED, response = ErrorResponse.class),
            @ApiResponse(code = 404, message = NOT_FOUND, response = ErrorResponse.class),
            @ApiResponse(code = 500, message = SERVER_ERROR, response = ErrorResponse.class)
    })
    @GetMapping(value = "{medicineSeq}")
    public ResponseEntity<BaseResponseBody> getMedicineInfo(@PathVariable Long medicineSeq) {

        return ResponseEntity.ok(BaseResponseBody.of(HttpStatus.OK, GET_MEDICINE_INFO, medicineService.getMedicineInfo(medicineSeq)));
    }

    @ApiOperation(value = "오늘의 약 조회", notes = "오늘 복용하는 약을 시간별로 조회하는 api입니다. \n 요청자가 보호자일 경우 memberSeq을 보내줘야 하고 피보호자일 경우 memberSeq을 보내지 마세요")
    @ApiResponses({
            @ApiResponse(code = 200, message = GET_TODAY_MEDICINE),
            @ApiResponse(code = 401, message = UNAUTHORIZED, response = ErrorResponse.class),
            @ApiResponse(code = 403, message = FORBIDDEN, response = ErrorResponse.class),
            @ApiResponse(code = 404, message = NOT_FOUND, response = ErrorResponse.class),
            @ApiResponse(code = 500, message = SERVER_ERROR, response = ErrorResponse.class)
    })
    @GetMapping(value = "today")
    public ResponseEntity<BaseResponseBody> getTodayMedicine(@RequestParam(required = false) Long memberSeq) {

        Member member = memberService.getMemberById(JwtUtil.getCurrentId()).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));

        if(!ObjectUtils.isEmpty(memberSeq)){
            Member protege = memberService.getMemberById(memberSeq).orElseThrow(() -> new NotFoundException(ErrorCode.MEMBER_NOT_FOUND));

            familyService.checkFamily(member, protege).orElseThrow(() -> new InvalidException(ErrorCode.THEY_NOT_FAMILY));
            member = protege;
        }

        return ResponseEntity.ok(BaseResponseBody.of(HttpStatus.OK, GET_TODAY_MEDICINE, memberMedicineService.findTodayMedicineList(member)));
    }
}
