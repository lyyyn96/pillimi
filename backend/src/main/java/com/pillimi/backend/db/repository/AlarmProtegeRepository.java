package com.pillimi.backend.db.repository;

import com.pillimi.backend.db.entity.AlarmProtege;
import com.pillimi.backend.db.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Repository
public interface AlarmProtegeRepository extends JpaRepository<AlarmProtege, Long> {

    Optional<AlarmProtege> findByAlarmDateAndAlarmTimeAndProtege(LocalDate now, LocalTime time, Member member);
}
