package com.pillimi.backend.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@ApiModel("MemberMedicineCreateReq")
@Getter
public class MemberMedicineCreateReq {

    @ApiModelProperty(name = "맴버 번호", example = "1")
    private Long memberSeq;

    @ApiModelProperty(name = "약품 번호", example = "1")
    private Long medicineSeq;

    @ApiModelProperty(name = "약 별칭", example = "혈압약")
    private String memberMedicineName;

    @ApiModelProperty(name = "복용 시작 일자", example = "1990-01-10")
    private LocalDate startDay;

    @ApiModelProperty(name = "복용 종료 일자", example = "1990-01-10")
    private LocalDate endDay;

    @ApiModelProperty(name = "복용 요일", example = "[1,3,4]")
    private List<Integer> intakeDay;

    @ApiModelProperty(name = "복약 시간", example = "[12:00, 14:00]")
    private List<LocalTime> intakeTime;

    @ApiModelProperty(name = "복약 갯수", example = "2")
    private int intakeCount;

    @ApiModelProperty(name = "섭취 후 특이사항", example = "나른함")
    private String remarkContent;

}
