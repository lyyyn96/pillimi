package com.pillimi.backend.api.response;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@ApiModel("TodayMedicineResponse")
@Getter
@Setter
@AllArgsConstructor
public class TodayMedicineRes {

    @ApiModelProperty(name = "약품 이름", example = "타이레놀")
    private String medicineName;

    @ApiModelProperty(name = "약 별칭", example = "혈압약")
    private String memberMedicineName;

    @ApiModelProperty(name = "약 이미지 주소", example = "???")
    private String imageURL;

    @ApiModelProperty(name = "약 복용 시간", example = "12:00")
    private LocalTime time;

    @ApiModelProperty(name = "약 복용 여부", example = "true")
    private boolean isTaken;

}
