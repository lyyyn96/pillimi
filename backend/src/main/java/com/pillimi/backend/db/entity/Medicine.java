package com.pillimi.backend.db.entity;


import com.pillimi.backend.db.entity.Shape;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "medicine")
public class Medicine{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long medicineSeq;

    @Column
    private String medicineName;

    @Column
    private Long medicineNumber;

    @Column
    private String medicineCompany;

    @Column
    private String medicineDivision;

    @Column
    private String medicineShape;

    @Column
    private String medicineEffect;

    @Column
    private String medicineDosage;

    @Column
    private String medicineCaution;

    @Column
    private String medicineDocument;

    @Column
    private String medicineStore;

    @Column
    private String medicineValidity;

    @Column
    private String medicineTotalamount;

    @Column
    private String medicineEffectSub;

    @Column
    private String medicineDosageSub;

    @Column
    private String medicineCautionSub;

    @Column
    private String medicineImage;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shape_seq")
    private Shape shape;

}
