package com.hospital.santajoana.domain.entity.auxiliar;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AggregatedFatura {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal total;

    public AggregatedFatura() {
    }

    public AggregatedFatura(LocalDateTime startDate, LocalDateTime endDate, BigDecimal total) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.total = total;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
