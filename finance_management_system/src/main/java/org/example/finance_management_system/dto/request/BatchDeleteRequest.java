package org.example.finance_management_system.dto.request;

import java.util.List;

public class BatchDeleteRequest {
    private List<Long> ids;

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }
}
